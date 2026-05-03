---
title: 戦略的なSuspenseバウンダリー
impact: HIGH
impactDescription: faster initial paint
tags: async, suspense, streaming, layout-shift
---

## 戦略的なSuspenseバウンダリー

非同期コンポーネントでJSXを返す前にデータをawaitする代わりに、Suspenseバウンダリーを使用してデータのロード中もラッパーUIを素早く表示します。

**誤り（データ取得によりラッパー全体がブロックされる）：**

```tsx
async function Page() {
  const data = await fetchData() // Blocks entire page

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <DataDisplay data={data} />
      </div>
      <div>Footer</div>
    </div>
  )
}
```

中央のセクションのみデータが必要なのに、レイアウト全体がデータを待ちます。

**正しい（ラッパーをすぐに表示し、データをストリーミングで受け取る）：**

```tsx
function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <Suspense fallback={<Skeleton />}>
          <DataDisplay />
        </Suspense>
      </div>
      <div>Footer</div>
    </div>
  )
}

async function DataDisplay() {
  const data = await fetchData() // Only blocks this component
  return <div>{data.content}</div>
}
```

Sidebar、Header、Footerはすぐにレンダリングされます。DataDisplayだけがデータを待ちます。

**代替案（コンポーネント間でPromiseを共有する）：**

```tsx
function Page() {
  // Start fetch immediately, but don't await
  const dataPromise = fetchData()

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <Suspense fallback={<Skeleton />}>
        <DataDisplay dataPromise={dataPromise} />
        <DataSummary dataPromise={dataPromise} />
      </Suspense>
      <div>Footer</div>
    </div>
  )
}

function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // Unwraps the promise
  return <div>{data.content}</div>
}

function DataSummary({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // Reuses the same promise
  return <div>{data.summary}</div>
}
```

両コンポーネントが同じPromiseを共有するため、フェッチは1回だけ行われます。レイアウトはすぐにレンダリングされ、両コンポーネントは一緒に待機します。

**このパターンを使うべきでない場合：**

- レイアウトの決定に必要なクリティカルデータ（配置に影響する場合）
- フォールドより上のSEOクリティカルなコンテンツ
- Suspenseのオーバーヘッドが見合わない小さくて高速なクエリ
- レイアウトシフトを避けたい場合（ローディング → コンテンツのジャンプ）

**トレードオフ：** 初期描画の速度 vs レイアウトシフトの可能性。UXの優先度に応じて選択してください。
