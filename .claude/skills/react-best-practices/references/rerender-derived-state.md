---
title: 派生状態を購読する
impact: MEDIUM
impactDescription: reduces re-render frequency
tags: rerender, derived-state, media-query, optimization
---

## 派生状態を購読する

再レンダリングの頻度を下げるために、連続した値ではなく派生ブーリアン状態を購読します。

**誤り（ピクセルが変わるたびに再レンダリング）：**

```tsx
function Sidebar() {
  const width = useWindowWidth()  // updates continuously
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

**正しい（ブーリアンが変わった時だけ再レンダリング）：**

```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```
