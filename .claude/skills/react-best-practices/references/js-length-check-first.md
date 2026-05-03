---
title: 配列比較の前に長さを先に確認する
impact: MEDIUM-HIGH
impactDescription: avoids expensive operations when lengths differ
tags: javascript, arrays, performance, optimization, comparison
---

## 配列比較の前に長さを先に確認する

高コストな操作（ソート、深い等価比較、シリアライズ）で配列を比較する場合は、まず長さを確認してください。長さが異なる場合、配列は等しくなりません。

実際のアプリケーションでは、この最適化はホットパス（イベントハンドラ、レンダリングループ）で比較が実行される場合に特に効果的です。

**誤り（常に高コストな比較を実行する）：**

```typescript
function hasChanges(current: string[], original: string[]) {
  // Always sorts and joins, even when lengths differ
  return current.sort().join() !== original.sort().join()
}
```

`current.length`が5で`original.length`が100の場合でも、O(n log n)のソートが2回実行されます。配列の結合と文字列比較のオーバーヘッドもあります。

**正しい（O(1)の長さチェックを先に行う）：**

```typescript
function hasChanges(current: string[], original: string[]) {
  // Early return if lengths differ
  if (current.length !== original.length) {
    return true
  }
  // Only sort when lengths match
  const currentSorted = current.toSorted()
  const originalSorted = original.toSorted()
  for (let i = 0; i < currentSorted.length; i++) {
    if (currentSorted[i] !== originalSorted[i]) {
      return true
    }
  }
  return false
}
```

この新しいアプローチが効率的な理由：
- 長さが異なる場合に配列のソートと結合のオーバーヘッドを回避
- 結合後の文字列のメモリ消費を回避（特に大きな配列で重要）
- 元の配列のミューテーションを回避
- 差異が見つかった時点で早期リターン
