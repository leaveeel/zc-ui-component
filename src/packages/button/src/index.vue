<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcButton'
})
</script>

<script lang="ts" setup>
import { setUnit } from '@/utils/common'
import { zcUIProps } from '@/types/zcUI'
import IconLoading from '@/packages/icon/src/IconLoading.vue'
import zcIcon from '@/packages/icon/index.vue'
import { computed, ref, inject } from 'vue'

const props = withDefaults(defineProps<zcUIProps.Button>(), {
  width: 'auto',
  height: '40',
  size: 16,
  radius: 6,
  border: 1,
  htmlType: 'button',
})

const propsDisabled = inject('fieldDisabled', props.disabled || false)

const emit = defineEmits<{
  click: [e?: MouseEvent]
}>()

const isFocused = ref(false)

// 处理点击事件
const handleClick = (e: MouseEvent) => {
  if (!propsDisabled && !props.loading) {
    handleBlur()
    emit('click', e)
  } else {
    // 阻止默认行为，确保禁用状态下不触发操作
    e.preventDefault()
  }
}

// 处理键盘事件，增强可访问性
const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.key === 'Enter' || e.key === ' ') && !propsDisabled && !props.loading) {
    e.preventDefault()
    handleBlur()
    emit('click')
  }
}

// 处理焦点事件
const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}

// 计算样式
const buttonStyle = computed(() => {
  return {
    display: props.inline ? 'inline-flex' : 'flex',
    '--width': setUnit(props.width),
    '--height': setUnit(props.height),
    '--fontSize': setUnit(props.size),
    '--backgroundColor': props.background
      ? props.background
      : props.plain
        ? ''
        : 'var(--main-color)',
    '--borderColor':
      props.borderColor || props.background || 'var(--main-color)',
    'border-radius': setUnit(props.radius),
    'border-width': props.text ? '0px' : setUnit(props.border),
    '--color':
      props.plain || props.text
        ? props.color || 'var(--main-color)'
        : props.color || '#fff'
  }
})

// 计算类名
const buttonClasses = computed(() => {
  return {
    plain: props.plain,
    text: props.text,
    disabled: propsDisabled || props.loading,
    focused: isFocused.value
  }
})
</script>

<template>
  <button
    class="zc-button zc-ui-component"
    :class="buttonClasses"
    :style="buttonStyle"
    :type="htmlType"
    :disabled="propsDisabled || loading"
    :aria-disabled="propsDisabled || loading"
    :aria-busy="loading"
    @click="handleClick"
    @keydown="handleKeyDown"
    @focus="handleFocus"
    @blur="handleBlur"
    tabindex="0"
  >
    <slot name="icon" v-if="$slots.icon && !loading"></slot>

    <zc-icon v-if="loading" :size="20" :color="
        plain ? color || 'var(--main-color)' : color || '#fff'
      " style="margin-right: 2px">
      <IconLoading></IconLoading>
    </zc-icon>
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.zc-button {
  font-weight: 500;
  border-style: solid;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background-color: var(--backgroundColor);
  border-color: var(--borderColor);
  color: var(--color);
  width: var(--width);
  height: var(--height);
  font-size: var(--fontSize);
  white-space: nowrap;
  padding: 4px 12px;
  transition: all 0.2s ease;
  user-select: none;
  outline: none;
  
  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(var(--main-color-rgb, 0, 120, 212), 0.25);
  }
  
  &.focused:not(.text) {
    box-shadow: 0 0 0 2px rgba(var(--main-color-rgb, 0, 120, 212), 0.25);
  }
  
  &:hover:not(.disabled) {
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0.1;
      background-color: var(--color);
    }
  }
  
  &.disabled {
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0.3;
      background-color: #fff;
    }
    &:hover {
      cursor: not-allowed;
    }
  }
  
  &.text {
    width: auto;
    height: auto;
    background: none;
    padding: 0;
    &:hover:not(.disabled) {
      opacity: 0.7;
      &::after {
        content: none;
      }
    }
  }
}
</style>
