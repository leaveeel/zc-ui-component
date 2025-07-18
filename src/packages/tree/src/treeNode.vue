<script lang="ts" setup>
import { zcUI } from '@/types/zcUI'
import { defineProps, inject } from 'vue'
import zcCheckbox from '@/packages/checkbox/src/index.vue'
import zcIcon from '@/packages/icon/index.vue'
import IconRightArrow from '@/packages/icon/src/IconRightArrow.vue'
import TreeNodeComponent from './treeNode.vue'

const props = defineProps<{ treeData: zcUI.TreeNode[], treeNode: zcUI.TreeNode }>()
const treeContext = inject<any>('treeContext')

const getLabel = (node: zcUI.TreeNode) => node[treeContext.props.label] ?? node.label
const getChildren = (node: zcUI.TreeNode) => node[treeContext.props.children] ?? node.children

function handleNodeClick(node: zcUI.TreeNode) {
  if (treeContext.selectable && !node.disabled) {
    if (!treeContext.multiple) {
      treeContext.clearOtherSelectedNodes(node)
      node.selected = true
    }else {
      node.selected = !node.selected
    }
    treeContext.emit('node-click', node)
  }
  if (treeContext.expandOnClickNode) toggleExpand(node)
}

function handleExpandIconClick(node: zcUI.TreeNode, event: Event) {
  event.stopPropagation()
  toggleExpand(node)
}

function toggleExpand(node: zcUI.TreeNode) {
  if (node.disabled) return
  if (treeContext.accordion && getChildren(node)?.length) {
    props.treeData.forEach((n: zcUI.TreeNode) => {
      if (n !== node) n.expanded = false
    })
  }
  node.expanded = !node.expanded
  treeContext.emit(node.expanded ? 'node-expand' : 'node-collapse', node)
}
</script>

<template>
  <div
    class="zc-tree-node"
    :class="{
      'is-expanded': treeNode.expanded,
      'is-selected': treeNode.selected,
      'is-disabled': treeNode.disabled,
      'is-hidden': treeNode.visible === false
    }"
    v-show="treeNode.visible !== false"
  >
    <div class="zc-tree-node__content" @click="handleNodeClick(treeNode)">
      <zcIcon
        class="zc-tree-node__expand-icon"
        v-if="getChildren(treeNode)?.length"
        size="18"
        color="var(--main-font-color)"
        :rotate="treeNode.expanded ? 90 : 0"
        @click="handleExpandIconClick(treeNode, $event)"
      >
        <IconRightArrow />
      </zcIcon>
      <span v-else class="zc-tree-node__empty"></span>

      <zc-checkbox
        v-if="treeContext.checkable"
        v-model="treeNode.checked"
        :indeterminate="treeNode.indeterminate"
        @change="treeContext.handleNodeCheck(treeNode)"
        label=""
      />

      <!-- <span v-if="treeNode.icon" class="zc-tree-node__icon">
        <i :class="treeNode.icon"></i>
      </span> -->

      <span class="zc-tree-node__label">{{ getLabel(treeNode) }}</span>
    </div>

    <transition name="tree-expand">
      <div
        v-if="getChildren(treeNode)?.length && treeNode.expanded"
        class="zc-tree-node__children"
      >
        <TreeNodeComponent
          v-for="child in getChildren(treeNode)"
          :key="child[treeContext.props.nodeKey]"
          :tree-data="getChildren(treeNode)"
          :tree-node="child"
        />
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.zc-tree {
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
        color: var(--main-color);
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
        border-color: var(--main-color);
      }
      
      &.is-checked {
        background-color: var(--main-color);
        border-color: var(--main-color);
        
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
        background-color: var(--main-color);
        border-color: var(--main-color);
        
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
      padding-left: 14px;
      overflow: hidden;
    }
    
    &.is-selected {
      > .zc-tree-node__content {
        background-color: #f5f7fa;
        color: var(--main-color);
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