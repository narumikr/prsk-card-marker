# 例：再レンダリング最適化されたフォームコンポーネント

複数の再レンダリング最適化ルールを組み合わせたフォームコンポーネントの例。

## Before（5つの問題）

```tsx
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

function ProductForm({ categories }: { categories: Category[] }) {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: '',
    description: '',
  })
  const [windowWidth, setWindowWidth] = useState(window.innerWidth) // not lazy (rerender-lazy-state-init)
  const [isMobile, setIsMobile] = useState(false)

  // Derived state via effect (rerender-derived-state-no-effect)
  useEffect(() => {
    setIsMobile(windowWidth < 768)
  }, [windowWidth])

  // Subscribes to continuous value (rerender-derived-state)
  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Non-functional setState creates unstable callback (rerender-functional-setstate)
  const handleChange = useCallback((field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }, [formData]) // dependency on formData causes re-creation every render

  // Effect for interaction logic (rerender-move-effect-to-event)
  useEffect(() => {
    if (formData.name.length > 100) {
      alert('Name too long!')
    }
  }, [formData.name])

  const sortedCategories = useMemo(
    () => categories.sort((a, b) => a.name.localeCompare(b.name)), // mutates original array
    [categories]
  )

  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      {/* ... */}
    </form>
  )
}
```

## After（5つの問題すべてを修正）

```tsx
'use client'

import { useState, useCallback } from 'react'

function ProductForm({ categories }: { categories: Category[] }) {
  // Lazy initialization for expensive computation (rerender-lazy-state-init)
  const [formData, setFormData] = useState(() => ({
    name: '',
    price: 0,
    category: '',
    description: '',
  }))

  // Subscribe to derived boolean directly (rerender-derived-state)
  const isMobile = useMediaQuery('(max-width: 767px)')

  // Functional setState - no dependency on formData (rerender-functional-setstate)
  const handleChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, []) // stable: no dependencies needed

  // Validation in event handler, not effect (rerender-move-effect-to-event)
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length > 100) {
      alert('Name too long!')
      return
    }
    setFormData(prev => ({ ...prev, name: value }))
  }, [])

  // Immutable sort (js-tosorted-immutable) + derive during render (rerender-derived-state-no-effect)
  const sortedCategories = categories.toSorted((a, b) =>
    a.name.localeCompare(b.name)
  )

  return (
    <form>
      <input
        value={formData.name}
        onChange={handleNameChange}
      />
      {/* ... */}
    </form>
  )
}
```

## 適用されたルール

| ルール | 影響 | 変更内容 |
|------|--------|-------------|
| `rerender-derived-state` | MEDIUM | windowWidthの購読 → useMediaQuery ブーリアン |
| `rerender-derived-state-no-effect` | MEDIUM | エフェクトによる派生状態 → レンダリング中に計算 |
| `rerender-functional-setstate` | MEDIUM | スプレッドsetState → 関数型アップデーター（安定したコールバック） |
| `rerender-lazy-state-init` | MEDIUM | 直接の値 → useStateにファクトリー関数を渡す |
| `rerender-move-effect-to-event` | MEDIUM | バリデーションエフェクト → イベントハンドラのロジック |
| `js-tosorted-immutable` | MEDIUM-HIGH | ミューテーションするsort() → イミュータブルなtoSorted() |
