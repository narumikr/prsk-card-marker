---
title: ユーザーの意図に基づいてプリロードする
impact: MEDIUM
impactDescription: reduces perceived latency
tags: bundle, preload, user-intent, hover
---

## ユーザーの意図に基づいてプリロードする

体感レイテンシを下げるために、必要になる前に重いバンドルをプリロードします。

**例（ホバー/フォーカス時にプリロード）：**

```tsx
function EditorButton({ onClick }: { onClick: () => void }) {
  const preload = () => {
    if (typeof window !== 'undefined') {
      void import('./monaco-editor')
    }
  }

  return (
    <button
      onMouseEnter={preload}
      onFocus={preload}
      onClick={onClick}
    >
      Open Editor
    </button>
  )
}
```

**例（フィーチャーフラグが有効な時にプリロード）：**

```tsx
function FlagsProvider({ children, flags }: Props) {
  useEffect(() => {
    if (flags.editorEnabled && typeof window !== 'undefined') {
      void import('./monaco-editor').then(mod => mod.init())
    }
  }, [flags.editorEnabled])

  return <FlagsContext.Provider value={flags}>
    {children}
  </FlagsContext.Provider>
}
```

`typeof window !== 'undefined'`チェックにより、SSR時にプリロードされるモジュールがバンドルされるのを防ぎ、サーバーバンドルサイズとビルド速度を最適化します。
