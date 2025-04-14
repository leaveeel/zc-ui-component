<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'zcIcon'
})
</script>

<script lang="ts" setup>
import { zcUIProps } from '@/types/zcUI'
import { defineProps, defineEmits } from 'vue'
import { setUnit } from '@/utils/common'

const props = withDefaults(defineProps<zcUIProps.Icon>(), {
  size: 24,
  color: 'var(--main-font-color)',
  spin: false,
  rotate: 0,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  emit('click', event)
}
</script>

<template>
  <i 
    class="zc-icon zc-ui-component" 
    :class="{ 'is-spinning': spin }"
    :style="{ 
      fontSize: setUnit(props.size), 
      '--color': props.color,
      transform: `rotate(${props.rotate}deg)`,
      opacity: props.disabled ? 0.5 : 1
    }"
    @click="handleClick"
  >
    <slot></slot>
  </i>
</template>

<style lang="scss" scoped>
.zc-icon {
  height: 1em;
  width: 1em;
  line-height: 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: var(--color);
  transition: transform 0.3s ease;
  flex-shrink: 0;
  
  svg {
    height: 1em;
    width: 1em;
  }

  &.is-spinning {
    animation: icon-spin 1s linear infinite;
  }
}

@keyframes icon-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
