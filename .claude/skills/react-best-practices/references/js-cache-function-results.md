---
title: 繰り返し呼ばれる関数の結果をキャッシュする
impact: MEDIUM
impactDescription: avoid redundant computation
tags: javascript, cache, memoization, performance
---

## 繰り返し呼ばれる関数の結果をキャッシュする

レンダリング中に同じ入力で同じ関数が繰り返し呼ばれる場合、モジュールレベルのMapを使用して結果をキャッシュします。

**誤り（冗長な計算）：**

```typescript
function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // slugify() called 100+ times for same project names
        const slug = slugify(project.name)

        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**正しい（キャッシュした結果）：**

```typescript
// Module-level cache
const slugifyCache = new Map<string, string>()

function cachedSlugify(text: string): string {
  if (slugifyCache.has(text)) {
    return slugifyCache.get(text)!
  }
  const result = slugify(text)
  slugifyCache.set(text, result)
  return result
}

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // Computed only once per unique project name
        const slug = cachedSlugify(project.name)

        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**単一値関数のシンプルなパターン：**

```typescript
let isLoggedInCache: boolean | null = null

function isLoggedIn(): boolean {
  if (isLoggedInCache !== null) {
    return isLoggedInCache
  }

  isLoggedInCache = document.cookie.includes('auth=')
  return isLoggedInCache
}

// Clear cache when auth changes
function onAuthChange() {
  isLoggedInCache = null
}
```

フック以外でも使えるよう、（フックではなく）Mapを使用します。ユーティリティ、イベントハンドラ、Reactコンポーネント以外でも動作します。

参考：[Vercel DashboardをF倍速にした方法](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)
