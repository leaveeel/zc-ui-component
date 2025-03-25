

















# ZC Scroll 滚动组件

滚动组件提供了自定义滚动条的容器，支持拖拽滚动、滚动事件监听和滚动位置控制。

## 基本用法

```vue
<zc-scroll height="300px">
  <div>滚动内容</div>
</zc-scroll>
```











## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| width | string/number | '100%' | 滚动区域宽度 |
| height | string/number | '100%' | 滚动区域高度 |
| maxHeight | string/number | '100%' | 滚动区域最大高度 |

## 事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| scroll | 滚动时触发 | { scrollLeft, scrollTop, scrollHeight, scrollWidth } |

## 方法

| 方法名 | 说明 | 参数 |
|-------|------|------|
| scrollTo | 滚动到指定位置 | { left?: number, top?: number, behavior?: ScrollBehavior } |
| scrollToTop | 滚动到顶部 | behavior?: ScrollBehavior |
| scrollToBottom | 滚动到底部 | behavior?: ScrollBehavior |

## 插槽

| 插槽名 | 说明 |
|-------|------|
| default | 滚动容器内容 |

## 样式定制

滚动组件提供了自定义滚动条样式，滚动条会在鼠标悬停时显示，支持拖拽滚动。

### 自定义尺寸

```vue
<zc-scroll width="500px" height="300px">
  <div>自定义尺寸的滚动区域</div>
</zc-scroll>
```











### 设置最大高度

```vue
<zc-scroll :max-height="500">
  <div>设置最大高度的滚动区域</div>
</zc-scroll>
```











## 滚动控制

滚动组件提供了多种方法来控制滚动位置。

### 滚动到指定位置

```vue
<template>
  <zc-scroll ref="scrollRef">
    <div>滚动内容</div>
  </zc-scroll>
  <button @click="scrollToPosition">滚动到指定位置</button>
</template>

<script setup>
import { ref } from 'vue'

const scrollRef = ref()

const scrollToPosition = () => {
  scrollRef.value.scrollTo({ 
    top: 100, 
    left: 0, 
    behavior: 'smooth' 
  })
}
</script>
```











### 滚动到顶部

```vue
<template>
  <zc-scroll ref="scrollRef">
    <div>滚动内容</div>
  </zc-scroll>
  <button @click="scrollToTop">滚动到顶部</button>
</template>

<script setup>
import { ref } from 'vue'

const scrollRef = ref()

const scrollToTop = () => {
  scrollRef.value.scrollToTop('smooth')
}
</script>
```











### 滚动到底部

```vue
<template>
  <zc-scroll ref="scrollRef">
    <div>滚动内容</div>
  </zc-scroll>
  <button @click="scrollToBottom">滚动到底部</button>
</template>

<script setup>
import { ref } from 'vue'

const scrollRef = ref()

const scrollToBottom = () => {
  scrollRef.value.scrollToBottom('smooth')
}
</script>
```











## 监听滚动事件

```vue
<template>
  <zc-scroll @scroll="handleScroll">
    <div>滚动内容</div>
  </zc-scroll>
</template>

<script setup>
const handleScroll = ({ scrollLeft, scrollTop, scrollHeight, scrollWidth }) => {
  console.log('滚动位置:', scrollTop, scrollLeft)
  console.log('内容尺寸:', scrollHeight, scrollWidth)
}
</script>
```











## 注意事项

- 滚动组件会自动隐藏原生滚动条，并提供自定义滚动条
- 滚动条会在鼠标悬停时显示，离开时隐藏
- 当内容不足以滚动时，滚动条会自动隐藏
- 组件会自动监听内容和容器大小变化，更新滚动条状态
- 支持鼠标拖拽滚动条进行滚动
