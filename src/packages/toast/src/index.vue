<script lang="ts" setup>
import { zcUIProps } from '@/types/zcUI'
import { onMounted, ref, onBeforeUnmount, computed } from 'vue'
import zcButton from '@/packages/button/src/index.vue'
import IconClose from '@/packages/icon/src/IconClose.vue'
import zcIcon from '@/packages/icon/index.vue'

// 定义组件属性
const props = defineProps<zcUIProps.Toast & {container: HTMLElement}>()

// 响应式状态
const fadeIn = ref(false)
const fadeOut = ref(false)
const isMobile = ref(false)

// 计算设备类型
const updateDeviceType = () => {
  isMobile.value = window.innerWidth <= 768
}

// 动画定时器
let fadeOutTimer: number | null = null

// 计算样式类
const toastClasses = computed(() => ({
  mobile: isMobile.value,
  'message-fade-in': fadeIn.value,
  'message-fade-out': fadeOut.value
}))

// 关闭toast的处理函数
const handleClose = () => {
  fadeOut.value = true
  setTimeout(() => {
    props.container.parentNode?.removeChild(props.container)
  }, 300)
}

onMounted(() => {
  // 检测设备类型
  updateDeviceType()
  window.addEventListener('resize', updateDeviceType)
  
  // 入场动画
  setTimeout(() => {
    fadeIn.value = true
  }, 10)
  
  // 自动关闭
  if (props.duration && props.duration > 0) {
    fadeOutTimer = window.setTimeout(() => {
      fadeOut.value = true
    }, props.duration)
  }
})

onBeforeUnmount(() => {
  // 清理事件监听和定时器
  window.removeEventListener('resize', updateDeviceType)
  if (fadeOutTimer) {
    clearTimeout(fadeOutTimer)
  }
})
</script>

<template>
  <div
    class="zc-toast zc-ui-component"
    :class="toastClasses"
    :style="{ '--color': color }"
  >
    <span>{{ message }}</span>
    <zc-button 
      v-if="props.duration === 0" 
      text 
      @click="handleClose" 
      class="close-btn"
    >
      <zc-icon size="18" :color="color">
        <IconClose />
      </zc-icon>
    </zc-button>
  </div>
</template>

<style scoped lang="scss">
.zc-toast {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color);
  background-color: color-mix(in srgb, var(--color), #fff 80%);
  border: 1px solid var(--color);
  border-radius: 6px;
  padding: 10px 18px;
  font-size: 14px;
  opacity: 0;
  transform: translateY(0);
  transition:
  opacity 0.2s ease,
  transform 0.2s ease;
  position: relative;
  z-index: 99999;
  
  &.mobile {
    max-width: 80%;
  }

  &.message-fade-in {
    opacity: 1;
    transform: translateY(20px);
  }

  &.message-fade-out {
    opacity: 0;
    transform: translateY(-20px);
  }

  .close-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    padding: 0;
  }

  span {
    text-align: center;
    word-break: break-word;
  }
}
</style>
