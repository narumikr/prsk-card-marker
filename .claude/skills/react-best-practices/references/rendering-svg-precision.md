---
title: SVGの精度を最適化する
impact: LOW
impactDescription: reduces file size
tags: rendering, svg, optimization, svgo
---

## SVGの精度を最適化する

ファイルサイズを減らすためにSVG座標の精度を下げます。最適な精度はviewBoxのサイズによって異なりますが、一般的に精度の削減を検討すべきです。

**誤り（過剰な精度）：**

```svg
<path d="M 10.293847 20.847362 L 30.938472 40.192837" />
```

**正しい（小数点1桁）：**

```svg
<path d="M 10.3 20.8 L 30.9 40.2" />
```

**SVGOで自動化する：**

```bash
npx svgo --precision=1 --multipass icon.svg
```
