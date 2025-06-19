<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcTree'
})
</script>

<script lang="ts" setup>
import { zcUI, zcUIProps } from '@/types/zcUI'
import { defineProps, provide, reactive, ref } from 'vue'
import TreeNodeComponent from './treeNode.vue'

const props = withDefaults(defineProps<zcUIProps.Tree>(), {
  defaultExpandAll: false,
  checkable: false,
  selectable: false,
  accordion: false,
  checkStrictly: false,
  props: { label: 'label', children: 'children' },
  nodeKey: 'id',
  expandOnClickNode: true
})

const emit = defineEmits<{
  'node-click': [node: zcUI.TreeNode]
  'node-expand': [node: zcUI.TreeNode]
  'node-collapse': [node: zcUI.TreeNode]
  'check-change': [node: zcUI.TreeNode, checked: boolean]
}>()

const filterText = ref('')

// 处理自定义属性
const getLabel = (node: zcUI.TreeNode) => node[props.props.label] || node.label
const getChildren = (node: zcUI.TreeNode) => node[props.props.children] || node.children

// 获取节点的唯一标识
const getNodeKey = (node: zcUI.TreeNode) => node[props.nodeKey]

// 初始化树数据
const initTreeData = (data: zcUI.TreeNode[]): zcUI.TreeNode[] => {
  return data.map(node => {
    const children = node[props.props.children]
    const nodeKey = getNodeKey(node)
    const isChecked = props.defaultCheckedKeys?.includes(nodeKey) || false
    
    const processedNode: any = {
      ...node,
      expanded: props.defaultExpandAll || false,
      selected: false,
      checked: isChecked,
      indeterminate: false,
    }

    if (children) {
      processedNode[props.props.children] = initTreeData(children)
      // 只在非严格模式下更新父节点状态
      if (!props.checkStrictly) {
        // 如果子节点都被选中，父节点也应该被选中
        if (processedNode[props.props.children].every((child: any) => child.checked)) {
          processedNode.checked = true
        }
        // 如果部分子节点被选中，父节点应该显示半选状态
        else if (processedNode[props.props.children].some((child: any) => child.checked)) {
          processedNode.indeterminate = true
        }
      }
    }

    return processedNode
  })
}

const treeData = reactive(initTreeData(props.data))

// 获取节点的所有子节点
const getChildNodes = (node: zcUI.TreeNode): zcUI.TreeNode[] => {
  const children: zcUI.TreeNode[] = []
  const traverse = (node: zcUI.TreeNode) => {
    const nodeChildren = getChildren(node)
    if (nodeChildren) {
      nodeChildren.forEach((child: any) => {
        children.push(child)
        traverse(child)
      })
    }
  }
  traverse(node)
  return children
}

// 获取节点的所有父节点
const getParentNodes = (node: zcUI.TreeNode, nodes = treeData): zcUI.TreeNode[] => {
  const parents: zcUI.TreeNode[] = []
  const traverse = (data: zcUI.TreeNode[], parent?: zcUI.TreeNode) => {
    for (const item of data) {
      if (item === node) {
        // 如果找到了目标节点，并且有父节点，则添加父节点
        if (parent) {
          parents.push(parent)
        }
        return true
      }
      
      const children = getChildren(item)
      if (children) {
        // 如果在子节点中找到了目标节点，则当前节点也是父节点之一
        if (traverse(children, item)) {
          if (parent) {
            parents.push(parent)
          }
          return true
        }
      }
    }
    return false
  }
  traverse(nodes)
  return parents.reverse() // 反转数组，使得从最远的祖先节点开始
}

// 更新父节点状态
const updateParentState = (node: zcUI.TreeNode) => {
  if (props.checkStrictly) return

  const updateSingleParent = (parent: zcUI.TreeNode) => {
    const children = getChildren(parent)
    if (!children) return

    const checkedCount = children.filter((child: any) => child.checked).length
    const indeterminateCount = children.filter((child: any) => child.indeterminate).length

    if (checkedCount === children.length) {
      parent.checked = true
      parent.indeterminate = false
    } else if (checkedCount > 0 || indeterminateCount > 0) {
      parent.checked = false
      parent.indeterminate = true
    } else {
      parent.checked = false
      parent.indeterminate = false
    }
  }

  // 从下往上更新父节点状态
  const parents = getParentNodes(node, treeData)

  for (let i = parents.length - 1; i >= 0; i--) {
    updateSingleParent(parents[i])
  }
}

// 更新子节点状态
const updateChildrenState = (node: zcUI.TreeNode, checked: boolean) => {
  if (props.checkStrictly) return

  const children = getChildNodes(node)
  children.forEach(child => {
    if (!child.disabled) {
      child.checked = checked
      child.indeterminate = false
    }
  })
}

// 处理节点选中状态
const handleNodeCheck = (node: zcUI.TreeNode) => {

  if (!props.checkable || node.disabled) return

  node.indeterminate = false
  
  if (!props.checkStrictly) {
    // 先更新子节点状态
    updateChildrenState(node, !!node.checked)
    // 再更新父节点状态
    updateParentState(node)
  }

  emit('check-change', node, !!node.checked)
}

// 手动设置节点选中状态
const setChecked = (key: string | number, checked: boolean) => {
  const findNode = (nodes: zcUI.TreeNode[]): zcUI.TreeNode | null => {
    for (const node of nodes) {
      if (getNodeKey(node) === key) return node
      const children = getChildren(node)
      if (children) {
        const found = findNode(children)
        if (found) return found
      }
    }
    return null
  }

  const node = findNode(treeData)
  if (node) {
    node.checked = checked
    node.indeterminate = false
    
    if (!props.checkStrictly) {
      updateChildrenState(node, checked)
      updateParentState(node)
    }
  }
}

// 过滤节点
const filterNode = (value: string) => {
  filterText.value = value
  const filter = (nodes: zcUI.TreeNode[]): boolean => {
    let visible = false
    nodes.forEach(node => {
      const children = getChildren(node)
      // 递归处理子节点，如果子节点可见，父节点也应该可见
      const childrenVisible = children ? filter(children) : false
      
      // 当前节点是否匹配过滤条件
      const currentVisible = props.filterNodeMethod 
        ? props.filterNodeMethod(value, node)
        : getLabel(node).includes(value)
      
      // 如果当前节点匹配或者子节点匹配，则当前节点可见
      node.visible = !value || currentVisible || childrenVisible
      
      // 更新整体可见性状态
      visible = visible || node.visible
    })
    return visible
  }
  filter(treeData)
}

// 获取所有选中的节点
const getCheckedNodes = () => {
  const checkedNodes: zcUI.TreeNode[] = []
  const traverse = (nodes: zcUI.TreeNode[]) => {
    nodes.forEach(node => {
      if (node.checked) {
        checkedNodes.push(node)
      }
      const children = getChildren(node)
      if (children) {
        traverse(children)
      }
    })
  }
  traverse(treeData)
  return checkedNodes
}

// 获取所有半选中的节点
const getHalfCheckedNodes = () => {
  const halfCheckedNodes: zcUI.TreeNode[] = []
  const traverse = (nodes: zcUI.TreeNode[]) => {
    nodes.forEach(node => {
      if (node.indeterminate) {
        halfCheckedNodes.push(node)
      }
      const children = getChildren(node)
      if (children) {
        traverse(children)
      }
    })
  }
  traverse(treeData)
  return halfCheckedNodes
}

// 获取选中节点的 keys
const getCheckedKeys = () => {
  return getCheckedNodes().map(node => getNodeKey(node))
}

// 获取半选节点的 keys
const getHalfCheckedKeys = () => {
  return getHalfCheckedNodes().map(node => getNodeKey(node))
}

// 提供树组件上下文给子组件使用
provide('treeContext', {
  props: props.props,
  checkStrictly: props.checkStrictly,
  checkable: props.checkable,
  selectable: props.selectable,
  expandOnClickNode: props.expandOnClickNode,
  accordion: props.accordion,
  handleNodeCheck: handleNodeCheck,
  emit: emit
})

// 对外暴露的方法
defineExpose({
  setChecked,
  filterNode,
  getCheckedNodes,
  getHalfCheckedNodes,
  getCheckedKeys,
  getHalfCheckedKeys
})
</script>

<template>
  <div class="zc-tree">
    <TreeNodeComponent v-for="node in treeData" :key="getNodeKey(node)" :tree-data="treeData" :tree-node="node" />
  </div>
</template>

<style lang="scss" scoped>
.zc-tree {
  font-size: 14px;
}
</style>