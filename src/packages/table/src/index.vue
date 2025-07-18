<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcTable'
})
</script>

<script lang="ts" setup>
import { splitString, setUnit } from '@/utils/common'
import { zcUIProps,zcUI } from '@/types/zcUI'
import { ref, nextTick, watch, computed, onMounted, useSlots, provide, onBeforeUnmount } from 'vue'
import zcScroll from '@/packages/scroll/src/index.vue'
import zcButton from '@/packages/button/src/index.vue'
import zcButtonGroup from '@/packages/buttonGroup/src/index.vue'
import zcTableColumn from './tableColumn.vue'
import zcTheadCol from './theadCol.vue'

const props = withDefaults(defineProps<zcUIProps.Table>(), {
  height: 'auto',
  maxHeight: '100%',
  stripe: false,
  showHeader: true,
  rowKey: '',
  emptyText: 'No Data',
  defaultSort: () => ({ prop: '', order: '' }),
  rowClassName: () => '',
  cellClassName: () => '',
  headerRowClassName: () => '',
  headerCellClassName: () => ''
})

// 表格引用
const colWidths = ref<number[]>([])
const tbody = ref()
const thead = ref()
const rows = ref()
const zcTable = ref()
const scroll = ref()


// 发出事件
const emit = defineEmits<{
  'row-click': [row: any, index: number, event: MouseEvent],
  'select': [selection: any[], row: any],
  'select-all': [selection: any[]],
  'sort-change': [{ prop: string, order: string }]
}>()


// 处理点击行
const handleRowClick = (row: any, index: number, event: MouseEvent) => {
  emit('row-click', row, index, event)
}

// 处理选择
const handleSelectAll = (checked: boolean) => {
  selectRows.value = checked ? [...props.data] : []
  emit('select-all', selectRows.value)
}

const handleSelectRow = (row: any, checked: boolean) => {
  if (checked) {
    selectRows.value.push(row)
  } else {
    const index = selectRows.value.findIndex(item => {
      return props.rowKey ? item[props.rowKey] === row[props.rowKey] : item === row
    })
    if (index !== -1) {
      selectRows.value.splice(index, 1)
    }
  }
  emit('select', selectRows.value, row)
}
provide('handleSelectRow',handleSelectRow)

const isRowSelected = (row: any) => {
  return selectRows.value.some(item => {
    return props.rowKey ? item[props.rowKey] === row[props.rowKey] : item === row
  })
}
provide('isRowSelected', isRowSelected)

// 计算滚动区域高度
const scrollHeight = ref<'auto' | number>('auto')
const getScrollHeight = () => {
  const zcTableHeight = zcTable.value?.offsetHeight || 0
  scrollHeight.value = zcTableHeight - (props.border ? 2 : 0)
}



onMounted(() => {
  nextTick(() => {
    calculateColWidths()
    getScrollHeight()
  })
  window.addEventListener('resize', calculateColWidths)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateColWidths)
  watchData()
  watchOptions()
})

const tableOptions = computed(() => sortFixed(props.option || setOptions()))


const slots = useSlots()
const columnSlots = new Map()
const setOptions = () => {
  if(slots.default) {
    const filter = slots.default().filter(i => typeof i.type === 'object' && (i.type as {name: string, [key: string]: any}).name === 'zcTableColumn')
    columnSlots.clear()
    filter.forEach(vnode => {
      if (vnode.children && (vnode.children as any).default) {
        columnSlots.set((vnode.props as zcUI.TableOptions).label, (vnode.children as any).default)
      }
    })
    return (filter && filter.length) ? filter.map(i => i.props as zcUI.TableOptions) : []
  }
  return []
}

const sortFixed = (options: zcUI.TableOptions[]) => {
  const grouped = options.reduce((accumulator, currentItem) => {
    if (currentItem.fixed === 'left') {
      accumulator.left.push(currentItem);
    } else if (currentItem.fixed === 'right') {
      accumulator.right.push(currentItem);
    } else {
      accumulator.middle.push(currentItem);
    }
    return accumulator;
  }, { left: [], middle: [], right: [] } as {left: zcUI.TableOptions[], middle: zcUI.TableOptions[], right: zcUI.TableOptions[]})

  return [...grouped.left, ...grouped.middle, ...grouped.right];
}

// 监听数据变化
const watchData = watch(() => props.data, () => {
  scrollHeight.value = 'auto'
  nextTick(() => {
    selectRows.value = []
    calculateColWidths()
    getScrollHeight()
  })
}, { deep: true })
const watchOptions = watch(tableOptions, () => {
  scrollHeight.value = 'auto'
  nextTick(() => {
    selectRows.value = []
    calculateColWidths()
    getScrollHeight()
  })
}, { deep: true })

let initWidths = ref<number[]>([])
const hrow = ref()
// 计算表头宽度
const calculateColWidths = () => {
  if (!thead.value && !tbody.value) return

  const tw = zcTable.value.offsetWidth
  let float:number[] = []

  const init = !initWidths.value.length

  colWidths.value = []

  let rs = [...rows.value || []]
  rs.unshift(hrow.value || [])

  tableOptions.value.forEach((i, n) => {
    if (i.width) return colWidths.value[n] = splitString(i.width).num
    for (let row of rs) {
      console.log(row.children[n].children[0])
      if (row && row.children && row.children[n]) {
        colWidths.value[n] = Math.max(colWidths.value[n] || 0, Math.floor(row.children[n].children[0].offsetWidth) + 32) // 32px padding
        initWidths.value[n] = !init ? initWidths.value[n] : Math.max(initWidths.value[n] || 0, Math.floor(row.children[n].children[0].offsetWidth) + 32) // 32px padding
      }
    }

    float.push(n)
  })

console.log(colWidths.value)
  const rw = colWidths.value.reduce((a, b) => a + b, 0)

  const twFloat = tw - rw
  const floatNum = Math.floor(twFloat / float.length)
  float.forEach(i => {
    colWidths.value[i] += floatNum
    if(colWidths.value[i] < initWidths.value[i]) colWidths.value[i] = initWidths.value[i]
  })

  if(tw === rw) sp.value = ''
}

// 选择相关
const selectRows = ref<any[]>([])
const isAllSelect = computed({
  get: () =>  props.data.length > 0 && selectRows.value.length === props.data.length,
  set: (checked) => handleSelectAll(checked)
})
const isIndeterminate = computed(() => {
  return selectRows.value.length > 0 && selectRows.value.length < props.data.length
})
provide('isAllSelect', isAllSelect)
provide('isIndeterminate', isIndeterminate)

const setPx = (fixed: string | undefined, index: number) => {
  let offset = 0
  
  if (fixed === 'left') {
    // 左侧固定列：计算当前列之前的所有左侧固定列宽度之和
    for (let i = 0; i < index; i++) {
      offset += colWidths.value[i]
    }
  } else if (fixed === 'right') {
    // 右侧固定列：计算当前列之后的所有右侧固定列宽度之和
    for (let i = colWidths.value.length - 1; i > index; i--) {
      offset += colWidths.value[i]
    }
  }
  
  return offset
}
provide('setPx', setPx)

// scroll position
const sp = ref('left')
const handleScroll = (s: any) => {
  const tw = zcTable.value.offsetWidth
  const sw = s.scrollWidth
  const sl = s.scrollLeft
  if(sl === 0) sp.value = 'left'
  else if(sl + tw === sw) sp.value = 'right'
  else sp.value = 'mid'
}
// 判断是否是最后一个左固定列
const isLastLeftFixed = (index: number) => {
  const leftFixedColumns = tableOptions.value
    .map((col, idx) => ({ idx, fixed: col.fixed }))
    .filter(item => item.fixed === 'left')
    .map(item => item.idx)
    .sort((a, b) => a - b)
  
  return leftFixedColumns.length > 0 && leftFixedColumns[leftFixedColumns.length - 1] === index && sp.value !== 'left' && sp.value !== ''
}
provide('isLastLeftFixed', isLastLeftFixed)
// 判断是否是第一个右固定列
const isFirstRightFixed = (index: number) => {
  const rightFixedColumns = tableOptions.value
    .map((col, idx) => ({ idx, fixed: col.fixed }))
    .filter(item => item.fixed === 'right')
    .map(item => item.idx)
    .sort((a, b) => a - b)
  
  return rightFixedColumns.length > 0 && rightFixedColumns[0] === index && sp.value !== 'right' && sp.value !== ''
}
provide('isFirstRightFixed', isFirstRightFixed)


// 处理排序
const sortState = ref({
  prop: props.defaultSort?.prop || '',
  order: props.defaultSort?.order || ''
})
const handleSort = (p: string, o = '') => {
  // 切换排序方向
  let order = ''
  if(o) {
    order = sortState.value.order === o ? '' : o
  }else {
    if (sortState.value.prop === p) {
      if (sortState.value.order === 'ascending') {
        order = 'descending'
      } else if (sortState.value.order === 'descending') {
        order = ''
      } else {
        order = 'ascending'
      }
    } else {
      order = 'ascending'
    }
  }
  
  sortState.value = {
    prop: order ? p : '',
    order
  }

  emit('sort-change', sortState.value)
}
provide('handleSort', handleSort)
// 获取排序图标类名
const getSortIconClass = (p: string) => {
  return {
    'sort-active': sortState.value.prop === p,
    'sort-ascending': sortState.value.prop === p && sortState.value.order === 'ascending',
    'sort-descending': sortState.value.prop === p && sortState.value.order === 'descending'
  }
}
</script>

<template>
  <div
    v-if="tableOptions.length"
    class="zc-table zc-ui-component"
    ref="zcTable"
    :class="{ border: border }"
    :style="{ height: setUnit(height), maxHeight: setUnit(maxHeight) }"
    v-loading="loading"
  >
    <zc-scroll 
      :height="scrollHeight"     
      ref="scroll"
      @scroll="handleScroll"
    >
      <!-- 表头 -->
      <div class="thead" ref="thead" :style="{width: setUnit(colWidths.reduce((a, b) => a + b, 0))}">
        <div ref="hrow" class="row" :class="headerRowClassName()">
          <zc-thead-col v-for="i, n in tableOptions" :key="'head' + i" :col-index="n" head >
            <zc-table-column
              :class="[headerCellClassName(i, n), i.sortable && i.prop && getSortIconClass(i.prop), { sortable: i.sortable }]"
              :type="i.type"
              :label="i.label"
              :width="colWidths[n]"
              :fixed="i.fixed"
              :align="i.align"
              :sortable="i.sortable"
              :prop="i.prop"
              @click="i.sortable && i.prop ? handleSort(i.prop) : () => {}"
            />
          </zc-thead-col>
        </div>
      </div>
      <div class="tbody" ref="tbody" :style="{width: setUnit(colWidths.reduce((a, b) => a + b, 0))}">
        <template v-if="data && data.length">
          <div
            class="row"
            ref="rows"
            v-for="(row, rowIndex) in data"
            :key="rowKey ? row[rowKey] : rowIndex"
            :class="[
              rowClassName(row, rowIndex),
              {
                'stripe-row': stripe && rowIndex % 2 === 1,
                'row-selected': isRowSelected(row)
              }
            ]"
            @click="handleRowClick(row, rowIndex, $event)"
          >
            <zc-thead-col v-for="i, n in tableOptions" :key="rowIndex + 'body' + i" :col-index="n" :row-index="rowIndex" :row="row">
              <zc-table-column
                :class="cellClassName(row, i, rowIndex, n)"
                :type="i.type"
                :label="i.label"
                :width="colWidths[n]"
                :fixed="i.fixed"
                :align="i.align"
                :tooltip="i.tooltip"
                :prop="i.prop"
                :formatter="i.formatter ? i.formatter(row, i, rowIndex) : ''"
                :showSlots="columnSlots.has(i.label) || (i.btns && !!i.btns.length)"
              >
                <component v-if="columnSlots.has(i.label)" :is="columnSlots.get(i.label)"></component>
                
                <zc-buttonGroup v-else-if="i.btns && !!i.btns.length" :gap="20">
                  <zc-button
                    v-for="btn in i.btns"
                    :key="btn.name"
                    :fontSize="14"
                    text
                    :color="btn.color"
                    @click.stop="btn.handle(rowIndex, row)"
                  >
                    {{ btn.name }}
                  </zc-button>
                </zc-buttonGroup>
              </zc-table-column>
            </zc-thead-col>
          </div>
        </template>
        
        <!-- 空数据提示 -->
        <div v-else class="empty-text">
          {{ emptyText }}
        </div>
      </div>
    </zc-scroll>

  </div>
</template>

<style scoped lang="scss">
.zc-table {
  width: 100%;
  overflow: hidden;
  position: relative;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #fff;
  
  &.border {
    border: 1px solid #e7e9eb;
    border-radius: 4px;
    
    .row {
      border-bottom: 1px solid #e7e9eb;
    }
    
    .tbody {
      .row {
        &:last-child {
          border-bottom: none;
        }
      }
    }

    .zc-table-col {
      &.fixedLeft {
        border-right: 1px solid #e7e9eb;
      }
      
      &.fixedRight {
        border-left: 1px solid #e7e9eb;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          width: 1px;
          height: 100%;
          background-color: #fff;
          left: -2px;
          top: 0;
        }
      }

      &:not(.fixedLeft):not(.fixedRight) {
        border-right: 1px solid #e7e9eb;
      }
    }
  }
  &:not(.border) {
    .zc-table-col {
      &.lastLeftFixed {
        position: relative;
        &::after {
          content: '';
          position: absolute;
          top: 0;
          width: 10px;
          height: 100%;
          right: -10px;
          box-shadow: inset 10px 0 10px -10px rgba(0, 0, 0, .1);
        }
      }
      
      &.firstRightFixed {
        position: relative;
        &::after {
          content: '';
          position: absolute;
          top: 0;
          width: 10px;
          height: 100%;
          left: -10px;
          box-shadow: inset -10px 0 10px -10px rgba(0, 0, 0, .1);
        }
      }
    }
  }

  
  .thead {
    position: sticky;
    top: 0;
    z-index: 10;
    .row {
      .zc-table-col {
        background-color: #fafafa;
        font-weight: bold;
        user-select: none;
      }
    }
  }
  
  .tbody {
    .row {
      &.stripe-row .zc-table-col {
        background-color: #fbfbfb;
      }
      
      &.row-selected .zc-table-col {
        background-color: var(--main-color-light9);
      }

      &:hover {
        .zc-table-col {
          background-color: #f5f7f9;
        }
      }
    }
    
    .empty-text {
      padding: 30px 0;
      text-align: center;
      color: #909399;
      font-size: 14px;
    }
  }
  
  .row {
    display: flex;
    width: 100%;
    .zc-table-col {
      background-color: #fff;
      text-align: var(--align);
      width: var(--width);
      position: relative;
      padding: 16px;
      line-height: 16px;
      font-size: 14px;
      color: var(--main-font-color);
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: var(--align);
      
      &.fixedLeft {
        position: sticky;
        left: var(--px);
        z-index: 1;
      }
      
      &.fixedRight {
        position: sticky;
        right: var(--px);
        z-index: 1;
      }

      :deep() {
        .column-label {
          width: inherit;
          overflow: hidden;
          label {
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
