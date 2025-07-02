<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'zcInput'
})
</script>

<script lang="ts" setup>
import zcIcon from '@/packages/icon/index.vue'
import IconClose from '@/packages/icon/src/IconClose.vue'
import IconHide from '@/packages/icon/src/IconHide.vue'
import IconShow from '@/packages/icon/src/IconShow.vue'
import { zcUIProps } from '@/types/zcUI'
import { setUnit } from '@/utils/common'
import { computed, defineProps, inject, nextTick, ref, useAttrs, watch } from 'vue'

// 定义props
const props = withDefaults(defineProps<zcUIProps.Input>(), {
  modelValue: '',
  height: '40px',
  type: 'text',
  clearable: false,
  placeholder: '',
  maxlength: undefined,
  resize: false,
  autocomplete: 'off',
  disabled: undefined,
  min: undefined,
  max: undefined,
})
const propsDisabled = props.disabled === undefined ? inject('fieldDisabled', ref(false)) : computed(() => props.disabled)

// 定义事件
const emit = defineEmits<{
  'update:modelValue': [value: string | number],
  input: [value: string | number],
  blur: [value: Event],
  focus: [value: Event],
  clear: [],
}>()

// 获取透传的属性
const attrs = useAttrs()

// refs
const inputRef = ref<HTMLInputElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// 注入的值
const id = inject('id', undefined)
const errorMsg = ref(inject('errorMsg', ''))
const blur = inject<(() => void) | undefined>('blur', undefined)
const change = inject<(() => void) | undefined>('change', undefined)

// 响应式状态
const inputType = ref(props.type)
const isPasswordVisible = ref(false)

// 计算属性
const isTextarea = computed(() => props.type === 'textarea')
const showClear = computed(() => 
  props.clearable && 
  !propsDisabled.value && 
  props.modelValue && 
  props.modelValue.toString().length > 0
)
const showTogglePassword = computed(() => 
  props.type === 'password' && 
  props.modelValue && 
  props.modelValue.toString().length > 0
)

// 方法
const clearInput = (e?: MouseEvent) => {
  emit('update:modelValue', '')
  emit('input', '')
  emit('clear')
  
  nextTick(() => {
    const target = isTextarea.value ? textareaRef.value : inputRef.value
    target?.focus()
  })
}

const togglePasswordVisibility = (e?: MouseEvent) => {
  isPasswordVisible.value = !isPasswordVisible.value
  inputType.value = isPasswordVisible.value ? 'text' : 'password'
}

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement | null
  if (!target) return
  if (props.type === 'number') {
    const reg = /^(-\d+|\d+)\.?\d*?$/g

    if (target.value && !reg.test(target.value)) {
      target.value = props.modelValue.toString()
      return
    }

    emit('update:modelValue', Number(target.value))
    emit('input', Number(target.value))
    change?.()
  }else {
    emit('update:modelValue', target.value)
    emit('input', target.value)
    change?.()
  }
}
const prevent = ref(false)

const focus = ref(false)
const handleBlur = (e: FocusEvent) => {
  if(prevent.value) return
  focus.value = false

  const target = ref(props.modelValue?.toString())

  if (props.type === 'number' && target.value) {
    if(!(props.min !== undefined && props.max !== undefined && props.min >= props.max)) {
      if (props.min !== undefined && Number(target.value) < props.min) {
        target.value = props.min.toString()
      }
      if (props.max !== undefined && Number(target.value) > props.max) {
        target.value = props.max.toString()
      }
    }

    emit('update:modelValue', Number(target.value))
    emit('input', target.value)
    change?.()
  }
  
  blur?.()
  emit('blur', e)
}

const handleFocus = (e: FocusEvent) => {
  focus.value = true
  emit('focus', e)
}

const adjustTextareaHeight = () => {
  if (!isTextarea.value || !textareaRef.value || !props.resize) return

  textareaRef.value.style.height = '100%'
  textareaRef.value.style.height = `${ textareaRef.value.scrollHeight }px`
}

if (isTextarea.value) {
  nextTick(() => {
    textareaRef.value!.style.height = '100%'
  })
}

// 监听器
watch(() => props.modelValue, (n,o) => {
  if (isTextarea.value && props.resize) {
    nextTick(adjustTextareaHeight)
  }
})

const handleClick = (e: MouseEvent) => {
  if(prevent.value) return prevent.value = false
  prevent.value = true
  const target = isTextarea.value ? textareaRef.value : inputRef.value
  target?.focus()
}

const input = (value: string) => {
  const target = isTextarea.value ? textareaRef.value : inputRef.value
  if (!target) return
  emit('update:modelValue', value)
  target.value = value
}

defineExpose({
  input,
})
</script>

<template>
  <div 
    class="zc-input zc-ui-component" 
    :style="{'--height': setUnit(height)}"
    :class="[
      { 
        'is-disabled': propsDisabled,
        'is-textarea': isTextarea
      }
    ]"
  >
    <div class="input-container" :class="{ error: errorMsg, focus: focus }">
      <textarea
        v-if="isTextarea"
        ref="textareaRef"
        :id="id"
        v-bind="attrs"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="propsDisabled"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        :style="{  '--resize': props.resize ? 'auto' : 'none' }"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      ></textarea>

      <input
        v-else
        ref="inputRef"
        :id="id"
        v-bind="attrs"
        :type="inputType !== 'number' ? inputType : 'text'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="propsDisabled"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <div
        v-if="showClear || showTogglePassword"
        class="input-buttons"
        @mousedown="handleClick"
        @mouseup="handleClick"
      >
        <zc-icon
          v-if="showClear"
          :size="16"
          @click="clearInput"
        >
          <IconClose />
        </zc-icon>
        <template v-if="showTogglePassword">
          <zc-icon
            v-if="isPasswordVisible"
            :size="16"
            @click="togglePasswordVisibility"
          >
            <IconShow />
          </zc-icon>
          <zc-icon
            v-else
            :size="16"
            @click="togglePasswordVisibility"
          >
            <IconHide />
          </zc-icon>
        </template>
      </div>
    </div>
    <p class="tip" :class="{ error: errorMsg }" v-if="tip">
      {{ tip }}
    </p>
  </div>
</template>

<style lang="scss">
.zc-input {
  width: 100%;
  height: var(--height);
  position: relative;
  display: grid;
  grid-template-rows: auto;
  .input-container {
    position: relative;
    background: #ffffff;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    cursor: text;
    height: 100%;
    &:hover:not(:disabled) {
      border-color: var(--main-color);
    }
    
    &.focus {
      border-color: var(--main-color);
      box-shadow: 0 0 0 2px rgba(var(--main-color-rgb, 0, 120, 212), 0.1);
    }

    &.error {
      border-color: var(--main-danger-color);
    }
  }

  .input-buttons {
    display: flex;
    align-items: center;
    gap: 4px;
    padding-right: 10px;

    .zc-icon {
      cursor: pointer;
      transition: color 0.2s ease;
      &:hover {
        color: var(--main-color);
      }
    }
  }

  .tip {
    font-size: 12px;
    font-family: inherit;
    color: #999999;
    line-height: 10px;
    margin-top: 8px;
    transition: color 0.2s ease;

    &.error {
      color: var(--main-danger-color);
    }
  }

  input, textarea {
    width: 100%;
    height: 100%;
    padding: 10px;
    outline: none;
    color: var(--main-font-color);
    transition: all 0.2s ease;
    border:none;
    font-family: inherit;
    &:disabled {
      background-color: #f5f7fa;
      cursor: not-allowed;
      color: #c0c4cc;
    }
    
    &::placeholder {
      color: #999999;
    }
  }
  
  textarea {
    min-height: 80px;
    resize: var(--resize);
  }

  
  &.is-disabled {
    opacity: 0.7;
  }
  
}
</style>
