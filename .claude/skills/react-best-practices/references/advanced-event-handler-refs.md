---
title: イベントハンドラをRefsに格納する
impact: LOW
impactDescription: stable subscriptions
tags: advanced, hooks, refs, event-handlers, optimization
---

## イベントハンドラをRefsに格納する

コールバックの変更時に再サブスクライブすべきでないエフェクトで使用されるコールバックは、refに格納してください。

**誤り（レンダリングのたびに再サブスクライブする）：**

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler])
}
```

**正しい（安定したサブスクリプション）：**

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const listener = (e) => handlerRef.current(e)
    window.addEventListener(event, listener)
    return () => window.removeEventListener(event, listener)
  }, [event])
}
```

**代替案：最新のReactを使用している場合は`useEffectEvent`を使用する：**

```tsx
import { useEffectEvent } from 'react'

function useWindowEvent(event: string, handler: (e) => void) {
  const onEvent = useEffectEvent(handler)

  useEffect(() => {
    window.addEventListener(event, onEvent)
    return () => window.removeEventListener(event, onEvent)
  }, [event])
}
```

`useEffectEvent`は同じパターンに対してよりクリーンなAPIを提供します。常にハンドラーの最新バージョンを呼び出す安定した関数参照を作成します。
