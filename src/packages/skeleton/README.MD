# ZC Skeleton 骨架屏组件

骨架屏组件用于在内容加载过程中显示一个占位图形，提升用户体验。

## 基本用法

### 默认骨架屏

默认模式下，骨架屏会显示标题和段落：

```vue
<zc-skeleton :loading="true"></zc-skeleton>
```

### 自定义骨架屏

可以通过插槽自定义骨架屏内容：

```vue
<zc-skeleton :loading="true">
  <zc-skeleton-item variant="title" style="margin-bottom: 16px" />
  <zc-skeleton-item variant="text" style="margin-bottom: 8px" />
  <zc-skeleton-item variant="text" style="margin-bottom: 8px" />
  <zc-skeleton-item variant="text" :width="'60%'" />
</zc-skeleton>
```

### 显示实际内容

当 loading 为 false 时，将显示实际内容：

```vue
<zc-skeleton :loading="false">
  <zc-skeleton-item variant="title" />
  <zc-skeleton-item variant="text" />
  
  <template #content>
    <div>这里是实际内容</div>
  </template>
</zc-skeleton>
```

## Skeleton 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| loading | boolean | true | 是否显示骨架屏 |
| animated | boolean | true | 是否启用动画效果 |
| backgroundColor | string | '#f2f2f2' | 骨架屏背景色 |
| highlightColor | string | '#e6e6e6' | 动画高亮颜色 |
| round | boolean | true | 是否显示为圆角 |
| radius | string/number | 4 | 圆角大小 |
| rows | number | 3 | 默认段落行数 |
| title | boolean | true | 是否显示默认标题 |

## SkeletonItem 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| variant | 'text' / 'title' / 'image' / 'circle' | 'text' | 骨架屏元素类型 |
| width | string/number | 根据variant不同 | 宽度 |
| height | string/number | 根据variant不同 | 高度 |
| radius | string/number | 0 | 圆角大小 |

## 插槽

### Skeleton 组件插槽

| 插槽名 | 说明 |
|-------|------|
| default | 自定义骨架屏内容 |
| content | 加载完成后显示的内容 |

## 常见示例

### 文章列表项

```vue
<zc-skeleton :loading="loading">
  <div style="display: flex; align-items: center; gap: 16px">
    <zc-skeleton-item variant="circle" :width="50" :height="50" />
    <div style="flex: 1">
      <zc-skeleton-item variant="title" style="margin-bottom: 8px" />
      <zc-skeleton-item variant="text" style="margin-bottom: 6px" />
      <zc-skeleton-item variant="text" :width="'60%'" />
    </div>
  </div>
  
  <template #content>
    <div class="article-item">
      <img src="avatar.jpg" />
      <h3>文章标题</h3>
      <p>文章摘要内容</p>
    </div>
  </template>
</zc-skeleton>
```

### 卡片布局

```vue
<zc-skeleton :loading="loading">
  <div style="padding: 20px; border: 1px solid #eee; border-radius: 8px">
    <zc-skeleton-item variant="image" style="width: 100%; height: 160px; margin-bottom: 16px" />
    <zc-skeleton-item variant="title" style="margin-bottom: 16px" />
    <zc-skeleton-item variant="text" style="margin-bottom: 12px" />
    <zc-skeleton-item variant="text" style="margin-bottom: 12px" />
    <zc-skeleton-item variant="text" :width="'60%'" />
  </div>
  
  <template #content>
    <div class="card">
      <img src="card-image.jpg" />
      <h3>卡片标题</h3>
      <p>卡片内容描述</p>
    </div>
  </template>
</zc-skeleton>
```

### 自定义布局

```vue
<zc-skeleton :loading="loading" :animated="false" backgroundColor="#e0e0e0">
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px">
    <zc-skeleton-item variant="image" />
    <zc-skeleton-item variant="image" />
    <zc-skeleton-item variant="image" />
  </div>
  
  <template #content>
    <div class="grid-layout">
      <!-- 实际网格内容 -->
    </div>
  </template>
</zc-skeleton>
```

## 注意事项

- 骨架屏组件会自动向 SkeletonItem 子组件提供样式上下文
- 当 loading 为 false 时，将显示 content 插槽中的内容
- 如果没有提供自定义骨架屏内容，将使用默认的标题+段落样式
- 自定义骨架屏内容时，可以根据需要自由组合 SkeletonItem 组件
