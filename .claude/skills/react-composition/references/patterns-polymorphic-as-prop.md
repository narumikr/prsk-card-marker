---
title: asPropを使ったポリモーフィックコンポーネント
impact: MEDIUM
impactDescription: 単一コンポーネントを異なるHTML要素や他のコンポーネントとしてレンダリングできるようにする
tags: composition, polymorphic, as-prop, design-system, reusability
---

## `as`プロップを使ったポリモーフィックコンポーネント

`as`プロップでレンダリングする要素を変更できるコンポーネントを作る。これにより`ButtonLink`、`ButtonDiv`などでスタイリングと振る舞いのロジックを重複させることを避ける。Chakra UI、styled-components、その他のデザインシステムで広く使われている。

**誤り（異なる要素に対してコンポーネントを重複させる）：**

```tsx
function Button({ children, ...props }: ButtonProps) {
  return <button className="btn" {...props}>{children}</button>
}

function ButtonLink({ children, href, ...props }: ButtonLinkProps) {
  return <a className="btn" href={href} {...props}>{children}</a>
}

function ButtonDiv({ children, ...props }: ButtonDivProps) {
  return <div className="btn" role="button" tabIndex={0} {...props}>{children}</div>
}
```

スタイリングが同一の3つのコンポーネント。スタイルを変更するたびに3箇所に適用しなければならない。

**正しい（`as`プロップを持つポリモーフィックコンポーネント）：**

```tsx
type PolymorphicProps<E extends React.ElementType> = {
  as?: E
  children: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<E>, 'as' | 'children'>

function Button<E extends React.ElementType = 'button'>({
  as,
  children,
  ...props
}: PolymorphicProps<E>) {
  const Component = as || 'button'
  return (
    <Component className="btn" {...props}>
      {children}
    </Component>
  )
}
```

**使用例：**

```tsx
// Renders <button>
<Button onClick={handleClick}>Click me</Button>

// Renders <a> with href type-checked
<Button as="a" href="/about">About</Button>

// Renders a Next.js Link
<Button as={Link} href="/dashboard">Dashboard</Button>
```

TypeScriptは選択した要素に対して正しいpropsを推論する。`as="a"`の場合は`href`が使用可能だが、`as="button"`の場合は使用できない。

**使うべき場合：**

- デザインシステムのプリミティブ（Box、Text、Heading、Button）
- 異なるセマンティック要素としてレンダリングされる可能性のあるコンポーネント
- サードパーティのリンクコンポーネントのラップ（Next.js Link、React Router Link）

**使うべきでない場合：**

- バリアントの振る舞いが大幅に異なる場合（代わりに明示的なバリアントを使う -- `patterns-explicit-variants.md`を参照）
- コンポーネントが常に1種類の要素としてのみレンダリングされる場合
