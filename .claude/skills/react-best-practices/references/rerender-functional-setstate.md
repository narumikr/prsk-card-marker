---
title: 関数型setStateの更新を使用する
impact: MEDIUM
impactDescription: prevents stale closures and unnecessary callback recreations
tags: react, hooks, useState, useCallback, callbacks, closures
---

## 関数型setStateの更新を使用する

現在のstate値に基づいてstateを更新する場合、state変数を直接参照する代わりにsetStateの関数型更新形式を使用します。これにより古いクロージャを防ぎ、不要な依存関係をなくし、安定したコールバック参照を作成します。

**誤り（stateを依存関係として必要とする）：**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)

  // Callback must depend on items, recreated on every items change
  const addItems = useCallback((newItems: Item[]) => {
    setItems([...items, ...newItems])
  }, [items])  // ❌ items dependency causes recreations

  // Risk of stale closure if dependency is forgotten
  const removeItem = useCallback((id: string) => {
    setItems(items.filter(item => item.id !== id))
  }, [])  // ❌ Missing items dependency - will use stale items!

  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

1つ目のコールバックは`items`が変わるたびに再生成されるため、子コンポーネントの不要な再レンダリングを引き起こす可能性があります。2つ目のコールバックには古いクロージャのバグがあり、常に初期の`items`値を参照します。

**正しい（安定したコールバック、古いクロージャなし）：**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)

  // Stable callback, never recreated
  const addItems = useCallback((newItems: Item[]) => {
    setItems(curr => [...curr, ...newItems])
  }, [])  // ✅ No dependencies needed

  // Always uses latest state, no stale closure risk
  const removeItem = useCallback((id: string) => {
    setItems(curr => curr.filter(item => item.id !== id))
  }, [])  // ✅ Safe and stable

  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

**メリット：**

1. **安定したコールバック参照** - stateが変わってもコールバックを再生成する必要がない
2. **古いクロージャなし** - 常に最新のstate値で動作する
3. **依存関係の削減** - 依存配列をシンプルにしてメモリリークを減らす
4. **バグの防止** - Reactのクロージャバグで最も多い原因を排除する

**関数型更新を使用すべき場面：**

- 現在のstate値に依存してstateを更新する場合
- stateが必要なuseCallback/useMemo内
- stateを参照するイベントハンドラ
- stateを更新する非同期処理

**直接更新で問題ない場面：**

- stateに静的な値を設定する場合：`setCount(0)`
- propsや引数からのみstateを設定する場合：`setName(newName)`
- stateが前の値に依存しない場合

**注意：** プロジェクトで[React Compiler](https://react.dev/learn/react-compiler)が有効になっている場合、コンパイラが一部のケースを自動最適化できますが、正確性と古いクロージャのバグ防止のために関数型更新は依然として推奨されます。
