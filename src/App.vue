<script setup lang="ts">
import {reactive, ref} from 'vue'

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
import { loadingDirective, zcLoading, useLoading } from '@/packages/loading/zc-loading.ts'
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

const value = ref('')
</script>

<template>
  <zc-input v-model="value" type="password" />
</template>

<style scoped>
</style>
