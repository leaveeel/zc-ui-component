<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'zcSkeletonItem'
})
</script>

<script lang="ts" setup>
import { zcUIProps } from '@/types/zcUI'
import { setUnit } from '@/utils/common'
import { computed, inject } from 'vue'

// 注入父组件的上下文数据
const skeletonContext = inject('skeleton', {
  animated: true,
  backgroundColor: '#f2f2f2',
  highlightColor: '#e6e6e6',
  round: true,
  radius: 4
})

const props = withDefaults(defineProps<zcUIProps.SkeletonItem>(), {
  variant: 'text',
  width: '',
  height: '',
  radius: 0
})

// 计算不同变体的默认样式
const variantStyle = computed(() => {
  const style: Record<string, any> = {}
  
  switch(props.variant) {
    case 'text':
      style.width = props.width || '100%'
      style.height = props.height || '16px'
      break
    case 'title':
      style.width = props.width || '40%'
      style.height = props.height || '24px'
      break
    case 'image':
      style.width = props.width || '100px'
      style.height = props.height || '100px'
      break
    case 'circle':
      style.width = props.width || '50px'
      style.height = props.height || '50px'
      style.borderRadius = '50%'
      break
  }
  
  return style
})

// 计算骨架屏元素样式
const itemStyle = computed(() => {
  const styles: Record<string, any> = {
    ...variantStyle.value,
    backgroundColor: skeletonContext.backgroundColor
  }
  
  // 处理圆角
  if (skeletonContext.round && props.variant !== 'circle') {
    styles.borderRadius = setUnit(props.radius || skeletonContext.radius)
  }
  
  // 转换单位
  if (styles.width) styles.width = setUnit(styles.width)
  if (styles.height) styles.height = setUnit(styles.height)
  
  return styles
})

// 计算骨架屏元素类名
const itemClass = computed(() => {
  return [
    'zc-skeleton-item',
    `zc-skeleton-item--${props.variant}`,
    {
      'is-animated': skeletonContext.animated
    }
  ]
})
</script>

<template>
  <div class="zc-skeleton-item" :class="itemClass" :style="itemStyle"></div>
</template>

<style lang="scss">
.zc-skeleton-item {
  display: inline-block;
  background-color: #f2f2f2;
  vertical-align: middle;
  
  &.is-animated {
    background: linear-gradient(
      90deg,
      var(--skeleton-bg, #f2f2f2) 25%,
      var(--skeleton-highlight, #e6e6e6) 37%,
      var(--skeleton-bg, #f2f2f2) 63%
    );
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease infinite;
  }
  
  & + & {
    margin-top: 8px;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  
  100% {
    background-position: 0 50%;
  }
}
</style> 