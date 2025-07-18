<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcTableColumn'
})
</script>

<script lang="ts" setup>
import { splitString, setUnit } from '@/utils/common'
import { zcUIProps, zcUI } from '@/types/zcUI'
import { ref, nextTick, watchEffect, toRef, watch, computed, onMounted, onBeforeUnmount, provide, inject, useSlots } from 'vue'
import zcCheckbox from '@/packages/checkbox/src/index.vue'
import zcTooltip from '@/packages/tooltip/src/index.vue'


const props = withDefaults(defineProps<zcUI.TableCol & { showSlots?: boolean }>(), {
  align: 'left',
  showSlots: false
})

const thead = inject('thead', false)
const rowIndex = inject('rowIndex', null)
const colIndex = inject('colIndex') as number
const row: any = inject('row', {})

const handleSelectRow = inject('handleSelectRow', (row: any, checked: boolean) => {})
const isRowSelected = inject('isRowSelected', (row: any) => void(Boolean))
const isAllSelect = inject('isAllSelect', false)
const isIndeterminate = inject('isIndeterminate', false)

const rowSelectd = computed({
  get: () => isRowSelected(row),
  set: (checked: boolean) => handleSelectRow(row, checked)
})

const setPx: (fixed: string | undefined, index: number) => string = inject('setPx', () => '')
const isLastLeftFixed: (index: number) => boolean = inject('isLastLeftFixed', () => false)
const isFirstRightFixed: (index: number) => boolean = inject('isFirstRightFixed', () => false)
const handleSort: (p: string, o: string) => boolean = inject('handleSort', () => false)
</script>

<template>
  <div
    class="zc-table-col"
    :class="{
      fixedLeft: fixed === 'left',
      fixedRight: fixed === 'right',
      lastLeftFixed: fixed === 'left' && isLastLeftFixed(colIndex),
      firstRightFixed: fixed === 'right' && isFirstRightFixed(colIndex),
    }"
    :style="{
      '--px': setUnit(setPx(fixed, colIndex)),
      width: width ? setUnit(width) : 'auto',
      textOverflow: 'ellipsis',
      '--align': align || 'left',
    }"
  >

    <template v-if="thead">
      <!-- 全选框 -->
      <template v-if="props.type === 'selection'">
        <zc-checkbox v-if="thead" v-model="isAllSelect" :indeterminate="isIndeterminate" />
      </template>

      <div class="column-label" v-else>
        <label>
          {{ props.label }}
        </label>
        
        <!-- 排序图标 -->
        <span 
          v-if="sortable && prop"
          class="sort-icon"
        >
          <i class="sort-up-icon" @click.stop="handleSort(prop, 'ascending')">▲</i>
          <i class="sort-down-icon" @click.stop="handleSort(prop, 'descending')">▼</i>
        </span>
      </div>
    </template>
    <template v-else>

      <!-- 全选框 -->
      <zc-checkbox v-if="props.type === 'selection'" v-model="rowSelectd" />

      <!-- 索引列 -->
      <label class="column" v-else-if="props.type === 'index' && rowIndex !== null">
        {{ rowIndex + 1 }}
      </label>
      
      <zc-tooltip v-else-if="tooltip?.content" :max-height="tooltip.maxHeight" :max-width="tooltip.maxWidth" class="column" :content="tooltip.content">
        <template v-if="showSlots">
          <slot></slot>
        </template>
        <template v-else>
          {{ prop ? formatter ? formatter : row[prop] : '' }}
        </template>
      </zc-tooltip>
      
      <label class="column" v-else-if="showSlots">
        <slot></slot>
      </label>

      <!-- 普通列 -->
      <label class="column" v-else>
        {{ prop ? formatter ? formatter : row[prop] : '' }}
      </label>
    </template>
  </div>
</template>

<style scoped lang="scss">
.zc-table-col {
  flex-shrink: 0;
  :deep() {
    .column {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.zc-table-col.sortable {
  cursor: pointer;
  
  .column-label {
    display: flex;
    align-items: center;
    justify-content: var(--align);

    label {
      width: calc(100% - 20px);
      cursor: pointer;
    }
    
    .sort-icon {
      display: inline-flex;
      flex-direction: column;
      margin-left: 4px;
      line-height: 0;
      font-size: 12px;
      color: #c0c4cc;
      
      i {
        line-height: 1;
        margin: -1px 0;
        font-style: normal;
      }
    }
  }

  &.sort-ascending {
    .sort-up-icon {
      color: var(--main-color);
    }
  }

  &.sort-descending {
    .sort-down-icon {
      color: var(--main-color);
    }
  }
}

</style>
