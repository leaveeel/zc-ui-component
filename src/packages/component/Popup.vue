<script lang="ts" setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount, computed } from 'vue'
import {
  useFloating,
  offset,
  flip,
  shift,
  arrow,
  autoUpdate,
  type Placement,
} from '@floating-ui/vue'
import zcScroll from '@/packages/scroll/src/index.vue'
import { splitString, setUnit } from '@/utils/common'

const props = defineProps({
  /**
   * 浮动元素的触发方式：'click' 或 'hover'
   */
  trigger: {
    type: String as () => 'click' | 'hover',
    default: 'hover',
  },
  /**
   * 浮动元素相对于参照元素的偏移量
   */
  offset: {
    type: Number,
    default: 8,
  },
  /**
   * 浮动元素的定位方式，例如 'bottom' | 'top' | 'right' | 'left'
   */
  placement: {
    type: String as () => Placement,
    default: 'bottom',
  },
  /**
   * 是否显示箭头
   */
  showArrow: {
    type: Boolean,
    default: true,
  },
  /**
   * 自定义浮动元素的宽度，可以是 CSS 宽度值或 'target' 表示与参照元素同宽
   */
  width: {
    type: [String, Number],
    default: '',
  },
  /**
   * 浮动元素的最小宽度
   */
  maxWidth: {
    type: [String, Number],
    default: '',
  },
  /**
   * 浮动元素的最大高度
   */
  maxHeight: {
    type: [String, Number],
    default: '',
  },
  /**
   * 浮动元素的 z-index
   */
  zIndex: {
    type: [String, Number],
    default: 1000,
  },
  /**
   * 弹层显示/隐藏的过渡动画名称
   */
  transitionName: {
    type: String,
    default: 'zc-popup-fade',
  },
  /**
   * 鼠标移出后弹窗延迟隐藏的时间 (毫秒)
   */
  hoverDelay: {
    type: Number,
    default: 150, // 默认延迟 150 毫秒
  },
  theme: {
    type: String,
    default: 'light'
  }
})

const reference = ref<HTMLElement | null>(null) // 参照元素（触发元素）
const floating = ref<HTMLElement | null>(null) // 浮动元素（弹层）
const arrowElement = ref<HTMLElement | null>(null) // 箭头元素

const isPopupVisible = ref(false)
let hideTimeout: ReturnType<typeof setTimeout> | null = null // 用于 hover 延迟隐藏的定时器

const middleware = computed(() => {
  const middlewares = [
    offset(props.offset),
    flip(), // 当空间不足时，自动翻转定位
    shift(), // 当浮动元素部分超出视口时，进行位移
  ]
  if (props.showArrow) {
    middlewares.push(arrow({ element: arrowElement.value!, padding: 10 }))
  }
  return middlewares
})

const {
  x,
  y,
  strategy,
  placement,
  middlewareData,
  update,
} = useFloating(reference, floating, {
  placement: props.placement,
  middleware,
  whileElementsMounted: autoUpdate, // 保持浮动元素在参照元素变化时自动更新位置
})

// 计算浮动元素的样式
const floatingStyles = computed(() => {
  const styles: Record<string, string | number> = {
    position: strategy.value,
    left: `${x.value ?? 0}px`,
    top: `${y.value ?? 0}px`,
    zIndex: 1000,
    width: (props.width === 'target' && reference.value) ? `${reference.value.offsetWidth}px` : setUnit(props.width),
    maxWidth: setUnit(props.maxWidth),
    maxHeight: setUnit(props.maxHeight),
  }

  return styles
})

// 计算箭头的样式
const arrowStyles = computed(() => {
  const { x: arrowX, y: arrowY } = middlewareData.value.arrow ?? {}
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placement.value.split('-')[0]]

  return {
    left: arrowX != null ? `${arrowX}px` : '',
    top: arrowY != null ? `${arrowY}px` : '',
    [staticSide as string]: '-4px', // 箭头的边框与弹层重叠
  }
})

// === 触发逻辑修改开始 ===
const showPopup = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  isPopupVisible.value = true
}

const hidePopup = () => {
  // 如果是 hover 触发，则延迟隐藏
  if (props.trigger === 'hover') {
    hideTimeout = setTimeout(() => {
      isPopupVisible.value = false
    }, props.hoverDelay)
  } else {
    // click 触发则直接隐藏
    isPopupVisible.value = false
  }
}

const handleTriggerClick = () => {
  if (props.trigger === 'click') {
    isPopupVisible.value = !isPopupVisible.value
  }
}

const handleReferenceMouseEnter = () => {
  if (props.trigger === 'hover') {
    showPopup()
  }
}

const handleReferenceMouseLeave = () => {
  if (props.trigger === 'hover') {
    hidePopup()
  }
}

const handleFloatingMouseEnter = () => {
  if (props.trigger === 'hover') {
    showPopup() // 鼠标移入弹窗内容时，取消隐藏定时器，保持显示
  }
}

const handleFloatingMouseLeave = () => {
  if (props.trigger === 'hover') {
    hidePopup() // 鼠标移出弹窗内容时，执行隐藏逻辑
  }
}
// === 触发逻辑修改结束 ===

// 点击外部关闭弹层 (仅对 click 触发有效)
const onClickOutside = (event: MouseEvent) => {
  if (
    props.trigger === 'click' && // 确保只对 click 触发生效
    isPopupVisible.value &&
    reference.value &&
    floating.value &&
    !reference.value.contains(event.target as Node) &&
    !floating.value.contains(event.target as Node)
  ) {
    isPopupVisible.value = false
  }
}

watch(isPopupVisible, (newValue) => {
  if (newValue) {
    nextTick(() => {
      update() // 确保在显示时更新位置
    })
    // 只有在 click 触发时才需要监听点击外部事件
    if (props.trigger === 'click') {
      document.addEventListener('click', onClickOutside)
    }
  } else {
    if (props.trigger === 'click') {
      document.removeEventListener('click', onClickOutside)
    }
  }
}, { immediate: true }) // immediate 确保初始状态也生效

onMounted(() => {
  // 初始状态下如果 `isPopupVisible` 为 true (例如，通过外部控制)，
  // `watch` 中的 `immediate: true` 会确保其正确处理。
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  if (hideTimeout) {
    clearTimeout(hideTimeout)
  }
})

const computedTheme = computed(() => {
  if(props.theme === 'dark') {
    return {
      '--backgroundColor': '#333',
      '--color': 'white'
    }
  } else {
    return {
      '--backgroundColor': 'white',
      '--color': 'var(--main-font-color)'
    }
  }
})

defineExpose({
  showPopup,
  hidePopup
});
</script>

<template>
  <div
    ref="reference"
    class="floating-popup-trigger"
    @click="handleTriggerClick"
    @mouseenter="handleReferenceMouseEnter"
    @mouseleave="handleReferenceMouseLeave"
  >
    <slot name="reference"></slot>
  </div>
  <Teleport to="body">
    <transition :name="transitionName">
      <div
        v-show="isPopupVisible"
        :key="floatingStyles.width"
        ref="floating"
        class="floating-popup-content"
        :style="{...floatingStyles, ...computedTheme}"
        @mouseenter="handleFloatingMouseEnter"
        @mouseleave="handleFloatingMouseLeave"
      >
        <zc-scroll :max-height="splitString(maxHeight).num - 8" :max-width="maxWidth">
            <slot></slot>
        </zc-scroll>
        <div v-if="showArrow" ref="arrowElement" class="floating-popup-arrow" :style="arrowStyles"></div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.floating-popup-trigger {
    overflow: hidden;
    text-overflow: ellipsis;
    height: 100%;
}

.floating-popup-content {
  background: var(--backgroundColor);
  color: var(--color);
  border-radius: 4px;
  padding: 4px 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box; /* 确保 padding 不影响宽度计算 */
  // 确保浮动元素不会被内容撑大到超出屏幕
  max-width: calc(100vw - 20px); // 留一点边距
  max-height: calc(100vh - 20px); // 留一点边距
  height: inherit;
}

.floating-popup-arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit; /* 继承父元素的背景色 */
  transform: rotate(45deg);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 继承父元素的阴影 */
  z-index: -1; /* 确保箭头在内容下方 */
}

/* 过渡动画 - 与原组件保持一致 */
.zc-popup-fade-enter-active,
.zc-popup-fade-leave-active {
  transition: opacity 0.2s;
}
.zc-popup-fade-enter-from,
.zc-popup-fade-leave-to {
  opacity: 0;
}
</style>