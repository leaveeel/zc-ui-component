<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'zcSkeleton'
})
</script>

<script lang="ts" setup>
import { zcUIProps } from '@/types/zcUI'
import { setUnit } from '@/utils/common'
import { computed, provide } from 'vue'
import zcSkeletonItem from './skeletonItem.vue'

const props = withDefaults(defineProps<zcUIProps.Skeleton>(), {
  loading: true,
  animated: true,
  backgroundColor: '#f2f2f2',
  highlightColor: '#e6e6e6',
  round: true,
  radius: 4,
  rows: 3,
  title: true
})


// 计算CSS变量
const cssVars = computed(() => ({
  '--skeleton-bg': props.backgroundColor,
  '--skeleton-highlight': props.highlightColor
}))

// 为子组件提供上下文
provide('skeleton', {
  animated: props.animated,
  backgroundColor: props.backgroundColor,
  highlightColor: props.highlightColor,
  round: props.round,
  radius: props.radius
})

// 生成默认段落行
const defaultRows = computed(() => 
  Array.from({ length: props.rows }, (_, index) => ({
    width: index === props.rows - 1 ? '60%' : '100%'
  }))
)
</script>

<template>
  <template v-if="loading">
    <!-- 默认骨架屏内容 -->
    <div class="zc-skeleton" :style="cssVars">
      <slot name="template" v-if="$slots.template"></slot>

      <template v-else>
        <zc-skeleton-item v-if="title" variant="title" class="zc-skeleton-title" />
        <div class="zc-skeleton-paragraph">
          <zc-skeleton-item
            v-for="(row, index) in defaultRows"
            :key="index"
            variant="text"
            :width="row.width"
            class="zc-skeleton-row"
          />
        </div>
      </template>
    </div>
  </template>
  
  <!-- 实际内容 -->
  <template v-else>
    <slot></slot>
  </template>
</template>

<style lang="scss">
.zc-skeleton {
  display: flex;
  flex-direction: column;
  width: 100%;
  
  &-title {
    margin-bottom: 16px;
  }
  
  &-paragraph {
    flex: 1;
  }
  
  &-row {
    display: block;
    width: 100%;
    
    &:not(:first-child) {
      margin-top: 12px;
    }
  }
}
</style>
