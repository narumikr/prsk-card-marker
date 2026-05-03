---
title: 明示的なコンポーネントバリアントを作成する
impact: MEDIUM
impactDescription: 自己文書化コード、隠れた条件分岐なし
tags: composition, variants, architecture
---

## 明示的なコンポーネントバリアントを作成する

多数のブールpropを持つ1つのコンポーネントの代わりに、明示的なバリアントコンポーネントを作成する。各バリアントは必要なピースをコンポーズする。コードが自己文書化される。

**誤り（1つのコンポーネント、多数のモード）：**

```tsx
// What does this component actually render?
<Composer
  isThread
  isEditing={false}
  channelId='abc'
  showAttachments
  showFormatting={false}
/>
```

**正しい（明示的なバリアント）：**

```tsx
// Immediately clear what this renders
<ThreadComposer channelId="abc" />

// Or
<EditMessageComposer messageId="xyz" />

// Or
<ForwardMessageComposer messageId="123" />
```

各実装はユニークで明示的かつ自己完結している。それでも共有パーツを使える。

**実装：**

```tsx
function ThreadComposer({ channelId }: { channelId: string }) {
  return (
    <ThreadProvider channelId={channelId}>
      <Composer.Frame>
        <Composer.Input />
        <AlsoSendToChannelField channelId={channelId} />
        <Composer.Footer>
          <Composer.Formatting />
          <Composer.Emojis />
          <Composer.Submit />
        </Composer.Footer>
      </Composer.Frame>
    </ThreadProvider>
  )
}

function EditMessageComposer({ messageId }: { messageId: string }) {
  return (
    <EditMessageProvider messageId={messageId}>
      <Composer.Frame>
        <Composer.Input />
        <Composer.Footer>
          <Composer.Formatting />
          <Composer.Emojis />
          <Composer.CancelEdit />
          <Composer.SaveEdit />
        </Composer.Footer>
      </Composer.Frame>
    </EditMessageProvider>
  )
}

function ForwardMessageComposer({ messageId }: { messageId: string }) {
  return (
    <ForwardMessageProvider messageId={messageId}>
      <Composer.Frame>
        <Composer.Input placeholder="Add a message, if you'd like." />
        <Composer.Footer>
          <Composer.Formatting />
          <Composer.Emojis />
          <Composer.Mentions />
        </Composer.Footer>
      </Composer.Frame>
    </ForwardMessageProvider>
  )
}
```

各バリアントは以下を明示している：

- 使用するプロバイダー/state
- 含まれるUI要素
- 利用可能なアクション

推論すべきブールpropの組み合わせなし。不可能な状態なし。
