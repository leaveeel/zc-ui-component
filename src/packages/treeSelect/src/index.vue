<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'zcTreeSelect'
})
</script>

<script lang="ts" setup>
import { zcUIProps,zcUI } from '@/types/zcUI'
import { ref, inject, provide, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import ZcSelect from '@/packages/select/src/index.vue'
import ZcTree from '@/packages/tree/src/index.vue'

const props = withDefaults(defineProps<zcUIProps.TreeSelect>(), {
  placeholder: '请选择',
  clearable: false,
  disabled: false,
  filterable: false,
  multiple: false,
  collapseTags: false,
  maxCollapseTags: 1,
  props: () => ({ label: 'label', children: 'children' }),
  nodeKey: 'value',
})

const change = inject<(() => void) | undefined>('change', undefined)

const emit = defineEmits(['update:modelValue', 'change', 'clear'])

const options = ref<zcUIProps.SelectOption[]>([])
function setTreeToArray(data?: zcUI.TreeNode[]) {
  const arr = data || props.data
  if (!arr) return
  for (const item of arr) {
    options.value.push({
      label: item[props.props.label],
      value: item[props.nodeKey]
    })
    if (item[props.props.children]) {
      setTreeToArray(item[props.props.children])
    }
  }
}

onMounted(() => {
  setTreeToArray()
})
const dataWatch = watch(() => props.data, () => {
  setTreeToArray()
})

onBeforeUnmount(() => {
  dataWatch()
})

const innerValue = computed({
  get: () => props.multiple
    ? Array.isArray(props.modelValue) ? props.modelValue : []
    : !Array.isArray(props.modelValue) ? props.modelValue : '',
  set: (node: zcUI.TreeNode | '') => {
    const newVal = node !== '' ? node[props.nodeKey] : ''
    if (props.multiple) {
      let arr = Array.isArray(innerValue.value) ? [...innerValue.value] : []
      if (newVal === '') {
        arr = []
        emit('clear')
      } else {
        const idx = arr.indexOf(newVal)
        if (idx > -1) {
          arr.splice(idx, 1)
        } else {
          arr.push(newVal)
        }
        emit('change', arr, node)
      }
      emit('update:modelValue', arr)
      change?.()
    } else {
      if (newVal === '') {
        emit('clear')
      } else {
        emit('change', newVal, node)
      }
      emit('update:modelValue', newVal)
      change?.()
    }
  }
})

const handleChange = (newValue: any) => {
  emit('update:modelValue', newValue)
  emit('change', newValue)
  treeRef.value?.updateSelectedNodes(newValue)
  change?.()
}

const treeRef = ref()
const keyword = ref('')
provide('keyword', keyword)
watch(keyword, val => {
  treeRef.value?.filterNode(val)
})

provide('multiple', props.multiple)

function handleNodeClick(node: zcUI.TreeNode, close: () => void) {
  innerValue.value = node
  if (!props.multiple) close()
}

function handleClear() {
  innerValue.value = ''
  treeRef.value?.clearOtherSelectedNodes()
}
</script>

<template>
  <zc-select
    :disabled="disabled"
    v-model="innerValue"
    :placeholder="placeholder"
    :multiple="multiple"
    :clearable="clearable"
    :filterable="filterable"
    :options="options"
    @clear="handleClear"
    @change="handleChange"
  >
    <template #tree="{ close }">
      <zc-tree
        ref="treeRef"
        :data="props.data"
        :defaultSelectKeys="innerValue ? Array.isArray(innerValue) ? innerValue : [innerValue] : []"
        selectable
        checkStrictly
        :nodeKey="nodeKey"
        :props="props.props"
        :expandOnClickNode="false"
        @node-click="(node) => handleNodeClick(node, close)"
      />
    </template>
  </zc-select>
</template>

<style lang="scss" scoped>
</style>