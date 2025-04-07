# ZC Loading 加载组件

加载组件用于在页面或元素上显示加载状态，支持全屏加载和局部加载。

## 基本用法

###

#### 指令方式

```vue
<div v-loading="true">加载中的内容</div>
```

#### 服务方式

```js
import { zcLoading } from 'zc-ui-component'

// 显示全屏加载
zcLoading.show()

// 隐藏加载
zcLoading.hide()
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| size | string/number | 50 | 加载图标大小 |
| color | string | '#29996c' | 加载图标颜色 |
| text | string | '' | 加载提示文本 |
| timeout | number | 0 | 自动关闭时间(毫秒)，0表示不自动关闭 |
| background | string | 'rgba(255, 255, 255, 0.7)' | 加载遮罩背景色 |
| fullscreen | boolean | false | 是否全屏显示 |
| fontSize | string/number | 14 | 加载文本字体大小 |
| el | HTMLElement | document.body | 挂载的DOM元素 |

## 方法

| 方法 | 说明 | 参数 |
|------|------|------|
| zcLoading.show() / zcLoading.hide() | 显示/隐藏全屏加载 | - |
| zcLoading(options) | 加载配置 | - |
| zcLoading.updateOptions(options) | 更新加载配置 | LoadingOptions |

## 配置

加载组件支持多种样式定制，可以指令方式可以通过`dataset`设置，服务方式通过`updateOptions(options)`或`zcLoading(options)`设置。

```html
  <!-- 指令方式 -->
  <div 
    v-loading="isLoading" 
    data-text="加载中" 
    data-color="#409EFF"
    data-size="40"
    data-background="rgba(0, 0, 0, 0.7)"
    data-font-size="16"
  >
    内容区域
  </div>
```

```javascript
// 服务方式
const loading = zcLoading({
  text: '加载中...',
  background: 'rgba(255, 255, 255, 0.9)'
})

// 显示加载
loading.show()

// 隐藏加载
loading.hide()

// 动态更新配置
loading.updateOptions({
  text: '数据处理中...',
  color: '#67C23A'
})
```

## 注意事项

- 指令方式只支持布尔值控制显示/隐藏，配置需通过 `data-*` 属性设置。
- 使用指令方式时，如果目标元素的`position`为`static`，会自动设置为`relative`
- 服务方式的 `zcLoading` 支持两种调用形式:
  - 函数调用：`zcLoading(options).show()`
  - 对象调用：`zcLoading.show()`
- 全屏加载会固定在视口，局部加载会相对于目标元素定位
- 设置timeout后，加载会在指定时间后自动关闭
- 组件卸载时会自动清除定时器
