<script setup lang="ts">
import { Form } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { reactive, unref, ref, onMounted } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'

const { required } = useValidator()

const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'price',
    label: '價格',
    component: 'Input',
    colProps: { span: 24 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'remark',
    label: '備註',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 2
    },
    colProps: { span: 24 }
  }
])

const { register, methods, elFormRef } = useForm({
  schema
})

defineExpose({
  elFormRef,
  getFormData: methods.getFormData
})

onMounted(() => {
  // unref(elFormRef)?.resetFields()
})
</script>

<template>
  <Form @register="register" />
</template>
