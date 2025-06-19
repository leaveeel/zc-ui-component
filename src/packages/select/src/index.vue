<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcSelect'
})
</script>

<script lang="ts" setup>
import { zcUI, zcUIProps } from '@/types/zcUI'
import { defineProps, defineEmits, ref, computed, nextTick, onMounted, onUnmounted, provide, inject  } from 'vue'
import zcIcon from '@/packages/icon/index.vue'
import IconRightArrow from '@/packages/icon/src/IconRightArrow.vue'
import IconClose from '@/packages/icon/src/IconClose.vue'
import zcScroll from '@/packages/scroll/src/index.vue'
import zcOption from '@/packages/select/src/option.vue'
import { setUnit } from '@/utils/common'

const props = withDefaults(defineProps<zcUIProps.Select>(), {
  placeholder: '请选择',
  clearable: false,
  disabled: false,
  filterable: false,
  valueKey: 'value',
  labelKey: 'label',
  multiple: false,
  collapseTags: false,
  maxCollapseTags: 1,
  height: '40px'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[]]
  'change': [value: string | number | (string | number)[]]
  'clear': []
}>()

const slots = defineSlots()

// 下拉框显示状态
const visible = ref(false)
// 选择器容器引用
const selectRef = ref<HTMLElement | null>(null)
// 输入框引用
const inputRef = ref<HTMLElement | null>(null)

// 注入的值
const id = inject('id', undefined)
const errorMsg = ref(inject('errorMsg', ''))
const change = inject<(() => void) | undefined>('change', undefined)


const setOptions = computed(() => {
  if(slots.default && slots.default()) {
    const child = slots.default()
    return child.map((i: any) => ({
      ...i.props,
      disabled: i.props.disabled || i.props.disabled === ''
    }))
  }else {
    return props.options
  }
})


// 搜索关键字
const keyword = ref('')
const setPlaceholder = ref()
// 计算显示的标签文本
const inputValue = computed(() => {
  if(props.multiple) {
    return keyword.value
  }else {
    const label = setOptions.value.find((i: any) => i.value === props.modelValue)?.label
    setPlaceholder.value = label || props.placeholder
    if(visible.value && props.filterable) {
      return ''
    }
    return label
  }
})

// 处理选项点击
const handleOptionClick = (value: string | number, label: string) => {
  if (props.multiple) {
    const newValue = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = newValue.indexOf(value)
    
    if (index > -1) {
      newValue.splice(index, 1)
    } else {
      newValue.push(value)
    }
    
    emit('update:modelValue', newValue)
    emit('change', newValue)
    change?.()
    
    if (props.filterable) {
      inputRef.value?.focus()
    }
  } else {
    emit('update:modelValue', value)
    emit('change', value)
    change?.()
    closeDropdown()
  }
}


// 注入选择器上下文
provide('select', {
  modelValue: computed(() => props.modelValue),
  multiple: props.multiple,
  handleOptionClick,
})

// 处理标签删除
const handleTagClose = (event: Event, value: string | number) => {
  event.stopPropagation()
  
  if (props.disabled) return
  
  const newValue = (Array.isArray(props.modelValue) ? props.modelValue : []).filter(v => v !== value)
  
  emit('update:modelValue', newValue)
  emit('change', newValue)
  change?.()
}

// 处理清空
const handleClear = (event: Event) => {
  event.stopPropagation()
  emit('update:modelValue', props.multiple ? [] : '')
  emit('clear')
  change?.()
  closeDropdown()
}

// 处理输入框点击
const handleInputClick = () => {
  if (props.disabled) return
  toggleDropdown()
}

// 处理输入框键入
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  keyword.value = target.value
  if(!visible.value) {
    toggleDropdown()
  }
}

// 处理文档点击
const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

// 切换下拉框显示状态
const toggleDropdown = () => {
  if (props.disabled) return
  
  visible.value = !visible.value
  if (visible.value && props.filterable) {
    nextTick(() => {
      keyword.value = ''
      inputRef.value?.focus()
    })
  }
}

// 关闭下拉框
const closeDropdown = () => {
  keyword.value = ''
  visible.value = false
}

// 监听点击事件
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div 
    class="zc-select" 
    :class="[
      {
        'is-disabled': disabled,
        'is-focus': visible
      }
    ]"
    ref="selectRef"
  >
    <div 
      class="zc-select__input" 
      @click.stop="handleInputClick"
      :class="{ 
        error: errorMsg,
        'is-focus': visible
      }"
    >
      <template v-if="multiple && Array.isArray(modelValue) && modelValue.length ">
        <template v-if="collapseTags">
          <span 
            v-for="option in modelValue.slice(0, maxCollapseTags)"
            :key="option"
            class="zc-select__tag"
          >
            {{ setOptions.find((i: any) => i.value === option)?.label }}
            <zcIcon 
              @click="handleTagClose($event, option)"
              size="14"
            >
              <IconClose />
            </zcIcon>
          </span>
          <span 
            v-if="modelValue.length > maxCollapseTags"
            class="zc-select__tag is-more"
          >
            +{{ modelValue.length - maxCollapseTags }}
          </span>
        </template>
        <template v-else>
          <span 
            v-for="option in modelValue"
            :key="option"
            class="zc-select__tag"
          >
            {{ setOptions.find((i: any) => i.value === option)?.label }}
            <zcIcon 
              @click="handleTagClose($event, option)"
              size="14"
            >
              <IconClose />
            </zcIcon>
          </span>
        </template>
      </template>

      <input
        ref="inputRef"
        :class="{
          'is-filterable': filterable,
          'has-tags': multiple && Array.isArray(modelValue) && modelValue.length
        }"
        :id="id"
        :placeholder="multiple && Array.isArray(modelValue) && modelValue.length ? '' : placeholder"
        :disabled="disabled"
        :readonly="!filterable"
        :value="inputValue"
        @input="handleInput"
      />
      
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

    <transition name="zc-select-dropdown">
      <div class="zc-select__dropdown" v-show="visible">
        <zc-scroll max-height="240px">
          <template v-for="option in setOptions" :key="option.value">
            <zc-option
              v-if="setOptions.find((i: any) => i.value === option.value)?.label.toString().toLowerCase().includes(keyword.toLowerCase())"
              :value="option.value" 
              :label="option.label" 
              :disabled="option.disabled"
            />
          </template>
          <div 
            v-if="keyword && !setOptions.find((i: any) => i.value === keyword)"
            class="zc-select__empty"
          >
            无匹配数据
          </div>
        </zc-scroll>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.zc-select {
  width: 100%;
  min-height: 40px;
  position: relative;
  
  .zc-select__tag {
    height: 24px;
    padding: 0 6px;
    font-size: 13px;
  }
  
  &__input {
    width: 100%;
    height: 100%;
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

    input {
      flex: 1;
      padding: 0;
      font-size: inherit;
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
      
      &.is-filterable {
        cursor: text;
      }

      &.has-tags {
        flex: 0;
        width: 80px;
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
    color: #606266;
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
  
  &__dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 100%;
    overflow: hidden;
    padding: 4px 0;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    z-index: 1000;
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

// 下拉框动画
.zc-select-dropdown-enter-active,
.zc-select-dropdown-leave-active {
  transition: all 0.2s;
}

.zc-select-dropdown-enter-from,
.zc-select-dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: center top;
}
</style>