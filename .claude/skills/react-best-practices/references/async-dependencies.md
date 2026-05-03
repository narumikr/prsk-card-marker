---
title: 依存関係ベースの並列化
impact: CRITICAL
impactDescription: 2-10× improvement
tags: async, parallelization, dependencies, better-all
---

## 依存関係ベースの並列化

部分的な依存関係を持つ処理には、`better-all`を使用して並列性を最大化します。各タスクを可能な限り早い段階で自動的に開始します。

**誤り（profileが不必要にconfigを待つ）：**

```typescript
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig()
])
const profile = await fetchProfile(user.id)
```

**正しい（configとprofileを並列実行）：**

```typescript
import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() { return fetchUser() },
  async config() { return fetchConfig() },
  async profile() {
    return fetchProfile((await this.$.user).id)
  }
})
```

**追加依存なしの代替案：**

全てのPromiseを最初に作成し、最後に`Promise.all()`を実行することもできます。

```typescript
const userPromise = fetchUser()
const profilePromise = userPromise.then(user => fetchProfile(user.id))

const [user, config, profile] = await Promise.all([
  userPromise,
  fetchConfig(),
  profilePromise
])
```

参考：[https://github.com/shuding/better-all](https://github.com/shuding/better-all)
