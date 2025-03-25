









# ZC Message Box 消息框组件

消息框组件用于显示重要提示信息，并提供确认和取消操作。

## 基本用法

```js
import { zcMessage } from '@/packages/messageBox/zc-messageBox'

// 显示消息框
zcMessage({
  title: '提示',
  message: '确认执行此操作吗？'
}).then(() => {
  // 用户点击确认按钮
  console.log('用户确认')
}).catch(() => {
  // 用户点击取消按钮
  console.log('用户取消')
})
```






## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| title | string | - | 消息框标题 |
| message | string | - | 消息框内容 |
| showConfirm | boolean | true | 是否显示确认按钮 |
| confirmText | string | 'Confirm' | 确认按钮文本 |
| confirmClass | string | - | 确认按钮样式类 |
| showCancel | boolean | true | 是否显示取消按钮 |
| cancelText | string | 'Cancel' | 取消按钮文本 |
| cancelClass | string | - | 取消按钮样式类 |
| beforeClose | (action: string, instance: any, done: () => void) => void | - | 关闭前的回调函数 |
| callback | (state: Record<string, any>) => void | - | 关闭后的回调函数 |
| loading | boolean | false | 是否显示加载状态 |

## 方法

| 方法 | 说明 | 返回值 |
|------|------|-------|
| zcMessage(options) | 显示消息框 | Promise<string> |

## 插槽

消息框组件支持通过选项传递内容，也可以通过插槽自定义内容。

| 插槽名 | 说明 |
|-------|------|
| default | 消息框内容，会替代message属性 |

## 样式定制

消息框组件支持多种样式定制，可以通过属性设置按钮的文本和样式。

### 自定义按钮文本

```js
zcMessage({
  title: '提示',
  message: '确认删除此项目吗？',
  confirmText: '删除',
  cancelText: '取消'
})
```






### 自定义按钮样式

```js
zcMessage({
  title: '警告',
  message: '此操作不可逆，请确认',
  confirmClass: 'danger-button',
  cancelClass: 'normal-button'
})
```






### 只显示确认按钮

```js
zcMessage({
  title: '提示',
  message: '操作已完成',
  showCancel: false
})
```






## 加载状态

消息框支持显示加载状态，在执行异步操作时特别有用。

```js
const messageInstance = zcMessage({
  title: '保存',
  message: '正在保存数据...',
  beforeClose: (action, state, done) => {
    if (action === 'confirm') {
      state.loading = true
      
      // 模拟异步操作
      setTimeout(() => {
        state.loading = false
        done()
      }, 2000)
    } else {
      done()
    }
  }
})
```






## 关闭前回调

可以在关闭前执行自定义逻辑，例如二次确认或异步操作。

```js
zcMessage({
  title: '确认',
  message: '确认提交表单吗？',
  beforeClose: (action, state, done) => {
    if (action === 'confirm') {
      // 执行提交操作
      submitForm().then(() => {
        done() // 操作完成后关闭
      })
    } else {
      done() // 直接关闭
    }
  }
})
```






## 关闭后回调

可以在消息框关闭后执行回调函数。

```js
zcMessage({
  title: '操作',
  message: '选择一个操作',
  callback: (state) => {
    console.log('消息框已关闭', state)
  }
})
```






## 注意事项

- 消息框会创建一个独立的DOM元素，关闭后会自动移除
- 点击确认按钮会resolve Promise，点击取消按钮会reject Promise
- 在加载状态下，点击遮罩层不会关闭消息框
- 消息框基于Dialog组件实现，继承了Dialog的部分特性
