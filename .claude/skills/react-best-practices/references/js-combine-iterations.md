---
title: 複数の配列イテレーションをまとめる
impact: LOW-MEDIUM
impactDescription: reduces iterations
tags: javascript, arrays, loops, performance
---

## 複数の配列イテレーションをまとめる

複数の`.filter()`や`.map()`呼び出しは配列を複数回繰り返します。1つのループにまとめましょう。

**誤り（3回の繰り返し）：**

```typescript
const admins = users.filter(u => u.isAdmin)
const testers = users.filter(u => u.isTester)
const inactive = users.filter(u => !u.isActive)
```

**正しい（1回の繰り返し）：**

```typescript
const admins: User[] = []
const testers: User[] = []
const inactive: User[] = []

for (const user of users) {
  if (user.isAdmin) admins.push(user)
  if (user.isTester) testers.push(user)
  if (!user.isActive) inactive.push(user)
}
```
