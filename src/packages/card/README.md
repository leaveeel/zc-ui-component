# ZC Card 卡片组件

卡片组件用于将信息进行分组展示，提供了灵活的布局和样式定制选项。

## 基本用法

```vue
<zc-card>
  <div>卡片内容</div>
</zc-card>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| height | string/number | 'auto' | 卡片高度 |
| maxHeight | string/number | 'auto' | 卡片最大高度 |
| radius | string/number | 12 | 卡片圆角 |
| background | string | '#fff' | 卡片背景色 |
| loading | boolean | false | 是否显示加载状态 |
| padding | string/number | 0 | 卡片内边距 |
| bordered | boolean | false | 是否显示边框 |
| borderColor | string | '#e4e7ed' | 边框颜色 |
| borderWidth | string/number | 1 | 边框宽度 |
| shadow | 'none'/'light'/'medium'/'heavy' | 'medium' | 阴影效果 |
| width | string/number | '100%' | 卡片宽度 |
| hoverable | boolean | false | 是否在悬停时显示阴影效果 |

## 插槽

| 插槽名 | 说明 |
|-------|------|
| default | 卡片主体内容 |
| header | 卡片头部内容 |
| footer | 卡片底部内容 |

## 样式定制

卡片组件支持多种样式定制，可以通过属性设置卡片的尺寸、边框、阴影等样式。

### 带标题的卡片

```vue
<zc-card>
  <template #header>
    <div>卡片标题</div>
  </template>
  <div>卡片内容</div>
</zc-card>
```

### 带底部的卡片

```vue
<zc-card>
  <div>卡片内容</div>
  <template #footer>
    <div>卡片底部</div>
  </template>
</zc-card>
```

### 阴影效果

```vue
<zc-card shadow="light">轻度阴影</zc-card>
<zc-card shadow="medium">中度阴影</zc-card>
<zc-card shadow="heavy">重度阴影</zc-card>
<zc-card shadow="none">无阴影</zc-card>
```

### 悬停效果

```vue
<zc-card hoverable>
  <div>悬停时会有阴影和上浮效果</div>
</zc-card>
```

### 带边框的卡片

```vue
<zc-card bordered>
  <div>带边框的卡片</div>
</zc-card>
```

### 自定义样式

```vue
<zc-card 
  :width="300" 
  :height="200" 
  :radius="8" 
  background="#f5f7fa" 
  :padding="16"
>
  <div>自定义样式的卡片</div>
</zc-card>
```

## 加载状态

```vue
<zc-card :loading="true">
  <div>加载中的卡片</div>
</zc-card>
```

## 注意事项

- 卡片默认宽度为100%，会自动适应父容器宽度
- 当设置了height属性时，内容超出会被隐藏
- 卡片组件内部使用了flex布局，header和footer会自动收缩，body会自动填充剩余空间
