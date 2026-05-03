---
title: プリミティブ結果型の単純な式をuseMemoでラップしない
impact: LOW-MEDIUM
impactDescription: wasted computation on every render
tags: rerender, useMemo, optimization
---

## プリミティブ結果型の単純な式をuseMemoでラップしない

式が単純（論理演算子や算術演算子が少ない）でプリミティブな結果型（boolean、number、string）を持つ場合、`useMemo`でラップしないでください。
`useMemo`の呼び出しとフック依存関係の比較は、式自体よりも多くのリソースを消費する可能性があります。

**誤り：**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = useMemo(() => {
    return user.isLoading || notifications.isLoading
  }, [user.isLoading, notifications.isLoading])

  if (isLoading) return <Skeleton />
  // return some markup
}
```

**正しい：**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = user.isLoading || notifications.isLoading

  if (isLoading) return <Skeleton />
  // return some markup
}
```
