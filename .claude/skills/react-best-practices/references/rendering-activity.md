---
title: 表示/非表示にActivityコンポーネントを使用する
impact: MEDIUM
impactDescription: preserves state/DOM
tags: rendering, activity, visibility, state-preservation
---

## 表示/非表示にActivityコンポーネントを使用する

頻繁に表示/非表示が切り替わる高コストなコンポーネントには、Reactの`<Activity>`を使用してstate/DOMを保持します。

**使用例：**

```tsx
import { Activity } from 'react'

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
```

高コストな再レンダリングとstateの消失を防ぎます。
