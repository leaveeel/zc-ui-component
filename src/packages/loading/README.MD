







# ZC Loading 加载组件

加载组件用于在页面或元素上显示加载状态，支持全屏加载和局部加载。

## 基本用法

### 指令方式

```vue
<div v-loading="true">加载中的内容</div>
```





### 服务方式

```js
import { zcLoading } from '@/packages/loading/zc-loading'

// 显示全屏加载
zcLoading.show()

// 隐藏加载
zcLoading.hide()
```





## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| size | string/number | 50 | 加载图标大小 |
| color | string | 'var(--main-color)' | 加载图标颜色 |
| text | string | '' | 加载提示文本 |
| timeout | number | 0 | 自动关闭时间(毫秒)，0表示不自动关闭 |
| background | string | 'rgba(255, 255, 255, 0.7)' | 加载遮罩背景色 |
| fullscreen | boolean | false | 是否全屏显示 |

## 方法

### 指令方式

| 用法 | 说明 |
|------|------|
| v-loading="true" | 显示加载状态 |
| v-loading="false" | 隐藏加载状态 |
| v-loading="{ loading: true, text: '加载中...' }" | 带配置的加载状态 |

### 服务方式

| 方法 | 说明 | 参数 |
|------|------|------|
| zcLoading.show() | 显示全屏加载 | - |
| zcLoading.hide() | 隐藏加载 | - |
| useLoading(options) | 创建自定义加载实例 | LoadingOptions |

## 自定义加载实例

```js
import { useLoading } from '@/packages/loading/zc-loading'

// 创建加载实例
const loading = useLoading({
  text: '加载中...',
  color: '#ff0000',
  el: document.querySelector('.container') // 指定挂载元素
})

// 显示加载
loading.show()

// 隐藏加载
loading.hide()

// 更新配置
loading.updateOptions({
  text: '正在处理...',
  timeout: 3000
})
```





## 全局配置

```js
import { setLoadingDefaultOptions } from '@/packages/loading/zc-loading'

// 设置全局默认配置
setLoadingDefaultOptions({
  size: 40,
  color: '#409EFF',
  background: 'rgba(0, 0, 0, 0.5)',
  text: '加载中'
})
```





## 样式定制

加载组件支持多种样式定制，可以通过属性设置加载图标的大小、颜色和背景等样式。

### 自定义文本

```vue
<div v-loading="{ loading: true, text: '正在加载数据...' }">
  加载中的内容
</div>
```





### 自定义颜色和大小

```vue
<div v-loading="{ loading: true, color: '#ff0000', size: 60 }">
  加载中的内容
</div>
```





### 自定义背景

```vue
<div v-loading="{ loading: true, background: 'rgba(0, 0, 0, 0.7)' }">
  加载中的内容
</div>
```





### 自动关闭

```vue
<div v-loading="{ loading: true, timeout: 3000 }">
  3秒后自动关闭的加载
</div>
```





## 与其他组件配合使用

加载组件可以与其他组件配合使用，如表单、卡片、对话框等。

```vue
<zc-form v-loading="loading">
  <!-- 表单内容 -->
</zc-form>

<zc-card v-loading="loading">
  <!-- 卡片内容 -->
</zc-card>

<zc-dialog :loading="loading">
  <!-- 对话框内容 -->
</zc-dialog>
```





## 注意事项

- 使用指令方式时，如果目标元素的position为static，会自动设置为relative
- 全屏加载会固定在视口，局部加载会相对于目标元素定位
- 设置timeout后，加载会在指定时间后自动关闭
- 组件卸载时会自动清除定时器
