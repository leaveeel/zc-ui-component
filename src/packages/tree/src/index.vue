<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcTree'
})
</script>

<script lang="ts" setup>
import { zcUI, zcUIProps } from '@/types/zcUI'
import { defineProps, provide, reactive, toRefs, ref, computed, watch } from 'vue'
import zcCheckbox from '@/packages/checkbox/src/index.vue'
import zcIcon from '@/packages/icon/index.vue'
import IconRightArrow from '@/packages/icon/src/IconRightArrow.vue'

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
      const children = getChildren(item)
      if (children) {
        if (children.includes(node)) {
          parents.push(item)
        }
        traverse(children, item)
      }
    }
  }
  traverse(nodes)
  return parents
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

const handleNodeClick = (node: zcUI.TreeNode) => {
  if (props.selectable && !node.disabled) {
    node.selected = !node.selected
    emit('node-click', node)
  }
  // 只有当 expandOnClickNode 为 true 时，点击节点才会触发展开/收起
  if (props.expandOnClickNode) {
    toggleExpand(node)
  }
}

// 添加一个专门处理展开图标点击的方法
const handleExpandIconClick = (node: zcUI.TreeNode, event: Event) => {
  event.stopPropagation() // 阻止事件冒泡
  toggleExpand(node)
}

const toggleExpand = (node: zcUI.TreeNode) => {
  if (node.disabled) return
  
  if (props.accordion && getChildren(node)?.length) {
    const siblings = treeData.filter(n => n !== node)
    siblings.forEach(sibling => {
      sibling.expanded = false
    })
  }
  
  node.expanded = !node.expanded
  if(node.expanded) {
    emit('node-expand', node)
  }else {
    emit('node-collapse', node)
  }
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
  checkable: props.checkable,
  selectable: props.selectable,
  filterText
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
    <div
      v-for="node in treeData"
      :key="getNodeKey(node)"
      class="zc-tree-node"
      :class="{
        'is-expanded': node.expanded,
        'is-selected': node.selected,
        'is-disabled': node.disabled,
        'is-hidden': node.visible === false
      }"
      v-show="node.visible !== false"
    >
      <div class="zc-tree-node__content" @click="handleNodeClick(node)">
        <zcIcon class="zc-tree-node__expand-icon" v-if="getChildren(node)?.length" size="24" :rotate="node.expanded ? 90 : 0" @click="handleExpandIconClick(node, $event)">
          <IconRightArrow></IconRightArrow>
        </zcIcon>
        <span v-else class="zc-tree-node__empty"></span>
        
        <zc-checkbox v-if="checkable" v-model="node.checked" :indeterminate="node.indeterminate" @change="handleNodeCheck(node)" label=""></zc-checkbox>
      
        <span v-if="node.icon" class="zc-tree-node__icon">
          <i :class="node.icon"></i>
        </span>
        
        <span class="zc-tree-node__label">{{ getLabel(node) }}</span>
      </div>
      
      <transition name="tree-expand">
        <div v-if="getChildren(node)?.length && node.expanded" class="zc-tree-node__children">
          <template v-for="child in getChildren(node)" :key="getNodeKey(child)">
            <div
              class="zc-tree-node"
              :class="{
                'is-expanded': child.expanded,
                'is-selected': child.selected,
                'is-disabled': child.disabled,
                'is-hidden': child.visible === false
              }"
              v-show="child.visible !== false"
            >
              <div class="zc-tree-node__content" @click="handleNodeClick(child)">
                <zcIcon class="zc-tree-node__expand-icon" v-if="getChildren(child)?.length" size="24" :rotate="child.expanded ? 90 : 0" @click="handleExpandIconClick(child, $event)">
                  <IconRightArrow></IconRightArrow>
                </zcIcon>
                <span v-else class="zc-tree-node__empty"></span>
                
                <zc-checkbox v-if="checkable" v-model="child.checked" :indeterminate="child.indeterminate" @change="handleNodeCheck(child)">
                  <span v-if="child.icon" class="zc-tree-node__icon">
                    <i :class="child.icon"></i>
                  </span>
                  {{ getLabel(child) }}
                </zc-checkbox>
              </div>
            </div>
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.zc-tree {
  font-size: 14px;
  
  &-node {
    &__content {
      display: flex;
      align-items: center;
      padding: 8px 0;
      cursor: pointer;
      
      &:hover {
        background-color: #f5f7fa;
      }
    }
    
    &__expand-icon {
      width: 24px;
      text-align: center;
      cursor: pointer;
      transition: transform 0.3s ease;
      
      &:hover {
        color: #409eff;
      }
    }
    
    &__empty {
      width: 24px;
    }
    
    &__checkbox {
      width: 16px;
      height: 16px;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      margin-right: 8px;
      position: relative;
      cursor: pointer;
      
      &:hover {
        border-color: #409eff;
      }
      
      &.is-checked {
        background-color: #409eff;
        border-color: #409eff;
        
        &::after {
          content: '';
          position: absolute;
          left: 4px;
          top: 1px;
          width: 4px;
          height: 8px;
          border: solid #fff;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      }
      
      &.is-indeterminate {
        background-color: #409eff;
        border-color: #409eff;
        
        &::after {
          content: '';
          position: absolute;
          left: 3px;
          top: 7px;
          width: 8px;
          height: 2px;
          background-color: #fff;
        }
      }
    }
    
    &__icon {
      margin-right: 8px;
    }
    
    &__label {
      flex: 1;
    }
    
    &__children {
      padding-left: 24px;
      overflow: hidden;
    }
    
    &.is-selected {
      > .zc-tree-node__content {
        background-color: #ecf5ff;
        color: #409eff;
      }
    }
    
    &.is-disabled {
      > .zc-tree-node__content {
        color: #c0c4cc;
        cursor: not-allowed;
        
        .zc-tree-node__checkbox {
          background-color: #f5f7fa;
          border-color: #dcdfe6;
          cursor: not-allowed;
        }
      }
    }

    &.is-hidden {
      display: none;
    }
  }
}

// 展开收起动画
.tree-expand-enter-active,
.tree-expand-leave-active {
  transition: all 0.3s ease;
}

.tree-expand-enter-from,
.tree-expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.tree-expand-enter-to,
.tree-expand-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>