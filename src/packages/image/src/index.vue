<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcImage'
})
</script>

<script setup lang="ts">
import { onMounted, ref, toRefs, watch, nextTick } from 'vue'
import { setUnit } from '@/utils/common'
import IconLoading from '@/packages/icon/src/IconLoading.vue'
import zcIcon from '@/packages/icon/index.vue'
import { zcUIProps } from '@/types/zcUI'


const props = withDefaults(defineProps<zcUIProps.Image>(), {
  src: '',
  width: 'auto',
  height: 'auto',
  objectFit: 'cover',
  alt: '',
  lazy: false,
  threshold: 0.1
})

// 定义事件
const emit = defineEmits<{
  (e: 'load'): void;
  (e: 'error'): void;
}>()

const { src, lazy } = toRefs(props)
const imgRef = ref<HTMLImageElement | null>(null)
const imageContainer = ref<HTMLElement | null>(null)
const isLoading = ref(true)
const isLoadError = ref(false)
const hasLoaded = ref(false)
// 如果不是懒加载，则立即显示图片；如果是懒加载，则等待进入视口才显示
const hasLoadedOrFailed = ref(!lazy.value)
// 保存观察器实例
let observer: IntersectionObserver | null = null

// 处理图片加载成功
const handleLoad = () => {
  isLoading.value = false
  hasLoaded.value = true
  isLoadError.value = false
  emit('load')
}

// 处理图片加载失败
const handleError = () => {
  isLoading.value = false
  hasLoaded.value = true
  isLoadError.value = true
  emit('error')
}

// 监听src变化，重置加载状态
watch(
  () => src.value,
  (newSrc) => {
    if (!newSrc) {
      isLoadError.value = true
      return
    }
    isLoading.value = true
    isLoadError.value = false
    hasLoaded.value = false
    
    // 如果不是懒加载，则直接显示图片
    if (!lazy.value) {
      hasLoadedOrFailed.value = true
    }
  },
  { immediate: true }
)

// 设置懒加载观察器
const setupIntersectionObserver = () => {
  if (!imageContainer.value || !lazy.value) return

  // 创建观察器
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 当元素进入视口时，显示图片
          hasLoadedOrFailed.value = true
          // 停止观察
          if (observer) {
            observer.unobserve(entry.target)
            observer.disconnect()
            observer = null
          }
        }
      })
    },
    {
      threshold: props.threshold
    }
  )

  // 开始观察容器元素
  observer.observe(imageContainer.value)
}

// 实现懒加载功能
onMounted(() => {
  nextTick(() => {
    setupIntersectionObserver()
  })
})
</script>

<template>
  <div
    class="zc-image"
    :style="{
      width: setUnit(width),
      height: setUnit(height)
    }"
  >
    <!-- 实际图片容器 -->
    <div ref="imageContainer" class="zc-image__container">
      <!-- 实际图片 -->
      <img
        v-if="hasLoadedOrFailed"
        v-show="!isLoadError"
        ref="imgRef"
        class="zc-image__inner"
        :src="src"
        :alt="alt"
        :style="{ objectFit }"
        v-bind="$attrs"
        @load="handleLoad"
        @error="handleError"
      />
    </div>
    
    <!-- 加载中的占位内容 -->
    <div v-if="!hasLoaded && !isLoadError" class="zc-image__placeholder">
      <slot name="placeholder">
        <zc-icon size="40px">
          <IconLoading />
        </zc-icon>
      </slot>
    </div>
    
    <!-- 加载失败的显示内容 -->
    <div v-if="isLoadError" class="zc-image__error">
      <slot name="error">
        <span>加载失败</span>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.zc-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
  vertical-align: top;

  &__container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  &__inner {
    display: block;
    width: 100%;
    height: 100%;
  }

  &__placeholder,
  &__error {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #f5f7fa;
    color: #909399;
  }
}

@keyframes rotating {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
</style>
