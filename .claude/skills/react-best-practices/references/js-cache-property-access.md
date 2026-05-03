---
title: ループ内でプロパティアクセスをキャッシュする
impact: LOW-MEDIUM
impactDescription: reduces lookups
tags: javascript, loops, optimization, caching
---

## ループ内でプロパティアクセスをキャッシュする

ホットパスにおけるオブジェクトのプロパティ参照をキャッシュします。

**誤り（3回の参照 × N回の繰り返し）：**

```typescript
for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value)
}
```

**正しい（合計1回の参照）：**

```typescript
const value = obj.config.settings.value
const len = arr.length
for (let i = 0; i < len; i++) {
  process(value)
}
```
