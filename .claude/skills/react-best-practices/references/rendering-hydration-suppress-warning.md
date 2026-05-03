---
title: 想定されるハイドレーションミスマッチを抑制する
impact: LOW-MEDIUM
impactDescription: avoids noisy hydration warnings for known differences
tags: rendering, hydration, ssr, nextjs
---

## 想定されるハイドレーションミスマッチを抑制する

SSRフレームワーク（例：Next.js）では、サーバーとクライアントで意図的に異なる値が存在します（ランダムID、日付、ロケール/タイムゾーンのフォーマット）。このような*想定される*ミスマッチには、動的なテキストを含む要素に`suppressHydrationWarning`を追加して、煩わしい警告を防ぎます。実際のバグを隠すために使用しないでください。乱用も避けてください。

**誤り（既知のミスマッチ警告）：**

```tsx
function Timestamp() {
  return <span>{new Date().toLocaleString()}</span>
}
```

**正しい（想定されるミスマッチのみ抑制）：**

```tsx
function Timestamp() {
  return (
    <span suppressHydrationWarning>
      {new Date().toLocaleString()}
    </span>
  )
}
```
