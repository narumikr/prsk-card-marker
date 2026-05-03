---
title: ソートの代わりにループでmin/maxを求める
impact: LOW
impactDescription: O(n) instead of O(n log n)
tags: javascript, arrays, performance, sorting, algorithms
---

## ソートの代わりにループでmin/maxを求める

最小値または最大値の要素を見つけるには、配列を1回通過するだけで十分です。ソートは無駄でより遅くなります。

**誤り（O(n log n) - 最新を見つけるためにソートする）：**

```typescript
interface Project {
  id: string
  name: string
  updatedAt: number
}

function getLatestProject(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt)
  return sorted[0]
}
```

最大値を見つけるためだけに配列全体をソートしています。

**誤り（O(n log n) - 最古と最新を求めるためにソートする）：**

```typescript
function getOldestAndNewest(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => a.updatedAt - b.updatedAt)
  return { oldest: sorted[0], newest: sorted[sorted.length - 1] }
}
```

min/maxのみ必要な場合も不必要にソートしています。

**正しい（O(n) - 単一ループ）：**

```typescript
function getLatestProject(projects: Project[]) {
  if (projects.length === 0) return null

  let latest = projects[0]

  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt > latest.updatedAt) {
      latest = projects[i]
    }
  }

  return latest
}

function getOldestAndNewest(projects: Project[]) {
  if (projects.length === 0) return { oldest: null, newest: null }

  let oldest = projects[0]
  let newest = projects[0]

  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt < oldest.updatedAt) oldest = projects[i]
    if (projects[i].updatedAt > newest.updatedAt) newest = projects[i]
  }

  return { oldest, newest }
}
```

配列を1回通過するだけで、コピーもソートも不要です。

**代替案（小さな配列ではMath.min/Math.max）：**

```typescript
const numbers = [5, 2, 8, 1, 9]
const min = Math.min(...numbers)
const max = Math.max(...numbers)
```

小さな配列では動作しますが、スプレッド演算子の制限により非常に大きな配列では遅くなるかエラーになる可能性があります。Chrome 143では約124000、Safari 18では約638000が最大配列長です（正確な数値は異なる場合があります - [fiddleを参照](https://jsfiddle.net/qw1jabsx/4/)）。信頼性のためにループアプローチを使用してください。
