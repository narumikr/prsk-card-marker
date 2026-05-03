---
title: 遅延state初期化を使用する
impact: MEDIUM
impactDescription: wasted computation on every render
tags: react, hooks, useState, performance, initialization
---

## 遅延state初期化を使用する

高コストな初期値には`useState`に関数を渡します。関数形式を使用しないと、初期化処理はレンダリングのたびに実行されますが、その値は初回しか使用されません。

**誤り（レンダリングのたびに実行される）：**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs on EVERY render, even after initialization
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))
  const [query, setQuery] = useState('')

  // When query changes, buildSearchIndex runs again unnecessarily
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse runs on every render
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem('settings') || '{}')
  )

  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

**正しい（1回だけ実行される）：**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs ONLY on initial render
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
  const [query, setQuery] = useState('')

  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse runs only on initial render
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('settings')
    return stored ? JSON.parse(stored) : {}
  })

  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

遅延初期化を使用すべき場面：localStorage/sessionStorageからの初期値の計算、データ構造（インデックス、Map）の構築、DOMからの読み取り、重い変換処理。

単純なプリミティブ（`useState(0)`）、直接参照（`useState(props.value)`）、安価なリテラル（`useState({})`）には関数形式は不要です。
