<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcTooltip'
})
</script>

<script setup lang="ts">
import { zcUIProps } from '@/types';
import Popup from '@/packages/component/Popup.vue'

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
</script>

<template>
  <div class="zc-tooltip zc-ui-component">
    <Popup :theme="theme" :maxWidth="maxWidth" :maxHeight="maxHeight" :placement="placement" :trigger="trigger" :offset="offset" :showArrow="showArrow">
      <template #reference>
        <slot></slot>
      </template>
      
      <div class="content" style="padding: 6px 10px; word-wrap: break-word; word-break: break-all; white-space: pre-wrap;">
        <slot name="content">{{ content }}</slot>
      </div>
    </Popup>
  </div>
</template>

<style scoped lang="scss">
.zc-tooltip {
  display: inline-block;
}
</style>