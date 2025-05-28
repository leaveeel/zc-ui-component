# ZC checkbox Group 复选框组组件

复选框组组件用于管理一组相关的复选框，提供统一的数据绑定和布局控制。

## 基本用法

```vue
<zc-checkbox-group v-model="checkedValues">
  <zc-checkbox label="选项1" value="1"></zc-checkbox>
  <zc-checkbox label="选项2" value="2"></zc-checkbox>
  <zc-checkbox label="选项3" value="3"></zc-checkbox>
</zc-checkbox-group>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| modelValue | string \| number | - | 复选框组选中值的数组 |
| align | 'left'/'center'/'right' | 'left' | 按钮组对齐方式 |
| inline | boolean | false | 是否为行内按钮组 |
| vertical | boolean | false | 是否垂直排列 |
| gap | string/number | 10 | 按钮之间的间距 |
| disabled | boolean | false | 禁用状态 |

## 事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| update:modelValue | 复选框组选中值变化时触发 | string \| number |
| change | 复选框组选中值变化时触发 | string \| number |

## 插槽

| 插槽名 | 说明 |
|-------|------|
| default | 复选框组内容，通常是多个复选框 |

## 样式定制

复选框组组件支持多种布局方式，可以通过属性设置复选框的排列方向和间距。

### 垂直布局

```vue
<zc-checkbox-group vertical>
</zc-checkbox-group>
```

### 自定义间距

```vue
<zc-checkbox-group :gap="16">
  <!-- 间距为16px的复选框组 -->
</zc-checkbox-group>
```

## 注意事项

- 复选框组内部应该放置 `zc-checkbox` 组件
- 每个复选框需要设置 `value` 属性，用于标识选中的值，未设置则取label为选中值
- 水平布局时，复选框会自动换行
