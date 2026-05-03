---
title: stateをプロバイダーコンポーネントにリフトアップする
impact: HIGH
impactDescription: コンポーネントのバウンダリーを超えたstateの共有を実現する
tags: composition, state, context, providers
---

## stateをプロバイダーコンポーネントにリフトアップする

state管理を専用のプロバイダーコンポーネントに移動する。これにより、メインUIの外側にある兄弟コンポーネントもプロップドリリングや扱いにくいrefsなしにstateにアクセスして変更できるようになる。

**誤り（コンポーネント内にトラップされたstate）：**

```tsx
function ForwardMessageComposer() {
  const [state, setState] = useState(initialState)
  const forwardMessage = useForwardMessage()

  return (
    <Composer.Frame>
      <Composer.Input />
      <Composer.Footer />
    </Composer.Frame>
  )
}

// Problem: How does this button access composer state?
function ForwardMessageDialog() {
  return (
    <Dialog>
      <ForwardMessageComposer />
      <MessagePreview /> {/* Needs composer state */}
      <DialogActions>
        <CancelButton />
        <ForwardButton /> {/* Needs to call submit */}
      </DialogActions>
    </Dialog>
  )
}
```

**誤り（stateを上に同期するためのuseEffect）：**

```tsx
function ForwardMessageDialog() {
  const [input, setInput] = useState('')
  return (
    <Dialog>
      <ForwardMessageComposer onInputChange={setInput} />
      <MessagePreview input={input} />
    </Dialog>
  )
}

function ForwardMessageComposer({ onInputChange }) {
  const [state, setState] = useState(initialState)
  useEffect(() => {
    onInputChange(state.input) // Sync on every change 😬
  }, [state.input])
}
```

**誤り（submitでrefからstateを読み取る）：**

```tsx
function ForwardMessageDialog() {
  const stateRef = useRef(null)
  return (
    <Dialog>
      <ForwardMessageComposer stateRef={stateRef} />
      <ForwardButton onPress={() => submit(stateRef.current)} />
    </Dialog>
  )
}
```

**正しい（プロバイダーにリフトアップされたstate）：**

```tsx
function ForwardMessageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState)
  const forwardMessage = useForwardMessage()
  const inputRef = useRef(null)

  return (
    <Composer.Provider
      state={state}
      actions={{ update: setState, submit: forwardMessage }}
      meta={{ inputRef }}
    >
      {children}
    </Composer.Provider>
  )
}

function ForwardMessageDialog() {
  return (
    <ForwardMessageProvider>
      <Dialog>
        <ForwardMessageComposer />
        <MessagePreview /> {/* Custom components can access state and actions */}
        <DialogActions>
          <CancelButton />
          <ForwardButton /> {/* Custom components can access state and actions */}
        </DialogActions>
      </Dialog>
    </ForwardMessageProvider>
  )
}

function ForwardButton() {
  const { actions } = use(Composer.Context)
  return <Button onPress={actions.submit}>Forward</Button>
}
```

ForwardButtonはComposer.Frameの外側に存在するが、プロバイダーの内側にあるためsubmitアクションにアクセスできる。一度限りのコンポーネントであっても、UI外部からComposerのstateとactionsにアクセスできる。

**重要な洞察：** 共有stateを必要とするコンポーネントは視覚的に互いの内側にある必要はなく、同じプロバイダーの内側にさえあればよい。
