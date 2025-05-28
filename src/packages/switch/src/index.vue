<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcSwitch'
})
</script>

<script lang="ts" setup>
import { ref, computed, inject } from 'vue'
import { zcUIProps } from '@/types/zcUI'

const props = withDefaults(defineProps<zcUIProps.Switch>(), {
  modelValue: false,
  activeValue: true,
  inactiveValue: false,
  disabled: false,
  beforeChange: undefined,
})

const emit = defineEmits<{ 
  'update:modelValue': [value: string | number | boolean];
  change: [value: string | number | boolean];
}>()

const change = inject<(() => void) | undefined>('change', undefined)
const errorMsg = ref(inject('errorMsg', ''))

const checked = computed(() => props.modelValue === props.activeValue)

const toggle = async () => {
  if (props.disabled) {
    return
  }

  let canChange = true
  if (props.beforeChange) {
    try {
      canChange = await props.beforeChange()
    } catch (e) {
      canChange = false
    }
  }

  if (canChange) {
    const newValue = checked.value ? props.inactiveValue : props.activeValue
    change?.()
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
    console.log(1)
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    toggle()
  }
}
</script>

<template>
  <div
    class="zc-switch zc-ui-component"
    :class="{
      'is-disabled': props.disabled,
      error: errorMsg
    }"
    @click="toggle"
    tabindex="0"
    role="switch"
    @keydown="handleKeyDown"
  >
    <div class="handle" :class="{
      'is-checked': checked,
    }">
        <span class="zc-switch-inner"></span>
        <div class="zc-switch-action"></div>
    </div>
    <slot v-if="$slots.default"></slot>
  </div>
</template>

<style scoped lang="scss">
.zc-switch {
  display: flex;
  height: 40px;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  outline: none;

  
  &.error {
    color: var(--main-danger-color);
  }

  .handle {
    width: 40px;
    height: 20px;
    position: relative;
    border-radius: 10px;
    background-color: lightgray;
    transition: background-color 0.3s;
    user-select: none;
  
    &.is-checked {
        background-color: var(--main-color);
        .zc-switch-action {
        transform: translateX(20px);
        }
    }
  }
  
  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .zc-switch-inner {
    display: block;
    height: 100%;
    width: 100%;
  }
  
  .zc-switch-action {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: transform 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style> 