<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
    name: 'zcScroll'
  })
</script>

<script lang="ts" setup>
import { setUnit } from '@/utils/common'
import { zcUIProps } from '@/types/zcUI'
import { defineProps, ref, nextTick, onMounted, computed } from 'vue'
import { debounce } from 'lodash-es'
import { useDocument } from '@/utils/common'
import {    onUnmounted,  StyleValue, watch } from 'vue';

const props = withDefaults(defineProps<zcUIProps.Scroll>(), {
});

const emit = defineEmits(['scroll'])

const scrollContainerRef = ref<HTMLElement | null>(null);
const scrollContentRef = ref<HTMLElement | null>(null);
const verticalTrackRef = ref<HTMLElement | null>(null);
const verticalThumbRef = ref<HTMLElement | null>(null);
const horizontalTrackRef = ref<HTMLElement | null>(null);
const horizontalThumbRef = ref<HTMLElement | null>(null);

// Scroll state
const scrollTop = ref(0);
const scrollLeft = ref(0);
const clientHeight = ref(0);
const clientWidth = ref(0);
const scrollHeight = ref(0);
const scrollWidth = ref(0);

// Scrollbar visibility and interaction state
const isHoveringContainer = ref(false);
const showScrollbarsDebounced = ref(false);

const isDraggingVerticalThumb = ref(false);
const isDraggingHorizontalThumb = ref(false);
let dragStartY = 0;
let dragStartScrollTop = 0;
let dragStartX = 0;
let dragStartScrollLeft = 0;

// --- Computed Styles ---
const containerStyle = computed<StyleValue>(() => ({
  position: 'relative',
  overflow: 'hidden', // Crucial for containing scrollContent and custom scrollbars
  boxSizing: 'border-box',
  display: 'flex',
  width: props.width && setUnit(props.width),
  height: props.height && setUnit(props.height),
  maxWidth: props.maxWidth && setUnit(props.maxWidth),
  maxHeight: props.maxHeight && setUnit(props.maxHeight),
}));

const needsVerticalScroll = computed(() => scrollHeight.value > clientHeight.value);
const needsHorizontalScroll = computed(() => scrollWidth.value > clientWidth.value);

const shouldShowScrollbars = computed(() => {
  return showScrollbarsDebounced.value || isDraggingVerticalThumb.value || isDraggingHorizontalThumb.value;
});

const verticalThumbHeight = computed(() => {
  if (!clientHeight.value || !scrollHeight.value || !needsVerticalScroll.value) return 0;
  const trackHeight = clientHeight.value; // Assuming track fills container height
  const minThumbHeight = 20; // Minimum thumb size
  const calculatedHeight = Math.pow(clientHeight.value, 2) / scrollHeight.value;
  return Math.max(minThumbHeight, Math.min(trackHeight, calculatedHeight));
});

const verticalThumbY = computed(() => {
  if (!needsVerticalScroll.value || !clientHeight.value || !scrollHeight.value) return 0;
  const trackHeight = clientHeight.value;
  const scrollableDist = scrollHeight.value - clientHeight.value;
  if (scrollableDist <= 0) return 0;
  const thumbMovableDist = trackHeight - verticalThumbHeight.value;
  return (scrollTop.value / scrollableDist) * thumbMovableDist;
});

const verticalThumbStyle = computed<StyleValue>(() => ({
  height: `${verticalThumbHeight.value}px`,
  transform: `translateY(${verticalThumbY.value}px)`,
  backgroundColor: 'rgba(0,0,0,0.3)',
  width: `8px`,
}));

const horizontalThumbWidth = computed(() => {
  if (!clientWidth.value || !scrollWidth.value || !needsHorizontalScroll.value) return 0;
  const trackWidth = clientWidth.value;
  const minThumbWidth = 20;
  const calculatedWidth = Math.pow(clientWidth.value, 2) / scrollWidth.value;
  return Math.max(minThumbWidth, Math.min(trackWidth, calculatedWidth));
});

const horizontalThumbX = computed(() => {
  if (!needsHorizontalScroll.value || !clientWidth.value || !scrollWidth.value) return 0;
  const trackWidth = clientWidth.value;
  const scrollableDist = scrollWidth.value - clientWidth.value;
  if (scrollableDist <= 0) return 0;
  const thumbMovableDist = trackWidth - horizontalThumbWidth.value;
  return (scrollLeft.value / scrollableDist) * thumbMovableDist;
});

const horizontalThumbStyle = computed<StyleValue>(() => ({
  width: `${horizontalThumbWidth.value}px`,
  transform: `translateX(${horizontalThumbX.value}px)`,
  backgroundColor: 'rgba(0,0,0,0.3)',
  height: `8px`,
}));


// --- Methods ---
const updateScrollState = () => {
  if (!scrollContentRef.value) return;
  scrollTop.value = scrollContentRef.value.scrollTop;
  scrollLeft.value = scrollContentRef.value.scrollLeft;
  clientHeight.value = scrollContentRef.value.clientHeight;
  clientWidth.value = scrollContentRef.value.clientWidth;
  scrollHeight.value = scrollContentRef.value.scrollHeight;
  scrollWidth.value = scrollContentRef.value.scrollWidth;
};

const handleScroll = () => {
  updateScrollState();
  emit('scroll', {
    scrollLeft: scrollLeft.value,
    scrollTop: scrollTop.value,
    scrollHeight: scrollHeight.value,
    scrollWidth:scrollWidth.value
  })
};

const handleContainerMouseEnter = () => {
  isHoveringContainer.value = true;
  showScrollbarsDebounced.value = true;
  updateScrollState(); // Ensure up-to-date measurements when showing
};

const handleContainerMouseLeave = () => {
  isHoveringContainer.value = false;
  if (!isDraggingVerticalThumb.value && !isDraggingHorizontalThumb.value) {
      showScrollbarsDebounced.value = false;
  }
};

// Vertical Thumb Drag
const handleVerticalThumbMouseDown = (event: MouseEvent) => {
  isDraggingVerticalThumb.value = true;
  dragStartY = event.clientY;
  dragStartScrollTop = scrollTop.value;
  document.addEventListener('mousemove', handleVerticalThumbMouseMove);
  document.addEventListener('mouseup', handleVerticalThumbMouseUp);
  document.body.style.userSelect = 'none'; // Prevent text selection
};

const handleVerticalThumbMouseMove = (event: MouseEvent) => {
  if (!isDraggingVerticalThumb.value || !scrollContentRef.value || !clientHeight.value || !scrollHeight.value) return;
  const deltaY = event.clientY - dragStartY;
  const trackHeight = clientHeight.value;
  const thumbHeightVal = verticalThumbHeight.value;
  const scrollableDist = scrollHeight.value - clientHeight.value;
  if (scrollableDist <= 0) return;
  
  const scrollDelta = (deltaY / (trackHeight - thumbHeightVal)) * scrollableDist;
  scrollContentRef.value.scrollTop = dragStartScrollTop + scrollDelta;
};

const handleVerticalThumbMouseUp = () => {
  isDraggingVerticalThumb.value = false;
  document.removeEventListener('mousemove', handleVerticalThumbMouseMove);
  document.removeEventListener('mouseup', handleVerticalThumbMouseUp);
  document.body.style.userSelect = '';
  if (!isHoveringContainer.value) { // If mouse left container during drag
    handleContainerMouseLeave();
  }
};

// Horizontal Thumb Drag (similar to vertical)
const handleHorizontalThumbMouseDown = (event: MouseEvent) => {
  isDraggingHorizontalThumb.value = true;
  dragStartX = event.clientX;
  dragStartScrollLeft = scrollLeft.value;
  document.addEventListener('mousemove', handleHorizontalThumbMouseMove);
  document.addEventListener('mouseup', handleHorizontalThumbMouseUp);
  document.body.style.userSelect = 'none';
};

const handleHorizontalThumbMouseMove = (event: MouseEvent) => {
  if (!isDraggingHorizontalThumb.value || !scrollContentRef.value || !clientWidth.value || !scrollWidth.value) return;
  const deltaX = event.clientX - dragStartX;
  const trackWidth = clientWidth.value;
  const thumbWidthVal = horizontalThumbWidth.value;
  const scrollableDist = scrollWidth.value - clientWidth.value;
  if (scrollableDist <= 0) return;

  const scrollDelta = (deltaX / (trackWidth - thumbWidthVal)) * scrollableDist;
  scrollContentRef.value.scrollLeft = dragStartScrollLeft + scrollDelta;
};

const handleHorizontalThumbMouseUp = () => {
  isDraggingHorizontalThumb.value = false;
  document.removeEventListener('mousemove', handleHorizontalThumbMouseMove);
  document.removeEventListener('mouseup', handleHorizontalThumbMouseUp);
  document.body.style.userSelect = '';
  if (!isHoveringContainer.value) {
    handleContainerMouseLeave();
  }
};

// Track Clicks
const handleVerticalTrackMouseDown = (event: MouseEvent) => {
  if (!scrollContentRef.value || !verticalTrackRef.value || event.target !== verticalTrackRef.value) return;
  const rect = verticalTrackRef.value.getBoundingClientRect();
  const clickY = event.clientY - rect.top;
  const thumbHeightVal = verticalThumbHeight.value;
  const targetScrollTopPercent = (clickY - thumbHeightVal / 2) / (rect.height - thumbHeightVal);
  scrollContentRef.value.scrollTop = targetScrollTopPercent * (scrollHeight.value - clientHeight.value);
};

const handleHorizontalTrackMouseDown = (event: MouseEvent) => {
  if (!scrollContentRef.value || !horizontalTrackRef.value || event.target !== horizontalTrackRef.value) return;
  const rect = horizontalTrackRef.value.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const thumbWidthVal = horizontalThumbWidth.value;
  const targetScrollLeftPercent = (clickX - thumbWidthVal / 2) / (rect.width - thumbWidthVal);
  scrollContentRef.value.scrollLeft = targetScrollLeftPercent * (scrollWidth.value - clientWidth.value);
};


// Resize Observer
let containerResizeObserver: ResizeObserver | null = null;
let contentResizeObserver: ResizeObserver | null = null;

onMounted(() => {
  nextTick(() => { // Ensure elements are rendered
    updateScrollState();
    if (scrollContainerRef.value) {
      containerResizeObserver = new ResizeObserver(updateScrollState);
      containerResizeObserver.observe(scrollContainerRef.value);
    }
    if (scrollContentRef.value) {
      contentResizeObserver = new ResizeObserver(updateScrollState);
      contentResizeObserver.observe(scrollContentRef.value);
      // Observe children of scrollContent for more robust content change detection
      const slotContent = scrollContentRef.value.children[0]; // Assuming slot has one direct child wrapper
      if (slotContent) contentResizeObserver.observe(slotContent);
    }
  });
});

onUnmounted(() => {
  if (containerResizeObserver) containerResizeObserver.disconnect();
  if (contentResizeObserver) contentResizeObserver.disconnect();
  if(useDocument()) {
    document.removeEventListener('mousemove', handleVerticalThumbMouseMove);
    document.removeEventListener('mouseup', handleVerticalThumbMouseUp);
    document.removeEventListener('mousemove', handleHorizontalThumbMouseMove);
    document.removeEventListener('mouseup', handleHorizontalThumbMouseUp);
  }
});

// Watch for prop changes that might affect layout and require scroll state update
watch(
  () => [props.width, props.height, props.maxWidth, props.maxHeight],
  async () => {
    await nextTick();
    updateScrollState();
  },
  { deep: true }
);

// Expose methods if needed
defineExpose({
  scrollTo: (options: ScrollToOptions) => scrollContentRef.value?.scrollTo(options),
});
</script>

<template>
  <div
    ref="scrollContainerRef"
    :style="containerStyle"
    class="zc-scroll zc-ui-component"
    @mouseenter="handleContainerMouseEnter"
    @mouseleave="handleContainerMouseLeave"
  >
    <div
      ref="scrollContentRef"
      class="scroll-content"
      @scroll="handleScroll"
    >
      <slot />
    </div>

    <div
      v-if="needsVerticalScroll"
      ref="verticalTrackRef"
      class="custom-scrollbar-track custom-scrollbar-track--vertical"
      :class="{'custom-scrollbar-active': shouldShowScrollbars}"
      @mousedown.prevent="handleVerticalTrackMouseDown"
    >
      <div
        ref="verticalThumbRef"
        class="custom-scrollbar-thumb custom-scrollbar-thumb--vertical"
        :style="verticalThumbStyle"
        @mousedown.prevent.stop="handleVerticalThumbMouseDown"
      />
    </div>

    <div
      v-if="needsHorizontalScroll && shouldShowScrollbars"
      ref="horizontalTrackRef"
      class="custom-scrollbar-track custom-scrollbar-track--horizontal"
      :class="{'custom-scrollbar-active': shouldShowScrollbars}"
      @mousedown.prevent="handleHorizontalTrackMouseDown"
    >
      <div
        ref="horizontalThumbRef"
        class="custom-scrollbar-thumb custom-scrollbar-thumb--horizontal"
        :style="horizontalThumbStyle"
        @mousedown.prevent.stop="handleHorizontalThumbMouseDown"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.scroll-content {
  flex-grow: 1;
  /* Native scrollbar hiding */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow: scroll;
}
.scroll-content::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
  width: 0 !important; /* !important to override user-agent stylesheets */
  height: 0 !important;
}

.custom-scrollbar-track {
  position: absolute;
  background-color: rgba(0,0,0,0.2);
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  overflow: hidden;
  &.custom-scrollbar-active {
    opacity: 1;
  }
}

.custom-scrollbar-thumb {
  position: relative; /* Relative to track for transform */
  border-radius: 8px;
  cursor: pointer;
}

.custom-scrollbar-track--vertical {
  top: 2px; /* Small gap */
  right: 2px;
  bottom: 2px;
  width: 8px;
}
.custom-scrollbar-thumb--vertical {
  width: 100%;
}

.custom-scrollbar-track--horizontal {
  left: 2px;
  bottom: 2px;
  right: 2px;
  height: 8px;
}
.custom-scrollbar-thumb--horizontal {
  height: 100%;
}
</style>
