---
title: RSCバウンダリーでのシリアライズを最小化する
impact: HIGH
impactDescription: reduces data transfer size
tags: server, rsc, serialization, props
---

## RSCバウンダリーでのシリアライズを最小化する

ReactのServer/Clientバウンダリーは、すべてのオブジェクトプロパティを文字列にシリアライズしてHTMLレスポンスと後続のRSCリクエストに埋め込みます。このシリアライズされたデータはページの重さとロード時間に直接影響するため、**サイズは非常に重要です**。クライアントが実際に使用するフィールドのみを渡してください。

**誤り（50フィールドすべてをシリアライズ）：**

```tsx
async function Page() {
  const user = await fetchUser()  // 50 fields
  return <Profile user={user} />
}

'use client'
function Profile({ user }: { user: User }) {
  return <div>{user.name}</div>  // uses 1 field
}
```

**正しい（1フィールドのみシリアライズ）：**

```tsx
async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />
}

'use client'
function Profile({ name }: { name: string }) {
  return <div>{name}</div>
}
```
