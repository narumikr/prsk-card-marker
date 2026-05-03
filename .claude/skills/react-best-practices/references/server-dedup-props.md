---
title: RSCのpropsで重複シリアライズを避ける
impact: LOW
impactDescription: reduces network payload by avoiding duplicate serialization
tags: server, rsc, serialization, props, client-components
---

## RSCのpropsで重複シリアライズを避ける

**影響：LOW（重複シリアライズを避けてネットワークペイロードを削減）**

RSC→クライアントのシリアライズは値ではなくオブジェクト参照で重複排除します。同じ参照 = 1回だけシリアライズ；新しい参照 = 再度シリアライズ。`.toSorted()`、`.filter()`、`.map()`などの変換はサーバーではなくクライアントで行ってください。

**誤り（配列を重複させる）：**

```tsx
// RSC: sends 6 strings (2 arrays × 3 items)
<ClientList usernames={usernames} usernamesOrdered={usernames.toSorted()} />
```

**正しい（3つの文字列のみ送信）：**

```tsx
// RSC: send once
<ClientList usernames={usernames} />

// Client: transform there
'use client'
const sorted = useMemo(() => [...usernames].sort(), [usernames])
```

**ネストされた重複排除の動作：**

重複排除は再帰的に動作します。影響はデータ型によって異なります：

- `string[]`、`number[]`、`boolean[]`：**高影響** - 配列とすべてのプリミティブが完全に重複
- `object[]`：**低影響** - 配列は重複するが、ネストされたオブジェクトは参照で重複排除

```tsx
// string[] - duplicates everything
usernames={['a','b']} sorted={usernames.toSorted()} // sends 4 strings

// object[] - duplicates array structure only
users={[{id:1},{id:2}]} sorted={users.toSorted()} // sends 2 arrays + 2 unique objects (not 4)
```

**重複排除を壊す操作（新しい参照を作成する）：**

- 配列：`.toSorted()`、`.filter()`、`.map()`、`.slice()`、`[...arr]`
- オブジェクト：`{...obj}`、`Object.assign()`、`structuredClone()`、`JSON.parse(JSON.stringify())`

**その他の例：**

```tsx
// ❌ Bad
<C users={users} active={users.filter(u => u.active)} />
<C product={product} productName={product.name} />

// ✅ Good
<C users={users} />
<C product={product} />
// Do filtering/destructuring in client
```

**例外：** 変換が高コストな場合や、クライアントが元のデータを必要としない場合は、派生データを渡しても構いません。
