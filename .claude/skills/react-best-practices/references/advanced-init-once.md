---
title: マウントごとではなくアプリ起動時に1回だけ初期化する
impact: LOW-MEDIUM
impactDescription: avoids duplicate init in development
tags: initialization, useEffect, app-startup, side-effects
---

## マウントごとではなくアプリ起動時に1回だけ初期化する

アプリ全体で1回だけ実行すべき初期化処理を、コンポーネントの`useEffect([])`内に置かないでください。コンポーネントは再マウントされ、エフェクトが再実行される可能性があります。代わりにモジュールレベルのガードか、エントリーモジュールのトップレベルの初期化を使用してください。

**誤り（開発環境では2回実行され、再マウント時にも再実行される）：**

```tsx
function Comp() {
  useEffect(() => {
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

**正しい（アプリ起動時に1回だけ実行）：**

```tsx
let didInit = false

function Comp() {
  useEffect(() => {
    if (didInit) return
    didInit = true
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

参考：[アプリケーションの初期化](https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application)
