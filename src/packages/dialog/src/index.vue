<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'zcDialog'
})
</script>

<script lang="ts" setup>
import { zcUIProps } from '@/types/zcUI'
import { setUnit } from '@/utils/common'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import IconClose from '@/packages/icon/src/IconClose.vue'
import zcIcon from '@/packages/icon/index.vue'
import { useDocument } from '@/utils/common'

const dialogId = `dialog-${Math.random()}`

const props = withDefaults(defineProps<zcUIProps.Dialog>(), {
  padding: '24px 32px',
  closeOnClickModal: true,
  width: '50%',
  minWidth: 'auto',
  closeOnPressEscape: true,
  title: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  cancel: []
}>()

const afterLeave = () => {
  emit('cancel')
}

const onCancel = () => {
  if (props.loading) return
  emit('update:modelValue', false)
}

const outStart = ref(false)
// 点击屏幕外关闭弹框
const handleClick = () => {
  if (props.closeOnClickModal && outStart.value) {
    onCancel()
  }
}

// 处理 ESC 键关闭
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.closeOnPressEscape) {
    onCancel()
  }
}

const visible = ref(false)
const contentVisible = ref(false)
watch(()=>props.modelValue, (newVal) => {
  if(newVal) {
    visible.value = newVal
    setTimeout(() => {
      contentVisible.value = newVal
    }, 10)
  } else {
    contentVisible.value = newVal
    setTimeout(() => {
      visible.value = newVal
    }, 100)
  }
})



// 监听键盘事件
onMounted(() => {
  if (useDocument()) {
    document.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (useDocument()) {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <Transition
    @after-leave="afterLeave"
    :duration="100"
    name="dialog"
  >
    <div
      v-if="visible"
      class="zc-dialog zc-ui-component"
      @mousedown.stop="outStart = true"
      @mouseup.stop="handleClick"
      role="dialog"
      :aria-modal="true"
      :aria-labelledby="'dialog-title-' + dialogId"
    >
      <Transition
        :duration="100"
        name="dialog-content"
      >
        <div
          v-if="contentVisible"
          class="content"
          :style="{
            width: setUnit(width),
            padding: setUnit(padding),
            minWidth: setUnit(minWidth)
          }"
          @mousedown.stop="outStart = false"
          @mouseup.stop
          v-loading="loading"
        >
          <zc-icon
            v-if="closeIcon"
            class="closeIcon"
            @click="onCancel"
            role="button"
            aria-label="Close Dialog"
          >
            <IconClose></IconClose>
          </zc-icon>
          <div class="dialog-header" v-if="$slots.header || title">
            <h3 v-if="title">{{ title }}</h3>
            <slot name="header" v-else></slot>
          </div>
          <div class="dialog-body">
            <slot></slot>
          </div>
          <div class="dialog-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.1s ease-in-out;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
}

.dialog-content-enter-active,
.dialog-content-leave-active {
  transition: all 0.1s ease-in-out;
}

.dialog-content-enter-from,
.dialog-content-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.dialog-content-enter-to,
.dialog-content-leave-from {
  opacity: 1;
  transform: scale(1);
}

.zc-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
  
  .content {
    overflow: hidden;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0px 4px 30px 0px rgba(38, 83, 56, 0.1);
    position: relative;
    max-width: 80%;
    max-height: 90vh;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #dcdfe6;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f5f7fa;
      border-radius: 3px;
    }

    .closeIcon {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 1;
      cursor: pointer;
      transition: transform 0.2s ease;
      
      &:hover {
        transform: rotate(90deg);
      }
    }
  }

  .dialog-header {
    position: relative;
    margin-bottom: 20px;
  }

  .dialog-body {
    color: var(--main-font-color);
    font-size: 16px;
    line-height: 1.5;
    overflow: hidden;
  }

  .dialog-footer {
    position: relative;
    margin-top: 20px;
    text-align: right;
  }
}
</style>
