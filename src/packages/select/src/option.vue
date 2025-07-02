<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'zcOption'
})
</script>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import zcIcon from '@/packages/icon/index.vue'
import IconChecked from '@/packages/icon/src/IconChecked.vue'
import { zcUIProps } from '@/types/zcUI'

const props = withDefaults(defineProps<zcUIProps.SelectOption>(), {
  disabled: false
})

interface SelectContext {
  modelValue: { value: string | number | (string | number)[] }
  multiple: boolean
  handleOptionClick: (value: string | number, label: string) => void
}

const select = inject<SelectContext>('select')

// 计算选项是否被选中
const isSelected = computed(() => {
  if (!select) return false
  
  if (Array.isArray(select.modelValue.value)) {
    return select.modelValue.value.includes(props.value!)
  }
  return select.modelValue.value === props.value
})

// 处理选项点击
const handleClick = () => {
  if (props.disabled) return
  select?.handleOptionClick(props.value!, props.label || '')
}
</script>

<template>
  <div 
    class="zc-select-option"
    :class="{
      'is-selected': isSelected,
      'is-disabled': disabled
    }"
    @click="handleClick"
  >
    {{ label }}
    <template v-if="select?.multiple">
      <zcIcon 
        class="zc-select-option__check"
        v-if="isSelected"
        :size="12"
        color="var(--main-color)"
      >
        <IconChecked />
      </zcIcon>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.zc-select-option {
  position: relative;
  padding: 4px 12px;
  height: 36px;
  font-size: 14px;
  color: var(--main-font-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover {
    background-color: #f5f7fa;
  }
  
  &.is-selected {
    color: var(--main-color);
    font-weight: bold;
    background-color: #f5f7fa;
  }
  
  &.is-disabled {
    color: #c0c4cc;
    cursor: not-allowed;
    
    &:hover {
      background-color: transparent;
    }
  }
  
}
</style> 