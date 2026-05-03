---
title: 自動重複排除のためにSWRを使用する
impact: MEDIUM-HIGH
impactDescription: automatic deduplication
tags: client, swr, deduplication, data-fetching
---

## 自動重複排除のためにSWRを使用する

SWRはコンポーネントインスタンス間でリクエストの重複排除、キャッシュ、再検証を自動的に行います。

**誤り（重複排除なし、各インスタンスがフェッチする）：**

```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
```

**正しい（複数インスタンスが1つのリクエストを共有する）：**

```tsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

**イミュータブルなデータの場合：**

```tsx
import { useImmutableSWR } from '@/lib/swr'

function StaticContent() {
  const { data } = useImmutableSWR('/api/config', fetcher)
}
```

**ミューテーションの場合：**

```tsx
import { useSWRMutation } from 'swr/mutation'

function UpdateButton() {
  const { trigger } = useSWRMutation('/api/user', updateUser)
  return <button onClick={() => trigger()}>Update</button>
}
```

参考：[https://swr.vercel.app](https://swr.vercel.app)
