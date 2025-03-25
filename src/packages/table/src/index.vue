<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcTable'
})
</script>

<script lang="ts" setup>
import { splitString, setUnit } from '@/utils/common'
import { zcUIProps } from '@/types/zcUI'
import { defineProps, ref, nextTick, watchEffect, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import zcScroll from '@/packages/scroll/src/index.vue'
import zcButton from '@/packages/button/src/index.vue'
import zcButtonGroup from '@/packages/buttonGroup/src/index.vue'

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

// 排序相关
const sortState = ref({
  prop: props.defaultSort?.prop || '',
  order: props.defaultSort?.order || ''
})

// 选择相关
const selectedRows = ref<any[]>([])
const isAllSelected = computed(() => {
  return props.data.length > 0 && selectedRows.value.length === props.data.length
})
const isIndeterminate = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.length < props.data.length
})

// 发出事件
const emit = defineEmits<{
  'row-click': [row: any, index: number, event: MouseEvent],
  'select': [selection: any[], row: any],
  'select-all': [selection: any[]],
  'sort-change': [{ prop: string, order: string }]
}>()

// 计算表头宽度
const calculateColWidths = () => {
  if (!tbody.value || !rows.value || rows.value.length === 0) return
  
  const bodywidth = ref(tbody.value.offsetWidth)
  const dynamics = ref(0)
  props.option.map(i => {
    if (i.width) {
      bodywidth.value -= splitString(i.width.toString()).num
    } else {
      dynamics.value += 1
    }
  })
  
  const widths = Array.from(rows.value[0].children).map((_, colIndex) => {
    const maxWidth = Math.max(
      ...Array.from(rows.value).map((row: any) => row.children[colIndex].offsetWidth)
    )
    return (
      props.option[colIndex].width && splitString(props.option[colIndex].width.toString()).num ||
      (maxWidth > bodywidth.value / dynamics.value
        ? maxWidth
        : bodywidth.value / dynamics.value)
    )
  })
  colWidths.value = widths
}

// 计算滚动区域高度
const scrollHeight = ref()
const getScrollHeight = () => {
  if (!zcTable.value || !thead.value) return
  
  const zcTableHeight = zcTable.value.offsetHeight
  const theadHeight = thead.value.offsetHeight
  scrollHeight.value = zcTableHeight - theadHeight
}

// 固定列位置计算
const setPx = (fixed: string | undefined, index: number) => {
  if (!fixed || !colWidths.value.length) return '0px'
  
  // 获取所有固定在同一侧的列索引
  const fixedColumns = props.option
    .map((col, idx) => ({ idx, fixed: col.fixed }))
    .filter(item => item.fixed === fixed)
    .map(item => item.idx)
  
  // 当前列在固定列中的位置
  const currentFixedIndex = fixedColumns.indexOf(index)
  
  // 如果找不到当前列，返回0
  if (currentFixedIndex === -1) return '0px'
  
  // 计算偏移量
  let offset = 0
  
  if (fixed === 'left') {
    // 左侧固定列：计算当前列之前的所有左侧固定列宽度之和
    for (let i = 0; i < currentFixedIndex; i++) {
      const colIndex = fixedColumns[i]
      offset += colWidths.value[colIndex] || 0
    }
  } else if (fixed === 'right') {
    // 右侧固定列：计算当前列之后的所有右侧固定列宽度之和
    for (let i = currentFixedIndex + 1; i < fixedColumns.length; i++) {
      const colIndex = fixedColumns[i]
      offset += colWidths.value[colIndex] || 0
    }
  }
  
  return setUnit(offset)
}

// 判断是否是最后一个左固定列
const isLastLeftFixed = (index: number) => {
  const leftFixedColumns = props.option
    .map((col, idx) => ({ idx, fixed: col.fixed }))
    .filter(item => item.fixed === 'left')
    .map(item => item.idx)
    .sort((a, b) => a - b)
  
  return leftFixedColumns.length > 0 && leftFixedColumns[leftFixedColumns.length - 1] === index
}

// 判断是否是第一个右固定列
const isFirstRightFixed = (index: number) => {
  const rightFixedColumns = props.option
    .map((col, idx) => ({ idx, fixed: col.fixed }))
    .filter(item => item.fixed === 'right')
    .map(item => item.idx)
    .sort((a, b) => a - b)
  
  return rightFixedColumns.length > 0 && rightFixedColumns[0] === index
}

// 处理点击行
const handleRowClick = (row: any, index: number, event: MouseEvent) => {
  emit('row-click', row, index, event)
}

// 处理排序
const handleSort = (column: any) => {
  if (!column.sortable) return
  
  // 切换排序方向
  let order = ''
  if (sortState.value.prop === column.prop) {
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
  
  sortState.value = {
    prop: order ? column.prop : '',
    order
  }
  
  emit('sort-change', sortState.value)
}

// 获取排序图标类名
const getSortIconClass = (column: any) => {
  if (!column.sortable) return {}
  
  return {
    'sort-active': sortState.value.prop === column.prop,
    'sort-ascending': sortState.value.prop === column.prop && sortState.value.order === 'ascending',
    'sort-descending': sortState.value.prop === column.prop && sortState.value.order === 'descending'
  }
}

// 处理选择
const handleSelectAll = (checked: boolean) => {
  selectedRows.value = checked ? [...props.data] : []
  emit('select-all', selectedRows.value)
}

const handleSelectRow = (row: any, checked: boolean) => {
  if (checked) {
    selectedRows.value.push(row)
  } else {
    const index = selectedRows.value.findIndex(item => {
      return props.rowKey ? item[props.rowKey] === row[props.rowKey] : item === row
    })
    if (index !== -1) {
      selectedRows.value.splice(index, 1)
    }
  }
  emit('select', selectedRows.value, row)
}

const isRowSelected = (row: any) => {
  return selectedRows.value.some(item => {
    return props.rowKey ? item[props.rowKey] === row[props.rowKey] : item === row
  })
}

// 获取行类名
const getRowClassName = (row: any, rowIndex: number) => {
  let className = ''
  
  // 用户自定义类名
  if (typeof props.rowClassName === 'function') {
    className += props.rowClassName(row, rowIndex) + ' '
  }
  
  // 斑马纹
  if (props.stripe && rowIndex % 2 === 1) {
    className += 'stripe-row '
  }
  
  // 选中状态
  if (isRowSelected(row)) {
    className += 'row-selected '
  }
  
  return className
}

// 监听数据变化
watch(
  () => props.data,
  () => {
    nextTick(() => {
      selectedRows.value = []
      calculateColWidths()
      getScrollHeight()
    })
  },
  { deep: true }
)

// 监听滚动事件
const handleScroll = (e: any) => {
  thead.value.scrollLeft = e.scrollLeft
}

// 组件挂载和卸载
onMounted(() => {
  nextTick(() => {
    calculateColWidths()
    getScrollHeight()
  })
  
  window.addEventListener('resize', getScrollHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', getScrollHeight)
})
</script>

<template>
  <div
    v-if="props.option"
    class="zc-table zc-ui-component"
    ref="zcTable"
    :class="{ border: props.border }"
    :style="{ height: setUnit(props.height), maxHeight: setUnit(props.maxHeight) }"
    v-loading="props.loading"
  >
    <!-- 表头 -->
    <div class="thead" ref="thead" v-if="showHeader">
      <div
        class="col header-cell"
        v-for="(column, index) in props.option"
        :class="[
          {
            fixedLeft: column.fixed === 'left',
            fixedRight: column.fixed === 'right',
            lastLeftFixed: column.fixed === 'left' && isLastLeftFixed(index),
            firstRightFixed: column.fixed === 'right' && isFirstRightFixed(index),
            sortable: column.sortable
          },
          headerCellClassName(column, index)
        ]"
        :key="column.label || index"
        :style="{
          '--px': setPx(column.fixed, index),
          '--width': colWidths[index] ? setUnit(colWidths[index]) : 'auto',
          overflow: column.width ? 'hidden' : 'visible',
          textOverflow: column.width ? 'ellipsis' : 'clip',
          '--align': column.align || 'left',
          flex: colWidths[index] ? 'none' : 1
        }"
      >
        <!-- 全选框 -->
        <template v-if="column.type === 'selection'">
          <input 
            type="checkbox" 
            :checked="isAllSelected"
            :indeterminate="isIndeterminate"
            @change="(e: Event) => handleSelectAll((e.target as HTMLInputElement).checked)"
          />
        </template>
        
        <!-- 普通列 -->
        <template v-else>
          <div 
            class="column-label" 
            @click="handleSort(column)"
          >
            {{ column.label }}
            
            <!-- 排序图标 -->
            <span 
              v-if="column.sortable" 
              class="sort-icon"
              :class="getSortIconClass(column)"
            >
              <i class="sort-up-icon">▲</i>
              <i class="sort-down-icon">▼</i>
            </span>
          </div>
        </template>
      </div>
    </div>
    
    <!-- 表格内容 -->
    <zc-scroll 
      :height="scrollHeight" 
      :key="scrollHeight"
      ref="scroll" 
      @scroll="handleScroll"
    >
      <div class="tbody" ref="tbody" v-if="props.data && props.data.length">
          <div
            class="row"
            ref="rows"
            v-for="(row, rowIndex) in props.data"
            :key="rowKey ? row[rowKey] : rowIndex"
            :class="getRowClassName(row, rowIndex)"
            :style="{ width: colWidths.reduce((a, b) => a + b, 0) + 'px' }"
            @click="handleRowClick(row, rowIndex, $event)"
          >
            <div
              class="col"
              v-for="(column, colIndex) in props.option"
              :class="{
                fixedLeft: column.fixed === 'left',
                fixedRight: column.fixed === 'right',
                lastLeftFixed: column.fixed === 'left' && isLastLeftFixed(colIndex),
                firstRightFixed: column.fixed === 'right' && isFirstRightFixed(colIndex)
              }"
              :key="colIndex"
              :style="{
                '--px': setPx(column.fixed, colIndex),
                '--width': colWidths[colIndex] ? setUnit(colWidths[colIndex]) : 'auto',
                overflow: column.width ? 'hidden' : 'visible',
                textOverflow: column.width ? 'ellipsis' : 'clip',
                '--align': column.align || 'left',
                flex: colWidths[colIndex] ? 'none' : 1
              }"
            >
              <!-- 索引列 -->
              <template v-if="column.type === 'index'">
                {{ rowIndex + 1 }}
              </template>
              
              <!-- 选择列 -->
              <template v-else-if="column.type === 'selection'">
                <input 
                  type="checkbox" 
                  :checked="isRowSelected(row)"
                  @change="(e: Event) => handleSelectRow(row, (e.target as HTMLInputElement).checked)"
                />
              </template>
              
              <!-- 按钮列 -->
              <template v-else-if="column.btns && column.btns.length">
                <zc-buttonGroup :gap="20">
                  <zc-button
                    v-for="btn in column.btns"
                    :key="btn.name"
                    :size="14"
                    :text="true"
                    :color="btn.color"
                    @click="btn.handle(rowIndex, row)"
                  >
                    {{ btn.name }}
                  </zc-button>
                </zc-buttonGroup>
              </template>
              
              <!-- 常规数据列 -->
              <template v-else>
                  {{ column.prop ? column.formatter ? column.formatter(row, column, rowIndex) : row[column.prop] : '' }}
              </template>
            </div>
        </div>
      </div>
      
      <!-- 空数据提示 -->
      <div v-else class="empty-text">
        {{ emptyText }}
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
  
  &.border {
    border: 1px solid #e7e9eb;
    border-radius: 4px;
    
    .thead {
      .col {
        border-bottom: 1px solid #e7e9eb;
        &:not(:last-child) {
          border-right: 1px solid #e7e9eb;
        }
      }
    }
    
    .tbody {
      .row {
        .col {
          border-bottom: 1px solid #e7e9eb;
          &:not(:last-child) {
            border-right: 1px solid #e7e9eb;
          }
        }
        
        &:last-child .col {
          border-bottom: none;
        }
      }
    }
  }
  
  .thead {
    width: 100%;
    line-height: 16px;
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;
    scrollbar-width: none;
    background-color: #fafafa;
    
    .col {
      background-color: #fafafa;
    }
    
    .header-cell {
      padding: 16px;
      font-weight: 600;
      user-select: none;
      
      &.sortable {
        cursor: pointer;
        
        &:hover {
          background-color: #f0f0f0;
        }
      }
      
      .column-label {
        display: flex;
        align-items: center;
        justify-content: var(--align);
        
        .sort-icon {
          display: inline-flex;
          flex-direction: column;
          margin-left: 4px;
          line-height: 0;
          font-size: 10px;
          color: #c0c4cc;
          
          &.sort-active {
            color: var(--main-color);
          }
          
          i {
            line-height: 1;
            margin: -1px 0;
          }
          
          &.sort-ascending .sort-up-icon {
            color: var(--main-color);
          }
          
          &.sort-descending .sort-down-icon {
            color: var(--main-color);
          }
        }
      }
    }
  }
  
  .tbody {
    background-color: #fff;
    position: relative;
  }
  
  .virtual-list {
    position: absolute;
    width: 100%;
    top: 0;
  }
  
  .row {
    display: flex;
    transition: background-color 0.15s ease;
    
    &:hover {
      .col {
        background-color: #f5f7f9;
      }
    }
    
    &.stripe-row .col {
      background-color: #fafafa;
    }
    
    &.row-selected .col {
      background-color: rgba(var(--main-color-rgb, 0, 120, 212), 0.1);
    }
  }
  
  .col {
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
    
    &.lastLeftFixed {
      box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
    }
    
    &.firstRightFixed {
      box-shadow: -2px 0 4px rgba(0, 0, 0, 0.05);
    }
  }
  
  .empty-text {
    padding: 30px 0;
    text-align: center;
    color: #909399;
    font-size: 14px;
  }
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
}
</style>
