---
title: 静的なJSX要素をホイストする
impact: LOW
impactDescription: avoids re-creation
tags: rendering, jsx, static, optimization
---

## 静的なJSX要素をホイストする

再生成を避けるために、静的なJSXをコンポーネント外に抽出します。

**誤り（レンダリングのたびに要素を再生成する）：**

```tsx
function LoadingSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200" />
}

function Container() {
  return (
    <div>
      {loading && <LoadingSkeleton />}
    </div>
  )
}
```

**正しい（同じ要素を再利用する）：**

```tsx
const loadingSkeleton = (
  <div className="animate-pulse h-20 bg-gray-200" />
)

function Container() {
  return (
    <div>
      {loading && loadingSkeleton}
    </div>
  )
}
```

これは特に大きな静的SVGノードに効果的です。レンダリングのたびに再生成するコストが高い場合に役立ちます。

**注意：** プロジェクトで[React Compiler](https://react.dev/learn/react-compiler)が有効になっている場合、コンパイラが自動的に静的JSX要素をホイストしてコンポーネントの再レンダリングを最適化するため、手動でのホイストは不要です。
