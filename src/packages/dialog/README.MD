# ZC Dialog 对话框组件

对话框组件用于在不离开当前页面的情况下与用户进行交互，如展示信息、请求用户输入或确认操作。

## 基本用法

```vue
<zc-dialog v-model="visible">
  <div>对话框内容</div>
</zc-dialog>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| modelValue | boolean | - | 对话框是否可见 |
| padding | string/number | '24px 32px' | 对话框内边距 |
| closeOnClickModal | boolean | true | 点击遮罩层是否关闭对话框 |
| closeIcon | boolean | - | 是否显示关闭图标 |
| width | string/number | '50%' | 对话框宽度 |
| minWidth | string/number | 'auto' | 对话框最小宽度 |
| loading | boolean | false | 是否显示加载状态 |
| closeOnPressEscape | boolean | true | 是否在按下 Escape 键时关闭对话框 |
| title | string | - | 标题 |

## 事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| update:modelValue | 对话框可见状态变化时触发 | boolean |
| cancel | 对话框关闭时触发 | - |

## 插槽

| 插槽名 | 说明 |
|-------|------|
| default | 对话框主体内容 |
| header | 对话框头部内容 |
| footer | 对话框底部内容，通常放置操作按钮 |

## 样式定制

对话框组件支持多种样式定制，可以通过属性设置对话框的尺寸、内边距等样式。

### 带标题的对话框

```vue
<zc-dialog v-model="visible">
  <template #header>
    <h3>对话框标题</h3>
  </template>
  <div>对话框内容</div>
</zc-dialog>
```

### 带底部按钮的对话框

```vue
<zc-dialog v-model="visible">
  <div>对话框内容</div>
  <template #footer>
    <zc-button @click="visible = false">取消</zc-button>
    <zc-button @click="handleConfirm">确认</zc-button>
  </template>
</zc-dialog>
```

### 自定义宽度

```vue
<zc-dialog v-model="visible" width="600px">
  <div>自定义宽度的对话框</div>
</zc-dialog>
```

### 显示关闭图标

```vue
<zc-dialog v-model="visible" :closeIcon="true">
  <div>带关闭图标的对话框</div>
</zc-dialog>
```

## 加载状态

```vue
<zc-dialog v-model="visible" :loading="true">
  <div>加载中的对话框</div>
</zc-dialog>
```

## 无障碍访问

对话框组件支持键盘导航和屏幕阅读器，增强了可访问性：

- 可以使用 Escape 键关闭对话框
- 支持 role="dialog" 和 aria-modal="true" 属性
- 关闭按钮有 aria-label="Close Dialog" 属性

## 注意事项

- 对话框默认宽度为50%，最大宽度为80%
- 对话框高度会根据内容自适应，最大高度为视口高度的90%
- 当内容超出对话框高度时，会显示滚动条
- 加载状态下，关闭按钮和点击遮罩层关闭功能会被禁用
