<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcFormItem'
})
</script>

<script lang="ts" setup>
import { setUnit } from '@/utils/common'
import AsyncValidator, { Rules } from 'async-validator'
import { debounce } from 'lodash-es'
import { zcUI, zcUIProps } from '@/types/zcUI'
import { defineProps, ref, provide, reactive, toRefs, inject, computed, onMounted, onBeforeUnmount, StyleValue, nextTick, watch } from 'vue'

const props = withDefaults(defineProps<zcUIProps.FormItem>(), {
  showMessage: true
})

const formContext = inject('formContext') as zcUI.Form

const errorMsg = ref('')
provide('errorMsg', errorMsg)
const isFieldDisabled = ref(!!formContext.disabled)

const rules = props.rules || (formContext.rules && formContext.rules[props.prop]) || undefined

const itemRequired = computed(() => {
  if (props.required) return true
  if (rules) {
    if (rules instanceof Array) {
      return !!rules.find(i => i.required)
    } else {
      return !!rules.required
    }
  }
  return false
})

const itemTrigger = computed(() => {
  let trigger: string[] = []
  if (rules) {
    if (rules instanceof Array) {
      rules
        .filter(i => i.trigger)
        .forEach(i => {
          if (i.trigger.indexOf('blur') >= 0) trigger.push('blur')
          if (i.trigger.indexOf('change') >= 0) trigger.push('change')
        })
      if (!trigger.length) trigger = ['change']
    } else {
      trigger.push(rules.trigger || 'change')
    }
  }
  return trigger
})

const validate = async (t = 'change', v = formContext.model[props.prop]) => {
  if (!rules) {
    return { status: 'fulfilled' as const }
  }
  
  const validator = new AsyncValidator({ [props.prop]: rules } as Rules)
  const model = { [props.prop]: v }
  
  try {
    await validator.validate(model)
    errorMsg.value = ''
    return { status: 'fulfilled' as const }
  } catch (err: any) {
    const message = err.errors[0].message
    errorMsg.value = props.showMessage ? message : ''
    return { status: 'rejected' as const, reason: message }
  }
}

const blur = () => {
  if (itemTrigger.value.indexOf('blur') >= 0) {
    validate('blur')
  }
}
provide('blur', blur)

const change = debounce(e => {
  if (itemTrigger.value.indexOf('change') >= 0) {
    validate('change', e)
  }
}, 300)
provide('change', change)

const id = 'formItem-' + Math.random()
provide('id', id)

const resetField = () => {
  errorMsg.value = ''
  if (props.prop && formContext.model) {
    // 重置为默认值
    formContext.model[props.prop] = Array.isArray(formContext.model[props.prop]) 
      ? [] 
      : typeof formContext.model[props.prop] === 'object' && formContext.model[props.prop] !== null
        ? {}
        : null
  }
}

const clearValidate = () => {
  errorMsg.value = ''
}

const updateDisabled = (disabled: boolean) => {
  isFieldDisabled.value = disabled
}

provide('fieldDisabled', isFieldDisabled)

const context = reactive({
  ...toRefs(props),
  validate,
  resetField,
  clearValidate,
  updateDisabled
})

// 监听form-disabled属性变化
watch(() => formContext.disabled, (val) => {
  isFieldDisabled.value = !!val
})

// 监听rules变化，重新验证
watch(() => props.rules, () => {
  if (formContext.validateOnRuleChange) {
    nextTick(() => validate())
  }
}, { deep: true })

onMounted(() => {
  if (props.prop) {
    formContext.addField(context)
  }
})

onBeforeUnmount(() => {
  if (props.prop) {
    formContext.removeField(context)
  }
})

defineExpose({
  validate,
  resetField,
  clearValidate
})
</script>

<template>
  <div
    class="zc-formItem zc-ui-component"
    ref="formItemRef"
    :class="{
      row:
        (labelPosition
          ? labelPosition
          : formContext.labelPosition) !== 'top',
      column:
        (labelPosition
          ? labelPosition
          : formContext.labelPosition) === 'top',
      'is-error': errorMsg,
      'is-required': itemRequired
    }"
    :data-prop="prop"
  >
    <label
      class="formItemLabel"
      v-if="label"
      :style="{
        width: (labelWidth || formContext.labelWidth) ? setUnit(
          labelWidth ? labelWidth : formContext.labelWidth as string | number
        ) : 'auto',
        textAlign: labelPosition
          ? labelPosition
          : formContext.labelPosition as string | number
      } as StyleValue"
      :for="id"
    >
      <span v-if="itemRequired && !formContext.hideRequiredAsterisk" class="required-asterisk">*</span>{{ label }}
    </label>
    <div class="formItemContent">
      <slot></slot>
      <p class="error" v-if="errorMsg && showMessage">
        {{ errorMsg }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.zc-formItem {
  display: flex;
  margin-bottom: 20px;
  transition: all 0.3s;
  
  &.column {
    flex-direction: column;
    .formItemLabel {
      margin-bottom: 4px;
    }
  }
  &.row {
    flex-direction: row;
    line-height: 40px;
    .formItemLabel {
      margin-right: 6px;
    }
  }
  &.is-error {
    .formItemLabel, input, textarea, .zc-select {
      color: var(--main-danger-color);
    }
    input, textarea, .zc-select {
      border-color: var(--main-danger-color);
    }
  }
  &.is-required {
    .formItemLabel {
      font-weight: bold;
    }
  }
  .formItemLabel {
    flex-shrink: 0;
    transition: color 0.3s;
    .required-asterisk {
      color: var(--main-danger-color);
      margin-right: 4px;
    }
  }
  .formItemContent {
    width: 100%;
    .error {
      font-size: 12px;
      font-family: var(--main-font-family);
      line-height: 10px;
      margin-top: 8px;
      color: var(--main-danger-color);
      transition: all 0.3s;
    }
  }
}
</style>
