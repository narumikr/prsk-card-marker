---
title: Server ActionをAPIルートと同様に認証する
impact: CRITICAL
impactDescription: prevents unauthorized access to server mutations
tags: server, server-actions, authentication, security, authorization
---

## Server ActionをAPIルートと同様に認証する

**影響：CRITICAL（サーバーミューテーションへの不正アクセスを防ぐ）**

Server Action（`"use server"`を持つ関数）はAPIルートと同様にパブリックなエンドポイントとして公開されます。Server Actionは直接呼び出せるため、ミドルウェアやレイアウトガード、ページレベルのチェックのみに頼らず、常に各Server Action**内部**で認証と認可を確認してください。

Next.jsのドキュメントでは明示的に「Server Actionはパブリックに公開されているAPIエンドポイントと同じセキュリティ上の配慮を持って扱い、ユーザーがミューテーションを実行することが許可されているか確認してください」と述べています。

**誤り（認証チェックなし）：**

```typescript
'use server'

export async function deleteUser(userId: string) {
  // Anyone can call this! No auth check
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**正しい（アクション内部での認証）：**

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { unauthorized } from '@/lib/errors'

export async function deleteUser(userId: string) {
  // Always check auth inside the action
  const session = await verifySession()

  if (!session) {
    throw unauthorized('Must be logged in')
  }

  // Check authorization too
  if (session.user.role !== 'admin' && session.user.id !== userId) {
    throw unauthorized('Cannot delete other users')
  }

  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**入力バリデーションを伴う例：**

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email()
})

export async function updateProfile(data: unknown) {
  // Validate input first
  const validated = updateProfileSchema.parse(data)

  // Then authenticate
  const session = await verifySession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  // Then authorize
  if (session.user.id !== validated.userId) {
    throw new Error('Can only update own profile')
  }

  // Finally perform the mutation
  await db.user.update({
    where: { id: validated.userId },
    data: {
      name: validated.name,
      email: validated.email
    }
  })

  return { success: true }
}
```

参考：[https://nextjs.org/docs/app/guides/authentication](https://nextjs.org/docs/app/guides/authentication)
