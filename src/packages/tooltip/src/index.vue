<script
  lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
    name: 'zcTooltip'
  })
</script>

<script
  lang="ts"
  setup>
import { setUnit } from '@/utils/common'
import { zcUIProps } from '@/types/zcUI'
import { defineProps, ref, nextTick, onMounted, onBeforeUnmount, computed } from 'vue'
import zcScroll from '@/packages/scroll/src/index.vue'

const props = withDefaults(defineProps<zcUIProps.Tooltip>(), {
  width: '100%',
  height: 'auto',
  position: 'top',
  trigger: 'hover',
  theme: 'light',
  arrow: true,
  zIndex: 1000,
  showDelay: 0,
  hideDelay: 200
})

const zcTooltip = ref<HTMLElement | null>(null)
const tipVisible = ref(false)
const isEnterTooltip = ref(false)
const isEnterContent = ref(false)

let showTimer: number | null = null
let hideTimer: number | null = null

const tooltipStyles = computed(() => {
  return {
    width: setUnit(props.width), 
    maxHeight: setUnit(props.height),
    zIndex: props.zIndex
  }
})

const clearTimers = () => {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const showTooltip = () => {
  clearTimers()
  if (props.showDelay > 0) {
    showTimer = setTimeout(() => {
      tipVisible.value = true
    }, props.showDelay)
  } else {
    tipVisible.value = true
  }
}

const hideTooltip = () => {
  clearTimers()
  if (!isEnterTooltip.value && !isEnterContent.value) {
    hideTimer = setTimeout(() => {
      tipVisible.value = false
    }, props.hideDelay)
  }
}

const handleMouseEnter = () => {
  if (props.trigger !== 'hover') return
  isEnterTooltip.value = true
  showTooltip()
}

const handleMouseLeave = () => {
  if (props.trigger !== 'hover') return
  isEnterTooltip.value = false
  hideTooltip()
}

const handleContentMouseEnter = () => {
  if (props.trigger !== 'hover') return
  isEnterContent.value = true
}

const handleContentMouseLeave = () => {
  if (props.trigger !== 'hover') return
  isEnterContent.value = false
  hideTooltip()
}

const handleClick = () => {
  if (props.trigger !== 'click') return
  tipVisible.value = !tipVisible.value
}

const handleClickOutside = (event: MouseEvent) => {
  if (props.trigger !== 'click') return
  if (zcTooltip.value && !zcTooltip.value.contains(event.target as Node)) {
    tipVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  clearTimers()
})
</script>

<template>
  <div
    class="zc-tooltip zc-ui-component"
    ref="zcTooltip"
    :class="[
      `zc-tooltip-${position}`, 
      `zc-tooltip-${trigger}`,
      `theme-${theme}`
    ]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick">
    <slot></slot>
    <Transition name="tooltip-fade">
      <div
        class="tooltip-content"
        v-if="tipVisible"
        :style="tooltipStyles"
        @mouseenter="handleContentMouseEnter"
        @mouseleave="handleContentMouseLeave">
        <div v-if="arrow" class="tooltip-arrow"></div>
        <slot
          name="content"
          v-if="$slots.content"></slot>
        <zc-scroll
          width="100%"
          height="100%"
          ref="scroll"
          v-else>
          <div class="tooltip-inner">
            {{ content }}
          </div>
        </zc-scroll>
      </div>
    </Transition>
  </div>
</template>

<style
  lang="scss">
.zc-tooltip {
  position: relative;
  display: inline-flex;
  
  .tooltip-content {
    position: absolute;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    word-break: break-all;
    box-sizing: border-box;
    z-index: 1000;
    
    .tooltip-inner {
      line-height: 1.5;
    }
    
    .tooltip-arrow {
      position: absolute;
      width: 8px;
      height: 8px;
      z-index: -1;
      transform: rotate(45deg);
    }
  }
  
  &.theme-dark {
    .tooltip-content {
      background-color: #303133;
      color: #ffffff;
      
      .tooltip-arrow {
        background-color: #303133;
      }
    }
  }
  
  &.theme-light {
    .tooltip-content {
      background-color: #ffffff;
      color: #303133;
      border: 1px solid #e4e7ed;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      
      .tooltip-arrow {
        background-color: #ffffff;
        border: 1px solid #e4e7ed;
      }
    }
  }
  
  /* 箭头位置 */
  &.zc-tooltip-top {
    .tooltip-content {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-10px);
      
      .tooltip-arrow {
        bottom: -4px;
        left: 50%;
        margin-left: -4px;
        border-top: none;
        border-left: none;
      }
    }
  }
  
  &.zc-tooltip-bottom {
    .tooltip-content {
      top: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(10px);
      
      .tooltip-arrow {
        top: -4px;
        left: 50%;
        margin-left: -4px;
        border-bottom: none;
        border-right: none;
      }
    }
  }
  
  &.zc-tooltip-left {
    .tooltip-content {
      top: 50%;
      right: 100%;
      transform: translateY(-50%) translateX(-10px);
      
      .tooltip-arrow {
        top: 50%;
        right: -4px;
        margin-top: -4px;
        border-left: none;
        border-bottom: none;
      }
    }
  }
  
  &.zc-tooltip-right {
    .tooltip-content {
      top: 50%;
      left: 100%;
      transform: translateY(-50%) translateX(10px);
      
      .tooltip-arrow {
        top: 50%;
        left: -4px;
        margin-top: -4px;
        border-right: none;
        border-top: none;
      }
    }
  }
}

/* 过渡动画 */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}

.tooltip-fade-enter-from {
  &.zc-tooltip-top .tooltip-content {
    transform: translateX(-50%) translateY(-20px);
  }
  
  &.zc-tooltip-bottom .tooltip-content {
    transform: translateX(-50%) translateY(20px);
  }
  
  &.zc-tooltip-left .tooltip-content {
    transform: translateY(-50%) translateX(-20px);
  }
  
  &.zc-tooltip-right .tooltip-content {
    transform: translateY(-50%) translateX(20px);
  }
}
</style>
