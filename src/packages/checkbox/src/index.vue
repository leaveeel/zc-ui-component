<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcCheckbox'
})
</script>

<script lang="ts" setup>
import { zcUI, zcUIProps } from '@/types/zcUI'
import { inject, computed, ref } from 'vue'
import IconChecked from '@/packages/icon/src/IconChecked.vue'
import zcIcon from '@/packages/icon/index.vue'

const props = withDefaults(defineProps<zcUIProps.Checkbox>(), {
  modelValue: false,
  value: undefined,
  disabled: undefined
})
const propsDisabled = props.disabled === undefined ? inject('fieldDisabled', ref(false)) : computed(() => props.disabled)

const emits = defineEmits<{
  'update:modelValue': [value: boolean | (string | number)[]],
  change: [value: boolean | (string | number)[]]
}>()

const checkboxGroup = inject<zcUI.CheckboxGroup | undefined>('checkboxGroup' , undefined)
const isGroup = computed(() => !!checkboxGroup)
const isFocused = ref(false)

const model = computed({
  get() {
    return isGroup.value ? checkboxGroup && checkboxGroup.props.modelValue : props.modelValue
  },
  set(val: boolean | (string | number)[]) {
    if (isGroup.value) {
      checkboxGroup && checkboxGroup.emit('change', val as (string | number)[])
      checkboxGroup && checkboxGroup.emit('update:modelValue', val as (string | number)[])
    } else {
      emits('update:modelValue', val)
      emits('change', val)
    }
  }
})

const isChecked = computed(() => {
  if (isGroup.value) {
    const v = model.value as (string | number)[]
    return v.includes((props.value || props.value === 0) ? props.value : props.label as string | number)
  } else {
    return model.value
  }
})

const toggle = () => {
  if (propsDisabled.value) return
  if (isGroup.value) {
    const list = model.value as (string | number)[]
    const value = (props.value || props.value === 0) ? props.value : props.label
    const index = list.indexOf(value)
    if (index === -1) {
      list.push(value)
    } else {
      list.splice(index, 1)
    }
    model.value = [...list]
  } else {
    model.value = !model.value
  }
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
    class="zc-checkbox zc-ui-component"
    @click="toggle"
    :class="{ 
      disabled: propsDisabled, 
      'is-checked': isChecked,
      'is-focused': isFocused
    }"
    tabindex="0"
    role="checkbox"
    @keydown="handleKeyDown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <input type="checkbox" :checked="isChecked" :disabled="propsDisabled" />
    <span class="checkbox" :class="{ checked: isChecked }">
      <zc-icon v-if="isChecked" color="#fff" size="10">
        <IconChecked></IconChecked>
      </zc-icon>
    </span>
    <slot v-if="$slots.default"></slot>
    <span v-else class="checkbox-label">{{ label }}</span>
  </div>
</template>

<style lang="scss">
.zc-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--main-font-color);
  transition: all 0.2s ease;
  outline: none;
  
  * {
    cursor: pointer;
  }
  
  &:hover:not(.disabled) {
    .checkbox {
      border-color: var(--main-color);
    }
  }
  
  &.is-focused:not(.disabled) {
    .checkbox {
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
    .checkbox {
      &.checked {
        background-color: var(--main-font-color);
        border-color: var(--main-font-color);
      }
    }
  }
  
  input {
    display: none;
  }
  
  .checkbox {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    border-radius: 2px;
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
    }
  }
  
  .checkbox-label {
    font-size: 16px;
    font-family: var(--main-font-family);
    user-select: none;
  }
  
  &.error {
    .checkbox {
      border-color: var(--main-danger-color);
    }
    color: var(--main-danger-color);
  }
}
</style>
