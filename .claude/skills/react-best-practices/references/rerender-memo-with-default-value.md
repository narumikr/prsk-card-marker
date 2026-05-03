---

title: メモ化コンポーネントのデフォルトの非プリミティブパラメータ値を定数に抽出する
impact: MEDIUM
impactDescription: restores memoization by using a constant for default value
tags: rerender, memo, optimization

---

## メモ化コンポーネントのデフォルトの非プリミティブパラメータ値を定数に抽出する

メモ化されたコンポーネントが配列、関数、オブジェクトのような非プリミティブのオプションパラメータのデフォルト値を持つ場合、そのパラメータなしでコンポーネントを呼び出すとメモ化が機能しなくなります。これはレンダリングのたびに新しい値インスタンスが作成され、`memo()`の厳密な等値比較に失敗するためです。

この問題を解決するには、デフォルト値を定数に抽出します。

**誤り（レンダリングのたびに`onClick`の値が異なる）：**

```tsx
const UserAvatar = memo(function UserAvatar({ onClick = () => {} }: { onClick?: () => void }) {
  // ...
})

// Used without optional onClick
<UserAvatar />
```

**正しい（安定したデフォルト値）：**

```tsx
const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({ onClick = NOOP }: { onClick?: () => void }) {
  // ...
})

// Used without optional onClick
<UserAvatar />
```
