# ZC Form Item 表单项组件

表单项组件用于在表单中创建单个表单字段，提供标签、验证和错误提示功能。

## 基本用法

```vue
<zc-form-item label="用户名" prop="username">
  <zc-input v-model="form.username"></zc-input>
</zc-form-item>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| label | string | - | 表单项标签 |
| prop | string | - | 表单项属性，对应form model中的字段 |
| rules | RuleItem\|RuleItem[] | - | 表单项验证规则 |
| required | boolean | false | 是否必填 |
| labelWidth | string/number | - | 表单项标签宽度 |
| labelPosition | 'left'/'right'/'top' | - | 表单项标签位置 |
| error | string | - | 表单域验证错误信息 |
| showMessage | boolean | true | 是否显示校验错误信息 |
| disabled | boolean | - | 是否禁用表单项 |

## 方法

| 方法名 | 说明 | 参数 | 返回值 |
|-------|------|------|-------|
| validate | 对表单项进行验证 | (type?: 'change' \| 'blur', value?: any) | Promise<{status: 'fulfilled' \| 'rejected', reason?: string}> |
| resetField | 重置表单项 | - | - |
| clearValidate | 清除表单项验证结果 | - | - |

## 插槽

| 插槽名 | 说明 |
|-------|------|
| default | 表单项内容，通常是表单控件 |

## 表单验证

表单项组件支持多种验证规则和验证方式。

### 基础验证

```vue
<zc-form-item 
  label="用户名" 
  prop="username" 
  :rules="[
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ]"
>
  <zc-input v-model="form.username"></zc-input>
</zc-form-item>
```

### 必填项

```vue
<zc-form-item label="用户名" prop="username" required>
  <zc-input v-model="form.username"></zc-input>
</zc-form-item>
```

## 表单布局

表单项组件支持多种布局方式，可以通过属性设置标签的位置和宽度。

### 标签位置

```vue
<zc-form-item label="用户名" prop="username" labelPosition="top">
  <!-- 标签在顶部的表单项 -->
</zc-form-item>

<zc-form-item label="用户名" prop="username" labelPosition="left">
  <!-- 标签在左侧的表单项 -->
</zc-form-item>

<zc-form-item label="用户名" prop="username" labelPosition="right">
  <!-- 标签在右侧的表单项 -->
</zc-form-item>
```

### 标签宽度

```vue
<zc-form-item label="用户名" prop="username" labelWidth="120px">
  <!-- 标签宽度为120px的表单项 -->
</zc-form-item>
```

## 错误提示

```vue
<zc-form-item label="用户名" prop="username" error="用户名不能为空">
  <zc-input v-model="form.username"></zc-input>
</zc-form-item>
```

## 与表单组件配合使用

表单项组件通常与表单组件配合使用，实现整体表单的数据绑定和验证。

```vue
<zc-form :model="form" :rules="rules">
  <zc-form-item label="用户名" prop="username">
    <zc-input v-model="form.username"></zc-input>
  </zc-form-item>
  <zc-form-item label="密码" prop="password">
    <zc-input v-model="form.password" type="password"></zc-input>
  </zc-form-item>
</zc-form>
```

## 注意事项

- 表单项必须设置prop属性才能进行验证
- 验证规则中的trigger可以是'blur'或'change'
- 必填项会在标签前显示红色星号，可以通过表单的hideRequiredAsterisk属性隐藏
- 表单项会继承表单的labelPosition和labelWidth属性，也可以单独设置
