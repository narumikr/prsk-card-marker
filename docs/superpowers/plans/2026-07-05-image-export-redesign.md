# 画像出力機能の根本的な見直し 実装プラン

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** モバイル (iOS Safari) で ImageUploader 経由の画像が白飛びする不具合を根絶し、`html-to-image` の 2 重呼び出し workaround を撤去して出力所要時間を半減させる。

**Architecture:** 3 層構成に責務を分離する。(1) `ImageUploader` は Blob URL + `img.decode()` で「DOM 反映時点で decode 済み」を自己保証。(2) `loadGoogleFont` は FontFace API を使い link 注入方式を廃止。(3) 新規フック `useCardExport` が画像/フォントの ready 保証 → 1 回だけの `toPng` → ダウンロードを状態機械として担当し、`Top.tsx` は薄い呼び出し側になる。

**Tech Stack:** React 19 / TypeScript / `html-to-image` (既存) / Blob URL + `img.decode()` API / FontFace API / Biome (linter/formatter)

## Global Constraints

- 依存追加は行わない (`package.json` の `dependencies` は不変)
- Biome の設定 (`biome.json`) に従う: シングルクォート、末尾カンマ all、セミコロン必須、arrow の括弧必須、インデント 2 スペース、行幅 125
- `ImageUploader` の props I/F (`shape`, `circleSizeClass`, `fill`) は変更しない
- テスト基盤が存在しないため各タスクはユニットテストを追加せず、最終タスクで手動 QA を実施する
- 各タスクは独立してコミット可能で、途中で中断してもアプリが壊れないこと
- `TOP_PAGE_TEXT` の既存キー (`profileFileName`, `saveImageButtonLabel`, `genImageErrorLog`) は削除しない (追加のみ)

---

### Task 1: 定数へラベルを追加

**Files:**
- Modify: `src/constant/pages.constant.ts`

**Interfaces:**
- Consumes: なし
- Produces: `TOP_PAGE_TEXT.exportingLabel: string`, `TOP_PAGE_TEXT.exportSuccessLabel: string`, `TOP_PAGE_TEXT.exportErrorMessage: string`

- [ ] **Step 1: `TOP_PAGE_TEXT` に 3 つのキーを追加**

`src/constant/pages.constant.ts` を以下に置換:

```ts
/**
 * @description Topページのテキスト定数
 */

export const TOP_PAGE_TEXT = {
  profileFileName: 'profile.png',
  saveImageButtonLabel: '画像として保存',
  exportingLabel: '出力中...',
  exportSuccessLabel: '保存しました',
  exportErrorMessage: '画像出力に失敗しました。もう一度お試しください',
  genImageErrorLog: '画像の生成に失敗しました',
} as const;
```

- [ ] **Step 2: 型チェックが通ることを確認**

Run: `pnpm run build`
Expected: エラーなくビルドが完了する (この時点で追加したキーはまだ未使用なので tsc 上も問題なし)

- [ ] **Step 3: コミット**

```bash
git add src/constant/pages.constant.ts
git commit -m "エクスポート機能用のUI文字列を追加"
```

---

### Task 2: `loadGoogleFont` を FontFace API 化

**Files:**
- Modify: `src/utils/loadGoogleFont.ts`

**Interfaces:**
- Consumes: なし
- Produces: `loadGoogleFont(fontFamilyValue: string): Promise<void>` — 既存の同期版 (`void`) を Promise 返却に変更。既に読み込み済み or 未登録ファミリの場合は即 resolve。fetch/parse/load いずれかで失敗した場合は console.warn し、reject せずに resolve する (呼び出し側を壊さないため)

- [ ] **Step 1: `loadGoogleFont.ts` を書き換え**

`src/utils/loadGoogleFont.ts` を以下に置換:

```ts
const GOOGLE_FONTS_BASE_URL = 'https://fonts.googleapis.com/css2';

const fontQueryByFamilyName: Record<string, string> = {
  Montserrat: 'family=Montserrat:wght@400;700',
  'Noto Sans JP': 'family=Noto+Sans+JP',
  Roboto: 'family=Roboto',
  'Sawarabi Gothic': 'family=Sawarabi+Gothic',
  Yomogi: 'family=Yomogi',
  'Yusei Magic': 'family=Yusei+Magic',
  'Zen Maru Gothic': 'family=Zen+Maru+Gothic',
  'Hachi Maru Pop': 'family=Hachi+Maru+Pop',
  'Kaisei HarunoUmi': 'family=Kaisei+HarunoUmi',
  'Shantell Sans': 'family=Shantell+Sans:ital,wght@0,300..800;1,300..800',
  'Zen Kurenaido': 'family=Zen+Kurenaido',
  'Space Mono': 'family=Space+Mono',
  'Sawarabi Mincho': 'family=Sawarabi+Mincho',
};

const loadedFamilies = new Set<string>();
const inflightLoads = new Map<string, Promise<void>>();

const FONT_LOAD_ERROR_LOG = 'Google Fontの読み込みに失敗しました';

const parseFamilyName = (fontFamilyValue: string): string => {
  const [familyName = ''] = fontFamilyValue.split(',');
  return familyName.trim().replace(/^['"]|['"]$/g, '');
};

interface ParsedFace {
  weight: string;
  style: string;
  url: string;
}

const parseFontFaces = (cssText: string): ParsedFace[] => {
  const faces: ParsedFace[] = [];
  const blockRegex = /@font-face\s*{([^}]+)}/g;
  let blockMatch = blockRegex.exec(cssText);
  while (blockMatch !== null) {
    const block = blockMatch[1];
    const weight = /font-weight:\s*([^;]+);/.exec(block)?.[1]?.trim() ?? '400';
    const style = /font-style:\s*([^;]+);/.exec(block)?.[1]?.trim() ?? 'normal';
    const url = /src:\s*url\(([^)]+)\)/.exec(block)?.[1]?.trim();
    if (url) {
      faces.push({ weight, style, url });
    }
    blockMatch = blockRegex.exec(cssText);
  }
  return faces;
};

const loadFamily = async (familyName: string, query: string): Promise<void> => {
  const url = `${GOOGLE_FONTS_BASE_URL}?${query}&display=swap`;
  const response = await fetch(url, { mode: 'cors' });
  if (!response.ok) {
    throw new Error(`Failed to fetch font CSS: ${response.status}`);
  }
  const cssText = await response.text();
  const faces = parseFontFaces(cssText);
  if (faces.length === 0) {
    throw new Error('No @font-face rules found');
  }
  await Promise.all(
    faces.map(async ({ weight, style, url: srcUrl }) => {
      const face = new FontFace(familyName, `url(${srcUrl})`, { weight, style });
      await face.load();
      document.fonts.add(face);
    }),
  );
  loadedFamilies.add(familyName);
};

export const loadGoogleFont = async (fontFamilyValue: string): Promise<void> => {
  const familyName = parseFamilyName(fontFamilyValue);
  const query = fontQueryByFamilyName[familyName];

  if (!query || loadedFamilies.has(familyName)) {
    return;
  }

  const existing = inflightLoads.get(familyName);
  if (existing) {
    return existing;
  }

  const promise = loadFamily(familyName, query).catch((error) => {
    console.warn(FONT_LOAD_ERROR_LOG, familyName, error);
  });
  inflightLoads.set(familyName, promise);
  try {
    await promise;
  } finally {
    inflightLoads.delete(familyName);
  }
};
```

- [ ] **Step 2: SideMenu.tsx 呼び出し側は変更不要であることを確認**

Run: `pnpm run check`
Expected: エラーなし。`SideMenu.tsx:30` の `loadGoogleFont(value);` は返り値を無視する fire-and-forget として問題なく動作する。

- [ ] **Step 3: ビルドが通ることを確認**

Run: `pnpm run build`
Expected: 成功。

- [ ] **Step 4: 開発サーバで動作確認**

Run: `pnpm run dev`
1. ブラウザで開いてサイドメニューからフォント (例: `Yomogi`) を選択
2. カード内のテキストが選択したフォントで表示されることを確認
3. DevTools > Network で `fonts.googleapis.com/css2?family=Yomogi&display=swap` へのリクエストが 1 回だけ走ることを確認
4. 同じフォントを再選択しても 2 回目の fetch は発生しない (キャッシュヒット)

- [ ] **Step 5: コミット**

```bash
git add src/utils/loadGoogleFont.ts
git commit -m "loadGoogleFontをFontFace APIベースに書き換え"
```

---

### Task 3: `ImageUploader` を Blob URL + `decode()` 化

**Files:**
- Modify: `src/components/atoms/ImageUploader.tsx`

**Interfaces:**
- Consumes: なし
- Produces: `ImageUploader` の props I/F (`ImageUploaderProps`) は不変。内部状態として `previewUrl` は Blob URL 文字列 or `null`。アンマウント時および差し替え時に古い Blob URL を `URL.revokeObjectURL` で解放する。デコード中は `aria-busy="true"`。

- [ ] **Step 1: `ImageUploader.tsx` を書き換え**

`src/components/atoms/ImageUploader.tsx` を以下に置換:

```tsx
import { useEffect, useRef, useState } from 'react';
import { useSekaiColor } from '@/hooks/useSekaiColor';

const ImageUploaderText = {
  selectedAlt: '選択した画像',
  imageReadErrorLog: '画像の読み込みに失敗しました',
} as const;

type ImageUploaderProps = { shape: 'circle'; circleSizeClass?: string } | { shape?: 'rectangle'; fill?: boolean };

export const ImageUploader = (props: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleSelectImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setIsDecoding(true);
    try {
      const img = new Image();
      img.src = nextUrl;
      await img.decode();
      setPreviewUrl(nextUrl);
    } catch (error) {
      URL.revokeObjectURL(nextUrl);
      console.error(ImageUploaderText.imageReadErrorLog, file.name, error);
    } finally {
      setIsDecoding(false);
    }
  };

  const { text, border, ring } = useSekaiColor();
  const emptyStateClass = previewUrl ? '' : `border-2 border-dashed ${border} bg-gray-300 hover:bg-gray-400`;

  let buttonClassName: string;
  if (props.shape === 'circle') {
    const circleSizeClass = props.circleSizeClass ?? 'h-48 w-48';
    buttonClassName = `mx-auto flex ${circleSizeClass} cursor-pointer appearance-none items-center justify-center overflow-hidden rounded-full transition focus:outline-none focus:ring-2 ${ring} ${emptyStateClass}`;
  } else if (props.fill) {
    buttonClassName = `flex h-full w-full cursor-pointer appearance-none items-center justify-center overflow-hidden rounded-xl transition focus:outline-none focus:ring-2 ${ring} ${emptyStateClass}`;
  } else {
    buttonClassName = `mx-auto flex aspect-video w-full max-w-3xl cursor-pointer appearance-none items-center justify-center overflow-hidden rounded-xl transition focus:outline-none focus:ring-2 ${ring} ${emptyStateClass}`;
  }

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleSelectImage} />

      <button type="button" onClick={openFileDialog} aria-busy={isDecoding} className={buttonClassName}>
        {previewUrl ? (
          <img src={previewUrl} alt={ImageUploaderText.selectedAlt} className="h-full w-full object-cover" />
        ) : (
          <span className={`text-6xl font-bold leading-none ${text}`}>+</span>
        )}
      </button>
    </>
  );
};
```

- [ ] **Step 2: 型チェックとリントが通ることを確認**

Run: `pnpm run check`
Expected: エラーなし。

- [ ] **Step 3: 開発サーバで動作確認 (デスクトップ)**

Run: `pnpm run dev`
1. `自己紹介` カードの Gallery に画像を 1 枚アップロード → プレビュー表示される
2. 同じ Gallery スロットに別の画像をアップロード → プレビューが差し替わる
3. DevTools > Memory > Take snapshot → `Blob` オブジェクトが差し替え後に 1 個だけ残っている (2 個以上残っていたらリーク)
4. カード種別を切り替えて再びアップロードできる

- [ ] **Step 4: コミット**

```bash
git add src/components/atoms/ImageUploader.tsx
git commit -m "ImageUploaderをBlob URL + img.decode()方式に再設計"
```

---

### Task 4: `useCardExport` フックを新規作成

**Files:**
- Create: `src/hooks/useCardExport.ts`

**Interfaces:**
- Consumes: `loadGoogleFont(fontFamilyValue: string): Promise<void>` from `@/utils/loadGoogleFont` (Task 2)
- Produces:
  - `ExportStatus = 'idle' | 'preparing' | 'rendering' | 'success' | 'error'`
  - `interface UseCardExportOptions { targetRef: RefObject<HTMLElement | null>; width: number; height: number; fileName: string }`
  - `interface UseCardExportReturn { status: ExportStatus; errorMessage: string | null; exportImage: () => Promise<void> }`
  - `function useCardExport(opts: UseCardExportOptions): UseCardExportReturn`
  - `exportImage()` は `status !== 'idle'` の間は即 return する再入不可。成功後 1500ms、失敗後 3000ms で `status` を `idle` に戻す。

- [ ] **Step 1: フックのファイルを新規作成**

`src/hooks/useCardExport.ts` を新規作成:

```ts
import { toPng } from 'html-to-image';
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { TOP_PAGE_TEXT } from '@/constant/pages.constant';
import { loadGoogleFont } from '@/utils/loadGoogleFont';

export type ExportStatus = 'idle' | 'preparing' | 'rendering' | 'success' | 'error';

export interface UseCardExportOptions {
  targetRef: RefObject<HTMLElement | null>;
  width: number;
  height: number;
  fileName: string;
}

export interface UseCardExportReturn {
  status: ExportStatus;
  errorMessage: string | null;
  exportImage: () => Promise<void>;
}

const SUCCESS_RESET_MS = 1500;
const ERROR_RESET_MS = 3000;

const waitForImages = async (root: HTMLElement): Promise<void> => {
  const imgs = Array.from(root.querySelectorAll<HTMLImageElement>('img'));
  await Promise.all(
    imgs.map((img) => {
      if (typeof img.decode === 'function') {
        return img.decode().catch(() => undefined);
      }
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
      });
    }),
  );
};

const collectFontFamilies = (root: HTMLElement): string[] => {
  const familyValues = new Set<string>();
  const rootFamily = getComputedStyle(root).fontFamily;
  if (rootFamily) familyValues.add(rootFamily);
  root.querySelectorAll<HTMLElement>('*').forEach((el) => {
    const family = getComputedStyle(el).fontFamily;
    if (family) familyValues.add(family);
  });
  return Array.from(familyValues);
};

const waitForFonts = async (root: HTMLElement): Promise<void> => {
  const families = collectFontFamilies(root);
  await Promise.all(families.map((family) => loadGoogleFont(family)));
  await Promise.all(
    families.map((family) => {
      const firstFamily = family.split(',')[0]?.trim().replace(/^['"]|['"]$/g, '') ?? '';
      if (!firstFamily) return Promise.resolve();
      return document.fonts.load(`10px "${firstFamily}"`).catch(() => undefined);
    }),
  );
};

const waitTwoFrames = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });

const triggerDownload = (dataUrl: string, fileName: string): void => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
};

export function useCardExport(opts: UseCardExportOptions): UseCardExportReturn {
  const { targetRef, width, height, fileName } = opts;
  const [status, setStatus] = useState<ExportStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const scheduleReset = useCallback((delayMs: number) => {
    if (resetTimerRef.current !== null) {
      clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = setTimeout(() => {
      setStatus('idle');
      setErrorMessage(null);
      resetTimerRef.current = null;
    }, delayMs);
  }, []);

  const exportImage = useCallback(async () => {
    if (status !== 'idle') return;
    const el = targetRef.current;
    if (!el) return;

    setErrorMessage(null);
    setStatus('preparing');
    try {
      await waitForImages(el);
      await waitForFonts(el);
      await waitTwoFrames();

      setStatus('rendering');
      const dataUrl = await toPng(el, {
        style: { transform: 'none', transformOrigin: 'top left' },
        width,
        height,
        pixelRatio: 2,
        cacheBust: false,
      });
      triggerDownload(dataUrl, fileName);

      setStatus('success');
      scheduleReset(SUCCESS_RESET_MS);
    } catch (error) {
      console.error(TOP_PAGE_TEXT.genImageErrorLog, error);
      setErrorMessage(TOP_PAGE_TEXT.exportErrorMessage);
      setStatus('error');
      scheduleReset(ERROR_RESET_MS);
    }
  }, [status, targetRef, width, height, fileName, scheduleReset]);

  return { status, errorMessage, exportImage };
}
```

- [ ] **Step 2: 型チェックとリントが通ることを確認**

Run: `pnpm run check`
Expected: エラーなし。特に `useExhaustiveDependencies` ルールで `useCallback` の依存配列に警告が出ないことを確認する。

- [ ] **Step 3: ビルドが通ることを確認**

Run: `pnpm run build`
Expected: 成功。

- [ ] **Step 4: コミット**

```bash
git add src/hooks/useCardExport.ts
git commit -m "useCardExportフックを新設し画像出力の責務を集約"
```

---

### Task 5: `Top.tsx` を新フックで書き換え、workaround を撤去

**Files:**
- Modify: `src/pages/Top.tsx`

**Interfaces:**
- Consumes: `useCardExport` from `@/hooks/useCardExport` (Task 4), `TOP_PAGE_TEXT.exportingLabel` / `exportSuccessLabel` / `exportErrorMessage` from `@/constant/pages.constant` (Task 1)
- Produces: 変更なし (Top はページコンポーネント)

- [ ] **Step 1: `Top.tsx` を書き換え**

`src/pages/Top.tsx` を以下に置換:

```tsx
import { BasicButton } from '@naru/untitled-ui-library';
import { useRef } from 'react';
import { CARD_HEIGHT, CARD_WIDTH, OFFICIAL_CARD_HEIGHT, OFFICIAL_CARD_WIDTH } from '@/constant/cards.constant';
import { TOP_PAGE_TEXT } from '@/constant/pages.constant';
import { BasicCardType, LookAtMyOshiCardType, OfficialProfileCardType } from '@/constant/sidemenu.constants';
import { useCardType } from '@/context/CardTypeContext';
import { BasicIntroductionCard } from '@/feature/cards/BasicIntroductionCard';
import { LookAtMyOshiCard } from '@/feature/cards/LookAtMyOshiCard';
import { OfficialProfileCard } from '@/feature/cards/OfficialProfileCard';
import { useCardExport } from '@/hooks/useCardExport';

export function Top() {
  const profileRef = useRef<HTMLDivElement>(null);
  const { cardType } = useCardType();
  const isOfficial = cardType === OfficialProfileCardType;

  const { status, errorMessage, exportImage } = useCardExport({
    targetRef: profileRef,
    width: isOfficial ? OFFICIAL_CARD_WIDTH : CARD_WIDTH,
    height: isOfficial ? OFFICIAL_CARD_HEIGHT : CARD_HEIGHT,
    fileName: TOP_PAGE_TEXT.profileFileName,
  });

  const isBusy = status === 'preparing' || status === 'rendering';
  const buttonLabel =
    status === 'success'
      ? TOP_PAGE_TEXT.exportSuccessLabel
      : isBusy
        ? TOP_PAGE_TEXT.exportingLabel
        : TOP_PAGE_TEXT.saveImageButtonLabel;

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
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </main>
  );
}
```

- [ ] **Step 2: 型チェックとリントが通ることを確認**

Run: `pnpm run check`
Expected: エラーなし。`BasicButton` が `disabled` を受け付けない場合は次のステップで対応する。

- [ ] **Step 3: `BasicButton` の props 制約を確認**

`BasicButton` は `@naru/untitled-ui-library` のコンポーネント。もし `disabled` プロパティを受け取れない場合、代わりに親側で `onClick` をガードする書き換えを行う:

```tsx
const handleClick = () => {
  if (isBusy) return;
  exportImage();
};

// <BasicButton type="button" onClick={handleClick} aria-busy={isBusy} className="--content-font">
```

Run: `pnpm run check` で確認し、必要ならこのフォールバックに差し替え。

- [ ] **Step 4: 開発サーバで動作確認 (デスクトップ Chrome)**

Run: `pnpm run dev`
1. `自己紹介` カードで、Gallery に画像 1 枚 + 各 Input に文字入力 → 「画像として保存」を押す
2. ボタンラベルが「出力中...」→「保存しました」と遷移する
3. `profile.png` がダウンロードされ、開くと画像も文字も正しく写っている
4. 「画像として保存」ボタン連打 → 2 回目以降は無視される (disabled + status ガード)
5. `私の推し` (`LookAtMyOshiCard`) でも同様に動作
6. `公式プロフ` (`OfficialProfileCard`) でも背景画像込みで出力される
7. DevTools > Network タブで `toPng` 実行時に画像 fetch が起きるが、**1 サイクルのみ** (2 重呼び出しが除去されている)

- [ ] **Step 5: コミット**

```bash
git add src/pages/Top.tsx
git commit -m "Top.tsxをuseCardExport化し2重toPng workaroundを撤去"
```

---

### Task 6: 手動 QA (モバイル含む)

**Files:**
- なし (検証のみ)

**Interfaces:**
- Consumes: 全変更後のアプリ
- Produces: 手動テストレポート (合否 + 発見された不具合)

このタスクは新規コミットを生成しない検証タスク。1 つでも FAIL があれば該当タスクに戻って修正する。

- [ ] **Step 1: デスクトップ Chrome での動作確認**

`pnpm run dev` → デスクトップ Chrome:
- [ ] `自己紹介` カード: Gallery 4 枚 + Input 6 個全部埋めて出力成功
- [ ] `私の推し` カード: 中央 1 + 背景 4 = 計 5 枚 ImageUploader 全部埋めて出力成功
- [ ] `公式プロフ` カード: すべての CoordInput + TextArea 埋めて背景込み出力成功
- [ ] フォント切替 (`Yomogi` などマイナーな手書き系) 直後にすぐ出力 → 新フォントで出る
- [ ] 出力中にボタン連打してもリクエストは 1 本
- [ ] 出力中に別カードへ切替 → アプリがクラッシュしない (前の出力完了時に警告が出ても許容、白画面や例外投擲は NG)

- [ ] **Step 2: iOS Safari (実機) での動作確認**

`pnpm run dev` のホスト IP へ iPhone Safari からアクセス:
- [ ] ImageUploader 1 枚アップ → 即出力しても白飛びしない
- [ ] Gallery (4 枚) 全てアップ → 出力しても全部映る
- [ ] 出力完了までに要する秒数 (体感でよい) を記録し、旧版 (2 重 toPng の main ブランチ) と比較して短縮していることを確認

- [ ] **Step 3: メモリリーク確認**

デスクトップ Chrome DevTools > Memory:
- [ ] `Gallery` の同じスロットで画像を 5 回差し替える
- [ ] Snapshot を撮り、`Blob` オブジェクトが 4 個以内であることを確認 (現在表示中 + GC 前の残骸考慮)
- [ ] タブを閉じずにカード種別切替 → メモリ使用量が単調増加していない

- [ ] **Step 4: エラー系動作確認**

- [ ] DevTools > Network を offline にして「画像として保存」を押す
- [ ] エラーメッセージ (`画像出力に失敗しました。もう一度お試しください`) がボタン下に出る
- [ ] 3 秒後にメッセージが消えボタンが再クリック可能に戻る

- [ ] **Step 5: 発見された不具合があれば修正コミット**

QA で発見された不具合は原則として該当タスク (Task 2〜5) に戻って修正する。QA 由来の追加コミットには prefix `fix:` を付ける。

```bash
git add <該当ファイル>
git commit -m "<QA発見の問題>を修正"
```

- [ ] **Step 6: 完了報告**

すべての QA 項目が pass したら、実装は完了。ブランチをレビュー/マージへ回す。

---

## 完了時の状態

- モバイル (iOS Safari) で ImageUploader 経由の画像が白飛びしない
- `toPng` の呼び出しは 1 サイクルのみ (2 重呼び出し撤去)
- 出力中は「出力中...」ラベルとボタン disabled、失敗時はエラーメッセージ表示
- `Top.tsx` は画像/フォント待機ロジックを持たず、`useCardExport` フックに一任
- Blob URL のライフサイクル (create/revoke) が ImageUploader 内で完結
- Google Fonts は FontFace API 経由でロードされ、`document.fonts.load` で最終確認される
