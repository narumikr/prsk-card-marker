# フロントエンド (TypeScript/JavaScript)

## ツールチェーン

以下のツールを標準として使用すること。

| 種類                               | ツール                      | 選定理由                                                                            |
| ---------------------------------- | --------------------------- | ----------------------------------------------------------------------------------- |
| UIライブラリ                       | React 19                    | 現行プロジェクトのUI実装基盤                                                        |
| ビルドツール / 開発サーバ          | Vite 8                      | Reactとの相性が良く、高速な開発体験を提供できる                                    |
| パッケージ管理                     | pnpm                        | 高速でディスク効率が良く、依存管理を安定して運用しやすい                                      |
| 型チェック                         | TypeScript (`tsc`)          | 言語標準の型チェッカー                                                              |
| Linter / Formatter                 | Biome                       | lint / format / check を一元化できる                                                |
| CSSツールチェーン                  | Tailwind CSS 4 + Vite plugin | Utility-firstで実装でき、Viteとの統合も容易でスタイル管理を効率化しやすい                      |

## 運用ルール

- パッケージ操作は npm / yarn ではなく pnpm を使用すること。
- スクリプト実行は `pnpm dev` / `pnpm build` / `pnpm preview` / `pnpm lint` / `pnpm format` / `pnpm check` を使用すること。
- TypeScriptの型チェックは `pnpm build` に含まれる `tsc -b` を前提とすること。