# ZC Form 表单组件

表单组件用于收集、验证和提交数据，提供了灵活的布局和验证功能。

## 基本用法

```vue
<zc-form :model="formData" :rules="rules">
  <zc-form-item label="用户名" prop="username">
    <zc-input v-model="formData.username"></zc-input>
  </zc-form-item>
</zc-form>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| rules | Record<string, RuleItem\|RuleItem[]> | - | 表单验证规则 |
| model | Record<string, any> | - | 表单数据对象 |
| labelPosition | 'left'/'right'/'top' | 'left' | 表单标签位置 |
| labelWidth | string/number | - | 表单标签宽度 |
| scrollToError | boolean | false | 提交表单且校验不通过时，是否滚动到错误的表单项 |
| hideRequiredAsterisk | boolean | false | 是否隐藏必填字段的标签旁边的红色星号 |
| validateOnRuleChange | boolean | true | 是否在rules属性改变后立即触发一次验证 |
| disabled | boolean | false | 是否禁用该表单内的所有组件 |
| enterSubmit | boolean | false | 是否在按下Enter键时提交表单 |

## 事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| validate | 表单验证完成时触发 | (isValid: boolean, invalidFields?: Record<string, string>) |
| submit | 表单提交时触发（当enterSubmit为true且按下Enter键时） | - |

## 方法

| 方法名 | 说明 | 参数 | 返回值 |
|-------|------|------|-------|
| validate | 对整个表单进行验证 | (callback?: (isValid: boolean, invalidFields?: Record<string, string>) => void) | Promise< boolean > |
| validateField | 对表单指定字段进行验证 | (prop: string) | Promise< boolean > |
| resetFields | 重置表单 | - | - |
| clearValidate | 清除表单验证信息 | (props?: string \| string[]) | - |

## 插槽

| 插槽名 | 说明 |
|-------|------|
| default | 表单内容，通常是多个表单项 |

## 表单验证

表单组件支持多种验证规则和验证方式。

### 基础验证

```vue
<zc-form :model="form" :rules="rules">
  <zc-form-item label="用户名" prop="username">
    <zc-input v-model="form.username"></zc-input>
  </zc-form-item>
</zc-form>

<script setup>
const form = reactive({
  username: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ]
}
</script>
```

### 自定义验证

```vue
<zc-form :model="form" :rules="rules">
  <zc-form-item label="密码" prop="password">
    <zc-input v-model="form.password" type="password"></zc-input>
  </zc-form-item>
</zc-form>

<script setup>
const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度不能小于6位'))
  } else {
    callback()
  }
}

const rules = {
  password: [
    { validator: validatePassword, trigger: 'blur' }
  ]
}
</script>
```

## 表单布局

表单组件支持多种布局方式，可以通过属性设置标签的位置和宽度。

### 标签位置

```vue
<zc-form :model="form" labelPosition="top">
  <!-- 标签在顶部的表单 -->
</zc-form>

<zc-form :model="form" labelPosition="left">
  <!-- 标签在左侧的表单 -->
</zc-form>

<zc-form :model="form" labelPosition="right">
  <!-- 标签在右侧的表单 -->
</zc-form>
```

### 标签宽度

```vue
<zc-form :model="form" labelWidth="120px">
  <!-- 标签宽度为120px的表单 -->
</zc-form>
```

## 禁用状态

```vue
<zc-form :model="form" disabled>
  <!-- 整个表单被禁用 -->
</zc-form>
```

## 回车提交表单

```vue
<zc-form :model="form" :rules="rules" enterSubmit @submit="handleSubmit">
  <!-- 按下Enter键时会触发表单验证，验证通过后触发submit事件 -->
</zc-form>

<script setup>
const handleSubmit = () => {
  // 处理表单提交
  console.log('表单提交成功')
}
</script>
```

## 注意事项

- 表单验证需要配合FormItem组件使用，并设置prop属性
- 表单数据对象model必须是响应式的
- 验证规则中的trigger可以是'blur'或'change'
- 禁用表单会禁用所有表单项
- 使用enterSubmit属性可以实现按下Enter键提交表单的功能
