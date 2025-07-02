# ZC Pagination 分页组件

分页组件用于数据量较大时进行数据分页展示，支持自定义布局和样式。

## 基本用法

```vue
<zc-pagination
  v-model="currentPage"
  :total="100"
  :page-size="10"
/>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| total | number | - | 总条目数 |
| pageSize | number | 10 | 每页显示条目个数 |
| modelValue | number | 1 | 当前页码 |
| layout | string | 'prev, pager, next' | 分页组件布局，可选值: 'sizes', 'prev', 'pager', 'next', 'jumper', 'total', 'slot' |
| pageSizes | number[] | [10, 20, 30, 50] | 每页显示条目数的选项列表 |
| hideOnSinglePage | boolean | true | 只有一页时是否隐藏分页 |
| lang | string | 'en' | 语言，可选值'en'、'zh' |

## 事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| update:modelValue | 当前页码变化时触发 | 新的页码值 |
| update:pageSize | 每页条数变化时触发 | 新的每页条数 |
| change | 当前页码变化时触发 | 新的页码值 |
| size-change | 每页条数变化时触发 | 新的每页条数 |

## 布局定制

分页组件支持多种布局方式，可以通过layout属性设置组件的布局。

### 基础分页

```vue
<zc-pagination
  v-model="currentPage"
  :total="100"
  layout="prev, pager, next"
/>
```

### 显示总数

```vue
<zc-pagination
  v-model="currentPage"
  :total="100"
  layout="total, prev, pager, next"
  :show-total="true"
/>
```

### 调整每页显示条数

```vue
<zc-pagination
  v-model="currentPage"
  :total="100"
  layout="sizes, prev, pager, next"
  :page-sizes="[10, 20, 50, 100]"
/>
```

### 跳转到指定页

```vue
<zc-pagination
  v-model="currentPage"
  :total="100"
  layout="prev, pager, next, jumper"
/>
```

### 完整功能

```vue
<zc-pagination
  v-model="currentPage"
  :total="100"
  layout="total, sizes, prev, pager, next, jumper"
  :show-total="true"
  :page-sizes="[10, 20, 50, 100]"
/>
```

## 页码按钮的数量

当页码较多时，会自动省略部分页码按钮，点击省略号可以快速前进或后退多页。

```vue
<zc-pagination
  v-model="currentPage"
  :total="1000"
  :page-size="10"
/>
```

## 只有一页时隐藏分页

当只有一页时，可以通过hideOnSinglePage属性控制是否隐藏分页组件。

```vue
<zc-pagination
  v-model="currentPage"
  :total="10"
  :page-size="10"
  :hide-on-single-page="true"
/>
```

## 注意事项

- layout属性中的各个元素会按照指定的顺序排列
- 当总页数只有一页时，默认会隐藏分页组件
- 页码按钮的数量会根据总页数自动调整
- 点击省略号可以快速前进或后退5页
- 跳转页码输入框支持按Enter键确认
