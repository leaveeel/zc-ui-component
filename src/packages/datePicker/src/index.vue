<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'zcDatePicker'
})
</script>

<script lang="ts" setup>
import { zcUIProps } from '@/types/zcUI'
import { defineProps, ref, computed, onMounted, onUnmounted } from 'vue'
import zcInput from '@/packages/input/src/index.vue'
import DatePickerPanel from './components/DatePickerPanel.vue'
import { DateFormat } from '@/utils/common'

const props = withDefaults(defineProps<zcUIProps.DatePicker>(), {
  type: 'date',
  placeholder: '',
  clearable: true,
  disabled: false,
  modelValue: ''
})

const emit = defineEmits(['update:modelValue', 'change'])

const computedFormat = computed(() => {
  if(!props.format) {
    if(props.type === 'date' || props.type === 'daterange') return 'yyyy-MM-dd'
    if(props.type === 'datetime') return 'yyyy-MM-dd hh:mm:ss'
  }else {
    return props.format
  }
})

const computedValueFormat = computed(() => {
  if(!props.valueFormat) {
    if(props.type === 'date' || props.type === 'daterange') return 'yyyy-MM-dd'
    if(props.type === 'datetime') return 'yyyy-MM-dd hh:mm:ss'
  }else {
    return props.valueFormat
  }
})

const model = computed({
  get: () => {
    if(props.type.includes('range')) {
      return (props.modelValue && Array.isArray(props.modelValue) ? props.modelValue.map(i => new Date(i)) : []) as Date[]
    }else {
      return (props.modelValue && !Array.isArray(props.modelValue)) ? new Date(props.modelValue as string | Date) : undefined
    }
  },
  set: (v) => {
    let update = Array.isArray(v) ? v.map(i => DateFormat(new Date(i), computedValueFormat.value)) : v ? DateFormat(new Date(v), computedValueFormat.value) : undefined
    emit('update:modelValue', update)
    handleDateSelect(v, update)
  }
})

const pickerVisible = ref(false)
const pickerRef = ref<HTMLElement | null>(null)

// 格式化显示值
const displayValue = ref('')
const formatDisplayValue = (v: undefined | (undefined | Date)[] | Date = undefined) => {
  if (!v) return displayValue.value = ''
  if (props.type.includes('range') && Array.isArray(v)) {
    if (v.length !== 2) return displayValue.value =  ''
    const [start, end] = v
    if (!start || !end) return displayValue.value =  ''
    displayValue.value = `${DateFormat(start, computedFormat.value)} - ${DateFormat(end, computedFormat.value)}`
  } else {
    displayValue.value = DateFormat(new Date(v as Date), computedFormat.value)
  }
}

onMounted(() => {
  formatDisplayValue(model.value)
})

// 处理日期选择
const handleDateSelect = (date: Date | Date[] | undefined, formatDate: String | String[] | undefined) => {
  emit('change', date, formatDate)
  formatDisplayValue(date)
  if (!props.type.includes('range') || (Array.isArray(date) && date.length === 2)) {
    pickerVisible.value = false
  }
}

// 处理点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
    pickerVisible.value = false
  }
}

// 监听点击外部
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 处理清除
const handleClear = () => {
  emit('update:modelValue', props.type.includes('range') ? [] : '')
  emit('change', props.type.includes('range') ? [] : '')
  formatDisplayValue()
  pickerVisible.value = false
  input.value = false
}


const focus = ref(false)
const input = ref(false)
const handleBlur = () => {
  focus.value = false
  if(!input.value) return
  input.value = false
  if(!new Date(displayValue.value).getTime()) {
    handleClear()
  }else {
    handleDateSelect(new Date(DateFormat(new Date(displayValue.value), computedFormat.value)), DateFormat(new Date(displayValue.value), computedFormat.value))
  }
}
</script>

<template>
  <div class="zc-date-picker" ref="pickerRef">
    <zc-input
      v-model="displayValue"
      :placeholder="placeholder"
      :clearable="clearable"
      :disabled="disabled"
      @clear="handleClear"
      @click="focus && (pickerVisible = true)"
      @focus="focus = true"
      @input="!input && (input = true)"
      @blur="handleBlur"
    />
    <DatePickerPanel 
      v-if="pickerVisible" 
      v-model="model"
      :type="type"
    />
  </div>
</template>

<style lang="scss" scoped>
.zc-date-picker {
  display: inline-block;
  position: relative;
  width: 220px;

  :deep(.zc-input) {
    width: 100%;
  }
}
</style>