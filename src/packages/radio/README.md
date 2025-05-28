# ZC radio 单选框组件

单选框组件用于在一组选项中进行多选。

## 基本用法

```vue
<zc-radio v-model="checked" label="选项1">选项1</zc-radio>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| modelValue | boolean | false | 单选框绑定值 |
| label | string | - | 单选框标签文本 |
| value | string/number | undefined | 单选框值，用于在单选框组中使用 |
| disabled | boolean | - | 是否禁用单选框 |

## 事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| update:modelValue | 单选框状态变化时触发 | boolean/(string\|number)[] |
| change | 单选框状态变化时触发 | boolean/(string\|number)[] |

## 插槽

| 插槽名 | 说明 |
|-------|------|
| default | 单选框标签内容，如果不提供则使用label属性 |

## 样式定制

单选框组件支持多种状态和样式。

### 基础单选框

```vue
<zc-radio v-model="checked" label="选项1"></zc-radio>
```

### 禁用状态

```vue
<zc-radio v-model="checked" label="禁用选项" disabled></zc-radio>
```

### 自定义内容

```vue
<zc-radio v-model="checked">
  <span>自定义内容</span>
</zc-radio>
```

## 单选框组

单选框可以与radioGroup组件一起使用，实现一组单选框的数据绑定。

```vue
<zc-radio-group v-model="checkedValues">
  <zc-radio label="选项1" value="1"></zc-radio>
  <zc-radio label="选项2" value="2"></zc-radio>
  <zc-radio label="选项3" value="3"></zc-radio>
</zc-radio-group>
```

## 无障碍访问

单选框组件支持键盘导航和焦点管理，增强了可访问性：

- 可以使用Tab键聚焦到单选框
- 可以使用Enter或空格键切换单选框状态
- 支持role="radio"属性
- 禁用状态下会阻止交互

## 注意事项

- 在单选框组中使用时，需要提供value属性
- 如果不提供插槽内容，将显示label属性作为标签文本
- 单选框在禁用状态下不会响应用户交互
