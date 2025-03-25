

























# ZC Tooltip 文字提示组件

文字提示组件用于在鼠标悬停或点击元素时显示简短的提示信息，支持多种位置和触发方式。

## 基本用法

```vue
<zc-tooltip content="这是一个提示文本">
  <button>鼠标悬停查看提示</button>
</zc-tooltip>
```















## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| content | string | - | 提示内容 |
| width | string/number | '100%' | 提示框宽度 |
| height | string/number | 'auto' | 提示框高度 |
| position | 'top'/'bottom'/'left'/'right' | 'top' | 提示框出现的位置 |
| trigger | 'hover'/'click' | 'hover' | 触发方式 |
| theme | 'light'/'dark' | 'light' | 提示框主题 |
| arrow | boolean | true | 是否显示箭头 |
| zIndex | number | 1000 | 提示框的z-index |
| showDelay | number | 0 | 显示延迟时间(毫秒) |
| hideDelay | number | 200 | 隐藏延迟时间(毫秒) |

## 插槽

| 插槽名 | 说明 |
|-------|------|
| default | 触发提示的元素 |
| content | 自定义提示内容 |

## 样式定制

文字提示组件支持多种样式定制，可以通过属性设置提示框的位置、主题和触发方式。

### 不同位置的提示

```vue
<zc-tooltip content="顶部提示" position="top">
  <button>顶部</button>
</zc-tooltip>

<zc-tooltip content="底部提示" position="bottom">
  <button>底部</button>
</zc-tooltip>

<zc-tooltip content="左侧提示" position="left">
  <button>左侧</button>
</zc-tooltip>

<zc-tooltip content="右侧提示" position="right">
  <button>右侧</button>
</zc-tooltip>
```















### 不同主题的提示

```vue
<zc-tooltip content="浅色主题" theme="light">
  <button>浅色</button>
</zc-tooltip>

<zc-tooltip content="深色主题" theme="dark">
  <button>深色</button>
</zc-tooltip>
```















### 不同触发方式

```vue
<zc-tooltip content="悬停触发" trigger="hover">
  <button>悬停触发</button>
</zc-tooltip>

<zc-tooltip content="点击触发" trigger="click">
  <button>点击触发</button>
</zc-tooltip>
```















### 自定义宽度和高度

```vue
<zc-tooltip content="自定义宽度的提示" width="200px">
  <button>自定义宽度</button>
</zc-tooltip>

<zc-tooltip content="自定义高度的提示" height="100px">
  <button>自定义高度</button>
</zc-tooltip>
```















### 不显示箭头

```vue
<zc-tooltip content="无箭头提示" :arrow="false">
  <button>无箭头</button>
</zc-tooltip>
```















### 延迟显示和隐藏

```vue
<zc-tooltip content="延迟显示" :show-delay="500">
  <button>延迟显示</button>
</zc-tooltip>

<zc-tooltip content="延迟隐藏" :hide-delay="1000">
  <button>延迟隐藏</button>
</zc-tooltip>
```















## 自定义内容

使用content插槽可以自定义提示内容，支持HTML和组件。

```vue
<zc-tooltip>
  <button>自定义内容</button>
  <template #content>
    <div>
      <h4>自定义标题</h4>
      <p>这是一段<strong>自定义内容</strong></p>
      <a href="#">链接</a>
    </div>
  </template>
</zc-tooltip>
```















## 注意事项

- 当提示内容较长时，会自动添加滚动条
- hover触发方式下，鼠标移入提示框内容区域不会导致提示消失
- click触发方式下，点击页面其他区域会关闭提示
- 提示框会根据position属性自动调整箭头位置
- 当内容超出高度时，会显示滚动条
