<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcCard'
})
</script>

<script lang="ts" setup>
import { zcUIProps } from '@/types/zcUI'
import { setUnit } from '@/utils/common'
import { computed } from 'vue'

const props = withDefaults(defineProps<zcUIProps.Card>(), {
  height: 'auto',
  maxHeight: 'auto',
  background: '#fff',
  radius: 12,
  padding: 0,
  bordered: false,
  borderColor: '#e4e7ed',
  borderWidth: 1,
  shadow: 'medium',
  width: '100%',
  hoverable: false
})

// 计算卡片样式
const cardStyle = computed(() => {
  const styles: Record<string, any> = {
    '--height': setUnit(props.height),
    '--maxHeight': setUnit(props.maxHeight),
    '--radius': setUnit(props.radius),
    '--background': props.background,
    '--padding': setUnit(props.padding),
    '--width': setUnit(props.width)
  }

  // 边框相关样式
  if (props.bordered) {
    styles['--borderWidth'] = setUnit(props.borderWidth)
    styles['--borderColor'] = props.borderColor
    styles['border'] = `var(--borderWidth) solid var(--borderColor)`
  }

  // 阴影样式
  if (props.shadow !== 'none') {
    switch (props.shadow) {
      case 'light':
        styles['--boxShadow'] = '0px 2px 12px 0px rgba(0, 0, 0, 0.05)'
        break
      case 'medium':
        styles['--boxShadow'] = '0px 4px 16px 0px rgba(0, 0, 0, 0.1)'
        break
      case 'heavy':
        styles['--boxShadow'] = '0px 8px 30px 0px rgba(0, 0, 0, 0.15)'
        break
      default:
        styles['--boxShadow'] = '0px 4px 16px 0px rgba(0, 0, 0, 0.1)'
    }
  } else {
    styles['--boxShadow'] = 'none'
  }

  return styles
})

// 计算卡片 class
const cardClass = computed(() => {
  return [
    'zc-card',
    'zc-ui-component',
    {
      'is-bordered': props.bordered,
      'is-hoverable': props.hoverable,
      [`shadow-${props.shadow}`]: props.shadow !== 'none'
    }
  ]
})
</script>

<template>
  <div
    class="zc-card zc-ui-component"
    :class="cardClass"
    :style="cardStyle"
    v-loading="loading"
  >
    <!-- 卡片头部 -->
    <div class="zc-card__header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    
    <!-- 卡片内容区 -->
    <div class="zc-card__body">
      <slot></slot>
    </div>
    
    <!-- 卡片底部 -->
    <div class="zc-card__footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style lang="scss">
.zc-card {
  position: relative;
  width: var(--width);
  height: var(--height);
  max-height: var(--maxHeight);
  border-radius: var(--radius);
  background: var(--background);
  box-shadow: var(--boxShadow);
  transition: all 0.3s ease;
  padding: var(--padding);
  display: flex;
  flex-direction: column;
  
  // 卡片各部分样式
  &__header,
  &__footer {
    flex-shrink: 0;
  }
  
  &__body {
    flex: 1;
    height: 0;
  }
  
  // 悬停效果
  &.is-hoverable {
    &:hover {
      box-shadow: 0px 8px 30px 0px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
  }
  
  // 不同阴影样式
  &.shadow-none {
    box-shadow: none;
  }
  
  &.shadow-light {
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.05);
  }
  
  &.shadow-medium {
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
  }
  
  &.shadow-heavy {
    box-shadow: 0px 8px 30px 0px rgba(0, 0, 0, 0.15);
  }
}
</style>
