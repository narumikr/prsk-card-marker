# 画像出力機能の根本的な見直し 設計書

- 作成日: 2026-07-05
- 対象ブランチ: `refactor/output-image`
- 対象範囲: `src/pages/Top.tsx` / `src/components/atoms/ImageUploader.tsx` / `src/utils/loadGoogleFont.ts` / 新規フック `src/hooks/useCardExport.ts`

## 背景と問題

現在、カード画像の出力は `html-to-image` の `toPng` を用いてプレビュー DOM をそのままキャプチャする方式で実装されている。以下の問題が観測されている。

1. **モバイル (iOS Safari) で ImageUploader の画像が白飛びする**
   ImageUploader は `FileReader.readAsDataURL` で得た data URL を即座に state に反映するため、`<img>` の decode が完了する前に state 更新→レンダリング→エクスポートというフローが走ってしまい、`toPng` 内部の再fetch/decode がレース状態を起こす。
2. **workaround による性能悪化**
   現状 `Top.tsx:50-51` で `toPng` を 2 回連続で呼び、1 回目でブラウザキャッシュを温めて 2 回目で確定させるという応急処置が入っている。これは症状の抑制であり、処理時間はほぼ倍になっている。
3. **フォント読込のレース**
   `loadGoogleFont.ts` は `<link rel="stylesheet">` を head に注入する方式で、`document.fonts.ready` はまだ FontFaceSet に登録されていないフォントを待たない。モバイル低速回線でフォントが間に合わないケースがある。
4. **責務が Top.tsx に集中**
   画像 preload、フォント wait、toPng 呼び出し、エラーハンドリング、ダウンロード誘導が 1 つのハンドラに詰め込まれており、拡張・テストが困難。

## ゴール

- **モバイルでも白飛びゼロで画像出力できる**
- **workaround (2 重 `toPng`) を撤去し、出力所要時間を半減させる**
- **出力処理を単一責任のフックに切り出し、Top.tsx を薄くする**
- **出力中の UI フィードバック (ボタン disabled、進行表示、エラー表示) を追加する**

## 非ゴール

- html-to-image ライブラリの置き換え (今回の対策で不足が判明したら次段として検討)
- 自動テストの追加 (このリポジトリにテスト基盤がないため今回は手動確認シナリオを整備)
- 出力形式の追加 (現状 PNG のみ、SVG/WebP は対象外)

## アーキテクチャ全体像

以下の 3 層に責務を分離する。

```
┌─────────────────────────────────────────────────────────────┐
│ pages/Top.tsx  ← 「押されたら export() を叩く」だけの薄い層 │
│   ↓ useCardExport(ref, { width, height, fileName }) を呼ぶ  │
├─────────────────────────────────────────────────────────────┤
│ hooks/useCardExport.ts  ← 出力オーケストレータ (新規)       │
│   ├ waitForImagesDecoded(root)  ... 全<img>のdecode()完了   │
│   ├ waitForFonts(root)          ... FontFace.load()で確実に │
│   ├ renderToPng(el, opts)       ... toPngを "1回だけ" 呼ぶ  │
│   └ 状態 { status, errorMessage, exportImage() }            │
├─────────────────────────────────────────────────────────────┤
│ components/atoms/ImageUploader.tsx  ← Blob URL + decode化   │
│ utils/loadGoogleFont.ts            ← FontFace API化         │
└─────────────────────────────────────────────────────────────┘
```

責務分離のポイント:

- ImageUploader は「DOM に載る時点で `<img>` は decode 済み」を自己保証する。出力側は個別画像の性質を知らなくてよい。
- useCardExport は「準備 → キャプチャ → ダウンロード → 状態復帰」を状態機械として持ち、呼び出し側 (Top.tsx) は Promise チェーンや try/catch を書かない。
- Top.tsx は「カード種別 → width/height」の判定と、フックが返す状態に応じた UI 表現のみを担当する。

## 詳細設計

### 1. `ImageUploader.tsx` の再設計

現在の `readAsDataURL` + 即 setState を **Blob URL + `img.decode()` 待ち** に置き換える。

**新しい選択時フロー**

```
handleSelectImage(file)
  ├─ prevUrl が Blob URL なら URL.revokeObjectURL(prev)
  ├─ const url = URL.createObjectURL(file)
  ├─ const img = new Image(); img.src = url
  ├─ isDecoding = true
  ├─ await img.decode()     ← 完全にデコード完了を待つ
  ├─ setPreviewUrl(url)     ← DOM に載る時点で 100% ready
  ├─ isDecoding = false
  └─ 失敗時: revokeObjectURL(url) + console.error
```

**追加の設計要件**

- コンポーネントアンマウント時に現在の Blob URL を `revokeObjectURL` する (`useEffect` cleanup)
- 差し替え時にも古い Blob URL を revoke する
- `isDecoding` state を導入し、その間ボタンに `aria-busy="true"` を付与
- `ImageUploaderProps` の I/F は変更しない (`shape`, `circleSizeClass`, `fill`)。既存呼び出し箇所 (`Gallery`, `LookAtMyOshiCard`) の修正はゼロ

**リスク**

- HEIC 等の Safari 固有形式は `decode()` が rejects することがある → 現状同等の console.error 出力
- ページリロード時に Blob URL は失効する。data URL でも同じくリロードで消えるため機能後退なし

### 2. `loadGoogleFont.ts` の FontFace API 化

`<link>` 注入方式を廃止し、`FontFace` を明示生成 → `face.load()` を `await` → `document.fonts.add()` する方式に置き換える。

**新しい API**

```ts
export async function loadGoogleFont(fontFamilyValue: string): Promise<void>
```

**内部フロー**

1. `familyName` を抽出 (現行のパース関数を流用)
2. `loadedFamilies` にヒットしたら即 resolve
3. Google Fonts CSS API から `family=...&display=swap` を fetch
4. レスポンス本文から `@font-face` ブロック内の `src: url(...) format('woff2')` を正規表現で抽出 (複数 weight/style 対応)
5. 各 src につき `new FontFace(family, `url(${url})`, { weight, style })` を生成
6. `face.load()` を並列 `await`
7. 全成功後、`document.fonts.add(face)` で登録し `loadedFamilies` にファミリ名を追加

**呼び出し側への影響**

- 従来 `loadGoogleFont` は同期呼び出しだったが Promise 返却に変わる
- `useCardExport` が「必要フォントリスト」を集めて並列 load するので、既存の呼び出し箇所は特に await せず fire-and-forget でも動く (フックが最終的に確定させる)
- 現行の同期呼び出し箇所は Promise を無視して継続、fatal ではない

**リスク**

- Google Fonts が返す CSS フォーマット変更で正規表現が壊れる可能性 (低確率)
- CSS レスポンスが User-Agent によって woff2 以外を返すケース → モダンブラウザのみサポートなので許容
- フォールバックの link 方式は残さない。エラーはコンソール警告として扱う

### 3. `useCardExport.ts` (新規フック)

**シグネチャ**

```ts
type ExportStatus = 'idle' | 'preparing' | 'rendering' | 'success' | 'error'

interface UseCardExportOptions {
  targetRef: RefObject<HTMLElement | null>
  width: number
  height: number
  fileName: string
}

interface UseCardExportReturn {
  status: ExportStatus
  errorMessage: string | null
  exportImage: () => Promise<void>
}

export function useCardExport(opts: UseCardExportOptions): UseCardExportReturn
```

**`exportImage()` の内部フロー**

```
1. status !== 'idle' なら即 return (再入不可)
2. status = 'preparing'
   ├─ waitForImages(el)   ... el 配下の全 <img> について img.decode() を並列 await
   │                          (静的 asset の officialProfile.jpg 等もカバー)
   ├─ waitForFonts(el)    ... getComputedStyle(el).fontFamily を読んで必要ファミリを収集
   │                          (フォントは body から継承されているため el ルートで拾える) →
   │                          loadGoogleFont() を並列 await → 最終確認として
   │                          document.fonts.load(`10px "${family}"`) も呼ぶ
   └─ requestAnimationFrame ×2 で layout 落ち着き保証

3. status = 'rendering'
   └─ toPng(el, {
        style: { transform: 'none', transformOrigin: 'top left' },
        width, height,
        pixelRatio: 2,
        cacheBust: false,
      }) を 1 回だけ呼ぶ

4. ダウンロード
   └─ 返された data URL を <a download> クリックで保存

5. status = 'success' → 1.5 秒後に 'idle' に自動復帰

エラー時:
  status = 'error', errorMessage 設定 → 3 秒後に 'idle' 復帰
```

**設計上のポイント**

- `status !== 'idle'` の間の `exportImage` 呼び出しは即 return (ボタン disabled と併せて二重の防壁)
- `status` を返すため呼び出し側は自然に UI 状態を組み立てられる
- カード種別依存 (width/height) は呼び出し側の関心。フックはカード種別を知らない
- fileName は現状 `TOP_PAGE_TEXT.profileFileName` の固定文字列 (ユーザ入力ではないため escape 不要)

### 4. `Top.tsx` の最終形

```tsx
export function Top() {
  const profileRef = useRef<HTMLDivElement>(null)
  const { cardType } = useCardType()
  const isOfficial = cardType === OfficialProfileCardType

  const { status, errorMessage, exportImage } = useCardExport({
    targetRef: profileRef,
    width: isOfficial ? OFFICIAL_CARD_WIDTH : CARD_WIDTH,
    height: isOfficial ? OFFICIAL_CARD_HEIGHT : CARD_HEIGHT,
    fileName: TOP_PAGE_TEXT.profileFileName,
  })

  const isBusy = status === 'preparing' || status === 'rendering'
  const buttonLabel =
    status === 'success' ? TOP_PAGE_TEXT.exportSuccessLabel
    : isBusy ? TOP_PAGE_TEXT.exportingLabel
    : TOP_PAGE_TEXT.saveImageButtonLabel

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 py-8">
      {cardType === BasicCardType && <BasicIntroductionCard ref={profileRef} />}
      {cardType === LookAtMyOshiCardType && <LookAtMyOshiCard ref={profileRef} />}
      {cardType === OfficialProfileCardType && <OfficialProfileCard ref={profileRef} />}
      <BasicButton
        type="button"
        onClick={exportImage}
        disabled={isBusy}
        aria-busy={isBusy}
        className="--content-font">
        {buttonLabel}
      </BasicButton>
      {status === 'error' && errorMessage && (
        <p role="alert" className="text-sm text-red-600">{errorMessage}</p>
      )}
    </main>
  )
}
```

### 5. 追加テキスト定義

`constant/pages.constant.ts` の `TOP_PAGE_TEXT` に以下を追加:

- `exportingLabel: '出力中...'`
- `exportSuccessLabel: '保存しました'`
- `exportErrorMessage: '画像出力に失敗しました。もう一度お試しください'`

## 削除される既存コード

- `Top.tsx` L21-33: `img.complete` チェックによる画像ロード待ち
- `Top.tsx` L36: `document.fonts.ready` 呼び出し
- `Top.tsx` L48-51: 2 重 `toPng` 呼び出し (workaround)
- `Top.tsx` L46-58: try/catch を含む全体構造
- `loadGoogleFont.ts` の `<link>` 注入ロジック全般

## 実装順序

各ステップは独立してコミット可能で、途中で中断してもアプリが壊れないよう設計する。

1. `utils/loadGoogleFont.ts` を FontFace API 化 (呼び出し側は Promise を無視しても動く)
2. `components/atoms/ImageUploader.tsx` を Blob URL + `img.decode()` 化
3. `hooks/useCardExport.ts` を新規作成
4. `constant/pages.constant.ts` にラベル追加
5. `pages/Top.tsx` を書き換え、workaround 削除
6. 手動確認シナリオ実施

## 手動確認シナリオ

- [ ] デスクトップ Chrome で 3 種類のカードそれぞれ出力できる
- [ ] iOS Safari (実機) で ImageUploader に画像 1 枚アップ → 即出力しても白飛びしない
- [ ] iOS Safari で Gallery (4 枚) 全部にアップ → 出力しても全部映る
- [ ] LookAtMyOshi の 5 枚 ImageUploader 全て使用 → 出力成功
- [ ] エクスポート中にボタン連打しても 1 回しか走らない
- [ ] 出力中に別カードに切替 → クラッシュしない
- [ ] フォント切替直後にすぐ出力 → 新しいフォントで出る (link 方式では失敗しやすかったケース)
- [ ] `Gallery` にアップした画像を差し替えると Blob URL がリークしない (DevTools memory で観察)
- [ ] エクスポート失敗時 (ネットワーク断で意図的に再現) にエラー表示が出て、3 秒後に消える

## リスクと将来の拡張

- 本方針でも稀に白飛びが残る場合、次段として `modern-screenshot` への切替を検討する
- HEIC 等の Safari 固有形式は `decode()` が rejects することがあり、その場合は現状と同じくコンソールログ + 選択キャンセル扱い
- 状態機械化により将来「rendering 中にプログレスバー」「preparing 完了時のインジケータ」等の拡張が特定 status の watch だけで書けるようになる
