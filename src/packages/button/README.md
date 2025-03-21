# `zc-button`按钮组件

## 基础用法

```vue
<zc-button>默认按钮</zc-button>
<zc-button plain>朴素按钮</zc-button>
<zc-button text>文本按钮</zc-button>
<zc-button loading>加载中</zc-button>
<zc-button disabled>禁用按钮</zc-button>
```

## 事件处理

```vue
<zc-button @click="handleClick">点击事件</zc-button>
<zc-button @click.stop="handleClickWithStop">阻止冒泡</zc-button>
```

## 自定义图标

```vue
<zc-button>
  <template #icon>
    <zc-icon name="search"></zc-icon>
  </template>
  带图标的按钮
</zc-button>
```

## 自定义样式

```vue
<zc-button 
  color="#ff5500" 
  background="#f5f5f5" 
  border-color="#ff5500"
  :radius="10"
  :size="18"
>
  自定义样式按钮
</zc-button>
```

## 属性列表

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| width | string \| number | 'auto' | 按钮宽度 |
| height | string \| number | '40' | 按钮高度 |
| size | number | 16 | 字体大小 |
| radius | number | 6 | 圆角大小 |
| border | number | 1 | 边框宽度 |
| htmlType | string | 'button' | 原生 button 的 type 属性 |
| disabled | boolean | false | 是否禁用 |
| loading | boolean | - | 是否显示加载状态 |
| plain | boolean | - | 是否为朴素按钮 |
| text | boolean | - | 是否为文本按钮 |
| color | string | - | 文字颜色 |
| background | string | - | 背景颜色 |
| borderColor | string | - | 边框颜色 |
| inline | boolean | - | 是否为内联按钮 |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 按钮内容 |
| icon | 按钮图标，loading 状态下不显示 |

## 事件

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| click | 点击按钮时触发 | MouseEvent |

## 注意事项

1. 当按钮处于 `disabled` 或 `loading` 状态时，点击事件不会触发
2. 使用 `@click.stop` 可以阻止事件冒泡
3. 按钮支持键盘导航，按下 Enter 或空格键可触发点击事件

## 示例

```vue
<template>
  <div class="button-demo">
    <h3>基础按钮</h3>
    <div class="demo-row">
      <zc-button @click="handleClick">默认按钮</zc-button>
      <zc-button plain>朴素按钮</zc-button>
      <zc-button text>文本按钮</zc-button>
    </div>
    
    <h3>状态按钮</h3>
    <div class="demo-row">
      <zc-button loading>加载中</zc-button>
      <zc-button disabled>禁用按钮</zc-button>
    </div>
    
    <h3>自定义样式</h3>
    <div class="demo-row">
      <zc-button color="#fff" background="#67c23a">成功按钮</zc-button>
      <zc-button color="#fff" background="#f56c6c">危险按钮</zc-button>
      <zc-button color="#fff" background="#e6a23c">警告按钮</zc-button>
      <zc-button color="#fff" background="#909399">信息按钮</zc-button>
    </div>
  </div>
</template>

<script setup>
const handleClick = () => {
  alert('按钮被点击了！')
}
</script>

<style scoped>
.demo-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
```
