<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'zcInput'
})
</script>

<script lang="ts" setup>
import { zcUIProps } from '@/types/zcUI'
import { defineProps, ref, inject, computed, watch, nextTick, useAttrs } from 'vue'
import IconClose from '@/packages/icon/src/IconClose.vue'
import zcIcon from '@/packages/icon/index.vue'
import { setUnit } from '@/utils/common'
import { debounce } from 'lodash-es'

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
  e?.stopPropagation()
  
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
  e?.stopPropagation()
  
  isPasswordVisible.value = !isPasswordVisible.value
  inputType.value = isPasswordVisible.value ? 'text' : 'password'
  
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement | null
  if (!target) return
  const value = target.value
  emit('update:modelValue', value)
  emit('input', value)
}

const handleBlur = (e: FocusEvent) => {
  blur?.()
  const target = e.target as HTMLInputElement | HTMLTextAreaElement
  emit('blur', target.value)
}

const handleFocus = (e: FocusEvent) => {
  emit('focus', e)
}

const adjustTextareaHeight = () => {
  if (!isTextarea.value || !textareaRef.value || !props.resize) return
  
  textareaRef.value.style.height = '100%'
  textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
}

if(isTextarea.value) {
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
    <template v-if="isTextarea">
      <textarea
        ref="textareaRef"
        :id="id"
        :class="{ error: errorMsg }"
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
    </template>
    <template v-else>
      <div class="input-container">
        <input
          ref="inputRef"
          :id="id"
          :class="{ error: errorMsg }"
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
        <div class="input-buttons" v-if="showClear || showTogglePassword">
          <zc-icon 
            v-if="showClear" 
            class="clear-icon" 
            :size="16" 
            color="#999" 
            @mousedown.stop="clearInput"
          >
            <IconClose />
          </zc-icon>
          <div 
            v-if="showTogglePassword" 
            class="password-toggle" 
            @mousedown.stop="togglePasswordVisibility"
          >
            {{ isPasswordVisible ? 'Hide' : 'Show' }}
          </div>
        </div>
      </div>
    </template>
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
  }
  .input-buttons {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    
    .clear-icon {
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s ease;
      
      &:hover {
        opacity: 1;
      }
    }
    
    .password-toggle {
      cursor: pointer;
      font-size: 12px;
      color: #999;
      transition: color 0.2s ease;
      
      &:hover {
        color: var(--main-color);
      }
    }
  }
  
  &.is-textarea {
    .input-buttons {
      top: 12px;
      transform: none;
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
    box-sizing: border-box;
    padding: 12px;
    border-radius: 4px;
    outline: none;
    background: #ffffff;
    border: 1px solid #e4e4e4;
    color: var(--main-font-color);
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
      border-color: #c0c4cc;
    }
    
    &:focus {
      border-color: var(--main-color);
      box-shadow: 0 0 0 2px rgba(var(--main-color-rgb, 0, 120, 212), 0.1);
    }

    &.error {
      border-color: var(--main-danger-color);
    }
    
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
  
  &.has-error {
    input, textarea {
      border-color: var(--main-danger-color);
    }
  }
}
</style>
