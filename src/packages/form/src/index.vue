<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent ({
  name: 'zcForm'
})
</script>

<script lang="ts" setup>
import { zcUI, zcUIProps } from '@/types/zcUI'
import { provide, reactive, toRefs, ref } from 'vue'

const props = withDefaults(defineProps<zcUIProps.Form>(), {
  labelPosition: 'left',
  labelAlign: 'left',
  scrollToError: false,
  hideRequiredAsterisk: false,
  validateOnRuleChange: true,
  disabled: false,
  enterSubmit: false,
  inline: false
})

const emit = defineEmits<{
  validate: [value: boolean, invalidFields?: Record<string, string>]
  submit: []
}>()

const fields: zcUI.FormItem[] = []
const errorFields = ref<Record<string, string>>({})

const addField = (field: zcUI.FormItem) => {
  fields.push(field)
}

const removeField = (field: zcUI.FormItem) => {
  if (field.prop) {
    fields.splice(fields.indexOf(field), 1)
  }
}

const validate = async (callback?: (isValid: boolean, invalidFields?: Record<string, string>) => void) => {
  errorFields.value = {}
  const promises = fields.map(field => field.validate())
  const results = await Promise.allSettled(promises)
  
  const invalidFields: Record<string, string> = {}
  let isValid = true
  
  results.forEach((result, index) => {
    if (result.status === 'rejected' || (result.status === 'fulfilled' && result.value.status === 'rejected')) {
      isValid = false
      const field = fields[index]
      if (field.prop) {
        invalidFields[field.prop] = result.status === 'rejected' 
          ? result.reason 
          : result.value.reason
        errorFields.value[field.prop] = invalidFields[field.prop]
      }
    }
  })
    
  emit('validate', isValid, invalidFields)
  if (callback) callback(isValid, invalidFields)
  
  return isValid
}

const validateField = async (prop: string) => {
  const field = fields.find(field => field.prop === prop)
  if (field) {
    try {
      await field.validate()
      delete errorFields.value[prop]
      return true
    } catch (error) {
      errorFields.value[prop] = error as string
      return false
    }
  }
  return false
}

const resetFields = () => {
  fields.forEach(field => {
    field.resetField && field.resetField()
  })
  errorFields.value = {}
}

const clearValidate = (props?: string | string[]) => {
  const fieldsToReset = props
    ? fields.filter(field => {
        if (Array.isArray(props)) {
          return field.prop && props.includes(field.prop)
        }
        return field.prop === props
      })
    : fields
    
  fieldsToReset.forEach(field => {
    field.clearValidate && field.clearValidate()
    if (field.prop) {
      delete errorFields.value[field.prop]
    }
  })
}

const handleEnterSubmit = (e: KeyboardEvent) => {
  if (props.enterSubmit && e.key === 'Enter') {
    e.preventDefault()
    submit()
  }
}

const submit = async () => {
  const isValid = await validate()
  if (isValid) {
    emit('submit')
  }
}

provide(
  'formContext',
  reactive({
    ...toRefs(props),
    addField,
    removeField,
    validateField,
    hideRequiredAsterisk: props.hideRequiredAsterisk || false
  })
)

defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate
})

</script>

<template>
  <form 
    class="zc-ui-component zc-form" 
    @submit.prevent="submit"
    @keydown="handleEnterSubmit"
    :class="{ 'zc-form-disabled': disabled, 'zc-form-inline': inline }"
  >
    <slot></slot>
  </form>
</template>

<style lang="scss" scoped>
.zc-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  :deep() {
    .zc-formItem {
      width: 100%;
    }
  }
  &.zc-form-disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  &.zc-form-inline {
    :deep() {
      .zc-formItem {
        width: auto;
      }
    }
  }
}
</style>