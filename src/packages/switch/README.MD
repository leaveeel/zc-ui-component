# ZC switch 开关组件

开关组件用于简单的状态切换。

## 基本用法

```vue
<zc-switch v-model="value"></zc-switch>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| modelValue | string \| number \| boolean | false | 绑定值 |
| value | string \| number | undefined | 单选框值，用于在单选框组中使用 |
| disabled | boolean | - | 是否禁用开关 |
| beforeChange | Promise \| boolean | - | 切换前执行函数，需返回true或resolve继续执行 |
| activeValue | string \| number \| boolean | true | 打开时的值 |
| inactiveValue | string \| number \| boolean | false | 关闭时的值 |

## 事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| update:modelValue | 状态变化时触发 | string \| number \| boolean |
| change | 状态变化时触发 | string \| number \| boolean |

## 插槽

| 插槽名 | 说明 |
|-------|------|
| default | 开关文本 |

## 用法

### 基础

```vue
<zc-switch v-model="value"></zc-switch>
```

### 禁用状态

```vue
<zc-switch v-model="value" disabled></zc-switch>
```

### 自定义内容

```vue
<zc-switch v-model="checked">
  <span>自定义内容</span>
</zc-switch>
```

## 无障碍访问

开关组件支持键盘导航和焦点管理，增强了可访问性：

- 可以使用Tab键聚焦到单选框
- 可以使用Enter或空格键切换单选框状态
- 支持role="switch"属性
- 禁用状态下会阻止交互
