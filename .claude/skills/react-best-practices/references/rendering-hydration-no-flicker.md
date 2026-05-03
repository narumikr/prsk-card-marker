---
title: フリッカーなしでハイドレーションミスマッチを防ぐ
impact: MEDIUM
impactDescription: avoids visual flicker and hydration errors
tags: rendering, ssr, hydration, localStorage, flicker
---

## フリッカーなしでハイドレーションミスマッチを防ぐ

クライアントサイドのストレージ（localStorage、Cookie）に依存するコンテンツをレンダリングする場合、Reactがハイドレーションする前にDOMを更新する同期スクリプトを注入することで、SSRの破損とハイドレーション後のフリッカーの両方を回避します。

**誤り（SSRが壊れる）：**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  // localStorage is not available on server - throws error
  const theme = localStorage.getItem('theme') || 'light'

  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

`localStorage`がundefinedのため、サーバーサイドレンダリングが失敗します。

**誤り（視覚的なフリッカー）：**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Runs after hydration - causes visible flash
    const stored = localStorage.getItem('theme')
    if (stored) {
      setTheme(stored)
    }
  }, [])

  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

コンポーネントはまずデフォルト値（`light`）でレンダリングされ、ハイドレーション後に更新されるため、誤ったコンテンツが一瞬表示されます。

**正しい（フリッカーなし、ハイドレーションミスマッチなし）：**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="theme-wrapper">
        {children}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                var el = document.getElementById('theme-wrapper');
                if (el) el.className = theme;
              } catch (e) {}
            })();
          `,
        }}
      />
    </>
  )
}
```

インラインスクリプトは要素を表示する前に同期的に実行され、DOMにすでに正しい値が設定されます。フリッカーなし、ハイドレーションミスマッチなし。

このパターンは特に、テーマの切り替え、ユーザー設定、認証状態、デフォルト値を表示せずに即座にレンダリングすべきクライアント専用データに有効です。
