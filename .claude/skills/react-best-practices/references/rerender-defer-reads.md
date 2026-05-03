---
title: state の読み取りを使用箇所まで遅らせる
impact: MEDIUM
impactDescription: avoids unnecessary subscriptions
tags: rerender, searchParams, localStorage, optimization
---

## state の読み取りを使用箇所まで遅らせる

動的なstate（searchParams、localStorage）はコールバック内でのみ読み取る場合、それを購読しないでください。

**誤り（すべてのsearchParamsの変更を購読する）：**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const searchParams = useSearchParams()

  const handleShare = () => {
    const ref = searchParams.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

**正しい（オンデマンドで読み取り、購読なし）：**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```
