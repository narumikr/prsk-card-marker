---
title: コンポジションのアンチパターン
impact: HIGH
impactDescription: コンポーネントの拡張性と再利用性を損なう一般的な間違い
tags: anti-patterns, composition, architecture
---

## コンポジションのアンチパターン

便利に見えるが、拡張性と再利用性を損なう一般的なパターン。

### 1. ブールpropの蓄積

**問題**：新しい機能やバリアントのたびにブールpropを追加する。

```tsx
// Each new feature adds another boolean
<Modal
  isFullScreen
  isClosable
  isDraggable
  hasOverlay
  isAnimated
  isNested
/>
```

**解決策**：Compound componentsまたは明示的なバリアントを使う。

```tsx
<FullScreenModal>
  <Modal.Overlay />
  <Modal.Content draggable>
    <Modal.CloseButton />
    {children}
  </Modal.Content>
</FullScreenModal>
```

### 2. 複数レイヤーを経由したプロップドリリング

**問題**：使用しないコンポーネントを通してpropsを渡す。

```tsx
function App() {
  return <Layout user={user} theme={theme} locale={locale}>
    <Sidebar user={user} theme={theme}>
      <Navigation user={user} theme={theme} locale={locale}>
        <NavItem user={user} />
      </Navigation>
    </Sidebar>
  </Layout>
}
```

**解決策**：適切なレベルでコンテキストプロバイダーを使う。

```tsx
function App() {
  return (
    <UserProvider user={user}>
      <ThemeProvider theme={theme}>
        <Layout>
          <Sidebar>
            <Navigation>
              <NavItem />
            </Navigation>
          </Sidebar>
        </Layout>
      </ThemeProvider>
    </UserProvider>
  )
}
```

### 3. stateの同期にuseEffectを使う

**問題**：子のstateを親に同期するためにuseEffectを使う。

```tsx
function Parent() {
  const [childValue, setChildValue] = useState('')
  return (
    <>
      <ChildInput onValueChange={setChildValue} />
      <Preview value={childValue} />
    </>
  )
}

function ChildInput({ onValueChange }) {
  const [value, setValue] = useState('')
  useEffect(() => {
    onValueChange(value) // Double render, potential infinite loops
  }, [value])
  return <input value={value} onChange={(e) => setValue(e.target.value)} />
}
```

**解決策**：両方のコンポーネントが同じソースから読み取れるよう、stateをプロバイダーにリフトアップする。

```tsx
function InputProvider({ children }) {
  const [value, setValue] = useState('')
  return (
    <InputContext value={{ value, setValue }}>
      {children}
    </InputContext>
  )
}

function Parent() {
  return (
    <InputProvider>
      <ChildInput />
      <Preview />
    </InputProvider>
  )
}
```

### 4. ゴッドコンポーネント

**問題**：何でもこなす1つのコンポーネント。数百行と数十の条件分岐。

```tsx
function Dashboard({ user, settings, data, filters, ... }) {
  // 500+ lines of hooks, state, effects, and conditional rendering
}
```

**解決策**：各コンポーネントが明確な責務を持つCompound componentsに分割する。

### 5. stateライブラリへの密結合

**問題**：UIコンポーネントが特定のstate管理フック（Zustand、Reduxなど）を直接インポートして依存する。

```tsx
function TodoList() {
  const todos = useTodoStore((state) => state.todos)  // Coupled to Zustand
  const addTodo = useTodoStore((state) => state.addTodo)
  // ...
}
```

**解決策**：コンテキストインターフェースを定義し、プロバイダーを通してstateをインジェクトする。UIは`{ state, actions, meta }`だけを知っている。

### 6. Render Propsの過度なネスト

**問題**：複数のRender propsがJSXで「コールバック地獄」を生み出す。

```tsx
<DataProvider render={(data) => (
  <ThemeConsumer render={(theme) => (
    <LocaleConsumer render={(locale) => (
      <Component data={data} theme={theme} locale={locale} />
    )} />
  )} />
)} />
```

**解決策**：コンテキストを使ったCompound components、またはchildrenでコンポーズする。

```tsx
<DataProvider>
  <ThemeProvider>
    <LocaleProvider>
      <Component />
    </LocaleProvider>
  </ThemeProvider>
</DataProvider>
```
