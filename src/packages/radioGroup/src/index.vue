<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcRadioGroup'
})
</script>

<script lang="ts" setup>
import { zcUI } from '@/types/zcUI'
import Group from '@/packages/component/group.vue'
import { provide } from 'vue'


const props = withDefaults(defineProps<zcUI.Group>(), {
  align: 'left',
  inline: false,
  vertical: false,
  gap: 10,
  disabled: false
})

const emits = defineEmits(['update:modelValue', 'change'])
provide('emits', emits)
</script>

<template>
  <Group v-bind="props" name="radioGroup">
    <slot></slot>
  </Group>
</template>