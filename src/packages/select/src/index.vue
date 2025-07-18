<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'zcSelect'
})
</script>

<script lang="ts" setup>
import { zcUIProps } from '@/types/zcUI'
import { defineProps, defineEmits, ref, computed, nextTick, provide, inject } from 'vue'
import zcIcon from '@/packages/icon/index.vue'
import IconRightArrow from '@/packages/icon/src/IconRightArrow.vue'
import IconClose from '@/packages/icon/src/IconClose.vue'
import zcOption from '@/packages/select/src/option.vue'
import Popup from '@/packages/component/Popup.vue'

const props = withDefaults(defineProps<zcUIProps.Select>(), {
  placeholder: '请选择',
  clearable: false,
  disabled: false,
  filterable: false,
  multiple: false,
  collapseTags: false,
  maxCollapseTags: 1,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[]]
  'change': [value: string | number | (string | number)[]]
  'clear': []
}>()

const slots = defineSlots()

const visible = ref(false)
const selectRef = ref<HTMLElement>()
const inputRef = ref<HTMLElement>()

const id = inject('id', undefined)
const errorMsg = inject('errorMsg', '')
const change = inject<(() => void) | undefined>('change', undefined)

const popup = ref()

// 关闭下拉框
const closeDropdown = () => {
  keyword.value = ''
  visible.value = false
  popup.value.hidePopup()
}

// 统一处理 options 来源
const optionsList = computed(() => {
  if (slots.default && slots.default()) {
    let options: any = []
    slots.default().forEach((i: any) => {
      if(i.children) {
        options = options.concat(i.children.map((n: any) => (
          {
            ...n.props,
            disabled: n.props?.disabled || n.props?.disabled === ''
          }
        )))
      }else {
        options.push({
          ...i.props,
          disabled: i.props?.disabled || i.props?.disabled === ''
        })
      }
    })
    return options
  }
  return props.options
})

const keyword = inject('keyword', ref(''))

// 计算输入框显示内容
const inputValue = computed(() => {
  if (props.multiple) return keyword.value
  if (visible.value && props.filterable) return ''
  const option = optionsList.value?.find((i: any) => i.value === props.modelValue)
  return option?.label || ''
})

// 选项点击
const handleOptionClick = (value: string | number, label: string) => {
  if (props.multiple) {
    const newValue = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const idx = newValue.indexOf(value)
    if (idx > -1) newValue.splice(idx, 1)
    else newValue.push(value)
    emit('update:modelValue', newValue)
    emit('change', newValue)
    change?.()
    if (props.filterable) nextTick(() => inputRef.value?.focus())
  } else {
    if(value === props.modelValue) return
    emit('update:modelValue', value)
    emit('change', value)
    change?.()
    closeDropdown()
  }
}

provide('select', {
  modelValue: computed(() => props.modelValue),
  multiple: props.multiple,
  handleOptionClick,
})

// 标签删除
const handleTagClose = (event: Event, value: string | number) => {
  event.stopPropagation()
  if (props.disabled) return
  const newValue = (Array.isArray(props.modelValue) ? props.modelValue : []).filter(v => v !== value)
  emit('update:modelValue', newValue)
  emit('change', newValue)
  change?.()
}

// 清空
const handleClear = (event: Event) => {
  event.stopPropagation()
  emit('update:modelValue', props.multiple ? [] : '')
  emit('clear')
  change?.()
  closeDropdown()
}

// 输入框点击
const handleInputClick = () => {
  if (!props.disabled) toggleDropdown()
}

// 输入事件
const handleInput = (event: Event) => {
  keyword.value = (event.target as HTMLInputElement).value
  if (!visible.value) toggleDropdown()
}

// 切换下拉
const toggleDropdown = () => {
  if (props.disabled) return
  if (visible.value && props.filterable) nextTick(() => {
    keyword.value = ''
    inputRef.value?.focus()
  })
}
</script>

<template>
  <div 
    class="zc-select" 
    :class="['zc-select', { 'is-disabled': disabled, 'is-focus': visible }]"
    ref="selectRef"
  >
    <Popup maxHeight="240px" trigger="click" :showArrow="false" width="target" ref="popup">
      <template #reference>
        <div 
          class="zc-select__input" 
          @click="handleInputClick"
          :class="{ error: errorMsg, 'is-focus': visible }"
        >
          <template v-if="multiple && Array.isArray(modelValue) && modelValue.length">
            <template v-if="collapseTags">
              <span 
                v-for="option in modelValue.slice(0, maxCollapseTags)"
                :key="option"
                class="zc-select__tag"
              >
                {{ optionsList.find((i: any) => i.value === option)?.label }}
                <zcIcon @click="handleTagClose($event, option)" size="14">
                  <IconClose />
                </zcIcon>
              </span>
              <span v-if="modelValue.length > maxCollapseTags" class="zc-select__tag is-more">
                +{{ modelValue.length - maxCollapseTags }}
              </span>
            </template>
            <template v-else>
              <span 
                v-for="option in modelValue"
                :key="option"
                class="zc-select__tag"
              >
                {{ optionsList.find((i: any) => i.value === option)?.label }}
                <zcIcon @click="handleTagClose($event, option)" size="14">
                  <IconClose />
                </zcIcon>
              </span>
            </template>
          </template>
          <div class="zc-select__input-container"
              :class="{
                'is-filterable': filterable,
                'has-tags': multiple && Array.isArray(modelValue) && modelValue.length
              }">
            <input
              ref="inputRef"
              v-if="!(multiple && Array.isArray(modelValue) && modelValue.length) ||filterable"
              :id="id"
              :placeholder="multiple && Array.isArray(modelValue) && modelValue.length ? '' : placeholder"
              :disabled="disabled"
              :readonly="!filterable"
              :value="inputValue"
              @input="handleInput"
            />
          </div>
          <div class="zc-select__suffix">
            <zcIcon 
              v-if="clearable && ((multiple && Array.isArray(modelValue)) ? modelValue.length : modelValue) && !disabled"
              class="zc-select__clear"
              size="20"
              @click="handleClear"
            >
              <IconClose />
            </zcIcon>
            <zcIcon 
              class="zc-select__arrow"
              size="20"
              :rotate="visible ? 270 : 90"
            >
              <IconRightArrow />
            </zcIcon>
          </div>
        </div>
      </template>

      <slot name="tree" :close="closeDropdown" />
      <template v-if="!slots.tree">
        <template v-for="option in optionsList" :key="option.value">
          <zc-option
            v-if="option.label?.toString().toLowerCase().includes(keyword.toLowerCase())"
            :value="option.value" 
            :label="option.label" 
            :disabled="option.disabled"
          />
        </template>
        <div 
          v-if="keyword && !optionsList.find((i: any) => i.label?.toString().toLowerCase().includes(keyword.toLowerCase()))"
          class="zc-select__empty"
        >
          无匹配数据
        </div>
      </template>
    </Popup>
  </div>
</template>

<style lang="scss" scoped>
.zc-select {
  width: 100%;
  position: relative;
  
  .zc-select__tag {
    height: 24px;
    padding: 0 6px;
    font-size: 13px;
  }
  
  &__input {
    width: 100%;
    height: 100%;
    min-height: 40px;
    position: relative;
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    align-items: center;
    padding: 5px 30px 5px 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background-color: #fff;
    transition: all 0.2s;
    cursor: pointer;

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

    .zc-select__input-container {
      height: 100%;
      flex: 1;
      display: flex;
      input {
        height: 100%;
        width: 100%;
        padding: 0;
        color: var(--main-font-color);
        cursor: inherit;
        outline: none;
        border: none;
        background: none;
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
      &.is-filterable {
        cursor: text;
      }
      &.has-tags {
        min-width: 80px;
      }
    }
  }

  &.is-disabled {
    opacity: 0.7;
  }
  
  &__tag {
    display: inline-flex;
    align-items: center;
    border-radius: 2px;
    background-color: #f0f2f5;
    color: var(--main-font-color);
    white-space: nowrap;
    
    &.is-more {
      color: #909399;
    }
  }
  
  
  &__suffix {
    position: absolute;
    right: 8px;
    display: flex;
    align-items: center;
  }
  
  &__clear {
    color: #c0c4cc;
    cursor: pointer;
    
    &:hover {
      color: #909399;
    }
  }
  
  &__arrow {
    color: #c0c4cc;
  }
  
  
  &__empty {
    padding: 8px 12px;
    color: #909399;
    text-align: center;
  }
  
  &.is-disabled {
    .zc-select__input {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      cursor: not-allowed;
      
      input {
        cursor: not-allowed;
        color: #c0c4cc;
      }
      
      .zc-select__tag {
        opacity: 0.7;
        
        .zc-select__tag-close {
          cursor: not-allowed;
          
          &:hover {
            color: #909399;
          }
        }
      }
    }
  }
}
</style>