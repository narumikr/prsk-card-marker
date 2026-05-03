---
title: ControlledとUncontrolledコンポーネントパターン
impact: MEDIUM
impactDescription: 最大の再利用性のためにcontrolledとuncontrolledの両方で動作するコンポーネントを実現する
tags: composition, controlled, uncontrolled, state, reusability
---

## ControlledとUncontrolledコンポーネントパターン

controlledモード（親がstateを所有）とuncontrolledモード（コンポーネントがstateを所有）の両方で動作するコンポーネントを構築する。これで再利用性が最大化される -- シンプルなユースケースはそのまま動作し、複雑なユースケースは完全な制御が可能。

Radix UI、Headless UI、React Ariaで広く使われている。

**誤り（controlledのみ -- すべてのコンシューマーにstate管理を強制）：**

```tsx
function Accordion({
  openItems,
  onOpenItemsChange,
  children,
}: {
  openItems: string[]
  onOpenItemsChange: (items: string[]) => void
  children: React.ReactNode
}) {
  // Every consumer MUST provide state, even for simple use-cases
  return (...)
}

// Simple use-case still requires full state management
function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([])
  return (
    <Accordion openItems={openItems} onOpenItemsChange={setOpenItems}>
      <Accordion.Item id="q1">...</Accordion.Item>
    </Accordion>
  )
}
```

**正しい（controlledとuncontrolledの両方をサポート）：**

```tsx
function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const nextValue = typeof next === 'function'
        ? (next as (prev: T) => T)(currentValue)
        : next

      if (!isControlled) {
        setInternalValue(nextValue)
      }
      onChange?.(nextValue)
    },
    [isControlled, currentValue, onChange],
  )

  return [currentValue, setValue] as const
}
```

**コンポーネントでの使用例：**

```tsx
interface AccordionProps {
  // Controlled mode
  value?: string[]
  onValueChange?: (value: string[]) => void
  // Uncontrolled mode
  defaultValue?: string[]
  children: React.ReactNode
}

function Accordion({
  value,
  onValueChange,
  defaultValue = [],
  children,
}: AccordionProps) {
  const [openItems, setOpenItems] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })

  return (
    <AccordionContext value={{ openItems, setOpenItems }}>
      {children}
    </AccordionContext>
  )
}
```

**コンシューマーの使用例：**

```tsx
// Uncontrolled — works out of the box, no state management needed
<Accordion defaultValue={['q1']}>
  <Accordion.Item id="q1">...</Accordion.Item>
  <Accordion.Item id="q2">...</Accordion.Item>
</Accordion>

// Controlled — parent owns state for complex use-cases
function FilterableAccordion() {
  const [openItems, setOpenItems] = useState<string[]>([])

  return (
    <>
      <button onClick={() => setOpenItems([])}>Collapse All</button>
      <Accordion value={openItems} onValueChange={setOpenItems}>
        <Accordion.Item id="q1">...</Accordion.Item>
        <Accordion.Item id="q2">...</Accordion.Item>
      </Accordion>
    </>
  )
}
```

**API規約：**

| モード       | Props                          |
| ------------ | ------------------------------ |
| Uncontrolled | `defaultValue`、コールバック   |
| Controlled   | `value` + `onValueChange`      |

`value`が提供された場合、コンポーネントはcontrolledになる。`defaultValue`のみが提供された場合（またはどちらも提供されない場合）、コンポーネントは自分でstateを管理する。

**使うべき場合：**

- シンプルなコンテキストと複雑なコンテキストの両方で使われる可能性のある再利用可能なUIコンポーネント
- デザインシステムコンポーネント（Accordion、Tabs、Select、Dialogの開閉状態）
- 一部のコンシューマーはstate制御が必要で他は不要なコンポーネント

**使うべきでない場合：**

- stateの所有権が常に明確なアプリケーション固有のコンポーネント
- 常に外部stateを必要とするコンポーネント（フォームライブラリにバインドされたフォーム入力など）
