---
title: React.cache()によるリクエストごとの重複排除
impact: MEDIUM
impactDescription: deduplicates within request
tags: server, cache, react-cache, deduplication
---

## React.cache()によるリクエストごとの重複排除

サーバーサイドのリクエスト重複排除には`React.cache()`を使用します。認証とデータベースクエリが最も恩恵を受けます。

**使用例：**

```typescript
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null
  return await db.user.findUnique({
    where: { id: session.user.id }
  })
})
```

単一のリクエスト内では、`getCurrentUser()`への複数の呼び出しはクエリを1回だけ実行します。

**インラインオブジェクトを引数として使用しない：**

`React.cache()`はキャッシュヒットの判定に浅い等値（`Object.is`）を使用します。インラインオブジェクトは呼び出しごとに新しい参照を作成するため、キャッシュヒットが発生しません。

**誤り（常にキャッシュミス）：**

```typescript
const getUser = cache(async (params: { uid: number }) => {
  return await db.user.findUnique({ where: { id: params.uid } })
})

// Each call creates new object, never hits cache
getUser({ uid: 1 })
getUser({ uid: 1 })  // Cache miss, runs query again
```

**正しい（キャッシュヒット）：**

```typescript
const getUser = cache(async (uid: number) => {
  return await db.user.findUnique({ where: { id: uid } })
})

// Primitive args use value equality
getUser(1)
getUser(1)  // Cache hit, returns cached result
```

オブジェクトを渡す必要がある場合は、同じ参照を渡します：

```typescript
const params = { uid: 1 }
getUser(params)  // Query runs
getUser(params)  // Cache hit (same reference)
```

**Next.js固有の注意：**

Next.jsでは、`fetch` APIは自動的にリクエストのメモ化で拡張されています。同じURLとオプションを持つリクエストは単一リクエスト内で自動的に重複排除されるため、`fetch`呼び出しに`React.cache()`は不要です。ただし、`React.cache()`は他の非同期タスクには依然として不可欠です：

- データベースクエリ（Prisma、Drizzleなど）
- 重い計算処理
- 認証チェック
- ファイルシステム操作
- その他のfetch以外の非同期処理

コンポーネントツリー全体でこれらの操作を重複排除するために`React.cache()`を使用してください。

参考：[React.cacheドキュメント](https://react.dev/reference/react/cache)
