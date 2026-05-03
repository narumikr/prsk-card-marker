---
title: O(1)検索にはSet/Mapを使用する
impact: LOW-MEDIUM
impactDescription: O(n) to O(1)
tags: javascript, set, map, data-structures, performance
---

## O(1)検索にはSet/Mapを使用する

繰り返しのメンバーシップチェックのために配列をSet/Mapに変換します。

**誤り（チェックのたびにO(n)）：**

```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

**正しい（チェックのたびにO(1)）：**

```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```
