# ZC Tree 树组件

## 基本用法

```vue
<template>
  <zc-tree
    :data="treeData"
    :checkable="true"
    :default-expand-all="true"
    :node-key="id"
    @node-click="handleNodeClick"
    @check-change="handleCheckChange"
  />
</template>

<script>
const treeData = [
  {
    id: 1,
    label: '一级节点',
    children: [
      {
        id: 2,
        label: '二级节点 1'
      },
      {
        id: 3,
        label: '二级节点 2',
        disabled: true
      }
    ]
  }
]
</script>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| data | TreeNode[] | [] | 树组件数据 |
| defaultExpandAll | boolean | false | 是否默认展开所有节点 |
| checkable | boolean | false | 节点是否可选择 |
| selectable | boolean | false | 节点是否可点击选中 |
| accordion | boolean | false | 是否每次只打开一个同级树节点 |
| checkStrictly | boolean | false | 是否严格的遵循父子不互相关联 |
| defaultCheckedKeys | (string \| number)[] | [] | 默认勾选的节点的 nodeKey 数组 |
| props | object | { label: 'label', children: 'children' } | 配置选项，可配置节点标签和子节点的字段名 |
| filterNodeMethod | (value: string, data: zcUI.TreeNode) => boolean | - | 对树节点进行筛选时执行的方法 |
| nodeKey | string | 'id' | 每个树节点用来作为唯一标识的属性名 |
| expandOnClickNode | boolean | true | 是否在点击节点的时候展开或者收缩节点 |

## 事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| node-click | 节点被点击时触发 | (node: TreeNode) 被点击的节点对象 |
| node-expand | 节点被展开时触发 | (node: TreeNode) 被展开的节点对象 |
| node-collapse | 节点被收起时触发 | (node: TreeNode) 被收起的节点对象 |
| check-change | 节点选中状态发生变化时触发 | (node: TreeNode, checked: boolean) 节点对象和是否选中 |

## 方法

| 方法名 | 说明 | 参数 | 返回值 |
|-------|------|------|-------|
| setChecked | 通过 nodeKey 设置节点的选中状态 | (key: string \| number, checked: boolean) | - |
| filterNode | 对树节点进行筛选操作 | (value: string) | - |
| getCheckedNodes | 获取当前选中的节点数组 | - | TreeNode[] |
| getHalfCheckedNodes | 获取当前半选中的节点数组 | - | TreeNode[] |
| getCheckedKeys | 获取当前选中的节点的 nodeKey 数组 | - | (string \| number)[] |
| getHalfCheckedKeys | 获取当前半选中的节点的 nodeKey 数组 | - | (string \| number)[] |

## TreeNode 属性

| 属性名 | 类型 | 说明 |
|-------|------|------|
| children | TreeNode[] | 子节点 |
| expanded | boolean | 是否展开 |
| selected | boolean | 是否选中 |
| disabled | boolean | 是否禁用该节点 |
| checked | boolean | 是否勾选 |
<!-- | icon | string | 节点图标的自定义类名 | -->

## 注意事项

1. 使用 `nodeKey` 时，确保数据中包含对应的唯一标识字段
2. 当 `checkStrictly` 为 false 时，父子节点的选择状态会互相关联
3. 使用 `filterNodeMethod` 时，需要返回 boolean 值来决定节点是否显示
4. 节点过滤后，如果子节点符合条件，父节点也会显示
5. 展开/收起动画使用 Vue 的 transition 组件实现，可以通过自定义 CSS 来修改动画效果
