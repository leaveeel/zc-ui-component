<script lang="ts" setup>
import zcDialog from '@/packages/dialog/src/index.vue'
import zcButton from '@/packages/button/src/index.vue'
import zcInput from '@/packages/input/src/index.vue'
import zcButtonGroup from '@/packages/buttonGroup/src/index.vue'
import { zcUIProps } from '@/types/zcUI'
import { onMounted, reactive, ref } from 'vue'

// 类型定义和默认值
interface MessageBoxProps extends zcUIProps.MessageBox {
  container: HTMLElement;
  resolve: (value: string, data?: any) => void;
  reject: (reason: string) => void;
}

const props = withDefaults(defineProps<MessageBoxProps>(), {
  showConfirm: true,
  confirmText: 'Confirm',
  showCancel: true,
  cancelText: 'Cancel',
  callback: () => {}
})

// 状态管理
const state = reactive({
  loading: false,
  value: ''
})

const visible = ref(false)
const dialog = ref()

// 生命周期钩子
onMounted(() => {
  visible.value = true
})

// 方法定义
const dialogClose = () => {
  props.container.remove()
}

const cancel = () => {
  close('cancel')
}

const confirm = () => {
  close('confirm')
}

const callback = (action: string) => {
  if (action === 'confirm') {
    props.resolve('confirm')
  } else if (action === 'cancel') {
    props.reject('cancel')
  }
  
  props.callback(state)
  props.container.remove()
}

const close = (action: string) => {
  if (props.beforeClose) {
    props.beforeClose(action, state, () => callback(action))
  } else {
    callback(action)
  }
}

</script>

<template>
  <zc-dialog
    class="zc-messageBox zc-ui-component"
    @cancel="dialogClose"
    :min-width="400"
    width="min-content"
    :closeOnClickModal="!state.loading"
    close-icon
    v-model="visible"
    ref="dialog"
    :loading="state.loading"
  >
    <template #header>
      <div class="title">{{ title }}</div>
    </template>
    
    <div class="content">{{ props.message }}</div>
    <zc-input v-if="props.input" v-bind="props.input" v-model="state.value"></zc-input>
    
    <template #footer>
      <zc-buttonGroup align="right">
        <zc-button
          v-if="props.showCancel"
          :class="props.cancelClass"
          plain
          width="min-content"
          :height="34"
          :fontSize="14"
          @click="cancel"
        >
          {{ props.cancelText }}
        </zc-button>
        <zc-button
          v-if="props.showConfirm"
          :class="props.confirmClass"
          width="min-content"
          :height="34"
          type="primary"
          :fontSize="14"
          @click="confirm"
        >
          {{ props.confirmText }}
        </zc-button>
      </zc-buttonGroup>
    </template>
  </zc-dialog>
</template>

<style scoped lang="scss">
.zc-messageBox {
  :deep() {
    .title {
      font-size: 16px;
      font-weight: 700;
      color: var(--main-font-color);
      margin-bottom: 20px;
    }
    
    .content {
      font-size: 14px;
      color: #999;
      max-width: 40%;
      min-width: 400px;
    }
  }
}
</style>
