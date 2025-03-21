# `zc-buttonGroup`按钮组

## 基础用法

```vue
<template>
  <zc-button-group>
    <zc-button>上一页</zc-button>
    <zc-button>下一页</zc-button>
  </zc-button-group>
</template>
```

## 不同尺寸

按钮组支持不同的尺寸设置，包括大、中、小三种尺寸。

```vue
<template>
  <div>
    <zc-button-group size="large">
      <zc-button>大尺寸</zc-button>
      <zc-button>大尺寸</zc-button>
    </zc-button-group>
    
    <zc-button-group>
      <zc-button>默认尺寸</zc-button>
      <zc-button>默认尺寸</zc-button>
    </zc-button-group>
    
    <zc-button-group size="small">
      <zc-button>小尺寸</zc-button>
      <zc-button>小尺寸</zc-button>
    </zc-button-group>
  </div>
</template>
```

## 垂直排列

设置 `direction` 属性为 `vertical` 可以使按钮垂直排列。

```vue
<template>
  <zc-button-group direction="vertical">
    <zc-button>按钮1</zc-button>
    <zc-button>按钮2</zc-button>
    <zc-button>按钮3</zc-button>
  </zc-button-group>
</template>
```

## 属性

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
|--------|------|------|--------|--------|
| size | 按钮组尺寸 | string | large / default / small | default |
| direction | 按钮排列方向 | string | horizontal / vertical | horizontal |
| disabled | 是否禁用所有按钮 | boolean | true / false | false |

## 插槽

| 插槽名 | 说明 |
|--------|------|
| default | 按钮组的内容，通常是多个按钮 |

## 注意事项

- 按钮组内部应当只放置 `zc-button` 组件
- 按钮组会统一设置内部按钮的尺寸和禁用状态
- 当使用垂直排列时，建议设置适当的宽度
