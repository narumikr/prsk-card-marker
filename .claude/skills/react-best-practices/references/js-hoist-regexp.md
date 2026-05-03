---
title: RegExpの生成をホイストする
impact: LOW-MEDIUM
impactDescription: avoids recreation
tags: javascript, regexp, optimization, memoization
---

## RegExpの生成をホイストする

レンダリング内にRegExpを作成しないでください。モジュールスコープにホイストするか、`useMemo()`でメモ化します。

**誤り（レンダリングのたびに新しいRegExpを生成）：**

```tsx
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**正しい（メモ化またはホイスト）：**

```tsx
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**警告（グローバル正規表現はミュータブルな状態を持つ）：**

グローバル正規表現（`/g`）はミュータブルな`lastIndex`状態を持ちます：

```typescript
const regex = /foo/g
regex.test('foo')  // true, lastIndex = 3
regex.test('foo')  // false, lastIndex = 0
```
