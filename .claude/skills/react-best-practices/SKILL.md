---
name: react-best-practices
description:
  Vercel Engineeringが執筆したReactおよびNext.jsのパフォーマンス最適化ガイドライン。ユーザーが「Reactのパフォーマンスを最適化して」「バンドルサイズを削減して」「再レンダリングを修正して」「Next.jsのパフォーマンスを改善して」「Reactコードをレビューして」「コンポーネントをリファクタリングして」「データフェッチングを最適化して」「ウォーターフォールを排除して」「SSRパフォーマンスを改善して」と依頼した時、またはReact/Next.jsのコンポーネント、ページ、データフェッチング、バンドル最適化、レンダリングパフォーマンスに関わるコードの作成・レビュー・リファクタリングを行う時に使用する。
---

# Vercel React ベストプラクティス

Vercel Engineeringが執筆した、ReactおよびNext.jsアプリケーション向けの包括的なパフォーマンス最適化ガイド。8つのカテゴリにわたる57のルールを、リファクタリングやコード生成を導くための優先度順に整理しています。

## 適用タイミング

以下の場面でこのガイドラインを適用してください：
- 新しいReactコンポーネントまたはNext.jsページを作成する時
- データフェッチング（クライアントまたはサーバーサイド）を実装する時
- React/Next.jsコードをパフォーマンスの観点からレビュー・リファクタリングする時
- バンドルサイズ、ロード時間、レンダリングを最適化する時
- 再レンダリングの問題やウォーターフォールリクエストをデバッグする時

## ルールカテゴリ

ルールはドメインごとにグループ化されています。各ルールにはオリジナルのソースによる影響レベルが設定されています。常にCRITICALとHIGHの影響レベルのルールを優先してください。

## クイックリファレンス

### 1. ウォーターフォールの排除

| ルール | 影響 | 説明 |
|------|--------|-------------|
| `async-defer-await` | HIGH | 実際に使用するブランチにawaitを移動する |
| `async-parallel` | CRITICAL | 独立した処理にはPromise.all()を使用する |
| `async-dependencies` | CRITICAL | 部分的な依存関係にはbetter-allを使用する |
| `async-api-routes` | CRITICAL | APIルートではPromiseを早めに開始し、awaitを遅らせる |
| `async-suspense-boundaries` | HIGH | Suspenseを使用してコンテンツをストリーミングする |

### 2. バンドルサイズの最適化

| ルール | 影響 | 説明 |
|------|--------|-------------|
| `bundle-barrel-imports` | CRITICAL | 直接インポートを使用し、バレルファイルを避ける |
| `bundle-dynamic-imports` | CRITICAL | 重いコンポーネントにはnext/dynamicを使用する |
| `bundle-defer-third-party` | MEDIUM | ハイドレーション後にアナリティクス/ログを読み込む |
| `bundle-conditional` | HIGH | 機能が有効化された時のみモジュールを読み込む |
| `bundle-preload` | MEDIUM | ホバー/フォーカス時にプリロードして体感速度を向上する |

### 3. サーバーサイドのパフォーマンス

| ルール | 影響 | 説明 |
|------|--------|-------------|
| `server-auth-actions` | CRITICAL | サーバーアクションをAPIルートと同様に認証する |
| `server-parallel-fetching` | CRITICAL | フェッチを並列化するようにコンポーネントを再構成する |
| `server-cache-lru` | HIGH | クロスリクエストキャッシュにLRUキャッシュを使用する |
| `server-serialization` | HIGH | クライアントコンポーネントへ渡すデータを最小化する |
| `server-cache-react` | MEDIUM | リクエストごとの重複排除にReact.cache()を使用する |
| `server-after-nonblocking` | MEDIUM | ノンブロッキング処理にafter()を使用する |
| `server-dedup-props` | LOW | RSCのpropsで重複シリアライズを避ける |

### 4. クライアントサイドのデータフェッチング

| ルール | 影響 | 説明 |
|------|--------|-------------|
| `client-swr-dedup` | MEDIUM-HIGH | 自動的なリクエスト重複排除のためにSWRを使用する |
| `client-passive-event-listeners` | MEDIUM | スクロールにはパッシブリスナーを使用する |
| `client-localstorage-schema` | MEDIUM | localStorageのデータにバージョンを付けて最小化する |
| `client-event-listeners` | LOW | グローバルイベントリスナーを重複排除する |

### 5. 再レンダリングの最適化

| ルール | 影響 | 説明 |
|------|--------|-------------|
| `rerender-defer-reads` | MEDIUM | コールバックのみで使用するstateの購読を避ける |
| `rerender-memo` | MEDIUM | 高コストな処理をメモ化コンポーネントに抽出する |
| `rerender-memo-with-default-value` | MEDIUM | デフォルトの非プリミティブpropsをホイストする |
| `rerender-derived-state` | MEDIUM | 生の値ではなく派生ブーリアンを購読する |
| `rerender-derived-state-no-effect` | MEDIUM | エフェクトではなくレンダリング中に状態を派生させる |
| `rerender-functional-setstate` | MEDIUM | 安定したコールバックには関数型setStateを使用する |
| `rerender-lazy-state-init` | MEDIUM | 高コストな値にはuseStateに関数を渡す |
| `rerender-move-effect-to-event` | MEDIUM | インタラクションロジックはイベントハンドラに置く |
| `rerender-transitions` | MEDIUM | 緊急でない更新にはstartTransitionを使用する |
| `rerender-use-ref-transient-values` | MEDIUM | 一時的な頻繁に変化する値にはrefを使用する |
| `rerender-simple-expression-in-memo` | LOW-MEDIUM | 単純なプリミティブにmemoを使用しない |
| `rerender-dependencies` | LOW | エフェクトにはプリミティブな依存関係を使用する |

### 6. レンダリングパフォーマンス

| ルール | 影響 | 説明 |
|------|--------|-------------|
| `rendering-content-visibility` | HIGH | 長いリストにはcontent-visibilityを使用する |
| `rendering-activity` | MEDIUM | 表示/非表示にはActivityコンポーネントを使用する |
| `rendering-hydration-no-flicker` | MEDIUM | クライアント専用データにはインラインスクリプトを使用する |
| `rendering-hydration-suppress-warning` | LOW-MEDIUM | 想定されるミスマッチを抑制する |
| `rendering-animate-svg-wrapper` | LOW | SVG要素ではなくdivラッパーをアニメーション化する |
| `rendering-hoist-jsx` | LOW | 静的なJSXをコンポーネント外に抽出する |
| `rendering-svg-precision` | LOW | SVG座標の精度を下げる |
| `rendering-conditional-render` | LOW | 条件がfalsyな非ブーリアンになり得る場合は三項演算子を使用する |
| `rendering-usetransition-loading` | LOW | ローディング状態にはuseTransitionを優先する |

### 7. JavaScriptパフォーマンス

| ルール | 影響 | 説明 |
|------|--------|-------------|
| `js-length-check-first` | MEDIUM-HIGH | 高コストな比較の前に配列の長さを確認する |
| `js-tosorted-immutable` | MEDIUM-HIGH | Reactの状態でのミューテーションバグを防ぐためにtoSorted()を使用する |
| `js-batch-dom-css` | MEDIUM | スタイルの書き込みをバッチ処理してレイアウトスラッシングを避ける |
| `js-cache-function-results` | MEDIUM | 関数の結果をモジュールレベルのMapにキャッシュする |
| `js-index-maps` | LOW-MEDIUM | 繰り返し検索にはMapを構築する |
| `js-cache-property-access` | LOW-MEDIUM | ループ内でオブジェクトのプロパティをキャッシュする |
| `js-cache-storage` | LOW-MEDIUM | localStorageとsessionStorageの読み取りをキャッシュする |
| `js-combine-iterations` | LOW-MEDIUM | 複数のfilter/mapを1つのループにまとめる |
| `js-early-exit` | LOW-MEDIUM | 関数から早期リターンする |
| `js-hoist-regexp` | LOW-MEDIUM | RegExpの生成をループ外にホイストする |
| `js-set-map-lookups` | LOW-MEDIUM | O(1)検索にはSetとMapを使用する |
| `js-min-max-loop` | LOW | ソートの代わりにループでmin/maxを求める |

### 8. 高度なパターン

| ルール | 影響 | 説明 |
|------|--------|-------------|
| `advanced-init-once` | LOW-MEDIUM | アプリの起動時に1回だけ初期化する |
| `advanced-event-handler-refs` | LOW | イベントハンドラをrefsに格納する |
| `advanced-use-latest` | LOW | 安定したコールバックrefにはuseEffectEventを使用する |

## 使い方

`references/`内の個別のルールファイルを読んで詳細な説明とコード例を確認してください。各ルールファイルには以下が含まれています：
- そのパターンが重要な理由の簡単な説明
- 問題のあるコード例と説明
- 正しいコード例と説明
- 追加のコンテキストとトレードオフ

特定のルールを参照するには：

```
references/<prefix>-<rule-name>.md
```

例：`references/async-parallel.md`、`references/bundle-barrel-imports.md`

コードをレビューする際は、CRITICALルール（async-*、bundle-*）から始めて優先度リストを下に進んでください。

## 使用例

複数のルールを実際のコンテキストで組み合わせた完全なbefore/afterシナリオ：

- **`examples/nextjs-dashboard-page.md`** - ダッシュボードページ：ウォーターフォール排除 + 並列フェッチング + バンドル最適化 + SSR
- **`examples/rerender-optimization-form.md`** - フォームコンポーネント：派生状態 + 関数型setState + 遅延初期化 + イベントハンドラ
- **`examples/bundle-optimization-landing.md`** - ランディングページ：動的インポート + サードパーティの遅延読み込み + 条件付き読み込み + プリロード
