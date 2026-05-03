---
title: 明示的な条件レンダリングを使用する
impact: LOW
impactDescription: prevents rendering 0 or NaN
tags: rendering, conditional, jsx, falsy-values
---

## 明示的な条件レンダリングを使用する

条件が`0`、`NaN`、またはレンダリングされるその他のfalsyな値になりうる場合は、`&&`の代わりに明示的な三項演算子（`? :`）を使用します。

**誤り（countが0の時に「0」がレンダリングされる）：**

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count && <span className="badge">{count}</span>}
    </div>
  )
}

// When count = 0, renders: <div>0</div>
// When count = 5, renders: <div><span class="badge">5</span></div>
```

**正しい（countが0の時は何もレンダリングされない）：**

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count > 0 ? <span className="badge">{count}</span> : null}
    </div>
  )
}

// When count = 0, renders: <div></div>
// When count = 5, renders: <div><span class="badge">5</span></div>
```
