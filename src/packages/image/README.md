# zcImage 图片组件

用于在页面上展示图片，支持懒加载、加载失败提示和无图片占位等功能。

## 基础用法

```vue
<template>
  <zc-image
    src="https://example.com/image.jpg"
    width="300px"
    height="200px"
  />
</template>
```

## 懒加载

当图片进入可视区域时才进行加载，可以提高页面性能。

```vue
<template>
  <zc-image
    src="https://example.com/image.jpg"
    width="300px"
    height="200px"
    lazy
  />
</template>
```

## 加载失败

当图片加载失败时，会显示加载失败提示。你可以通过插槽自定义加载失败内容。

```vue
<template>
  <zc-image
    src="https://example.com/not-exist.jpg"
    width="300px"
    height="200px"
  >
    <template #error>
      <div>
        <p>图片加载失败</p>
        <p>请稍后重试</p>
      </div>
    </template>
  </zc-image>
</template>
```

## 自定义占位内容

当图片未加载完成时，会显示占位内容。你可以通过插槽自定义占位内容。

```vue
<template>
  <zc-image
    src="https://example.com/image.jpg"
    width="300px"
    height="200px"
  >
    <template #placeholder>
      <div>
        <p>图片加载中...</p>
      </div>
    </template>
  </zc-image>
</template>
```

## 多种填充模式

通过`objectFit`属性设置图片的填充模式。

```vue
<template>
  <zc-image
    src="https://example.com/image.jpg"
    width="300px"
    height="200px"
    object-fit="contain"
  />
</template>
```

## 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| src | 图片源地址 | string | — | — |
| width | 图片宽度 | string / number | — | auto |
| height | 图片高度 | string / number | — | auto |
| object-fit | 图片填充模式 | string | fill / contain / cover / none / scale-down | cover |
| alt | 图片描述 | string | — | — |
| lazy | 是否开启懒加载 | boolean | — | false |
| threshold | 懒加载阈值，表示图片与可视区域的交叉比例达到多少时加载 | number | 0-1之间 | 0.1 |

## 事件

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| load | 图片加载成功时触发 | — |
| error | 图片加载失败时触发 | — |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| placeholder | 自定义占位内容 |
| error | 自定义加载失败内容 |
