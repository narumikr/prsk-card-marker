---
title: Render PropsよりChildrenのコンポジションを優先する
impact: MEDIUM
impactDescription: よりクリーンなコンポジション、優れた可読性
tags: composition, children, render-props
---

## Render PropsよりChildrenを優先する

`renderX`プロップの代わりにコンポジションに`children`を使う。Childrenはより読みやすく、自然にコンポーズでき、コールバックのシグネチャを理解する必要がない。

**誤り（Render props）：**

```tsx
function Composer({
  renderHeader,
  renderFooter,
  renderActions,
}: {
  renderHeader?: () => React.ReactNode
  renderFooter?: () => React.ReactNode
  renderActions?: () => React.ReactNode
}) {
  return (
    <form>
      {renderHeader?.()}
      <Input />
      {renderFooter ? renderFooter() : <DefaultFooter />}
      {renderActions?.()}
    </form>
  )
}

// Usage is awkward and inflexible
return (
  <Composer
    renderHeader={() => <CustomHeader />}
    renderFooter={() => (
      <>
        <Formatting />
        <Emojis />
      </>
    )}
    renderActions={() => <SubmitButton />}
  />
)
```

**正しい（childrenを使ったCompound components）：**

```tsx
function ComposerFrame({ children }: { children: React.ReactNode }) {
  return <form>{children}</form>
}

function ComposerFooter({ children }: { children: React.ReactNode }) {
  return <footer className='flex'>{children}</footer>
}

// Usage is flexible
return (
  <Composer.Frame>
    <CustomHeader />
    <Composer.Input />
    <Composer.Footer>
      <Composer.Formatting />
      <Composer.Emojis />
      <SubmitButton />
    </Composer.Footer>
  </Composer.Frame>
)
```

**Render propsが適切な場合：**

```tsx
// Render props work well when you need to pass data back
<List
  data={items}
  renderItem={({ item, index }) => <Item item={item} index={index} />}
/>
```

親が子にデータやstateを渡す必要がある場合はRender propsを使う。静的な構造をコンポーズする場合はchildrenを使う。
