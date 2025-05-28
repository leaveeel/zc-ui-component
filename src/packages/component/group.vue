<script lang="ts" setup>
import { setUnit } from '@/utils/common'
import { zcUI } from '@/types/zcUI'
import { computed,inject,provide } from 'vue'

const props = withDefaults(defineProps<zcUI.Group>(), {
  align: 'left',
  inline: false,
  vertical: false,
  gap: 10,
  disabled: false
})

const propsDisabled = computed(() => props.disabled)
provide('fieldDisabled', propsDisabled)

const emits = inject('emits' , undefined) as ((event: string, ...args: any[]) => void) | undefined
const propsModelValue = computed({
    get:() => props.modelValue,
    set:(val) => emits && emits('update:modelValue', val)
})
provide('fieldModelValue', propsModelValue)

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
    `zc-${props.name}`,
    `align-${props.align}`,
    { 'is-vertical': props.vertical }
  ]
})
</script>

<template>
  <div
    class="zc-groupComponent zc-ui-component"
    :class="groupClass"
    :style="groupStyle"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
.zc-groupComponent {
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
