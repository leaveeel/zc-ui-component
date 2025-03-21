<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
    name: 'zcPagination'
  })
</script>

<script lang="ts" setup>
import { zcUIProps } from '@/types/zcUI'
import { defineProps, computed, ref } from 'vue'
import zcButton from '@/packages/button/src/index.vue'
import zcButtonGroup from '@/packages/buttonGroup/src/index.vue'
import IconRightArrow from '@/packages/icon/src/IconRightArrow.vue'
import zcIcon from '@/packages/icon/index.vue'
import zcInput from '@/packages/input/src/index.vue'

const props = withDefaults(defineProps<zcUIProps.Pagination>(), {
  pageSize: 10,
  modelValue: 1,
  layout: 'prev, pager, next',
  showTotal: false,
  pageSizes: () => [10, 20, 30, 50],
  hideOnSinglePage: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: number],
  'update:pageSize': [value: number],
  change: [value: number],
  'size-change': [value: number]
}>()

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))
const inputPage = ref<string>('')
const inputVisible = ref(false)
const pageSize = ref(props.pageSize)

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  emit('update:modelValue', page)
  emit('change', page)
  inputPage.value = ''
  inputVisible.value = false
}

const nextPage = () => {
  if (props.modelValue < totalPages.value) {
    goToPage(props.modelValue + 1)
  }
}

const prevPage = () => {
  if (props.modelValue > 1) {
    goToPage(props.modelValue - 1)
  }
}

const handlePage = (page: number) => {
  goToPage(page)
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  emit('update:pageSize', size)
  emit('size-change', size)
  // 调整当前页以确保不超出新的总页数范围
  const newTotalPages = Math.ceil(props.total / size)
  if (props.modelValue > newTotalPages) {
    goToPage(newTotalPages)
  }
}

const showPagination = computed(() => {
  return !(props.hideOnSinglePage && totalPages.value <= 1)
})

const pageList = computed(() => {
  const pages = []
  if (totalPages.value <= 6 && totalPages.value > 0) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (props.modelValue <= 4) {
      pages.push(1, 2, 3, 4, 5, 0, totalPages.value)
    } else if (props.modelValue >= totalPages.value - 3) {
      pages.push(
        1,
        0,
        totalPages.value - 4,
        totalPages.value - 3,
        totalPages.value - 2,
        totalPages.value - 1,
        totalPages.value
      )
    } else {
      pages.push(
        1,
        0,
        props.modelValue - 1,
        props.modelValue,
        props.modelValue + 1,
        0,
        totalPages.value
      )
    }
  }
  return pages
})

const handleQuickPrevClick = () => {
  goToPage(Math.max(1, props.modelValue - 5))
}

const handleQuickNextClick = () => {
  goToPage(Math.min(totalPages.value, props.modelValue + 5))
}

const handleInputConfirm = () => {
  const pageNum = parseInt(inputPage.value)
  if (!isNaN(pageNum)) {
    goToPage(pageNum)
  }
}

const showJumper = () => {
  inputVisible.value = true
  setTimeout(() => {
    const input = document.querySelector('.zc-pagination-jumper input') as HTMLInputElement
    if (input) {
      input.focus()
    }
  }, 10)
}
</script>

<template>
  <div 
    v-if="showPagination"
    class="zc-pagination zc-ui-component"
  >
    <span v-if="showTotal" class="zc-pagination-total" :style="{ '--order': layout.indexOf('total') + 1 }">
      Total {{ total }}
    </span>
    
    <div v-if="layout.includes('sizes')" class="zc-pagination-sizes" :style="{ '--order': layout.indexOf('sizes') + 1 }">
      <select 
        v-model="pageSize"
        @change="handlePageSizeChange(Number(pageSize))"
      >
        <option v-for="size in pageSizes" :key="size" :value="size">
          {{ size }} Size/Page
        </option>
      </select>
    </div>
    
    <zc-button
      v-if="layout.includes('prev')"
      class="zc-pagination-prev"
      :style="{ '--order': layout.indexOf('prev') + 1 }"
      width="24"
      height="24"
      radius="4"
      background="#fff"
      color="#999"
      @click="prevPage"
      :disabled="modelValue === 1"
    >
      <zcIcon size="16" :rotate="180">
        <IconRightArrow></IconRightArrow>
      </zcIcon>
    </zc-button>
    
    <zc-buttonGroup 
      v-if="layout.includes('pager')"
      gap="4" 
      class="zc-pagination-pager"
      :style="{ '--order': layout.indexOf('pager') + 1 }"
    >
      <template v-for="(page, index) in pageList" :key="index">
        <zc-button
          v-if="page !== 0"
          :type="modelValue === page ? 'primary' : 'default'"
          height="24"
          width="24"
          radius="4"
          size="12"
          :background="modelValue === page ? 'var(--main-color)' : '#fff'"
          :color="modelValue === page ? '#fff' : 'var(--main-font-color)'"
          @click="handlePage(page)"
        >
          {{ page }}
        </zc-button>
        <zc-button
          v-else
          class="zc-pagination-ellipsis"
          height="24"
          background="#fff"
          color="#999"
          width="24"
          radius="4"
          @click="index < 3 ? handleQuickPrevClick() : handleQuickNextClick()"
        >
          ...
        </zc-button>
      </template>
    </zc-buttonGroup>
    
    <zc-button
      v-if="layout.includes('next')"
      class="zc-pagination-next"
      :style="{ '--order': layout.indexOf('next') + 1 }"
      width="24"
      height="24"
      radius="4"
      background="#fff"
      color="#999"
      @click="nextPage"
      :disabled="modelValue === totalPages"
    >
      <zcIcon size="16">
        <IconRightArrow></IconRightArrow>
      </zcIcon>
    </zc-button>
    
    <div v-if="layout.includes('jumper')" class="zc-pagination-jumper" :style="{ '--order': layout.indexOf('jumper') + 1 }">
      <template v-if="!inputVisible">
        <span @click="showJumper">Go to</span>
      </template>
      <template v-else>
        <zcInput 
          v-model="inputPage"
          placeholder="No."
          size="small"
          type="number"
          height="32"
          min="1"
          :max="totalPages"
          @keyup.enter="handleInputConfirm"
          @blur="inputVisible = false"
        />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.zc-pagination {
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 12px;
  
  .zc-pagination-total {
    order: var(--order);
    color: #666;
  }
  
  .zc-pagination-sizes {
    order: var(--order);
    select {
      height: 32px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      padding: 0 8px;
      color: #606266;
      outline: none;
      
      &:focus {
        border-color: var(--main-color);
      }
    }
  }

  .zc-pagination-prev {
    order: var(--order);
    padding: 0;
  }
  
  .zc-pagination-pager {
    order: var(--order);
    .zc-button {
      font-size: 14px;
    }
    
    .zc-pagination-ellipsis {
      line-height: 1;
      cursor: pointer;
    }
  }

  .zc-pagination-next {
    order: var(--order);
    padding: 0;
  }
  
  .zc-pagination-jumper {
    order: var(--order);
    display: flex;
    align-items: center;
    color: #606266;
    
    span {
      cursor: pointer;
      &:hover {
        color: var(--main-color);
      }
    }
    
    input {
      width: 50px;
      height: 32px;
      text-align: center;
      margin: 0 8px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      
      &:focus {
        border-color: var(--main-color);
        outline: none;
      }
    }
  }
}
</style>
