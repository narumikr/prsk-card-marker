---
title: 依存性注入のためのジェネリックコンテキストインターフェースを定義する
impact: HIGH
impactDescription: ユースケースをまたいで依存性注入可能なstateを実現する
tags: composition, context, state, typescript, dependency-injection
---

## 依存性注入のためのジェネリックコンテキストインターフェースを定義する

コンポーネントのコンテキストに対して`state`、`actions`、`meta`の3つの部分を持つ**ジェネリックインターフェース**を定義する。このインターフェースは任意のプロバイダーが実装できる契約であり、同じUIコンポーネントがまったく異なるstate実装で動作できるようになる。

**核心原則：** stateをリフトアップし、内部をコンポーズし、stateを依存性注入可能にする。

**誤り（UIが特定のstate実装に密結合）：**

```tsx
function ComposerInput() {
  // Tightly coupled to a specific hook
  const { input, setInput } = useChannelComposerState()
  return <TextInput value={input} onChangeText={setInput} />
}
```

**正しい（ジェネリックインターフェースで依存性注入を実現）：**

```tsx
// Define a GENERIC interface that any provider can implement
interface ComposerState {
  input: string
  attachments: Attachment[]
  isSubmitting: boolean
}

interface ComposerActions {
  update: (updater: (state: ComposerState) => ComposerState) => void
  submit: () => void
}

interface ComposerMeta {
  inputRef: React.RefObject<TextInput>
}

interface ComposerContextValue {
  state: ComposerState
  actions: ComposerActions
  meta: ComposerMeta
}

const ComposerContext = createContext<ComposerContextValue | null>(null)
```

**UIコンポーネントは実装ではなくインターフェースを利用する：**

```tsx
function ComposerInput() {
  const {
    state,
    actions: { update },
    meta,
  } = use(ComposerContext)

  // This component works with ANY provider that implements the interface
  return (
    <TextInput
      ref={meta.inputRef}
      value={state.input}
      onChangeText={(text) => update((s) => ({ ...s, input: text }))}
    />
  )
}
```

**異なるプロバイダーが同じインターフェースを実装する：**

```tsx
// Provider A: Local state for ephemeral forms
function ForwardMessageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState)
  const inputRef = useRef(null)
  const submit = useForwardMessage()

  return (
    <ComposerContext
      value={{
        state,
        actions: { update: setState, submit },
        meta: { inputRef },
      }}
    >
      {children}
    </ComposerContext>
  )
}

// Provider B: Global synced state for channels
function ChannelProvider({ channelId, children }: Props) {
  const { state, update, submit } = useGlobalChannel(channelId)
  const inputRef = useRef(null)

  return (
    <ComposerContext
      value={{
        state,
        actions: { update, submit },
        meta: { inputRef },
      }}
    >
      {children}
    </ComposerContext>
  )
}
```

**同じコンポーズされたUIが両方で動作する：**

```tsx
// Works with ForwardMessageProvider (local state)
<ForwardMessageProvider>
  <Composer.Frame>
    <Composer.Input />
    <Composer.Submit />
  </Composer.Frame>
</ForwardMessageProvider>

// Works with ChannelProvider (global synced state)
<ChannelProvider channelId="abc">
  <Composer.Frame>
    <Composer.Input />
    <Composer.Submit />
  </Composer.Frame>
</ChannelProvider>
```

**コンポーネント外部のカスタムUIもstateとactionsにアクセスできる：**

プロバイダーのバウンダリーが重要であり、視覚的なネストは関係ない。共有stateを必要とするコンポーネントは`Composer.Frame`の内部にある必要はなく、プロバイダーの内部にさえあればよい。

```tsx
function ForwardMessageDialog() {
  return (
    <ForwardMessageProvider>
      <Dialog>
        {/* The composer UI */}
        <Composer.Frame>
          <Composer.Input placeholder="Add a message, if you'd like." />
          <Composer.Footer>
            <Composer.Formatting />
            <Composer.Emojis />
          </Composer.Footer>
        </Composer.Frame>

        {/* Custom UI OUTSIDE the composer, but INSIDE the provider */}
        <MessagePreview />

        {/* Actions at the bottom of the dialog */}
        <DialogActions>
          <CancelButton />
          <ForwardButton />
        </DialogActions>
      </Dialog>
    </ForwardMessageProvider>
  )
}

// This button lives OUTSIDE Composer.Frame but can still submit based on its context!
function ForwardButton() {
  const {
    actions: { submit },
  } = use(ComposerContext)
  return <Button onPress={submit}>Forward</Button>
}

// This preview lives OUTSIDE Composer.Frame but can read composer's state!
function MessagePreview() {
  const { state } = use(ComposerContext)
  return <Preview message={state.input} attachments={state.attachments} />
}
```

`ForwardButton`と`MessagePreview`は視覚的にComposerボックスの内側にないが、それでもstateとactionsにアクセスできる。これがstateをプロバイダーにリフトアップする力だ。

UIは組み合わせる再利用可能なパーツ。stateはプロバイダーによって依存性注入される。プロバイダーを交換してもUIはそのまま使える。
