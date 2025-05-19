<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcCheckboxGroup'
})
</script>

<script lang="ts" setup>
import { zcUIProps } from '@/types/zcUI'
import { provide } from 'vue'
import { setUnit } from '@/utils/common'
const props = withDefaults(defineProps<zcUIProps.CheckboxGroup>(), {
  direction: 'vertical',
  gap: '8px'
})

const emits = defineEmits<{
  'update:modelValue': [value: (string | number)[]],
  change: [value: (string | number)[]]
}>()

provide('checkboxGroup', {
  props,
  emit: emits
})
</script>

<template>
  <div class="zc-checkboxGroup zc-ui-component" 
    :class="{ 
      'is-horizontal': direction === 'horizontal',
      'is-vertical': direction === 'vertical'
    }"
    :style="{ 
      '--gap': setUnit(gap)
    }"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
.zc-checkboxGroup {
  display: flex;
  gap: var(--gap);
  
  &.is-vertical {
    flex-direction: column;
  }
  
  &.is-horizontal {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
