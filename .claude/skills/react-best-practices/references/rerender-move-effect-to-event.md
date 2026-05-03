---
title: インタラクションロジックをイベントハンドラに置く
impact: MEDIUM
impactDescription: avoids effect re-runs and duplicate side effects
tags: rerender, useEffect, events, side-effects, dependencies
---

## インタラクションロジックをイベントハンドラに置く

副作用が特定のユーザーアクション（送信、クリック、ドラッグ）によってトリガーされる場合は、そのイベントハンドラ内で実行します。アクションをstate+エフェクトとしてモデル化しないでください。エフェクトが無関係な変更時にも再実行され、アクションが重複する可能性があります。

**誤り（イベントをstate+エフェクトとしてモデル化）：**

```tsx
function Form() {
  const [submitted, setSubmitted] = useState(false)
  const theme = useContext(ThemeContext)

  useEffect(() => {
    if (submitted) {
      post('/api/register')
      showToast('Registered', theme)
    }
  }, [submitted, theme])

  return <button onClick={() => setSubmitted(true)}>Submit</button>
}
```

**正しい（ハンドラで処理する）：**

```tsx
function Form() {
  const theme = useContext(ThemeContext)

  function handleSubmit() {
    post('/api/register')
    showToast('Registered', theme)
  }

  return <button onClick={handleSubmit}>Submit</button>
}
```

参考：[このコードはイベントハンドラに移すべきか？](https://react.dev/learn/removing-effect-dependencies#should-this-code-move-to-an-event-handler)
