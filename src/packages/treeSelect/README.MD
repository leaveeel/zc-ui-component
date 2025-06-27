# TreeSelect 树形选择器

树形选择器组件，结合了树形控件和选择器的功能。

## 基础用法

基础的树形选择器用法。

```vue
<template>
  <zc-tree-select
    v-model="value"
    :data="data"
    placeholder="请选择"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const data = [
  {
    value: '1',
    label: '一级 1',
    children: [
      {
        value: '1-1',
        label: '二级 1-1',
        children: [
          {
            value: '1-1-1',
            label: '三级 1-1-1'
          }
        ]
      }
    ]
  },
  {
    value: '2',
    label: '一级 2',
    children: [
      {
        value: '2-1',
        label: '二级 2-1'
      }
    ]
  }
]
</script>
```

## 多选

通过 `multiple` 属性开启多选模式。

```vue
<template>
  <zc-tree-select
    v-model="value"
    :data="data"
    multiple
    placeholder="请选择"
  />
</template>
```

## 可搜索

通过 `filterable` 属性开启搜索功能。

```vue
<template>
  <zc-tree-select
    v-model="value"
    :data="data"
    filterable
    placeholder="请选择"
  />
</template>
```

## 可清空

通过 `clearable` 属性开启清空功能。

```vue
<template>
  <zc-tree-select
    v-model="value"
    :data="data"
    clearable
    placeholder="请选择"
  />
</template>
```

## 禁用状态

通过 `disabled` 属性禁用选择器。

```vue
<template>
  <zc-tree-select
    v-model="value"
    :data="data"
    disabled
    placeholder="请选择"
  />
</template>
```

## 折叠标签

通过 `collapseTags` 和 `maxCollapseTags` 属性控制多选时标签的折叠显示。

```vue
<template>
  <zc-tree-select
    v-model="value"
    :data="data"
    multiple
    collapseTags
    :maxCollapseTags="3"
    placeholder="请选择"
  />
</template>
```

## 属性

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 选择器绑定值 | string \| number \| (string \| number)[] | - |
| data | 树形数据 | TreeNode[] | - |
| placeholder | 占位文本 | string | '请选择' |
| clearable | 是否可清空 | boolean | false |
| disabled | 是否禁用 | boolean | false |
| filterable | 是否可搜索 | boolean | false |
| multiple | 是否多选 | boolean | false |
| collapseTags | 多选时是否折叠标签 | boolean | false |
| maxCollapseTags | 折叠标签时最多显示的标签数量 | number | 1 |
| nodeKey | string | 'id' | 每个树节点用来作为唯一标识的属性名 |
| props | object | { label: 'label', children: 'children' } | 配置选项，可配置节点标签和子节点的字段名 |

## 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 选中值发生变化时触发 | (value, node) |
| clear | 点击清空按钮时触发 | - |

## 注意事项

注意事项参考[Tree](src/packages/tree)和[Select](src/packages/select)组件
