# ZC Toast 轻提示组件

轻提示组件用于在页面顶部显示简短的消息提示，支持多种类型和自定义样式。

## 基本用法

```js
import { zcToast } from 'zc-ui-component'

// 显示普通提示
zcToast('这是一条提示消息')

// 显示成功提示
zcToast.success('操作成功')

// 显示错误提示
zcToast.error('操作失败')

// 显示警告提示
zcToast.warning('警告信息')
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| message | string | - | 提示内容 |
| duration | number | 2000 | 显示时间，单位毫秒，设为0则不会自动关闭 |
| color | string | - | 自定义颜色，会覆盖type对应的颜色 |
| type | 'normal'/'success'/'error'/'warning' | 'normal' | 提示类型 |

## 方法

| 方法名 | 说明 | 参数 | 返回值 |
|-------|------|------|-------|
| zcToast | 显示提示 | (content: string, options?: Partial<zcUIProps.Toast>) | number (提示的唯一ID) |
| zcToast.normal | 显示普通提示 | (content: string, options?: Omit<Partial<zcUIProps.Toast>, 'type'>) | number |
| zcToast.success | 显示成功提示 | (content: string, options?: Omit<Partial<zcUIProps.Toast>, 'type'>) | number |
| zcToast.error | 显示错误提示 | (content: string, options?: Omit<Partial<zcUIProps.Toast>, 'type'>) | number |
| zcToast.warning | 显示警告提示 | (content: string, options?: Omit<Partial<zcUIProps.Toast>, 'type'>) | number |
| zcToast.clear | 清除所有提示 | - | - |

## 样式定制

轻提示组件支持多种样式定制，可以通过属性设置提示的类型和颜色。

### 不同类型的提示

```js
// 成功提示
zcToast.success('操作成功')

// 错误提示
zcToast.error('操作失败')

// 警告提示
zcToast.warning('警告信息')

// 普通提示
zcToast.normal('普通信息')
```

### 自定义显示时间

```js
// 显示5秒后自动关闭
zcToast('这是一条提示消息', { duration: 5000 })

// 不自动关闭，需要手动点击关闭按钮
zcToast('这是一条需要手动关闭的提示', { duration: 0 })
```

### 自定义颜色

```js
// 自定义颜色的提示
zcToast('自定义颜色的提示', { color: '#8e44ad' })
```

## 多条提示的管理

轻提示组件支持同时显示多条提示，最多显示5条，超出时会自动移除最早的提示。

```js
// 连续显示多条提示
zcToast('第一条提示')
zcToast('第二条提示')
zcToast('第三条提示')

// 清除所有提示
zcToast.clear()
```

## 响应式设计

轻提示组件会根据设备类型自动调整样式：

- 在移动设备上（宽度 ≤ 768px），提示最大宽度为屏幕宽度的80%
- 在桌面设备上，提示最大宽度为屏幕宽度的60%

## 注意事项

- 提示默认显示2秒后自动关闭
- 同时最多显示5条提示，超出时会自动移除最早的提示
- 设置duration为0时，提示不会自动关闭，会显示关闭按钮
- 提示会根据type自动设置颜色，也可以通过color属性自定义颜色
- 提示内容支持换行和长文本，会自动进行换行处理
