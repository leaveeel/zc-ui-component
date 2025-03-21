<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcButtonGroup'
})
</script>

<script lang="ts" setup>
import { setUnit } from '@/utils/common'
import { zcUIProps } from '@/types/zcUI'
import { computed } from 'vue'

const props = withDefaults(defineProps<zcUIProps.ButtonGroup>(), {
  align: 'left',
  inline: false,
  vertical: false,
  gap: 10
})

// 计算按钮组样式
const groupStyle = computed(() => {
  const styles: Record<string, any> = {
    display: props.inline ? 'inline-flex' : 'flex',
    flexDirection: props.vertical ? 'column' : 'row',
  }

  // 如果提供了 gap 属性，优先使用 gap
  if (props.gap !== undefined) {
    styles['gap'] = setUnit(props.gap)
  }

  return styles
})

// 计算组件 class
const groupClass = computed(() => {
  return [
    'zc-buttonGroup', 
    'zc-ui-component',
    `align-${props.align}`,
    { 'is-vertical': props.vertical }
  ]
})
</script>

<template>
  <div
    class="zc-buttonGroup zc-ui-component"
    :class="groupClass"
    :style="groupStyle"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
.zc-buttonGroup {
  display: flex;
  flex-shrink: 0;
  // 常规横向布局
  &:not(.is-vertical) {
    &.align-right {
      justify-content: flex-end;
    }
    
    &.align-center {
      justify-content: center;
    }
    
    &.align-left {
      justify-content: flex-start;
    }
  }
  
  // 垂直排列样式
  &.is-vertical {
    flex-direction: column;
    
    &.align-right {
      align-items: flex-end;
    }
    
    &.align-center {
      align-items: center;
    }
    
    &.align-left {
      align-items: flex-start;
    }
  }
}
</style>
