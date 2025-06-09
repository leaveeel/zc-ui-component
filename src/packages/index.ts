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
import zcImage from '@/packages/image/src/index.vue'
import { loadingDirective, zcLoading } from '@/packages/loading/zc-loading.ts'
import { zcMessage } from '@/packages/messageBox/zc-messageBox.ts'
import zcPagination from '@/packages/pagination/src/index.vue'
import zcRadio from '@/packages/radio/src/index.vue'
import zcRadioGroup from '@/packages/radioGroup/src/index.vue'
import zcScroll from '@/packages/scroll/src/index.vue'
import zcSkeleton from '@/packages/skeleton/src/index.vue'
import zcSkeletonItem from '@/packages/skeleton/src/skeletonItem.vue'
import zcTable from '@/packages/table/src/index.vue'
import { zcToast } from '@/packages/toast/zc-toast.ts'
import zcTooltip from '@/packages/tooltip/src/index.vue'
import zcSwitch from '@/packages/switch/src/index.vue'
import zcDatePicker from '@/packages/datePicker/src/index.vue'
import { zcUI, zcUIProps } from '@/types/zcUI'
import type { App, Component } from 'vue'

// 组件列表
const components: Record<string, Component> = {
  zcButton,
  zcButtonGroup,
  zcCard,
  zcCheckbox,
  zcCheckboxGroup,
  zcDialog,
  zcForm,
  zcFormItem,
  zcInput,
  zcIcon,
  zcImage,
  zcPagination,
  zcRadio,
  zcRadioGroup,
  zcScroll,
  zcSkeleton,
  zcSkeletonItem,
  zcTable,
  zcTooltip,
  zcSwitch,
  zcDatePicker
}

// 指令
const directives = {
  loading: loadingDirective
}

/**
 * 安装所有组件
 * @param app Vue实例
 */
const install = (app: App): void => {
  // 注册组件
  Object.entries(components).forEach(([_, component]) => {
    // 使用类型断言确保组件类型正确
    const comp = component as unknown as { name: string }
    if (comp.name) {
      app.component(comp.name, component)
    } else {
      console.warn('Component is missing name:', component)
    }
  })
  
  // 注册指令
  Object.entries(directives).forEach(([name, directive]) => {
    app.directive(name, directive)
  })
}

// 默认导出插件
export default { install }

// 导出单独组件
export {
  // 组件
  zcButton,
  zcButtonGroup,
  zcCard,
  zcCheckbox,
  zcCheckboxGroup,
  zcDialog,
  zcForm,
  zcFormItem,
  zcInput,
  zcIcon,
  zcImage,
  zcPagination,
  zcRadio,
  zcRadioGroup,
  zcScroll,
  zcSkeleton,
  zcSkeletonItem,
  zcTable,
  zcTooltip,
  zcSwitch,
  zcDatePicker,
   // 指令
  loadingDirective,
  // 服务
  zcLoading,
  zcMessage,
  zcToast
}

// 类型导出
export type {
  zcUI,
  zcUIProps
}