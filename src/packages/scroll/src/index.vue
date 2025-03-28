<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
    name: 'zcScroll'
  })
</script>

<script lang="ts" setup>
import { setUnit } from '@/utils/common'
import { zcUIProps } from '@/types/zcUI'
import { defineProps, ref, nextTick, onMounted, onBeforeUnmount, computed } from 'vue'
import { debounce } from 'lodash-es'
import { useDocument } from '@/utils/common'

const props = withDefaults(defineProps<zcUIProps.Scroll>(), {
  width: '100%',
  height: '100%',
})

const emit = defineEmits(['scroll'])

const zcScroll = ref()
const rightScroll = ref()
const bottomScroll = ref()
const scrollBody = ref()
const rightBlock = ref()
const bottomBlock = ref()
const getScrollLeft = ref(0)
const getScrollTop = ref(0)

const rightBlockHeight = () => {
  if (!zcScroll.value || !scrollBody.value || !rightScroll.value || !rightBlock.value) return
  
  const zcScrollHeight = zcScroll.value.offsetHeight
  const scrollBodyHeight = scrollBody.value.scrollHeight

  if(zcScrollHeight / scrollBodyHeight >= 1) {
    rightScroll.value.style.display = 'none'
    rightBlock.value.style.height = 0
  } else {
    rightScroll.value.style.display = 'block'
    rightBlock.value.style.height = `${(zcScrollHeight / scrollBodyHeight) * 100}%`
  }
}

const bottomBlockWidth = () => {
  if (!zcScroll.value || !scrollBody.value || !bottomScroll.value || !bottomBlock.value) return
  
  const zcScrollWidth = zcScroll.value.offsetWidth
  const scrollBodyWidth = scrollBody.value.scrollWidth

  if(zcScrollWidth / scrollBodyWidth >= 1) {
    bottomScroll.value.style.display = 'none'
    bottomBlock.value.style.width = 0
  } else {
    bottomScroll.value.style.display = 'block'
    bottomBlock.value.style.width = `${(zcScrollWidth / scrollBodyWidth) * 100}%`
  }
}

// 使用防抖函数优化尺寸更新
const updateScrollBars = debounce(() => {
  rightBlockHeight()
  bottomBlockWidth()
}, 200)

// 处理滚动事件
const handleScroll = () => {
  if (!scrollBody.value || !rightScroll.value || !rightBlock.value || !bottomScroll.value || !bottomBlock.value) return
  
  const scrollTop = scrollBody.value.scrollTop
  const scrollHeight = rightScroll.value.offsetHeight + 8
  const scrollLeft = scrollBody.value.scrollLeft
  const scrollWidth = bottomScroll.value.offsetWidth + 8

  rightBlock.value.style.transform = `translateY(${(scrollTop / scrollHeight) * 100}%)`
  bottomBlock.value.style.transform = `translateX(${(scrollLeft / scrollWidth) * 100}%)`

  getScrollLeft.value = scrollLeft
  getScrollTop.value = scrollTop

  emit('scroll', { scrollLeft, scrollTop, scrollHeight: scrollBody.value.scrollHeight, scrollWidth: scrollBody.value.scrollWidth })
}

// 处理窗口大小变化
const handleResize = debounce(() => {
  updateScrollBars()
}, 200)

const syncScroll = () => {
  if (!scrollBody.value || !rightBlock.value || !bottomBlock.value) return
  
  // 绑定滚动事件
  scrollBody.value.addEventListener('scroll', handleScroll, { passive: false })
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize, { passive: false })

  let isDragging = false
  let startY = 0
  let startScrollTop = 0

  const handleRightMouseDown = (e: MouseEvent) => {
    isDragging = true
    startY = e.clientY
    startScrollTop = scrollBody.value.scrollTop
    if(useDocument()) {
      document.body.style.userSelect = 'none'
    }
    e.preventDefault()
  }

  let isDraggingBottom = false
  let startX = 0
  let startScrollLeft = 0

  const handleBottomMouseDown = (e: MouseEvent) => {
    isDraggingBottom = true
    startX = e.clientX
    startScrollLeft = scrollBody.value.scrollLeft
    if(useDocument()) {
      document.body.style.userSelect = 'none'
    }
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging && !isDraggingBottom) return
    
    if (isDragging) {
      const deltaY = e.clientY - startY
      const scrollHeight =
        scrollBody.value.scrollHeight - scrollBody.value.clientHeight

      scrollBody.value.scrollTop =
        startScrollTop +
        (deltaY /
          (rightScroll.value.offsetHeight - rightBlock.value.offsetHeight)) *
          scrollHeight
    } else {
      const deltaX = e.clientX - startX
      const scrollWidth =
        scrollBody.value.scrollWidth - scrollBody.value.clientWidth

      scrollBody.value.scrollLeft =
        startScrollLeft +
        (deltaX /
          (bottomScroll.value.offsetWidth - bottomBlock.value.offsetWidth)) *
          scrollWidth
    }
  }

  const handleMouseUp = () => {
    isDragging = false
    isDraggingBottom = false
    if(useDocument()) {
      document.body.style.userSelect = ''
    }
  }

  // 绑定事件监听器
  rightBlock.value.addEventListener('mousedown', handleRightMouseDown, { passive: false })
  bottomBlock.value.addEventListener('mousedown', handleBottomMouseDown, { passive: false })
  if(useDocument()) {
    document.addEventListener('mousemove', handleMouseMove, { passive: false })
    document.addEventListener('mouseup', handleMouseUp, { passive: false })
  }

  // 返回清理函数
  return () => {
    scrollBody.value?.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleResize)
    rightBlock.value?.removeEventListener('mousedown', handleRightMouseDown, { passive: false })
    bottomBlock.value?.removeEventListener('mousedown', handleBottomMouseDown, { passive: false })
    if(useDocument()) {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }
}

// 使用ResizeObserver监听元素大小变化
let resizeObserver: ResizeObserver | null = null
const setupResizeObserver = () => {
  if (typeof ResizeObserver === 'undefined') return
  
  resizeObserver = new ResizeObserver(updateScrollBars)
  
  if (zcScroll.value) {
    resizeObserver.observe(zcScroll.value)
  }
  if (scrollBody.value) {
    resizeObserver.observe(scrollBody.value)
  }
}

let cleanupScrollEvents: (() => void) | null = null

onMounted(() => {
  nextTick(() => {
    rightBlockHeight()
    bottomBlockWidth()
    const cleanup = syncScroll()
    if (cleanup) {
      cleanupScrollEvents = cleanup
    }
    setupResizeObserver()
  })
})

onBeforeUnmount(() => {
  if (cleanupScrollEvents) {
    cleanupScrollEvents()
  }
  
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

// 滚动到指定位置
const scrollTo = (options: { left?: number; top?: number; behavior?: ScrollBehavior }) => {
  if (scrollBody.value) {
    scrollBody.value.scrollTo(options)
  }
}

// 滚动到顶部
const scrollToTop = (behavior: ScrollBehavior = 'auto') => {
  scrollTo({ top: 0, behavior })
}

// 滚动到底部
const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
  if (scrollBody.value) {
    scrollTo({ top: scrollBody.value.scrollHeight, behavior })
  }
}

defineExpose({
  scrollTo,
  scrollToTop,
  scrollToBottom
})
</script>

<template>
  <div
    class="zc-scroll zc-ui-component"
    ref="zcScroll"
    :style="{ height: setUnit(props.height), width: setUnit(props.width) }"
  >
    <div class="rightScroll" ref="rightScroll">
      <div class="block" ref="rightBlock"></div>
    </div>
    <div class="bottomScroll" ref="bottomScroll">
      <div class="block" ref="bottomBlock"></div>
    </div>
    <div
      class="scrollBody"
      ref="scrollBody"
      :style="{ height: setUnit(props.height) }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.zc-scroll {
  position: relative;
  overflow: hidden;
  &:hover {
    .rightScroll {
      opacity: 1;
    }
    .bottomScroll {
      opacity: 1;
    }
  }
  .rightScroll {
    opacity: 0;
    position: absolute;
    right: 0;
    width: 8px;
    height: 100%;
    z-index: 100;
    transition: opacity 0.2s ease;
    &:active {
      opacity: 1;
    }
    .block {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
  .bottomScroll {
    opacity: 0;
    position: absolute;
    bottom: 1px;
    left: 0;
    width: 100%;
    height: 8px;
    z-index: 10;
    transition: opacity 0.2s ease;
    &:active {
      opacity: 1;
    }
    .block {
      height: 8px;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
  /* 自定义滚动条样式 */
  .scrollBody::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
  /* Firefox 自定义滚动条样式 */
  .scrollBody {
    overflow: auto;
    scrollbar-width: none;
  }
}
</style>
