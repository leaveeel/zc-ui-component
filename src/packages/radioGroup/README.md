# ZC Radio Group 单选框组组件

单选框组组件用于管理一组相关的单选框，提供统一的数据绑定和布局控制。

## 基本用法

```vue
<zc-radio-group v-model="checkedValues">
  <zc-radio label="选项1" value="1"></zc-radio>
  <zc-radio label="选项2" value="2"></zc-radio>
  <zc-radio label="选项3" value="3"></zc-radio>
</zc-radio-group>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| modelValue | string \| number \| boolean | - | 单选框组选中值的数组 |
| align | 'left'/'center'/'right' | 'left' | 按钮组对齐方式 |
| inline | boolean | false | 是否为行内按钮组 |
| vertical | boolean | false | 是否垂直排列 |
| gap | string/number | 10 | 按钮之间的间距 |
| disabled | boolean | false | 禁用状态 |

## 事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| update:modelValue | 单选框组选中值变化时触发 | string \| number \| boolean |
| change | 单选框组选中值变化时触发 | string \| number \| boolean |

## 插槽

| 插槽名 | 说明 |
|-------|------|
| default | 单选框组内容，通常是多个单选框 |

## 样式定制

单选框组组件支持多种布局方式，可以通过属性设置单选框的排列方向和间距。

### 垂直布局

```vue
<zc-radio-group vertical>
</zc-radio-group>
```

### 自定义间距

```vue
<zc-radio-group :gap="16">
  <!-- 间距为16px的单选框组 -->
</zc-radio-group>
```

## 注意事项

- 单选框组内部应该放置 `zc-radio` 组件
- 每个单选框需要设置 `value` 属性，用于标识选中的值，未设置则取label为选中值
- 水平布局时，单选框会自动换行
