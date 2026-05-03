---
title: localStorageデータにバージョンを付けて最小化する
impact: MEDIUM
impactDescription: prevents schema conflicts, reduces storage size
tags: client, localStorage, storage, versioning, data-minimization
---

## localStorageデータにバージョンを付けて最小化する

キーにバージョンプレフィックスを追加し、必要なフィールドのみを格納します。スキーマの競合と機密データの誤保存を防止します。

**誤り：**

```typescript
// No version, stores everything, no error handling
localStorage.setItem('userConfig', JSON.stringify(fullUserObject))
const data = localStorage.getItem('userConfig')
```

**正しい：**

```typescript
const VERSION = 'v2'

function saveConfig(config: { theme: string; language: string }) {
  try {
    localStorage.setItem(`userConfig:${VERSION}`, JSON.stringify(config))
  } catch {
    // Throws in incognito/private browsing, quota exceeded, or disabled
  }
}

function loadConfig() {
  try {
    const data = localStorage.getItem(`userConfig:${VERSION}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// Migration from v1 to v2
function migrate() {
  try {
    const v1 = localStorage.getItem('userConfig:v1')
    if (v1) {
      const old = JSON.parse(v1)
      saveConfig({ theme: old.darkMode ? 'dark' : 'light', language: old.lang })
      localStorage.removeItem('userConfig:v1')
    }
  } catch {}
}
```

**サーバーレスポンスから最小限のフィールドのみを格納する：**

```typescript
// User object has 20+ fields, only store what UI needs
function cachePrefs(user: FullUser) {
  try {
    localStorage.setItem('prefs:v1', JSON.stringify({
      theme: user.preferences.theme,
      notifications: user.preferences.notifications
    }))
  } catch {}
}
```

**常にtry-catchでラップする：** `getItem()`と`setItem()`は、プライベートブラウジング（Safari、Firefox）、クォータ超過、または無効化されている場合にスローします。

**メリット：** バージョニングによるスキーマの進化、ストレージサイズの削減、トークン/個人情報/内部フラグの誤保存防止。
