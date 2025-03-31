# ZC Icon 图标组件

图标组件用于展示各种图标，支持自定义大小、颜色和旋转效果。

## 基本用法

```vue
<zc-icon>
  <svg>...</svg>
</zc-icon>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| size | string/number | 24 | 图标大小 |
| color | string | 'var(--main-font-color)' | 图标颜色 |
| spin | boolean | false | 是否旋转 |
| rotate | number | 0 | 旋转角度 |
| disabled | boolean | false | 是否禁用 |

## 事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| click | 点击图标时触发 | MouseEvent |

## 插槽

| 插槽名 | 说明 |
|-------|------|
| default | 图标内容，通常是SVG元素 |

## 样式定制

图标组件支持多种样式定制，可以通过属性设置图标的大小、颜色和旋转效果。

### 自定义大小

```vue
<zc-icon :size="32">
  <svg>...</svg>
</zc-icon>
```

### 自定义颜色

```vue
<zc-icon color="#ff0000">
  <svg>...</svg>
</zc-icon>
```

### 旋转效果

```vue
<zc-icon spin>
  <svg>...</svg>
</zc-icon>
```

### 旋转角度

```vue
<zc-icon :rotate="45">
  <svg>...</svg>
</zc-icon>
```

### 禁用状态

```vue
<zc-icon disabled>
  <svg>...</svg>
</zc-icon>
```

## 与其他组件配合使用

图标组件通常与其他组件配合使用，如按钮、输入框等。

```vue
<zc-button>
  <zc-icon>
    <svg>...</svg>
  </zc-icon>
  按钮文本
</zc-button>
```

## 注意事项

- 图标组件内部需要放置SVG元素
- 图标大小会影响容器的尺寸
- 禁用状态下，图标会变为半透明且不响应点击事件
- 旋转角度和旋转效果可以同时使用
