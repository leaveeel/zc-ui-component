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
  type: 'default',
  width: 'auto',
  height: '40',
  fontSize: 16,
  radius: 6,
  htmlType: 'button',
  disabled: false
})

const propsDisabled = props.disabled ? computed(() => props.disabled) : inject('fieldDisabled', ref(false))

const emit = defineEmits<{
  click: [e?: MouseEvent]
}>()

const isFocused = ref(false)

// 处理点击事件
const handleClick = (e: MouseEvent) => {
  if (!propsDisabled.value && !props.loading) {
    handleBlur()
    emit('click', e)
  } else {
    // 阻止默认行为，确保禁用状态下不触发操作
    e.preventDefault()
  }
}

// 处理键盘事件，增强可访问性
const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.key === 'Enter' || e.key === ' ') && !propsDisabled.value && !props.loading) {
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

const color = {
  'default': '',
  'primary': 'var(--main-color)',
  'success': 'var(--main-success-color)',
  'warning': 'var(--main-warning-color)',
  'danger': 'var(--main-danger-color)',
  'info': 'var(--main-info-color)',
}

// 计算样式
const buttonStyle = computed(() => {
  return {
    display: props.inline ? 'inline-flex' : 'flex',
    width: setUnit(props.width),
    height: props.text ? 'auto' : setUnit(props.height),
    fontSize: setUnit(props.fontSize),
    '--background': props.background ? props.background : props.plain ? '' : color[props.type],
    borderRadius: setUnit(props.radius),
    borderWidth: props.plain ? '1px' : 0,
    '--color': props.color ? props.color : (props.type === 'default' ? 'var(--main-font-color)' : (props.plain || props.text) ? color[props.type] : '#fff')
  }
})

// 计算类名
const buttonClasses = computed(() => {
  const classname = `zc-button-plain--${props.type}`
  return {
    'zc-button-text': props.text,
    'zc-button-disabled': propsDisabled.value || props.loading,
    'zc-button-focused': isFocused.value,
    [classname]: props.plain
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

    <zc-icon v-if="loading" :size="20" :color="buttonStyle['--color']" style="margin-right: 2px">
      <IconLoading></IconLoading>
    </zc-icon>
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.zc-button {
  font-family: inherit;
  font-weight: 500;
  border-style: solid;
  border-color: var(--color);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  color: var(--color);
  white-space: nowrap;
  background: var(--background);
  padding: 4px 12px;
  transition: all 0.2s ease;
  user-select: none;
  outline: none;

  &-plain {
    &--primary {
      border-color: var(--main-color);
      color: var(--main-color);
    }
    &--success {
      border-color: var(--main-success-color);
      color: var(--main-success-color);
    }
    &--warning {
      border-color: var(--main-warning-color);
      color: var(--main-warning-color);
    }
    &--danger {
      border-color: var(--main-danger-color);
      color: var(--main-danger-color);
    }
    &--default {
      border-color: var(--main-font-color);
      color: var(--main-font-color);
    }
  }
  
  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.25);
  }
  
  &-focused:not(&-text) {
    box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.25);
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
  
  &-disabled {
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
  
  &-text {
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
