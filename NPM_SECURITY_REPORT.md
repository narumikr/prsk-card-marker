# 🩺 依存関係ヘルスレポート

> 🤖 **草薙 寧々**: パッケージの依存関係の状態確認してきたよ。レポートにまとめておいたから後で確認しておいて欲しいな🤖

**実行日時**: 2026/11/07 06:14:39 JST

---

## 📦 pnpm outdated

```
┌────────────────────────────────┬─────────┬────────┐
│ Package                        │ Current │ Latest │
├────────────────────────────────┼─────────┼────────┤
│ @vitejs/plugin-react-swc (dev) │ 4.3.0   │ 4.3.3  │
├────────────────────────────────┼─────────┼────────┤
│ @biomejs/biome (dev)           │ 2.4.13  │ 2.6.6  │
├────────────────────────────────┼─────────┼────────┤
│ @tailwindcss/vite (dev)        │ 4.2.4   │ 4.3.5  │
├────────────────────────────────┼─────────┼────────┤
│ @types/react (dev)             │ 19.2.14 │ 19.3.0 │
├────────────────────────────────┼─────────┼────────┤
│ @types/react-dom (dev)         │ 19.2.3  │ 19.3.0 │
├────────────────────────────────┼─────────┼────────┤
│ react                          │ 19.2.5  │ 19.3.1 │
├────────────────────────────────┼─────────┼────────┤
│ react-dom                      │ 19.2.5  │ 19.3.1 │
├────────────────────────────────┼─────────┼────────┤
│ react-router-dom               │ 7.13.2  │ 7.18.5 │
├────────────────────────────────┼─────────┼────────┤
│ tailwindcss (dev)              │ 4.2.4   │ 4.3.5  │
├────────────────────────────────┼─────────┼────────┤
│ vite (dev)                     │ 8.0.16  │ 8.3.6  │
├────────────────────────────────┼─────────┼────────┤
│ @types/node (dev)              │ 25.6.0  │ 26.6.6 │
├────────────────────────────────┼─────────┼────────┤
│ typescript (dev)               │ 6.0.3   │ 7.0.2  │
└────────────────────────────────┴─────────┴────────┘
```

---

## 🔒 pnpm audit

```
合計 15 件の脆弱性が検出されました

critical : 0
high     : 7
moderate : 7
low      : 1
info     : 0

----------------------------------------

■ react-router [MODERATE]
  影響バージョン: >=6.0.0 <7.18.0
  React Router: Open redirect via backslash in <Link> and useNavigate (CVE-2025-68470 bypass)
  https://github.com/advisories/GHSA-wrjc-x8rr-h8h6
  修正: >=7.18.0 へのアップデートが必要

■ react-router [MODERATE]
  影響バージョン: >=7.11.0 <7.18.0
  React Router: RSCErrorHandler Missing Protocol Validation (XSS)
  https://github.com/advisories/GHSA-h8fp-f39c-q6mh
  修正: >=7.18.0 へのアップデートが必要

■ react-router [MODERATE]
  影響バージョン: >=6.4.0 <7.18.0
  React Router: Arbitrary Constructor Injection via deserializeErrors() in React Router SSR Hydration
  https://github.com/advisories/GHSA-337j-9hxr-rhxg
  修正: >=7.18.0 へのアップデートが必要

■ react-router [HIGH]
  影響バージョン: >=7.0.0 <7.18.0
  React Router: Unauthenticated Denial of Service via Inefficient Route Matching
  https://github.com/advisories/GHSA-chx6-hx7r-mcp5
  修正: >=7.18.0 へのアップデートが必要

■ postcss [MODERATE]
  影響バージョン: <=8.5.22
  PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset
  https://github.com/advisories/GHSA-fxqj-rqcc-2cmp
  修正: >=8.5.23 へのアップデートが必要

■ react-router [HIGH]
  影響バージョン: >=7.12.0 <7.18.2
  React Router: RSC Mode CSRF Bypass Allows Action Execution Before 400 Response
  https://github.com/advisories/GHSA-qwww-vcr4-c8h2
  修正: >=7.18.2 へのアップデートが必要

■ nanoid [HIGH]
  影響バージョン: <3.3.16
  nanoid: non-secure generators can loop indefinitely with negative size
  https://github.com/advisories/GHSA-28wg-ghj8-5hjv
  修正: >=3.3.16 へのアップデートが必要

■ nanoid [HIGH]
  影響バージョン: <3.3.18
  nanoid: custom generators can loop indefinitely when size is zero
  https://github.com/advisories/GHSA-2v37-7h3g-55p8
  修正: >=3.3.18 へのアップデートが必要

■ postcss [HIGH]
  影響バージョン: <=8.5.17
  PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure
  https://github.com/advisories/GHSA-r28c-9q8g-f849
  修正: >=8.5.18 へのアップデートが必要

■ source-map-js [HIGH]
  影響バージョン: >=1.0.0 <1.2.2
  source-map-js allows event-loop denial of service through indexed source-map section offsets
  https://github.com/advisories/GHSA-68fv-2mgg-jv7q
  修正: >=1.2.2 へのアップデートが必要

■ vite [MODERATE]
  影響バージョン: >=8.0.0 <=8.1.5
  launch-editor: escapeCmdArgs() omits % escaping on Windows
  https://github.com/advisories/GHSA-698v-4r3x-3vcv
  修正: >=8.1.6 へのアップデートが必要

■ vite [MODERATE]
  影響バージョン: >=8.0.0 <=8.1.5
  launch-editor: Editor CLI flag misinterpretation causing arbitrary command execution for some editors
  https://github.com/advisories/GHSA-r825-w8mm-5pxw
  修正: >=8.1.6 へのアップデートが必要

■ vite [HIGH]
  影響バージョン: >=8.0.0 <=8.1.5
  launch-editor: `fs.existsSync()` existence check can be bypassed on Windows
  https://github.com/advisories/GHSA-587h-7wmj-h5pm
  修正: >=8.1.6 へのアップデートが必要

■ vite [LOW]
  影響バージョン: >=8.0.0 <=8.1.5
  Vite: Cross origin script execution through Vite custom middleware
  https://github.com/advisories/GHSA-9jrq-w75r-8gcw
  修正: >=8.1.6 へのアップデートが必要

■ vite [MODERATE]
  影響バージョン: >=8.0.0 <=8.1.5
  Vite: Files outside `server.fs.allow` could be served when project paths match system paths on non-Windows machine
  https://github.com/advisories/GHSA-rq7h-c2jc-7f22
  修正: >=8.1.6 へのアップデートが必要
```
