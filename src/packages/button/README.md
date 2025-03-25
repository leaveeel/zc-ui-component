# ZC Button 按钮组件

按钮组件是一个常用的交互元素，用于触发操作。

## 基本用法

```vue
<zc-button>默认按钮</zc-button>
<zc-button plain>朴素按钮</zc-button>
<zc-button text>文本按钮</zc-button>
<zc-button loading>加载中</zc-button>
<zc-button disabled>禁用按钮</zc-button>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| plain | boolean | false | 是否为朴素按钮（仅显示边框） |
| text | boolean | false | 是否为文本按钮（无边框和背景） |
| inline | boolean | false | 是否为行内按钮 |
| width | string/number | 'auto' | 按钮宽度 |
| height | string/number | '40' | 按钮高度 |
| size | string/number | 16 | 按钮字体大小 |
| radius | string/number | 6 | 按钮圆角大小 |
| color | string | - | 按钮文字颜色 |
| background | string | - | 按钮背景颜色 |
| borderColor | string | - | 按钮边框颜色 |
| border | string/number | 1 | 按钮边框宽度 |
| loading | boolean | false | 是否显示加载状态 |
| disabled | boolean | - | 是否禁用按钮 |
| htmlType | 'button'/'submit'/'reset' | 'button' | 原生button类型 |

## 事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| click | 点击按钮时触发 | MouseEvent |

## 插槽

| 插槽名 | 说明 |
|-------|------|
| default | 按钮内容 |
| icon | 按钮图标，loading状态下不显示 |

## 样式定制

按钮组件支持多种样式定制，可以通过属性设置按钮的宽高、颜色、边框等样式。

### 朴素按钮

```vue
<zc-button plain>朴素按钮</zc-button>
```

### 文本按钮

```vue
<zc-button text>文本按钮</zc-button>
```

### 自定义颜色

```vue
<zc-button color="#ff0000">红色文字</zc-button>
<zc-button background="#ff0000">红色背景</zc-button>
<zc-button borderColor="#ff0000">红色边框</zc-button>
```

### 加载状态

```vue
<zc-button loading>加载中</zc-button>
```

### 禁用状态

```vue
<zc-button disabled>禁用按钮</zc-button>
```

## 无障碍访问

按钮组件支持键盘导航和焦点管理，增强了可访问性：

- 可以使用Tab键聚焦到按钮
- 可以使用Enter或空格键触发按钮点击
- 禁用状态和加载状态下会阻止点击事件
- 支持aria-disabled和aria-busy属性

## 注意事项

- 在表单中使用时，可以设置htmlType为"submit"或"reset"
- 按钮在禁用或加载状态下不会触发点击事件
- 文本按钮没有背景色和边框
