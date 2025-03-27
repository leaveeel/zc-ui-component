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
  type: 'text',
  clearable: false,
  placeholder: '',
  maxLength: undefined,
  size: 'default',
  resize: false,
  autocomplete: 'off',
  height: '40px',
  disabled: undefined
})
const propsDisabled = props.disabled === undefined ? inject('fieldDisabled', ref(false)) : computed(() => props.disabled)

// 定义事件
const emit = defineEmits<{
  'update:modelValue': [value: string],
  input: [value: string],
  blur: [value: string],
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
  props.modelValue.length > 0
)
const showTogglePassword = computed(() => 
  props.type === 'password' && 
  props.modelValue && 
  props.modelValue.length > 0
)

// 方法
const clearInput = (e?: MouseEvent) => {
  e?.preventDefault()

  emit('update:modelValue', '')
  emit('input', '')
  emit('clear')
  
  nextTick(() => {
    const target = isTextarea.value ? textareaRef.value : inputRef.value
    target?.focus()
  })
}

const togglePasswordVisibility = (e?: MouseEvent) => {
  e?.preventDefault()

  isPasswordVisible.value = !isPasswordVisible.value
  inputType.value = isPasswordVisible.value ? 'text' : 'password'
}

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement | null
  if (!target) return
  const value = target.value
  emit('update:modelValue', value)
  emit('input', value)
  change?.()
}

const focus = ref(false)
const handleBlur = (e: FocusEvent) => {
  focus.value = false
  blur?.()
  const target = e.target as HTMLInputElement | HTMLTextAreaElement
  emit('blur', target.value)
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
watch(() => props.modelValue, () => {
  if (isTextarea.value && props.resize) {
    nextTick(adjustTextareaHeight)
  }
})

const handleClick = (e: MouseEvent) => {
  e?.preventDefault()
  nextTick(() => {
    const target = isTextarea.value ? textareaRef.value : inputRef.value
    target?.focus()
  })
}
</script>

<template>
  <div 
    class="zc-input zc-ui-component" 
    :class="[
      { 
        'is-disabled': propsDisabled,
        'has-error': errorMsg,
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
        :maxlength="maxLength"
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
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="propsDisabled"
        :maxlength="maxLength"
        :autocomplete="autocomplete"
        :style="{ height: setUnit(height) }"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <div
        v-if="showClear || showTogglePassword"
        class="input-buttons"
        @mousedown.stop="handleClick"
      >
        <zc-icon
          v-if="showClear"
          :size="16"
          @mousedown.stop="clearInput"
        >
          <IconClose />
        </zc-icon>
        <template v-if="showTogglePassword">
          <zc-icon
            v-if="isPasswordVisible"
            :size="16"
            @mousedown="togglePasswordVisibility"
          >
            <IconShow />
          </zc-icon>
          <zc-icon
            v-else
            :size="16"
            @mousedown.stop="togglePasswordVisibility"
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
  height: 100%;
  position: relative;
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

  &.has-error {
    .input-container {
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
    font-family: var(--main-font-family);
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
    padding: 10px;
    outline: none;
    color: var(--main-font-color);
    transition: all 0.2s ease;
    border:none;
    
    &:disabled {
      background-color: #f5f7fa;
      cursor: not-allowed;
      color: #c0c4cc;
    }
  }
  
  textarea {
    min-height: 80px;
    resize: var(--resize);
  }

  &::placeholder {
    color: #dcdcdc;
  }
  
  &.is-disabled {
    opacity: 0.7;
  }
  
}
</style>
