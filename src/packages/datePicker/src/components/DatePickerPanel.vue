<template>
  <div class="zc-date-picker-panel">
    <div class="panel-header">
      <span class="prev-year-btn" @click="prevYear">&lt;&lt;</span>
      <span class="prev-month-btn" @click="prevMonth">&lt;</span>
      <span class="year-month">
        {{ currentYear }}年 {{ currentMonth }}月
      </span>
      <span class="next-month-btn" @click="nextMonth">&gt;</span>
      <span class="next-year-btn" @click="nextYear">&gt;&gt;</span>
    </div>
    <div class="panel-week">
      <span v-for="week in ['日', '一', '二', '三', '四', '五', '六']" :key="week">{{ week }}</span>
    </div>
    <div class="panel-body">
      <div class="week" v-for="(week, weekIndex) in calendarDays" :key="weekIndex">
        <span
          class="day"
          v-for="(day, dayIndex) in week" :key="dayIndex"
          :class="{
            'not-current-month': !day.isCurrentMonth,
            'today': day.isToday,
            'selected': tempDate && (Array.isArray(tempDate) ? tempDate.map(i=>i.toDateString()).includes(day.date.toDateString()) : day.date.toDateString() === tempDate.toDateString()),
            'range': rangeDate.length === 2 && day.date.getTime() > rangeDate[0].getTime() && day.date.getTime() < rangeDate[1].getTime(),
            'rangeStart': rangeDate.length === 2 && day.date.toDateString() === rangeDate[0].toDateString(),
            'rangeEnd': rangeDate.length === 2 && day.date.toDateString() === rangeDate[1].toDateString(),
          }"
          @click="handleDayClick(day)"
          @mouseenter="hoverDate = day.date"
        >
          {{ day.date.getDate() }}
        </span>
      </div>
    </div>
    <div class="panel-footer" v-if="type.includes('time')">
      <!-- 时间选择区域 -->
      <div class="time-picker">
        <zc-input type="number" :min="0" :max="23" placeholder="时" v-model="currentTime.hour" height="20"></zc-input>:
        <zc-input type="number" :min="0" :max="59" placeholder="分" v-model="currentTime.minute" height="20"></zc-input>:
        <zc-input type="number" :min="0" :max="59" placeholder="秒" v-model="currentTime.second" height="20"></zc-input>
        <zcButton v-if="type.includes('time')" type="primary" height="25" width="50" font-size="12" @click="confirmDateTime">确认</zcButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, reactive, onUnmounted, toRef } from 'vue'
import { getDaysInMonth, getDayOfWeek } from '../utils/dateUtils'
import { zcUIProps } from '@/types/zcUI'
import zcButton from '@/packages/button/src/index.vue';
import zcInput from '@/packages/input/src/index.vue';

const props = defineProps<{
  type: string,
  modelValue: Date | Date[] | undefined
}>()

const emit = defineEmits(['update:modelValue'])

const today = new Date()
const current = computed(() => {
  const m = props.modelValue
  if(!m) return today
  if(Array.isArray(m)) {
    return m.length ? m[0] : today
  } else {
    return m
  }
})
const currentYear = ref(current.value.getFullYear())
const currentMonth = ref(current.value.getMonth() + 1) // 月份从 1 开始

// 添加时间相关的响应式数据
const currentTime = reactive({
  hour: current.value.getHours(),
  minute: current.value.getMinutes(),
  second: current.value.getSeconds(),
});

// 计算日历网格数据
const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getDayOfWeek(year, month, 1);

  const days = [];
  // 填充上个月的日期
  const daysInPrevMonth = getDaysInMonth(year, month === 1 ? 12 : month - 1);
  const prevMonthYear = month === 1 ? year - 1 : year;
  const prevMonth = month === 1 ? 12 : month - 1;
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(prevMonthYear, prevMonth - 1, daysInPrevMonth - i);
    days.push({
      date: date,
      isCurrentMonth: false,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: props.modelValue ? props.type.includes('range') 
        ? Array.isArray(props.modelValue) && props.modelValue.length === 2 && props.modelValue[0] instanceof Date && props.modelValue[1] instanceof Date
          ? date >= props.modelValue[0] && date <= props.modelValue[1] 
          : false
        : props.modelValue instanceof Date && date.toDateString() === props.modelValue.toDateString()
        : false,
    });
  }

  // 填充当前月的日期
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month - 1, i);
    days.push({
      date: date,
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: props.modelValue ? props.type.includes('range') 
        ? Array.isArray(props.modelValue) && props.modelValue.length === 2 && props.modelValue[0] instanceof Date && props.modelValue[1] instanceof Date
          ? date >= props.modelValue[0] && date <= props.modelValue[1] 
          : false
        : props.modelValue instanceof Date && date.toDateString() === props.modelValue.toDateString() : false,

    });
  }

  // 填充下个月的日期
  const remaining = 42 - days.length; // 保证日历面板有 6 周
  const nextMonthYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(nextMonthYear, nextMonth - 1, i);
    days.push({
      date: date,
      isCurrentMonth: false,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: props.modelValue ? props.type.includes('range') 
        ? Array.isArray(props.modelValue) && props.modelValue.length === 2 && props.modelValue[0] instanceof Date && props.modelValue[1] instanceof Date
          ? date >= props.modelValue[0] && date <= props.modelValue[1] 
          : false
        : props.modelValue instanceof Date && date.toDateString() === props.modelValue.toDateString() : false,
    });
  }

  // 将一维数组转换为二维数组 (按周分组)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
})

// 实现切换年月的方法
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentYear.value--;
    currentMonth.value = 12;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentYear.value++;
    currentMonth.value = 1;
  } else {
    currentMonth.value++;
  }
};

const prevYear = () => {
  currentYear.value--;
};

const nextYear = () => {
  currentYear.value++;
};

const tempDate = props.type.includes('range') ? toRef(props.modelValue as Date[] || []) : toRef(props.modelValue as Date || undefined)
// 实现日期点击事件
const handleDayClick = (day: any) => {
  if (!day.isCurrentMonth) {
    // 点击了非当前月份的日期，切换到对应月份
    currentYear.value = day.date.getFullYear();
    currentMonth.value = day.date.getMonth() + 1;
  } 
    // 点击了当前月份的日期
    if (props.type === 'date') {
      // 单日期选择
      emit('update:modelValue', day.date);
    } else if (Array.isArray(tempDate.value)) {
      const v = tempDate.value
      // 日期范围选择
      if(v.length === 0) {
        // 如果当前没有选中的范围，则选中起始日期
        const newDate = new Date(day.date);
        if (props.type.includes('time')) {
          newDate.setHours(currentTime.hour, currentTime.minute, currentTime.second);
        }
        tempDate.value = [newDate]
      } else if(v.length === 1) {
        // 如果已经选中了起始日期，则选中结束日期
        const startDate = v[0];
        const endDate = new Date(day.date);
        if (props.type.includes('time')) {
          endDate.setHours(currentTime.hour, currentTime.minute, currentTime.second);
        }
        if (endDate < startDate) {
          // 如果结束日期早于起始日期，则交换
          tempDate.value = [endDate, startDate]
          if(!props.type.includes('time')) {
            emit('update:modelValue', [endDate, startDate]);
          }
        } else {
          tempDate.value = [startDate, endDate]
          if(!props.type.includes('time')) {
            emit('update:modelValue', [startDate, endDate]);
          }
        }
      } else {
        // 如果已经选中了起始日期和结束日期，则重新选择起始日期
        const newDate = new Date(day.date);
        if (props.type.includes('time')) {
          newDate.setHours(currentTime.hour, currentTime.minute, currentTime.second);
        }
        tempDate.value = [newDate]
      }
    } else if (props.type === 'datetime') {
      // 日期时间选择
      const newDate = new Date(day.date);
      newDate.setHours(currentTime.hour, currentTime.minute, currentTime.second);
      tempDate.value = newDate
    }
};

const confirmDateTime = () => {
  const validHour = currentTime.hour >= 0 && currentTime.hour <= 23;
  const validMinute = currentTime.minute >= 0 && currentTime.minute <= 59;
  const validSecond = currentTime.second >= 0 && currentTime.second <= 59;

  if (!validHour || !validMinute || !validSecond) {
    // 如果时间无效，不更新 modelValue
    console.warn('Invalid time input'); // 或者其他错误提示方式
    return;
  }

  // 只有当 modelValue 包含有效的日期时才更新时间
  if (props.type === 'datetime' && tempDate.value instanceof Date) {
    const newDate = new Date(tempDate.value);
    newDate.setHours(currentTime.hour, currentTime.minute, currentTime.second);
    emit('update:modelValue', newDate);
  } else if (props.type === 'datetimerange' && Array.isArray(tempDate.value) && tempDate.value.length === 2 && tempDate.value[0] instanceof Date && tempDate.value[1] instanceof Date) {
      // 更新日期范围的起始和结束时间
      // const startDate = new Date(tempDate.value[0]);
      // const endDate = new Date(tempDate.value[1]);
      // startDate.setHours(currentTime.hour, currentTime.minute, currentTime.second);
      // endDate.setHours(currentTime.hour, currentTime.minute, currentTime.second);
      // emit('update:modelValue', [startDate, endDate]);
  }
}

const hoverDate = ref()
const rangeDate = computed(() => {
  if(!Array.isArray(tempDate?.value) || tempDate?.value.length === 0) return []
  if (tempDate?.value.length === 2) {
    return tempDate?.value
  } else if(hoverDate.value.getTime() < tempDate?.value[0].getTime()) {
    return [hoverDate.value, tempDate?.value[0]]
  } else {
    return [tempDate?.value[0], hoverDate.value]
  }
})

// 监听 modelValue 变化，更新日历显示
watch(() => props.modelValue, (n) => {
  if(Array.isArray(n)) {
    if(n[0] || n[1]) {
      const newValue = [n[0] ? new Date(n[0]) : undefined, n[1] ? new Date(n[1]) : undefined]

      if (props.type.includes('time') && newValue[0]) {
        currentTime.hour = newValue[0].getHours();
        currentTime.minute = newValue[0].getMinutes();
        currentTime.second = newValue[0].getSeconds();
      }
    }
  }else {
    if(n) {
      const newValue = new Date(n)
      currentYear.value = newValue.getFullYear();
      currentMonth.value = newValue.getMonth() + 1;
      if (props.type.includes('time')) {
        currentTime.hour = newValue.getHours();
        currentTime.minute = newValue.getMinutes();
        currentTime.second = newValue.getSeconds();
      }
    }
  }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.zc-date-picker-panel {
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 10px;
  background-color: #fff;
  position: absolute;

  .panel-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    span {
      cursor: pointer;
      padding: 0 5px;
      &:hover {
        color: var(--main-color); /* Element Plus 主题蓝 */
      }
    }
    .year-month {
      font-weight: bold;
      cursor: default;
      &:hover {
        color: inherit;
      }
    }
  }

  .panel-week {
    display: flex;
    margin-bottom: 5px;
    span {
      width: 35px; /* 星期格子宽度 */
      text-align: center;
      font-weight: bold;
    }
  }

  .panel-body {
    .week {
      display: flex;
      .day {
        width: 35px; /* 日期格子宽度 */
        height: 35px; /* 日期格子高度 */
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 50%;
        &:hover {
          background-color: #e6f0ff; /* 悬停背景色 */
        }
        &.not-current-month {
          color: #c0c4cc; /* 非当前月份颜色 */
        }
        &.today {
          color: var(--main-color); /* 今天颜色 */
          font-weight: bold;
        }
        &.selected {
          background-color: var(--main-color); /* 选中背景色 */
          color: #fff; /* 选中文字颜色 */
        }
        &.range {
          background-color: #d6ebff;
          border-radius: 0;
        }
        &.rangeStart {
          border-radius: 50% 0 0 50%;
        }
        &.rangeEnd {
          border-radius: 0 50% 50% 0;
        }
      }
    }
  }

  .panel-footer {
    margin-top: 10px;
    text-align: center;
    .time-picker {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      .zc-input {
        width: 35px;
        :deep() {
          input {
            padding: 0;
            text-align: center;
          }
        }
      }
    }
  }
}
</style> 