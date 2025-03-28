# ZC UI

[Github](https://github.com/leaveeel/zc-ui-component)

## 最近更新

- 1.5.6
  - 尝试处理ssg时报错

## 组件列表

### 基础组件

- [Button 按钮](src/packages/button)
- [ButtonGroup 按钮组](src/packages/buttonGroup)
- [Card 卡片](src/packages/card)
- [Icon 图标](src/packages/icon)

### 表单组件

- [Checkbox 复选框](src/packages/checkbox)
- [CheckboxGroup 复选框组](src/packages/checkboxGroup)
- [Form 表单](src/packages/form)
- [FormItem 表单项](src/packages/formItem)
- [Input 输入框](src/packages/input)

### 数据展示

- [Table 表格](src/packages/table)
- [Pagination 分页](src/packages/pagination)
- [Scroll 滚动容器](src/packages/scroll)

### 反馈组件

- [Dialog 对话框](src/packages/dialog)
- [Loading 加载](src/packages/loading)
- [MessageBox 消息框](src/packages/messageBox)
- [Toast 轻提示](src/packages/toast)
- [Tooltip 文字提示](src/packages/tooltip)

## 安装

```bash
npm install zc-ui-component
```

## 使用

```js
import { createApp } from 'vue'
import App from './App.vue'
import zcUIComponent from 'zc-ui-component'
import 'zc-ui-component/dist/zc-ui-component.css'

const app = createApp(App)
app.use(zcUIComponent)
app.mount('#app')
```

## 按需引入

```js
import { createApp } from 'vue'
import App from './App.vue'
import { zcButton, zcInput } from 'zc-ui-component'
import 'zc-ui-component/dist/zc-ui-component.css'

const app = createApp(App)
app.component('zc-button', zcButton)
app.component('zc-input', zcInput)
app.mount('#app')
```

## 注册全局组件

```js
import zcUIComponent, {
  zcMessage,
  zcToast
} from 'zc-ui-component'
import 'zc-ui-component/dist/zc-ui-component.css'

const app = createApp(App).use(zcUIComponent)

app.config.globalProperties.$toast = zcToast
app.config.globalProperties.$message = zcMessage

app.mount('#app')

// 在组件中使用
// const { proxy } = getCurrentInstance()
// proxy.$toast('这是一个提示')
// proxy.$message('这是一个消息')
```

## 注册指令

```js
import zcUIComponent, {
  loadingDirective,
} from 'zc-ui-component'
import 'zc-ui-component/dist/zc-ui-component.css'

const app = createApp(App).use(zcUIComponent)

app.directive('loading', loadingDirective)
app.mount('#app')


// 在组件中使用
// <div v-loading="true">加载中的内容</div>
```

## 主题

```scss
:root {
  --main-color: #29996c;
  --main-font-color: #555987;
  --main-danger-color: #f52828;
  --main-warning-color: #ff8a00;
  --main-warning-icon-color: #f39159;
  --main-success-color: #23c987;
  --main-font-family: PingFang SC;
}
```

## 更新日志

- 1.5.6
  - 尝试处理ssg时报错
  
- 1.5.5
  - 调整dialog组件关闭按钮位置
  - input优化，替换可见图标

- 1.5.4
  - 修复Form组件submit事件不触发的问题

- 1.5.3
  - 对1.5.0版本trigger不触发change校验的问题补充修复
  - 添加Form组件enterSubmit属性，实现按下Enter键提交表单

- 1.5.2
  - 修复Table表头滚动问题
  - 优化Dialog组件动画
  - 修复Form表单项禁用问题

- 1.5.1 移除滚动组件无用属性

- 1.5.0 修复表单验证问题
  - trigger设置为change时输入框没有正确触发验证
  - rule类型为对象时没有正确触发验证
