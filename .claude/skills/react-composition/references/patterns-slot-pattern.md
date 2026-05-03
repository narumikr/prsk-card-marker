---
title: 柔軟なコンテンツインジェクションのためのSlotパターン
impact: MEDIUM
impactDescription: Render propsやブールフラグなしにタイプセーフなコンテンツインジェクションを実現する
tags: composition, slot, design-system, reusability, radix
---

## 柔軟なコンテンツインジェクションのためのSlotパターン

Slotパターンを使うと、コンポーネントが固定のラッパー要素をレンダリングする代わりに、渡された子要素にpropsをマージできる。コンシューマーがレンダリングする要素を制御し、コンポーネントは振る舞いとスタイリングを提供する。Radix UIの`Slot` / `asChild`パターンで広まった。

**誤り（ラッパーdivが余分なDOMネストを強制する）：**

```tsx
function Tooltip({ children, content }: TooltipProps) {
  return (
    <div className="tooltip-trigger" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {isOpen && <div className="tooltip">{content}</div>}
    </div>
  )
}

// Consumer — unwanted wrapper div in the DOM
<Tooltip content="Settings">
  <button>⚙️</button>
</Tooltip>
// Renders: <div class="tooltip-trigger"><button>⚙️</button></div>
```

**正しい（Slotが子要素にpropsをマージする）：**

```tsx
import { Slot } from '@radix-ui/react-slot'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

function Button({ asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : 'button'
  return <Component className="btn" {...props} />
}
```

**使用例：**

```tsx
// Renders a <button>
<Button onClick={handleClick}>Save</Button>

// Renders a <a> — Slot merges Button's props onto the anchor
<Button asChild>
  <a href="/home">Home</a>
</Button>
// Renders: <a class="btn" href="/home">Home</a>

// Renders a Next.js Link with Button styling
<Button asChild>
  <Link href="/dashboard">Dashboard</Link>
</Button>
```

余分なラッパー要素なし。子要素はマージによってコンポーネントのclassName、イベントハンドラー、その他のpropsを受け取る。

**Radixを使わないミニマルなSlotの実装：**

```tsx
import { cloneElement, isValidElement, Children } from 'react'

function Slot({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) {
  if (isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      ...children.props,
      className: cn(props.className, children.props.className),
    })
  }
  return null
}
```

**使うべき場合：**

- DOM要素を強制すべきでないデザインシステムコンポーネント
- トリガーコンポーネント（ツールチップトリガー、ポップオーバートリガー、ダイアログトリガー）
- スタイリングやアクセシビリティにおいて余分なラッパー要素を避けることが重要な場合

**使うべきでない場合：**

- アクセシビリティのために要素を制御する必要があるコンポーネント（特定のARIAロールが必要なダイアログパネルなど）
- 複数の子要素をラップする必要がある場合 -- Slotは単一の子要素で動作する
