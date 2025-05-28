<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcRadio'
})
</script>

<script lang="ts" setup>
import { zcUIProps } from '@/types/zcUI'
import { inject, computed, ref, Ref } from 'vue'

const props = withDefaults(defineProps<zcUIProps.Radio>(), {
  modelValue: false,
  value: undefined,
  disabled: undefined
})
const propsDisabled = props.disabled ? computed(() => props.disabled) : inject('fieldDisabled', ref(false))

const propsModelValue = inject('fieldModelValue', undefined) as undefined | Ref<boolean | string | number>

const emits = defineEmits(['update:modelValue', 'change'])
const change = inject<(() => void) | undefined>('change', undefined)
const errorMsg = ref(inject('errorMsg', ''))

const group = inject('emits', undefined) as ((event: string, ...args: any[]) => void) | undefined
const isGroup = computed(() => propsModelValue !== undefined)
const isFocused = ref(false)

const model = computed({
  get() {
    return isGroup.value ? propsModelValue!.value : props.modelValue
  },
  set(val: boolean | string | number) {
    if (isGroup.value) {
      change?.()
      group && group('change', val as (string | number | boolean))
      group && group('update:modelValue', val as (string | number | boolean))
    } else {
      change?.()
      emits('update:modelValue', val)
      emits('change', val)
    }
  }
})

const isChecked = computed(() => (props.value || props.value === 0) ? model.value === props.value : model.value === props.label)

const toggle = () => {
  if (propsDisabled.value || isChecked.value) return
  model.value = (props.value || props.value === 0) ? props.value : props.label
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    toggle()
  }
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}
</script>

<template>
  <div
    class="zc-radio zc-ui-component"
    @click="toggle"
    :class="{ 
      disabled: propsDisabled, 
      error: errorMsg,
      'is-checked': isChecked,
      'is-focused': isFocused
    }"
    tabindex="0"
    role="radio"
    @keydown="handleKeyDown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <input type="radio" :checked="isChecked" :disabled="propsDisabled" />
    <span class="radio" :class="{ checked: isChecked }"></span>
    <slot v-if="$slots.default"></slot>
    <span v-else class="radio-label">{{ label }}</span>
  </div>
</template>

<style lang="scss">
.zc-radio {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--main-font-color);
  transition: all 0.2s ease;
  outline: none;
  
  * {
    cursor: pointer;
  }

  
  &.error {
    color: var(--main-danger-color);
    .radio {
      border-color: var(--main-danger-color);
    }
  }
  
  &:hover:not(.disabled) {
    .radio {
      border-color: var(--main-color);
    }
  }
  
  &.is-focused:not(.disabled) {
    .radio {
      border-color: var(--main-color);
      box-shadow: 0 0 0 2px rgba(var(--main-color-rgb), 0.2);
    }
  }
  
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    * {
      cursor: not-allowed;
    }
    .radio {
      &.checked {
        background-color: var(--main-font-color);
        border-color: var(--main-font-color);
      }
    }
  }
  
  input {
    display: none;
  }
  
  .radio {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #cccccc;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    transition: all 0.2s ease;
    position: relative;
    
    &:before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 4px;
      background: transparent;
      transition: all 0.2s ease;
    }
    
    &.checked {
      background-color: var(--main-color);
      border-color: var(--main-color);
      &::after {
        content: '';
        position: absolute;
        border-radius: 50%;
        background-color: #fff;
        width: 6px;
        height: 6px;
      }
    }

  }
  
  .radio-label {
    font-size: 16px;
    user-select: none;
  }
  
  &.error {
    .radio {
      border-color: var(--main-danger-color);
    }
    color: var(--main-danger-color);
  }
}
</style>
