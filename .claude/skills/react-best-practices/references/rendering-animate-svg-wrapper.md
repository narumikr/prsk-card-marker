---
title: SVG要素ではなくSVGのラッパーをアニメーション化する
impact: LOW
impactDescription: enables hardware acceleration
tags: rendering, svg, css, animation, performance
---

## SVG要素ではなくSVGのラッパーをアニメーション化する

多くのブラウザはSVG要素に対するCSSアニメーションのハードウェアアクセラレーションをサポートしていません。SVGを`<div>`でラップして、ラッパーをアニメーション化します。

**誤り（SVGを直接アニメーション化する - ハードウェアアクセラレーションなし）：**

```tsx
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
    </svg>
  )
}
```

**正しい（ラッパーdivをアニメーション化する - ハードウェアアクセラレーション）：**

```tsx
function LoadingSpinner() {
  return (
    <div className="animate-spin">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    </div>
  )
}
```

これはすべてのCSSトランスフォームとトランジション（`transform`、`opacity`、`translate`、`scale`、`rotate`）に適用されます。ラッパーdivにより、ブラウザがGPUアクセラレーションを使用して滑らかなアニメーションを実現できます。
