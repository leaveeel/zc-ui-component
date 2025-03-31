
# ZC Table 表格组件

表格组件用于展示多条结构类似的数据，支持排序、筛选、固定列、自定义样式等功能。

## 基本用法

```vue
<zc-table :data="tableData" :option="tableOption">
</zc-table>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| data | Array | - | 显示的数据 |
| option | Array | - | 表格列的配置选项 |
| height | string/number | 'auto' | 表格高度 |
| maxHeight | string/number | '100%' | 表格最大高度 |
| stripe | boolean | false | 是否为斑马纹表格 |
| border | boolean | false | 是否显示边框 |
| showHeader | boolean | true | 是否显示表头 |
| rowKey | string | '' | 行数据的唯一标识字段 |
| emptyText | string | 'No Data' | 空数据时显示的文本 |
| loading | boolean | false | 是否显示加载状态 |
| defaultSort | { prop: string, order: string } | { prop: '', order: '' } | 默认的排序列和排序方式 |
| rowClassName | Function | () => '' | 行的 className 的回调方法 |
| cellClassName | Function | () => '' | 单元格的 className 的回调方法 |
| headerRowClassName | Function | () => '' | 表头行的 className 的回调方法 |
| headerCellClassName | Function | () => '' | 表头单元格的 className 的回调方法 |

## 事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| row-click | 当用户点击行时触发 | row, index, event |
| select | 当用户手动勾选数据行时触发 | selection, row |
| select-all | 当用户手动勾选全选时触发 | selection |
| sort-change | 当表格的排序条件发生变化时触发 | { prop, order } |

## 列配置选项

表格列配置选项是一个对象数组，每个对象表示一列，支持以下属性：

| 属性名 | 类型 | 说明 |
|-------|------|------|
| type | 'index'/'selection' | 列类型，index为序号列，selection为选择列 |
| label | string | 列标题 |
| prop | string | 对应列内容的字段名 |
| width | string/number | 列宽度 |
| fixed | 'left'/'right' | 列是否固定在左侧或右侧 |
| align | 'left'/'center'/'right' | 对齐方式 |
| sortable | boolean | 是否可排序 |
| formatter | Function | 用来格式化内容的函数 |
| btns | Array | 操作按钮配置，用于操作列 |

## 样式定制

表格组件支持多种样式定制，可以通过属性设置表格的外观。

### 带边框表格

```vue
<zc-table :data="tableData" :option="tableOption" border>
</zc-table>
```

### 斑马纹表格

```vue
<zc-table :data="tableData" :option="tableOption" stripe>
</zc-table>
```

### 固定列

```vue
<zc-table :data="tableData" :option="tableOption">
</zc-table>

<script setup>
const tableOption = [
  { label: 'ID', prop: 'id', fixed: 'left' },
  { label: '姓名', prop: 'name' },
  { label: '年龄', prop: 'age' },
  { label: '操作', fixed: 'right', btns: [
    { name: '编辑', color: '#409EFF', handle: (index, row) => {} },
    { name: '删除', color: '#F56C6C', handle: (index, row) => {} }
  ]}
]
</script>
```

### 自定义行样式

```vue
<zc-table 
  :data="tableData" 
  :option="tableOption"
  :row-class-name="rowClassName"
>
</zc-table>

<script setup>
const rowClassName = (row, index) => {
  if (index === 1) {
    return 'warning-row'
  } else if (index === 3) {
    return 'success-row'
  }
  return ''
}
</script>
```

## 排序

表格支持点击表头进行排序。

```vue
<zc-table 
  :data="tableData" 
  :option="tableOption"
  :default-sort="{ prop: 'age', order: 'ascending' }"
  @sort-change="handleSortChange"
>
</zc-table>

<script setup>
const tableOption = [
  { label: '姓名', prop: 'name' },
  { label: '年龄', prop: 'age', sortable: true }
]

const handleSortChange = ({ prop, order }) => {
  console.log('排序字段:', prop)
  console.log('排序方式:', order) // ascending, descending 或空字符串
}
</script>
```

## 选择功能

表格支持选择行功能。

```vue
<zc-table 
  :data="tableData" 
  :option="tableOption"
  @select="handleSelect"
  @select-all="handleSelectAll"
>
</zc-table>

<script setup>
const tableOption = [
  { type: 'selection' },
  { label: '姓名', prop: 'name' },
  { label: '年龄', prop: 'age' }
]

const handleSelect = (selection, row) => {
  console.log('选中的行:', selection)
  console.log('当前选中行:', row)
}

const handleSelectAll = (selection) => {
  console.log('全选的行:', selection)
}
</script>
```

## 操作列

表格支持添加操作按钮列。

```vue
<zc-table :data="tableData" :option="tableOption">
</zc-table>

<script setup>
const tableOption = [
  { label: '姓名', prop: 'name' },
  { label: '年龄', prop: 'age' },
  { 
    label: '操作', 
    btns: [
      { name: '编辑', color: '#409EFF', handle: (index, row) => {} },
      { name: '删除', color: '#F56C6C', handle: (index, row) => {} }
    ]
  }
]
</script>
```

## 空数据提示

当没有数据时，表格会显示空数据提示。

```vue
<zc-table 
  :data="[]" 
  :option="tableOption"
  empty-text="暂无数据"
>
</zc-table>
```

## 加载状态

表格支持显示加载状态。

```vue
<zc-table 
  :data="tableData" 
  :option="tableOption"
  :loading="loading"
>
</zc-table>
```

## 注意事项

- 表格高度设置为auto时会自适应内容高度
- 固定列需要设置列宽度才能正常显示
- 排序功能需要在列配置中设置sortable为true
- 选择功能需要在列配置中添加type为selection的列
- 操作列需要在列配置中设置btns数组
