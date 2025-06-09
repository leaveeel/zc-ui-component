# ZC DatePicker 日期选择组件

## 基本用法

```vue
<zc-datePicker v-model="date" @change="change"></zc-datePicker>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| modelValue | string \| string[] \| Date \| Date[] | - | 绑定值 |
| type | 'date' \| 'daterange' \| 'datetime' | 'date' | 类型 |
| placeholder | string | - | 占位文本 |
| clearable | boolean | true | 是否显示清空按钮 |
| disabled | boolean | false | 是否禁用 |
| format | string | yyyy-MM-dd | 显示格式 |
| valueFormat | string | yyyy-MM-dd | 绑定值格式 |

## 事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| change | 改变时触发 | date: string \| string[] \| Date \| Date[], formatDate: string \| string[] |

## 与表单组件配合使用

输入框组件通常与表单组件配合使用，实现表单数据的收集和验证。

```vue
<zc-form :model="form" :rules="rules">
  <zc-form-item label="用户名" prop="username">
    <zc-datePicker type="daterange" v-model="form.date" @change="change"></zc-datePicker>
  </zc-form-item>
</zc-form>
```

## 注意事项
