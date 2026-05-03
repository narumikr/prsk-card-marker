---
title: 安定したコールバックRefのためのuseEffectEvent
impact: LOW
impactDescription: prevents effect re-runs
tags: advanced, hooks, useEffectEvent, refs, optimization
---

## 安定したコールバックRefのためのuseEffectEvent

依存配列に追加することなく、コールバック内で最新の値にアクセスします。古いクロージャを避けながらエフェクトの再実行を防止します。

**誤り（コールバックが変わるたびにエフェクトが再実行される）：**

```tsx
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(query), 300)
    return () => clearTimeout(timeout)
  }, [query, onSearch])
}
```

**正しい（ReactのuseEffectEventを使用）：**

```tsx
import { useEffectEvent } from 'react';

function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const onSearchEvent = useEffectEvent(onSearch)

  useEffect(() => {
    const timeout = setTimeout(() => onSearchEvent(query), 300)
    return () => clearTimeout(timeout)
  }, [query])
}
```
