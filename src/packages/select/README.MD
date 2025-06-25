# ZC Select 选择器

## 基本用法

```vue
<template>
  <zc-select
    v-model="value"
    :options="options"
    placeholder="请选择"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const options = [
  { value: '1', label: '选项1' },
  { value: '2', label: '选项2' },
  { value: '3', label: '选项3', disabled: true }
]

const handleChange = (value: string | number | boolean) => {
  console.log('选中值：', value)
}
</script>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| modelValue | string \| number \| (string \| number)[] | - | 选择器绑定值 |
| options | SelectOption[] | [] | 选项数据 |
| placeholder | string | '请选择' | 占位文本 |
| clearable | boolean | false | 是否可清空 |
| disabled | boolean | false | 是否禁用 |
| filterable | boolean | false | 是否可搜索 |
| multiple | boolean | false | 是否多选 |
| collapseTags | boolean | false | 多选时是否折叠标签 |
| maxCollapseTags | number | 1 | 折叠标签时最多显示的标签数量 |

## SelectOption 选项

| 属性名 | 类型 | 说明 |
|-------|------|------|
| value | string \| number | 选项值 |
| label | string | 选项标签 |
| disabled | boolean | 是否禁用该选项 |

## 事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| change | 选中值发生变化时触发 | (value: string \| number \| (string \| number)[]) |
| clear | 点击清空按钮时触发 | - |

## 示例

### 基础用法

```vue
<zc-select v-model="value" :options="options" />
```

### 禁用状态

```vue
<zc-select v-model="value" :options="options" disabled />
```

### 可清空选择

```vue
<zc-select v-model="value" :options="options" clearable />
```

### 可搜索

```vue
<zc-select v-model="value" :options="options" filterable />
```

### 自定义选项的键名

```vue
<zc-select
  v-model="value"
  :options="options"
  value-key="id"
  label-key="name"
/>
```

## 注意事项

1. 使用 `v-model` 进行双向绑定
2. 确保 `options` 中的每个选项都有唯一的 value 值
3. 当使用自定义键名时，确保 `options` 中的对象包含对应的字段
4. 搜索功能（filterable）会匹配选项的 label 值
5. 组件会自动处理键盘事件和点击外部关闭
