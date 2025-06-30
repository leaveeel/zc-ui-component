<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcTree'
})
</script>

<script lang="ts" setup>
import { zcUI, zcUIProps } from '@/types/zcUI'
import { defineProps, inject, provide, reactive, ref, watch } from 'vue'
import TreeNodeComponent from './treeNode.vue'

const props = withDefaults(defineProps<zcUIProps.Tree & {defaultSelectKeys?: (string | number)[]}>(), {
  defaultExpandAll: false,
  checkable: false,
  selectable: false,
  accordion: false,
  checkStrictly: false,
  props: () => ({ label: 'label', children: 'children' }),
  nodeKey: 'id',
  expandOnClickNode: true
})

const emit = defineEmits<{
  'node-click': [node: zcUI.TreeNode]
  'node-expand': [node: zcUI.TreeNode]
  'node-collapse': [node: zcUI.TreeNode]
  'check-change': [node: zcUI.TreeNode, checked: boolean]
}>()

// 工具函数合并
const nodeUtil = {
  label: (node: zcUI.TreeNode) => node[props.props.label] ?? node.label,
  children: (node: zcUI.TreeNode) => node[props.props.children] ?? node.children,
  key: (node: zcUI.TreeNode) => node[props.nodeKey]
}

const multiple = inject('multiple', false)

watch(() => props.defaultSelectKeys, (newVal: (string | number)[] | undefined) => {
  if (newVal) updateSelectedNodes(newVal)
})

// 初始化树数据
function initTreeData(data: zcUI.TreeNode[], parent: zcUI.TreeNode[] = []): zcUI.TreeNode[] {
  return data.map(node => {
    const children = nodeUtil.children(node)
    const nodeKey = nodeUtil.key(node)
    const isChecked = props.defaultCheckedKeys?.includes(nodeKey) || false
    const isSelect = props.defaultSelectKeys?.includes(nodeKey) || false
    const processedNode: any = {
      ...node,
      expanded: props.defaultExpandAll,
      selected: isSelect,
      checked: isChecked,
      indeterminate: false,
    }
    if (isSelect && parent.length) {
      parent.forEach(p => {
        p.expanded = true
      })
    }
    if (children) {
      processedNode[props.props.children] = initTreeData(children, [...parent, processedNode])
      if (!props.checkStrictly) {
        const allChecked = processedNode[props.props.children].every((c: any) => c.checked)
        const someChecked = processedNode[props.props.children].some((c: any) => c.checked)
        processedNode.checked = allChecked
        processedNode.indeterminate = !allChecked && someChecked
      }
    }
    return processedNode
  })
}

const treeData = reactive(initTreeData(props.data))

// 递归工具
function traverse(nodes: zcUI.TreeNode[], cb: (node: zcUI.TreeNode) => void) {
  nodes.forEach(node => {
    cb(node)
    const children = nodeUtil.children(node)
    if (children) traverse(children, cb)
  })
}

// 获取所有子节点
function getChildNodes(node: zcUI.TreeNode): zcUI.TreeNode[] {
  const children: zcUI.TreeNode[] = []
  traverse([node], n => {
    if (n !== node) children.push(n)
  })
  return children
}

// 获取所有父节点
function getParentNodes(node: zcUI.TreeNode, nodes = treeData): zcUI.TreeNode[] {
  const parents: zcUI.TreeNode[] = []
  function find(data: zcUI.TreeNode[], parent?: zcUI.TreeNode): boolean {
    for (const item of data) {
      if (item === node) {
        if (parent) parents.push(parent)
        return true
      }
      const children = nodeUtil.children(item)
      if (children && find(children, item)) {
        if (parent) parents.push(parent)
        return true
      }
    }
    return false
  }
  find(nodes)
  return parents.reverse()
}

// 更新父节点状态
function updateParentState(node: zcUI.TreeNode) {
  if (props.checkStrictly) return
  const parents = getParentNodes(node)
  parents.reverse().forEach(parent => {
    const childrenRaw = nodeUtil.children(parent)
    const children = Array.isArray(childrenRaw) ? childrenRaw : []
    if (!children.length) return
    const checkedCount = children.filter((c: any) => c.checked).length
    const indeterminateCount = children.filter((c: any) => c.indeterminate).length
    parent.checked = checkedCount === children.length
    parent.indeterminate = !parent.checked && (checkedCount > 0 || indeterminateCount > 0)
  })
}

// 更新子节点状态
function updateChildrenState(node: zcUI.TreeNode, checked: boolean) {
  if (props.checkStrictly) return
  getChildNodes(node).forEach(child => {
    if (!child.disabled) {
      child.checked = checked
      child.indeterminate = false
    }
  })
}

// 处理节点选中状态
function handleNodeCheck(node: zcUI.TreeNode) {
  if (!props.checkable || node.disabled) return
  node.indeterminate = false
  if (!props.checkStrictly) {
    updateChildrenState(node, !!node.checked)
    updateParentState(node)
  }
  emit('check-change', node, !!node.checked)
}

// 手动设置节点选中状态
function setChecked(key: string | number, checked: boolean) {
  let found: zcUI.TreeNode = {}
  traverse(treeData, node => {
    if (nodeUtil.key(node) === key) found = node
  })
  if (Object.keys(found).length) {
    found.checked = checked
    found.indeterminate = false
    if (!props.checkStrictly) {
      updateChildrenState(found, checked)
      updateParentState(found)
    }
  }
}

const allNodeHide = ref(false)
// 过滤节点
function filterNode(value: string) {
  allNodeHide.value = true
  function filter(nodes: zcUI.TreeNode[]) {
    nodes.forEach(node => {
      const children = nodeUtil.children(node)
      // 先递归处理子节点
      if (children) filter(children)
      // 当前节点是否匹配
      const currentVisible = props.filterNodeMethod
        ? props.filterNodeMethod(value, node)
        : nodeUtil.label(node).toLowerCase().includes(value.toLowerCase())
      // 子节点是否有可见
      const childrenVisible = children ? children.some((c: any) => c.visible) : false
      node.visible = !value || currentVisible || childrenVisible
      if (node.visible && value) node.expanded = true
      if (node.visible) allNodeHide.value = false
    })
  }
  filter(treeData)
}

// 获取所有选中/半选节点
function getCheckedNodes() {
  const checked: zcUI.TreeNode[] = []
  traverse(treeData, node => { if (node.checked) checked.push(node) })
  return checked
}
function getHalfCheckedNodes() {
  const half: zcUI.TreeNode[] = []
  traverse(treeData, node => { if (node.indeterminate) half.push(node) })
  return half
}
function getCheckedKeys() { return getCheckedNodes().map(node => nodeUtil.key(node)) }
function getHalfCheckedKeys() { return getHalfCheckedNodes().map(node => nodeUtil.key(node)) }

// 清除其他节点的选中状态
function clearOtherSelectedNodes(currentNode: zcUI.TreeNode) {
  traverse(treeData, node => {
    if (node !== currentNode) {
      node.selected = false
    }
  })
}

// 更新节点的选中状态
function updateSelectedNodes(selectedKeys: (string | number)[]) {
  traverse(treeData, node => {
    node.selected = selectedKeys.includes(nodeUtil.key(node))
  })
}

// 提供树组件上下文给子组件
provide('treeContext', {
  props: { ...props.props, nodeKey: props.nodeKey },
  checkStrictly: props.checkStrictly,
  checkable: props.checkable,
  selectable: props.selectable,
  expandOnClickNode: props.expandOnClickNode,
  accordion: props.accordion,
  multiple,
  clearOtherSelectedNodes,
  handleNodeCheck,
  emit
})

// 对外暴露方法
defineExpose({
  setChecked,
  filterNode,
  getCheckedNodes,
  getHalfCheckedNodes,
  getCheckedKeys,
  getHalfCheckedKeys,
  clearOtherSelectedNodes,
  updateSelectedNodes
})
</script>

<template>
  <div class="zc-tree">
    <template v-if="allNodeHide">
      <div class="zc-tree__empty">
        无匹配节点
      </div>
    </template>
    <TreeNodeComponent 
      v-for="node in treeData" 
      :key="nodeUtil.key(node)" 
      :tree-data="treeData" 
      :tree-node="node" 
    />
  </div>
</template>

<style lang="scss" scoped>
.zc-tree {
  font-size: 14px;
  &__empty {
    text-align: center;
    padding: 10px;
  }
}
</style>