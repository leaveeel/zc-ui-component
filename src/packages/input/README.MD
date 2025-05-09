# ZC Input 输入框组件

输入框组件用于接收用户的文本输入，支持普通输入框和文本域两种形式。

## 基本用法

```vue
<zc-input v-model="input" placeholder="请输入内容"></zc-input>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| tip | string | - | 输入框提示信息 |
| modelValue | string | - | 输入框绑定值 |
| autocomplete | string | 'off' | 自动完成属性 |
| type | 'text'/'password'/'textarea'/'number'/'email'/'tel'/'url' | 'text' | 输入框类型 |
| clearable | boolean | false | 是否可清空 |
| showPassword | boolean | false | 是否显示密码切换按钮 |
| disabled | boolean | - | 是否禁用 |
| placeholder | string | '' | 输入框占位文本 |
| maxlength | number | - | 最大输入长度 |
| resize | boolean | false | 文本域是否可调整大小 |
| min | number | - | 最小值 |
| max | number | - | 最大值 |

## 事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| update:modelValue | 输入值变化时触发 | string |
| input | 输入值变化时触发 | string |
| blur | 输入框失去焦点时触发 | string |
| focus | 输入框获得焦点时触发 | Event |
| clear | 点击清空按钮时触发 | - |

## 样式定制

输入框组件支持多种样式定制，可以通过属性设置输入框的类型、大小和外观。

### 基础输入框

```vue
<zc-input v-model="input" placeholder="请输入内容"></zc-input>
```

### 文本域

```vue
<zc-input v-model="textarea" type="textarea" placeholder="请输入多行文本"></zc-input>
```

### 可调整大小的文本域

```vue
<zc-input v-model="textarea" type="textarea" :resize="true" placeholder="可调整大小的文本域"></zc-input>
```

### 密码输入框

```vue
<zc-input v-model="password" type="password" placeholder="请输入密码"></zc-input>
```

### 可清空输入框

```vue
<zc-input v-model="input" clearable placeholder="可清空的输入框"></zc-input>
```

### 带提示信息

```vue
<zc-input v-model="input" tip="这是一条提示信息" placeholder="请输入内容"></zc-input>
```

### 禁用状态

```vue
<zc-input v-model="input" disabled placeholder="禁用的输入框"></zc-input>
```

### 自定义高度

```vue
<zc-input v-model="input" :height="60" placeholder="高度为60px的输入框"></zc-input>
```

## 与表单组件配合使用

输入框组件通常与表单组件配合使用，实现表单数据的收集和验证。

```vue
<zc-form :model="form" :rules="rules">
  <zc-form-item label="用户名" prop="username">
    <zc-input v-model="form.username" placeholder="请输入用户名"></zc-input>
  </zc-form-item>
  <zc-form-item label="密码" prop="password">
    <zc-input v-model="form.password" type="password" placeholder="请输入密码"></zc-input>
  </zc-form-item>
</zc-form>
```

## 注意事项

- 输入框默认宽度为100%，会自动适应父容器宽度
- 文本域默认最小高度为80px
- 当与表单组件配合使用时，会自动显示表单验证的错误信息
- 禁用状态下，输入框会变为半透明且不响应用户交互
