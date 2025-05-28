# ZC Button Group 按钮组组件

按钮组组件用于将多个按钮组合在一起，提供统一的布局和间距控制。

## 基本用法

```vue
<zc-button-group>
  <zc-button>按钮1</zc-button>
  <zc-button>按钮2</zc-button>
  <zc-button>按钮3</zc-button>
</zc-button-group>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| align | 'left'/'center'/'right' | 'left' | 按钮组对齐方式 |
| inline | boolean | false | 是否为行内按钮组 |
| vertical | boolean | false | 是否垂直排列 |
| gap | string/number | 10 | 按钮之间的间距 |
| disabled | boolean | false | 禁用状态 |

## 插槽

| 插槽名 | 说明 |
|-------|------|
| default | 按钮组内容，通常是多个按钮 |

## 样式定制

按钮组组件支持多种布局方式，可以通过属性设置按钮的排列方向和对齐方式。

### 对齐方式

```vue
<zc-button-group align="left">
  <!-- 左对齐按钮 -->
</zc-button-group>

<zc-button-group align="center">
  <!-- 居中对齐按钮 -->
</zc-button-group>

<zc-button-group align="right">
  <!-- 右对齐按钮 -->
</zc-button-group>
```

### 垂直排列

```vue
<zc-button-group vertical>
  <!-- 垂直排列的按钮 -->
</zc-button-group>
```

### 行内显示

```vue
<zc-button-group inline>
  <!-- 行内显示的按钮组 -->
</zc-button-group>
```

### 自定义间距

```vue
<zc-button-group :gap="20">
  <!-- 间距为20px的按钮组 -->
</zc-button-group>
```

## 注意事项

- 按钮组内部应该放置 `zc-button` 组件
- 垂直排列时，对齐方式会影响按钮的水平位置
- 行内显示时，按钮组会使用 `inline-flex` 布局
