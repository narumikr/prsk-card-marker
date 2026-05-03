---
title: デザインシステムのコンポジション例
tags: examples, design-system, polymorphic, slot, controlled-uncontrolled
---

## デザインシステムのコンポジション例

デザインシステムコンポーネントに適用したコンポジションパターンの実践的な例。

---

### 例1：ポリモーフィックTextコンポーネント

任意の見出しや段落要素としてレンダリングできる単一のTextコンポーネント。

```tsx
type TextProps<E extends React.ElementType = 'p'> = {
  as?: E
  size?: 'sm' | 'md' | 'lg' | 'xl'
  weight?: 'normal' | 'medium' | 'bold'
  children: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<E>, 'as' | 'size' | 'children'>

function Text<E extends React.ElementType = 'p'>({
  as,
  size = 'md',
  weight = 'normal',
  children,
  className,
  ...props
}: TextProps<E>) {
  const Component = as || 'p'
  return (
    <Component
      className={cn(
        styles.text,
        styles[`size-${size}`],
        styles[`weight-${weight}`],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
```

**使用例：**

```tsx
<Text>Default paragraph</Text>
<Text as="h1" size="xl" weight="bold">Page Title</Text>
<Text as="span" size="sm">Inline text</Text>
<Text as="label" htmlFor="email" size="sm" weight="medium">Email</Text>
```

TypeScriptは`as="label"`の場合に`htmlFor`が使用可能で、`as="h1"`の場合には使用できないことを正しく推論する。

---

### 例2：Slotトリガーを持つDialog

トリガーが任意の要素になれるDialogコンポーネント。

```tsx
import { Slot } from '@radix-ui/react-slot'

interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

function DialogTrigger({ asChild, ...props }: DialogTriggerProps) {
  const { open } = use(DialogContext)
  const Component = asChild ? Slot : 'button'
  return <Component onClick={open} {...props} />
}
```

**使用例：**

```tsx
// Default — renders a <button>
<Dialog>
  <Dialog.Trigger>Open Settings</Dialog.Trigger>
  <Dialog.Content>...</Dialog.Content>
</Dialog>

// asChild — renders the child element directly with Dialog behavior
<Dialog>
  <Dialog.Trigger asChild>
    <a href="#settings">Open Settings</a>
  </Dialog.Trigger>
  <Dialog.Content>...</Dialog.Content>
</Dialog>

// asChild with a custom component
<Dialog>
  <Dialog.Trigger asChild>
    <IconButton icon={<SettingsIcon />} label="Settings" />
  </Dialog.Trigger>
  <Dialog.Content>...</Dialog.Content>
</Dialog>
```

ラッパー要素なし。トリガーの振る舞いは渡された子要素にマージされる。

---

### 例3：Controlled/Uncontrolled Tabs

そのまま動作するが、外部からも制御できるTabs。

```tsx
interface TabsProps {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  children: React.ReactNode
}

function Tabs({ value, onValueChange, defaultValue, children }: TabsProps) {
  const [activeTab, setActiveTab] = useControllableState({
    value,
    defaultValue: defaultValue ?? '',
    onChange: onValueChange,
  })

  return (
    <TabsContext value={{ activeTab, setActiveTab }}>
      <div role="tablist">{children}</div>
    </TabsContext>
  )
}

function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const { activeTab, setActiveTab } = use(TabsContext)
  return (
    <button
      role="tab"
      aria-selected={activeTab === value}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  )
}

function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  const { activeTab } = use(TabsContext)
  if (activeTab !== value) return null
  return <div role="tabpanel">{children}</div>
}

const TabsCompound = {
  Root: Tabs,
  Trigger: TabsTrigger,
  Content: TabsContent,
}
```

**Uncontrolled -- シンプルなユースケース：**

```tsx
<TabsCompound.Root defaultValue="tab1">
  <TabsCompound.Trigger value="tab1">General</TabsCompound.Trigger>
  <TabsCompound.Trigger value="tab2">Security</TabsCompound.Trigger>

  <TabsCompound.Content value="tab1">
    <GeneralSettings />
  </TabsCompound.Content>
  <TabsCompound.Content value="tab2">
    <SecuritySettings />
  </TabsCompound.Content>
</TabsCompound.Root>
```

**Controlled -- URLと同期するTabs：**

```tsx
function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') ?? 'general'

  return (
    <TabsCompound.Root
      value={activeTab}
      onValueChange={(tab) => setSearchParams({ tab })}
    >
      <TabsCompound.Trigger value="general">General</TabsCompound.Trigger>
      <TabsCompound.Trigger value="security">Security</TabsCompound.Trigger>

      <TabsCompound.Content value="general">
        <GeneralSettings />
      </TabsCompound.Content>
      <TabsCompound.Content value="security">
        <SecuritySettings />
      </TabsCompound.Content>
    </TabsCompound.Root>
  )
}
```

同じコンポーネントだが、アクティブなタブがURLと同期する。Tabsの実装変更は不要。

---

### 例4：全パターンの組み合わせ -- Compound + Slot + Controlled

Compound components、Slotパターン、Controlled/Uncontrolled stateを組み合わせた完全なSelectコンポーネント。

```tsx
interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  children: React.ReactNode
}

function Select({ value, onValueChange, defaultValue, children }: SelectProps) {
  const [selected, setSelected] = useControllableState({
    value,
    defaultValue: defaultValue ?? '',
    onChange: onValueChange,
  })
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SelectContext value={{ selected, setSelected, isOpen, setIsOpen }}>
      {children}
    </SelectContext>
  )
}

function SelectTrigger({ asChild, children, ...props }: TriggerProps) {
  const { isOpen, setIsOpen, selected } = use(SelectContext)
  const Component = asChild ? Slot : 'button'

  return (
    <Component
      aria-expanded={isOpen}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children ?? selected}
    </Component>
  )
}

function SelectOption({ value, children }: OptionProps) {
  const { selected, setSelected, setIsOpen } = use(SelectContext)

  return (
    <div
      role="option"
      aria-selected={selected === value}
      onClick={() => {
        setSelected(value)
        setIsOpen(false)
      }}
    >
      {children}
    </div>
  )
}

const SelectCompound = {
  Root: Select,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Option: SelectOption,
}
```

**使用例：**

```tsx
// Uncontrolled with default trigger
<SelectCompound.Root defaultValue="apple">
  <SelectCompound.Trigger />
  <SelectCompound.Content>
    <SelectCompound.Option value="apple">Apple</SelectCompound.Option>
    <SelectCompound.Option value="banana">Banana</SelectCompound.Option>
  </SelectCompound.Content>
</SelectCompound.Root>

// Controlled with custom trigger element
<SelectCompound.Root value={fruit} onValueChange={setFruit}>
  <SelectCompound.Trigger asChild>
    <Chip>{fruit}</Chip>
  </SelectCompound.Trigger>
  <SelectCompound.Content>
    <SelectCompound.Option value="apple">Apple</SelectCompound.Option>
    <SelectCompound.Option value="banana">Banana</SelectCompound.Option>
  </SelectCompound.Content>
</SelectCompound.Root>
```
