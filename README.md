

# ZC UI

基于 Vue 3 + TypeScript 


## 最近更新


## 组件列表

### 基础组件
- [Button 按钮](src/packages/button/README.MD)
- [ButtonGroup 按钮组](src/packages/buttonGroup/README.MD)
- [Card 卡片](src/packages/card/README.MD)
- [Icon 图标](src/packages/icon/README.MD)

### 表单组件
- [Checkbox 复选框](src/packages/checkbox/README.MD)
- [CheckboxGroup 复选框组](src/packages/checkboxGroup/README.MD)
- [Form 表单](src/packages/form/README.MD)
- [FormItem 表单项](src/packages/formItem/README.MD)
- [Input 输入框](src/packages/input/README.MD)

### 数据展示
- [Table 表格](src/packages/table/README.MD)
- [Pagination 分页](src/packages/pagination/README.MD)
- [Scroll 滚动容器](src/packages/scroll/README.MD)

### 反馈组件
- [Dialog 对话框](src/packages/dialog/README.MD)
- [Loading 加载](src/packages/loading/README.MD)
- [MessageBox 消息框](src/packages/messageBox/README.MD)
- [Toast 轻提示](src/packages/toast/README.MD)
- [Tooltip 文字提示](src/packages/tooltip/README.MD)

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

const app = createApp(App).use(createPinia()).use(router).use(zcUIComponent)

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

const app = createApp(App).use(createPinia()).use(router).use(zcUIComponent)

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
