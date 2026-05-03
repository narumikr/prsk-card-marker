---
title: レンダリング中に派生状態を計算する
impact: MEDIUM
impactDescription: avoids redundant renders and state drift
tags: rerender, derived-state, useEffect, state
---

## レンダリング中に派生状態を計算する

現在のprops/stateから計算できる値は、stateに格納したりエフェクトで更新したりしないでください。レンダリング中に派生させることで、余分なレンダリングとstateのズレを防ぎます。propsの変更のみに反応してstateをエフェクトで設定しないでください。代わりに派生値またはkeyedリセットを使用してください。

**誤り（冗長なstateとエフェクト）：**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(firstName + ' ' + lastName)
  }, [firstName, lastName])

  return <p>{fullName}</p>
}
```

**正しい（レンダリング中に派生させる）：**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const fullName = firstName + ' ' + lastName

  return <p>{fullName}</p>
}
```

参考：[You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
