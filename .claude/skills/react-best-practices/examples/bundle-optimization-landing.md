# 例：ランディングページのバンドル最適化

バンドルサイズと読み込み最適化のルールを組み合わせたランディングページの例。

## Before（4つの問題）

```tsx
// app/page.tsx
import { Hero, Features, Pricing, FAQ, Footer } from '@/components'  // barrel import
import { Analytics } from '@segment/analytics-next'                    // loaded immediately
import { motion } from 'framer-motion'                                 // full library loaded
import Confetti from 'react-confetti'                                  // loaded even if not used

export default function LandingPage() {
  const [showConfetti, setShowConfetti] = useState(false)

  return (
    <div>
      <Analytics writeKey="..." />
      {showConfetti && <Confetti />}
      <Hero />
      <Features />
      <Pricing onPurchase={() => setShowConfetti(true)} />
      <FAQ />
      <Footer />
    </div>
  )
}
```

## After（4つの問題すべてを修正）

```tsx
// app/page.tsx
import Hero from '@/components/hero/Hero'               // direct imports (bundle-barrel-imports)
import Features from '@/components/features/Features'
import Pricing from '@/components/pricing/Pricing'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Heavy components loaded on demand (bundle-dynamic-imports)
const FAQ = dynamic(() => import('@/components/faq/FAQ'))
const Footer = dynamic(() => import('@/components/footer/Footer'))

// Conditional module: only loaded when triggered (bundle-conditional)
const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

export default function LandingPage() {
  const [showConfetti, setShowConfetti] = useState(false)

  return (
    <div>
      {/* Analytics deferred after hydration (bundle-defer-third-party) */}
      <DeferredAnalytics />
      {showConfetti && <Confetti />}
      <Hero />
      <Features />
      {/* Preload below-fold sections on interaction (bundle-preload) */}
      <div onMouseEnter={() => {
        import('@/components/pricing/Pricing')
      }}>
        <Pricing onPurchase={() => setShowConfetti(true)} />
      </div>
      <Suspense fallback={null}>
        <FAQ />
      </Suspense>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}

// Defer non-critical third-party (bundle-defer-third-party)
function DeferredAnalytics() {
  useEffect(() => {
    import('@segment/analytics-next').then(({ Analytics }) => {
      const analytics = new Analytics({ writeKey: '...' })
      analytics.page()
    })
  }, [])
  return null
}
```

## 適用されたルール

| ルール | 影響 | 変更内容 |
|------|--------|-------------|
| `bundle-barrel-imports` | CRITICAL | バレル再エクスポート → 直接ファイルインポート |
| `bundle-dynamic-imports` | CRITICAL | 静的インポート → FAQ・Footerをnext/dynamicに変更 |
| `bundle-conditional` | HIGH | Confettiが常にバンドルされる → トリガー時のみ読み込む |
| `bundle-defer-third-party` | MEDIUM | Analyticsを即時読み込み → ハイドレーション後に遅延読み込み |
| `bundle-preload` | MEDIUM | プリロードなし → ホバー操作時にプリロード |
