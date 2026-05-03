---
title: 長いリストにはCSS content-visibilityを使用する
impact: HIGH
impactDescription: faster initial render
tags: rendering, css, content-visibility, long-lists
---

## 長いリストにはCSS content-visibilityを使用する

`content-visibility: auto`を適用して、画面外のレンダリングを遅延させます。

**CSS：**

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

**例：**

```tsx
function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map(msg => (
        <div key={msg.id} className="message-item">
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  )
}
```

1000件のメッセージがある場合、ブラウザは画面外の約990件のアイテムのレイアウト/ペイントをスキップします（初期レンダリングが10倍高速化）。
