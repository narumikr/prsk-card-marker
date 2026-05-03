---
title: 重要でないサードパーティライブラリを遅延読み込みする
impact: MEDIUM
impactDescription: loads after hydration
tags: bundle, third-party, analytics, defer
---

## 重要でないサードパーティライブラリを遅延読み込みする

アナリティクス、ログ、エラートラッキングはユーザーの操作をブロックしません。ハイドレーション後に読み込みます。

**誤り（初期バンドルをブロックする）：**

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**正しい（ハイドレーション後に読み込む）：**

```tsx
import dynamic from 'next/dynamic'

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(m => m.Analytics),
  { ssr: false }
)

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```
