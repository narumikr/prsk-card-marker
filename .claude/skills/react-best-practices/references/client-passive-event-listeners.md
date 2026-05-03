---
title: スクロールパフォーマンスのためにパッシブイベントリスナーを使用する
impact: MEDIUM
impactDescription: eliminates scroll delay caused by event listeners
tags: client, event-listeners, scrolling, performance, touch, wheel
---

## スクロールパフォーマンスのためにパッシブイベントリスナーを使用する

タッチとホイールのイベントリスナーに`{ passive: true }`を追加して、即座のスクロールを有効にします。ブラウザは通常、`preventDefault()`が呼ばれるかどうか確認するためにリスナーの完了を待つため、スクロールの遅延が発生します。

**誤り：**

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)

  document.addEventListener('touchstart', handleTouch)
  document.addEventListener('wheel', handleWheel)

  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

**正しい：**

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)

  document.addEventListener('touchstart', handleTouch, { passive: true })
  document.addEventListener('wheel', handleWheel, { passive: true })

  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

**passiveを使用する場面：** トラッキング/アナリティクス、ログ、`preventDefault()`を呼ばないすべてのリスナー。

**passiveを使用しない場面：** カスタムスワイプジェスチャーの実装、カスタムズームコントロール、`preventDefault()`が必要なリスナー。
