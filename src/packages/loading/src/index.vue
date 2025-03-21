<script lang="ts" setup>
import IconLoading from '@/packages/icon/src/IconLoading.vue'
import { ref, computed, onMounted, watch, inject } from 'vue'
import zcIcon from '@/packages/icon/index.vue'

interface Props {
  size?: number | string
  color?: string
  text?: string
  timeout?: number
  background?: string
  fullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 50,
  color: 'var(--main-color)',
  text: '',
  timeout: 0,
  background: 'rgba(255, 255, 255, 0.7)',
  fullscreen: false
})

// 从指令中注入的配置
const injectSize = inject('loading-size', undefined)
const injectColor = inject('loading-color', undefined)
const injectText = inject('loading-text', undefined)
const injectTimeout = inject('loading-timeout', undefined)
const injectBackground = inject('loading-background', undefined)
const injectFullscreen = inject('loading-fullscreen', undefined)

// 合并props和inject的配置
const size = computed(() => injectSize ?? props.size)
const color = computed(() => injectColor ?? props.color)
const text = computed(() => injectText ?? props.text)
const timeout = computed(() => injectTimeout ?? props.timeout)
const background = computed(() => injectBackground ?? props.background)
const fullscreen = computed(() => injectFullscreen ?? props.fullscreen)

const visible = ref<boolean>(false)
const timer = ref<number | null>(null)

const loadingStyle = computed(() => ({
  background: background.value,
  position: fullscreen.value ? 'fixed' as const : 'absolute' as const
}))

const show = () => {
  visible.value = true
  
  // 如果设置了超时时间，启动定时器
  if (timeout.value > 0) {
    clearTimeout(timer.value as any)
    timer.value = setTimeout(() => {
      hide()
    }, timeout.value) as unknown as number
  }
}

const hide = () => {
  visible.value = false
  if (timer.value) {
    clearTimeout(timer.value as any)
    timer.value = null
  }
}

// 设置配置项方法
const setOptions = (options: Partial<Props>) => {
  // 特殊处理timeout
  if (options.timeout !== undefined && options.timeout !== timeout.value) {
    if (visible.value && options.timeout > 0) {
      if (timer.value) clearTimeout(timer.value as any)
      timer.value = setTimeout(() => {
        hide()
      }, options.timeout) as unknown as number
    }
  }
}

// 监听timeout的变化
watch(() => timeout.value, (newTimeout) => {
  if (visible.value && newTimeout > 0) {
    if (timer.value) clearTimeout(timer.value as any)
    timer.value = setTimeout(() => {
      hide()
    }, newTimeout) as unknown as number
  }
})

// 组件卸载时清除定时器
onMounted(() => {
  return () => {
    if (timer.value) {
      clearTimeout(timer.value as any)
      timer.value = null
    }
  }
})

defineExpose({
  show,
  hide,
  setOptions
})
</script>

<template>
  <div class="zc-loading zc-ui-component" v-if="visible" :style="loadingStyle">
    <div class="zc-loading-spinner">
      <zc-icon :size="size" :color="color">
        <IconLoading></IconLoading>
      </zc-icon>
      <p v-if="text" class="zc-loading-text" :style="{ color }">{{ text }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.zc-loading {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  transition: opacity 0.3s;
  
  .zc-loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .zc-loading-text {
    margin-top: 8px;
    font-size: 14px;
  }
}
</style>
