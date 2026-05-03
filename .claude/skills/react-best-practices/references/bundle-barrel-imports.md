---
title: バレルファイルのインポートを避ける
impact: CRITICAL
impactDescription: 200-800ms import cost, slow builds
tags: bundle, imports, tree-shaking, barrel-files, performance
---

## バレルファイルのインポートを避ける

未使用モジュールを大量に読み込まないよう、バレルファイルではなくソースファイルから直接インポートしてください。**バレルファイル**とは、複数のモジュールを再エクスポートするエントリーポイントのことです（例：`export * from './module'`を行う`index.js`）。

人気のアイコンやコンポーネントライブラリのエントリーファイルには**最大1万件の再エクスポート**が含まれる場合があります。多くのReactパッケージでは、**インポートするだけで200〜800msかかり**、開発速度と本番環境のコールドスタートの両方に影響します。

**なぜツリーシェイキングが効かないか：** ライブラリがexternalとしてマークされている（バンドルされていない）場合、バンドラーは最適化できません。ツリーシェイキングのためにバンドルすると、モジュールグラフ全体の解析でビルドが大幅に遅くなります。

**誤り（ライブラリ全体をインポートする）：**

```tsx
import { Check, X, Menu } from 'lucide-react'
// Loads 1,583 modules, takes ~2.8s extra in dev
// Runtime cost: 200-800ms on every cold start

import { Button, TextField } from '@mui/material'
// Loads 2,225 modules, takes ~4.2s extra in dev
```

**正しい（必要なものだけインポートする）：**

```tsx
import Check from 'lucide-react/dist/esm/icons/check'
import X from 'lucide-react/dist/esm/icons/x'
import Menu from 'lucide-react/dist/esm/icons/menu'
// Loads only 3 modules (~2KB vs ~1MB)

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// Loads only what you use
```

**代替案（Next.js 13.5+）：**

```js
// next.config.js - use optimizePackageImports
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@mui/material']
  }
}

// Then you can keep the ergonomic barrel imports:
import { Check, X, Menu } from 'lucide-react'
// Automatically transformed to direct imports at build time
```

直接インポートにより、dev起動が15〜70%高速化、ビルドが28%高速化、コールドスタートが40%高速化、HMRも大幅に改善されます。

よく影響を受けるライブラリ：`lucide-react`、`@mui/material`、`@mui/icons-material`、`@tabler/icons-react`、`react-icons`、`@headlessui/react`、`@radix-ui/react-*`、`lodash`、`ramda`、`date-fns`、`rxjs`、`react-use`。

参考：[Next.jsにおけるパッケージインポートの最適化方法](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
