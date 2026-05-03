---
title: イミュータビリティのためにsort()の代わりにtoSorted()を使用する
impact: MEDIUM-HIGH
impactDescription: prevents mutation bugs in React state
tags: javascript, arrays, immutability, react, state, mutation
---

## イミュータビリティのためにsort()の代わりにtoSorted()を使用する

`.sort()`は配列をその場でミューテーションするため、Reactのstateとpropsでバグを引き起こす可能性があります。`.toSorted()`を使用して、ミューテーションなしに新しいソート済み配列を作成します。

**誤り（元の配列をミューテーションしてしまう）：**

```typescript
function UserList({ users }: { users: User[] }) {
  // Mutates the users prop array!
  const sorted = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**正しい（新しい配列を作成する）：**

```typescript
function UserList({ users }: { users: User[] }) {
  // Creates new sorted array, original unchanged
  const sorted = useMemo(
    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**Reactでこれが重要な理由：**

1. propsやstateのミューテーションはReactのイミュータビリティモデルを壊します - Reactはpropsとstateを読み取り専用として扱うことを期待します
2. 古いクロージャのバグを引き起こします - クロージャ（コールバック、エフェクト）内で配列をミューテーションすると予期しない動作につながります

**ブラウザサポート（古いブラウザのフォールバック）：**

`.toSorted()`はすべての最新ブラウザで利用可能です（Chrome 110+、Safari 16+、Firefox 115+、Node.js 20+）。古い環境ではスプレッド演算子を使用してください：

```typescript
// Fallback for older browsers
const sorted = [...items].sort((a, b) => a.value - b.value)
```

**その他のイミュータブルな配列メソッド：**

- `.toSorted()` - イミュータブルなソート
- `.toReversed()` - イミュータブルな反転
- `.toSpliced()` - イミュータブルなスプライス
- `.with()` - イミュータブルな要素置換
