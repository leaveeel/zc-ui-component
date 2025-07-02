<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcCheckbox'
})
</script>

<script lang="ts" setup>
import { zcUIProps } from '@/types/zcUI'
import { inject, computed, ref, Ref } from 'vue'
import IconChecked from '@/packages/icon/src/IconChecked.vue'
import zcIcon from '@/packages/icon/index.vue'

const props = withDefaults(defineProps<zcUIProps.Checkbox>(), {
  modelValue: false,
  label: '',
  value: undefined,
  disabled: undefined
})
const propsDisabled = props.disabled ? computed(() => props.disabled) : inject('fieldDisabled', ref(false))

const propsModelValue = inject('fieldModelValue', undefined) as undefined | Ref<boolean | (string | number)[]>

const emits = defineEmits(['update:modelValue', 'change'])

const change = inject<(() => void) | undefined>('change', undefined)
const errorMsg = ref(inject('errorMsg', ''))

const checkboxGroup = inject('emits' , undefined) as ((event: string, ...args: any[]) => void) | undefined
const isGroup = computed(() => propsModelValue !== undefined)
const isFocused = ref(false)

const model = computed({
  get() {
    return isGroup.value ? propsModelValue!.value : (props.value || props.value === 0) ? props.value === props.modelValue :props.modelValue
  },
  set(val: boolean | (string | number)[]) {
    if (isGroup.value) {
      change?.()
      checkboxGroup && checkboxGroup('change', val as (string | number)[])
      checkboxGroup && checkboxGroup('update:modelValue', val as (string | number)[])
    } else {
      let v
      if(props.value || props.value === 0) {
        v = val ? props.value : ''
      }else {
        v = val
      }
      change?.()
      emits('update:modelValue', v)
      emits('change', v)
    }
  }
})

const isChecked = computed(() => {
  if (isGroup.value) {
    const v = model.value as (string | number)[] || []
    return v.includes((props.value || props.value === 0) ? props.value : props.label)
  } else {
    return model.value as boolean
  }
})

const toggle = () => {
  if (propsDisabled.value) return
  if (isGroup.value) {
    const list = model.value as (string | number)[] || []
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
      'is-focused': isFocused,
      error: errorMsg
    }"
    tabindex="0"
    role="checkbox"
    @keydown="handleKeyDown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <input type="checkbox" :checked="isChecked" :disabled="propsDisabled" />
    <span class="checkbox" :class="{ checked: isChecked || indeterminate }">
      <zc-icon v-if="isChecked || indeterminate" color="#fff" size="10">
        <IconChecked v-if="!indeterminate"></IconChecked>
        <i class="half-checked" v-else></i>
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
  
  &.error {
    color: var(--main-danger-color);
    .radio {
      border-color: var(--main-danger-color);
    }
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
    margin-right: 6px;
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
      .half-checked {
        background-color: #fff;
        width: 8px;
        height: 2px;
        display: block;
      }
    }
  }
  
  .checkbox-label {
    font-size: 16px;
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
