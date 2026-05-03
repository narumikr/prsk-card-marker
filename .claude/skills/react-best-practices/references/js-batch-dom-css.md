---
title: レイアウトスラッシングを避ける
impact: MEDIUM
impactDescription: prevents forced synchronous layouts and reduces performance bottlenecks
tags: javascript, dom, css, performance, reflow, layout-thrashing
---

## レイアウトスラッシングを避ける

スタイルの書き込みとレイアウトの読み取りを交互に行わないようにしてください。スタイル変更の間にレイアウトプロパティ（`offsetWidth`、`getBoundingClientRect()`、`getComputedStyle()`など）を読み取ると、ブラウザは強制的に同期リフローを行います。

**問題なし（ブラウザがスタイル変更をバッチ処理）：**
```typescript
function updateElementStyles(element: HTMLElement) {
  // Each line invalidates style, but browser batches the recalculation
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'
}
```

**誤り（読み書きの交互実行によりリフローが強制される）：**
```typescript
function layoutThrashing(element: HTMLElement) {
  element.style.width = '100px'
  const width = element.offsetWidth  // Forces reflow
  element.style.height = '200px'
  const height = element.offsetHeight  // Forces another reflow
}
```

**正しい（書き込みをバッチ処理してから1回だけ読み取る）：**
```typescript
function updateElementStyles(element: HTMLElement) {
  // Batch all writes together
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'

  // Read after all writes are done (single reflow)
  const { width, height } = element.getBoundingClientRect()
}
```

**正しい（読み取りをバッチ処理してから書き込む）：**
```typescript
function avoidThrashing(element: HTMLElement) {
  // Read phase - all layout queries first
  const rect1 = element.getBoundingClientRect()
  const offsetWidth = element.offsetWidth
  const offsetHeight = element.offsetHeight

  // Write phase - all style changes after
  element.style.width = '100px'
  element.style.height = '200px'
}
```

**より良い方法：CSSクラスを使用する**
```css
.highlighted-box {
  width: 100px;
  height: 200px;
  background-color: blue;
  border: 1px solid black;
}
```
```typescript
function updateElementStyles(element: HTMLElement) {
  element.classList.add('highlighted-box')

  const { width, height } = element.getBoundingClientRect()
}
```

**Reactの例：**
```tsx
// Incorrect: interleaving style changes with layout queries
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && isHighlighted) {
      ref.current.style.width = '100px'
      const width = ref.current.offsetWidth // Forces layout
      ref.current.style.height = '200px'
    }
  }, [isHighlighted])

  return <div ref={ref}>Content</div>
}

// Correct: toggle class
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  return (
    <div className={isHighlighted ? 'highlighted-box' : ''}>
      Content
    </div>
  )
}
```

可能な場合はインラインスタイルよりCSSクラスを優先してください。CSSファイルはブラウザにキャッシュされ、クラスは関心の分離を促進し、保守しやすくなります。

レイアウトを強制する処理の詳細は[このgist](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)と[CSS Triggers](https://csstriggers.com/)を参照してください。
