<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcTooltip'
})
</script>

<script setup lang="ts">
import { ref, watch, computed, toRefs, onMounted, onUnmounted, nextTick } from 'vue';
import {
  useFloating,
  offset as offsetMiddleware,
  flip as flipMiddleware,
  shift as shiftMiddleware,
  arrow as arrowMiddleware,
  autoUpdate,
  type Placement,
} from '@floating-ui/vue';
import { zcUIProps } from '@/types';
import zcScroll from '@/packages/scroll/src/index.vue'
import { setUnit, useDocument } from '@/utils/common';

const props = withDefaults(defineProps<zcUIProps.Tooltip>(), {
  maxWidth: '500px',
  maxHeight: 'auto',
  placement: 'top',
  theme: 'light',
  trigger: 'hover',
  offset: 8,
  showArrow: true,
  disabled: false,
});

const { content, trigger, offset: offsetValue, showArrow, disabled } = toRefs(props);

const isOpen = ref(false);
const referenceRef = ref<HTMLElement | null>(null);
const floatingRef = ref<HTMLElement | null>(null);
const arrowRef = ref<HTMLElement | null>(null);

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

const middleware = computed(() => {
  const mw = [
    offsetMiddleware(offsetValue.value),
    flipMiddleware({
    }),
    shiftMiddleware({ padding: 5 }),
  ];
  if (showArrow.value && arrowRef.value) {
    mw.push(arrowMiddleware({ element: arrowRef, padding: 4 }));
  }
  return mw;
});

const {
  floatingStyles,
  middlewareData,
  update,
  placement: currentPlacement,
} = useFloating(
  referenceRef,
  floatingRef,
  {
    placement: computed(() => props.placement),
    whileElementsMounted: autoUpdate,
    middleware,
  }
);

const finalArrowStyles = computed(() => {
  if (showArrow.value && middlewareData.value.arrow) {
    const { x, y } = middlewareData.value.arrow;

    const side = currentPlacement.value.split('-')[0] as string;

    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[side];

    if (!staticSide) return {};

    return {
      left: x != null ? `${x}px` : '',
      top: y != null ? `${y}px` : '',
      [staticSide]: '-4px',
    };
  }
  return {};
});

const showTooltip = () => {
  if (!disabled.value) {
    isOpen.value = true;
  }
};

const hideTooltip = () => {
  isOpen.value = false;
};

const toggleTooltip = () => {
  if (!disabled.value) {
    isOpen.value = !isOpen.value;
  }
};

let clickOutsideListener: ((event: MouseEvent) => void) | null = null;
let hoverTimeout: number | undefined;

const handleMouseEnter = () => {
  clearTimeout(hoverTimeout);
  if (trigger.value === 'hover') {
    showTooltip();
  }
};

const handleMouseLeave = () => {
  if (trigger.value === 'hover') {
    hoverTimeout = setTimeout(() => {
      if (referenceRef.value && floatingRef.value) {
          const isOverReference = referenceRef.value.matches(':hover');
          const isOverFloating = floatingRef.value.matches(':hover');
          if (!isOverReference && !isOverFloating) {
              hideTooltip();
          }
      } else {
          hideTooltip();
      }
    }, 100);
  }
};

onMounted(() => {
  const referenceEl = referenceRef.value;
  if (referenceEl) {
    if (trigger.value === 'hover') {
      referenceEl.addEventListener('mouseenter', handleMouseEnter);
      referenceEl.addEventListener('mouseleave', handleMouseLeave);
      watch(floatingRef, (newFloatingEl) => {
        if (newFloatingEl) {
          newFloatingEl.addEventListener('mouseenter', handleMouseEnter);
          newFloatingEl.addEventListener('mouseleave', handleMouseLeave);
        }
      });
    } else if (trigger.value === 'click') {
      referenceEl.addEventListener('click', toggleTooltip);
      clickOutsideListener = (event: MouseEvent) => {
        if (
          isOpen.value &&
          referenceRef.value &&
          !referenceRef.value.contains(event.target as Node) &&
          floatingRef.value &&
          !floatingRef.value.contains(event.target as Node)
        ) {
          hideTooltip();
        }
      };
      if(useDocument()) {
        document.addEventListener('mousedown', clickOutsideListener, true);
      }
    }
  }
});

onUnmounted(() => {
  clearTimeout(hoverTimeout);
  const referenceEl = referenceRef.value;
  if (referenceEl) {
    if (trigger.value === 'hover') {
      referenceEl.removeEventListener('mouseenter', handleMouseEnter);
      referenceEl.removeEventListener('mouseleave', handleMouseLeave);
    } else if (trigger.value === 'click') {
      referenceEl.removeEventListener('click', toggleTooltip);
      if (clickOutsideListener) {
        document.removeEventListener('mousedown', clickOutsideListener, true);
      }
    }
  }
  unwatchOpen()
  unwatchContent()
});

const unwatchOpen = watch(isOpen, (newValue) => {
  if (newValue && floatingRef.value) {
    nextTick(update);
  }
});

const unwatchContent = watch(() => props.content, () => { if (isOpen.value) update(); });
</script>

<template>
  <div ref="referenceRef" class="zc-tooltip zc-ui-component">
    <slot></slot>
  </div>
  <div
    ref="floatingRef"
    v-if="isOpen"
    class="zc-tooltip-content"
    :style="{...floatingStyles, maxWidth: setUnit(maxWidth), maxHeight: setUnit(maxHeight), ...computedTheme}"
  >
    <zc-scroll>
      <slot name="content">{{ content }}</slot>
    </zc-scroll>
    <div ref="arrowRef" class="tooltip-arrow" :style="finalArrowStyles"></div>
  </div>
</template>

<style scoped lang="scss">
.zc-tooltip {
  display: inline-block;
  position: relative;
}

.zc-tooltip-content {
  position: absolute;
  background-color: var(--backgroundColor);
  color: var(--color);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 10000;
  overflow-wrap: break-word;
  display: flex;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .tooltip-arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: var(--backgroundColor);
    transform: rotate(45deg);
    z-index: -1;
  }
}
</style>