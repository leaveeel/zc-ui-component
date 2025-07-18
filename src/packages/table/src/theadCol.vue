<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcTheadCol'
})
</script>

<script lang="ts" setup>
import { provide } from 'vue';

const props = defineProps<{
  colIndex: number
  rowIndex?: number
  head?: boolean
  row?: any
}>()

provide('thead', props.head)
provide('colIndex', props.colIndex)
provide('rowIndex', props.rowIndex)
provide('row', props.row)
</script>

<template>
  <slot></slot>
</template>