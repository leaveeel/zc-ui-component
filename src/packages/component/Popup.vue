<script lang="ts" setup>
import { ref, watch, nextTick, Teleport, onBeforeUnmount, onMounted, type Ref } from 'vue'

const props = defineProps({
  show: Boolean,
  targetRef: Object as () => HTMLElement | null,
  width: { type: [String, Number], default: '' },
  minWidth: { type: [String, Number], default: '' },
  maxHeight: { type: [String, Number], default: '' },
  zIndex: { type: [String, Number], default: 1000 },
  offsetY: { type: Number, default: 8 },
  offsetX: { type: Number, default: 0 },
  transitionName: { type: String, default: 'zc-popup-fade' },
})

const popupRef = ref<HTMLElement | null>(null)
const popupStyles = ref<Record<string, string>>({})

const updatePosition = () => {
  if (!props.targetRef || !popupRef.value) return
  const rect = props.targetRef.getBoundingClientRect()
  popupStyles.value = {
    left: rect.left + window.scrollX + props.offsetX + 'px',
    top: rect.bottom + window.scrollY + props.offsetY + 'px',
    width: props.width ? (typeof props.width === 'number' ? props.width + 'px' : props.width) : rect.width + 'px',
    minWidth: props.minWidth ? (typeof props.minWidth === 'number' ? props.minWidth + 'px' : props.minWidth) : '',
    maxHeight: props.maxHeight ? (typeof props.maxHeight === 'number' ? props.maxHeight + 'px' : props.maxHeight) : '',
    position: 'absolute',
    zIndex: String(props.zIndex),
  }
}

watch(() => props.show, (val) => {
  if (val) {
    nextTick(updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
  } else {
    window.removeEventListener('scroll', updatePosition, true)
    window.removeEventListener('resize', updatePosition)
  }
})

onMounted(() => {
  if (props.show) {
    nextTick(updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
})
</script>

<template>
  <Teleport to="body">
    <transition :name="transitionName">
      <div
        v-show="show"
        ref="popupRef"
        class="zc-popup"
        :style="popupStyles"
      >
        <slot />
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.zc-popup {
  background: #fff;
  border-radius: 4px;
  padding: 4px 0;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  overflow: hidden;
}
.zc-popup-fade-enter-active,
.zc-popup-fade-leave-active {
  transition: all 0.2s;
}
.zc-popup-fade-enter-from,
.zc-popup-fade-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
  transform-origin: center top;
}
</style> 