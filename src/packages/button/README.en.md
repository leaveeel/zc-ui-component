# `zc-button` Button Component

## Basic Usage

```vue
<zc-button>default</zc-button>
<zc-button plain>Plain Button</zc-button>
<zc-button text>Text Button</zc-button>
<zc-button loading>Loading</zc-button>
<zc-button disabled>Disabled</zc-button>
```

## Event Handling

```vue
<zc-button @click="handleClick">Click Event</zc-button>
<zc-button @click.stop="handleClickWithStop">Stop Propagation</zc-button>
```

## Custom Icon

```vue
<zc-button>
  <template #icon>
    <zc-icon name="search"></zc-icon>
  </template>
  Button with Icon
</zc-button>
```

## Custom Style

```vue
<zc-button 
  color="#ff5500" 
  background="#f5f5f5" 
  border-color="#ff5500"
  :radius="10"
  :size="18"
>
  Custom Style Button
</zc-button>
```

## Props

| Prop Name | Type | Default | Description |
| --- | --- | --- | --- |
| width | string \| number | 'auto' | Button width |
| height | string \| number | '40' | Button height |
| size | number | 16 | Font size |
| radius | number | 6 | Border radius |
| border | number | 1 | Border width |
| type | string | 'default' | Button type |
| htmlType | string | 'button' | Native button type attribute |
| disabled | boolean | false | Whether the button is disabled |
| loading | boolean | - | Whether to show loading state |
| plain | boolean | - | Whether it's a plain button |
| text | boolean | - | Whether it's a text button |
| color | string | - | Text color |
| background | string | - | Background color |
| borderColor | string | - | Border color |
| inline | boolean | - | Whether it's an inline button |

## Slots

| Slot Name | Description |
| --- | --- |
| default | Button content |
| icon | Button icon, not displayed when loading |

## Events

| Event Name | Description | Parameters |
| --- | --- | --- |
| click | Triggered when button is clicked | MouseEvent |

## Tips

1. When the button is in `disabled` or `loading` state，click event will not be triggered
2. Use `@click.stop` to prevent event propagation
3. The button supports keyboard navigation, pressing Enter or Space key will trigger the click event

## Example

```vue
<template>
  <div class="button-demo">
    <h3>Basic Buttons</h3>
    <div class="demo-row">
      <zc-button @click="handleClick">Default Button</zc-button>
      <zc-button plain>Plain Button</zc-button>
      <zc-button text>Text Button</zc-button>
    </div>
    
    <h3>State Buttons</h3>
    <div class="demo-row">
      <zc-button loading>Loading</zc-button>
      <zc-button disabled>Disabled</zc-button>
    </div>
    
    <h3>Custom Style</h3>
    <div class="demo-row">
      <zc-button color="#fff" background="#67c23a">Success</zc-button>
      <zc-button color="#fff" background="#f56c6c">Danger</zc-button>
      <zc-button color="#fff" background="#e6a23c">Warning</zc-button>
      <zc-button color="#fff" background="#909399">Info</zc-button>
    </div>
  </div>
</template>

<script setup>
const handleClick = () => {
  alert('Button clicked!')
}
</script>

<style scoped>
.demo-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
```