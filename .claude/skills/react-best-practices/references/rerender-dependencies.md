---
title: エフェクトの依存関係を絞り込む
impact: LOW
impactDescription: minimizes effect re-runs
tags: rerender, useEffect, dependencies, optimization
---

## エフェクトの依存関係を絞り込む

エフェクトの再実行を最小化するために、オブジェクトではなくプリミティブな依存関係を指定します。

**誤り（userのどのフィールドが変わっても再実行される）：**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user])
```

**正しい（idが変わった時だけ再実行される）：**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user.id])
```

**派生状態は、エフェクトの外で計算する：**

```tsx
// Incorrect: runs on width=767, 766, 765...
useEffect(() => {
  if (width < 768) {
    enableMobileMode()
  }
}, [width])

// Correct: runs only on boolean transition
const isMobile = width < 768
useEffect(() => {
  if (isMobile) {
    enableMobileMode()
  }
}, [isMobile])
```
