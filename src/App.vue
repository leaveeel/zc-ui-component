<script setup lang="ts">
import {reactive, ref, nextTick} from 'vue'
import { onMounted } from 'vue'
import { zcUIProps } from '@/types/zcUI'

import zcButton from '@/packages/button/src/index.vue'
import zcButtonGroup from '@/packages/buttonGroup/src/index.vue'
import zcCard from '@/packages/card/src/index.vue'
import zcCheckbox from '@/packages/checkbox/src/index.vue'
import zcCheckboxGroup from '@/packages/checkboxGroup/src/index.vue'
import zcDialog from '@/packages/dialog/src/index.vue'
import zcForm from '@/packages/form/src/index.vue'
import zcFormItem from '@/packages/formItem/src/index.vue'
import zcInput from '@/packages/input/src/index.vue'
import zcIcon from '@/packages/icon/index.vue'
import { loadingDirective, zcLoading } from '@/packages/loading/zc-loading.ts'
import { zcMessage } from '@/packages/messageBox/zc-messageBox.ts'
import zcPagination from '@/packages/pagination/src/index.vue'
import zcScroll from '@/packages/scroll/src/index.vue'
import zcTable from '@/packages/table/src/index.vue'
import { zcToast } from '@/packages/toast/zc-toast.ts'
import zcTooltip from '@/packages/tooltip/src/index.vue'
import IconChecked from '@/packages/icon/src/IconChecked.vue'
import IconClose from '@/packages/icon/src/IconClose.vue'
import IconLoading from '@/packages/icon/src/IconLoading.vue'
import { zcUI } from '@/types/zcUI'


const loading = reactive<zcUIProps.Loading>({
  loading: false
})

onMounted(() => {
  // 初始加载
  loading.loading = true
  setTimeout(() => {
    loading.loading = false
  }, 1000)
  
  // 5秒后更新加载状态和配置
  setTimeout(() => {
    loading.loading = true
    loading.text = '正在处理数据...'
    loading.color = '#ff0000'
    loading.size = 60
  }, 5000)
})
</script>

<template>
  <div class="container">
    <div v-loading="loading" class="loading-area">
      这里是内容区域，将显示加载状态
    </div>
    <!-- {{loading}} -->
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}

.loading-area {
  height: 200px;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
</style>
