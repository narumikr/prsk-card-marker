---
title: Storage APIの呼び出しをキャッシュする
impact: LOW-MEDIUM
impactDescription: reduces expensive I/O
tags: javascript, localStorage, storage, caching, performance
---

## Storage APIの呼び出しをキャッシュする

`localStorage`、`sessionStorage`、`document.cookie`は同期的で高コストです。読み取りをメモリにキャッシュします。

**誤り（呼び出しのたびにストレージを読み取る）：**

```typescript
function getTheme() {
  return localStorage.getItem('theme') ?? 'light'
}
// Called 10 times = 10 storage reads
```

**正しい（Mapキャッシュ）：**

```typescript
const storageCache = new Map<string, string | null>()

function getLocalStorage(key: string) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key))
  }
  return storageCache.get(key)
}

function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value)
  storageCache.set(key, value)  // keep cache in sync
}
```

フック以外でも使えるよう、（フックではなく）Mapを使用します。ユーティリティ、イベントハンドラ、Reactコンポーネント以外でも動作します。

**Cookieのキャッシュ：**

```typescript
let cookieCache: Record<string, string> | null = null

function getCookie(name: string) {
  if (!cookieCache) {
    cookieCache = Object.fromEntries(
      document.cookie.split('; ').map(c => c.split('='))
    )
  }
  return cookieCache[name]
}
```

**重要（外部からの変更時にキャッシュを無効化する）：**

ストレージが外部から変更される可能性がある場合（別タブ、サーバーによるCookieの設定）、キャッシュを無効化します：

```typescript
window.addEventListener('storage', (e) => {
  if (e.key) storageCache.delete(e.key)
})

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    storageCache.clear()
  }
})
```
