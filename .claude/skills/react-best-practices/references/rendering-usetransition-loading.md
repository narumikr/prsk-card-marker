---
title: 手動のローディング状態よりuseTransitionを優先する
impact: LOW
impactDescription: reduces re-renders and improves code clarity
tags: rendering, transitions, useTransition, loading, state
---

## 手動のローディング状態よりuseTransitionを優先する

ローディング状態に手動の`useState`の代わりに`useTransition`を使用します。組み込みの`isPending`状態を提供し、トランジションを自動的に管理します。

**誤り（手動のローディング状態）：**

```tsx
function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (value: string) => {
    setIsLoading(true)
    setQuery(value)
    const data = await fetchResults(value)
    setResults(data)
    setIsLoading(false)
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**正しい（組み込みのpending状態を持つuseTransition）：**

```tsx
import { useTransition, useState } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    setQuery(value) // Update input immediately

    startTransition(async () => {
      // Fetch and update results
      const data = await fetchResults(value)
      setResults(data)
    })
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**メリット：**

- **自動的なpending状態：** `setIsLoading(true/false)`を手動で管理する必要がない
- **エラー耐性：** トランジションがエラーをスローしても、pending状態が正しくリセットされる
- **応答性の向上：** 更新中もUIの応答性を保持する
- **割り込み処理：** 新しいトランジションが保留中のトランジションを自動的にキャンセルする

参考：[useTransition](https://react.dev/reference/react/useTransition)
