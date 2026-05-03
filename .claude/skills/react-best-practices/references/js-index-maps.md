---
title: 繰り返し検索のためにインデックスMapを構築する
impact: LOW-MEDIUM
impactDescription: 1M ops to 2K ops
tags: javascript, map, indexing, optimization, performance
---

## 繰り返し検索のためにインデックスMapを構築する

同じキーで複数回`.find()`を呼び出す場合は、Mapを使用してください。

**誤り（検索のたびにO(n)）：**

```typescript
function processOrders(orders: Order[], users: User[]) {
  return orders.map(order => ({
    ...order,
    user: users.find(u => u.id === order.userId)
  }))
}
```

**正しい（検索のたびにO(1)）：**

```typescript
function processOrders(orders: Order[], users: User[]) {
  const userById = new Map(users.map(u => [u.id, u]))

  return orders.map(order => ({
    ...order,
    user: userById.get(order.userId)
  }))
}
```

Mapを1回構築（O(n)）すれば、以降の検索はすべてO(1)になります。
注文1000件 × ユーザー1000件の場合：100万回の操作 → 2000回の操作。
