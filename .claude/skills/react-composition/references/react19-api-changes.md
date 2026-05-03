---
title: React 19 APIの変更
impact: MEDIUM
impactDescription: よりクリーンなコンポーネント定義とコンテキストの使用
tags: react19, refs, context, hooks
---

## React 19 APIの変更

> **⚠️ React 19以降のみ。** React 18以前を使用している場合はスキップする。

React 19では、`ref`が通常のpropになり（`forwardRef`ラッパー不要）、`use()`が`useContext()`に取って代わる。

**誤り（React 19でのforwardRef）：**

```tsx
const ComposerInput = forwardRef<TextInput, Props>((props, ref) => {
  return <TextInput ref={ref} {...props} />
})
```

**正しい（通常のpropとしてのref）：**

```tsx
function ComposerInput({ ref, ...props }: Props & { ref?: React.Ref<TextInput> }) {
  return <TextInput ref={ref} {...props} />
}
```

**誤り（React 19でのuseContext）：**

```tsx
const value = useContext(MyContext)
```

**正しい（useContextの代わりにuse）：**

```tsx
const value = use(MyContext)
```

`use()`は`useContext()`と異なり、条件付きで呼び出すこともできる。
