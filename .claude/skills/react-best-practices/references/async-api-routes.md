---
title: APIルートのウォーターフォールチェーンを防ぐ
impact: CRITICAL
impactDescription: 2-10× improvement
tags: api-routes, server-actions, waterfalls, parallelization
---

## APIルートのウォーターフォールチェーンを防ぐ

APIルートとServer Actionでは、独立した処理はawaitしなくてもすぐに開始してください。

**誤り（configはauthを待ち、dataは両方を待つ）：**

```typescript
export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}
```

**正しい（authとconfigをすぐに開始する）：**

```typescript
export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const session = await sessionPromise
  const [config, data] = await Promise.all([
    configPromise,
    fetchData(session.user.id)
  ])
  return Response.json({ data, config })
}
```

より複雑な依存関係チェーンを持つ処理には、`better-all`を使用して自動的に並列性を最大化してください（「依存関係ベースの並列化」を参照）。
