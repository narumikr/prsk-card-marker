---
title: クロスリクエストLRUキャッシュ
impact: HIGH
impactDescription: caches across requests
tags: server, cache, lru, cross-request
---

## クロスリクエストLRUキャッシュ

`React.cache()`は1つのリクエスト内でのみ機能します。連続したリクエスト間で共有されるデータ（ユーザーがボタンAを押してからボタンBを押すなど）には、LRUキャッシュを使用します。

**実装例：**

```typescript
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 5 * 60 * 1000  // 5 minutes
})

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached

  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}

// Request 1: DB query, result cached
// Request 2: cache hit, no DB query
```

連続したユーザーアクションが数秒以内に同じデータを必要とする複数のエンドポイントにヒットする場合に使用します。

**Vercelの[Fluid Compute](https://vercel.com/docs/fluid-compute)を使用する場合：** 複数の同時リクエストが同じ関数インスタンスとキャッシュを共有できるため、LRUキャッシュが特に効果的です。つまり、Redisのような外部ストレージなしにリクエスト間でキャッシュが持続します。

**従来のサーバーレス環境：** 各呼び出しは独立して実行されるため、クロスプロセスキャッシュにはRedisを検討してください。

参考：[https://github.com/isaacs/node-lru-cache](https://github.com/isaacs/node-lru-cache)
