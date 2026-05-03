---
title: ノンブロッキングな処理にafter()を使用する
impact: MEDIUM
impactDescription: faster response times
tags: server, async, logging, analytics, side-effects
---

## ノンブロッキングな処理にafter()を使用する

Next.jsの`after()`を使用して、レスポンス送信後に実行すべき処理をスケジュールします。これにより、ログ記録、アナリティクス、その他の副作用がレスポンスをブロックするのを防ぎます。

**誤り（レスポンスをブロックする）：**

```tsx
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)

  // Logging blocks the response
  const userAgent = request.headers.get('user-agent') || 'unknown'
  await logUserAction({ userAgent })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

**正しい（ノンブロッキング）：**

```tsx
import { after } from 'next/server'
import { headers, cookies } from 'next/headers'
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)

  // Log after response is sent
  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    const sessionCookie = (await cookies()).get('session-id')?.value || 'anonymous'

    logUserAction({ sessionCookie, userAgent })
  })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

レスポンスはすぐに送信され、ログはバックグラウンドで記録されます。

**主なユースケース：**

- アナリティクスのトラッキング
- 監査ログ
- 通知の送信
- キャッシュの無効化
- クリーンアップタスク

**重要な注意点：**

- `after()`はレスポンスが失敗またはリダイレクトした場合でも実行されます
- Server Actions、Route Handlers、Server Componentsで動作します

参考：[https://nextjs.org/docs/app/api-reference/functions/after](https://nextjs.org/docs/app/api-reference/functions/after)
