<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, onMounted, PropType } from 'vue'
import { AppointRegisteredTableData } from '@/api/appoint/regist/registered/types'

import { genFormSchema } from '@/utils/schema'

const props = defineProps({
  currentRow: {
    type: Object as PropType<AppointRegisteredTableData>,
    default: () => {}
  }
})

const schema = reactive<FormSchema[]>([
  genFormSchema('input', 'refundAmount', '輸入退費金額：', {
    placeholder: null,
    required: true,
    labelWidth: '150px'
  }),
  genFormSchema('textarea', 'remark', '退費備註：', {
    placeholder: null,
    span: 24,
    required: true
  }),
  genFormSchema('hidden', 'id', '退費備註：', { placeholder: null, span: 24 })
])

const { register, methods, elFormRef } = useForm({
  schema
})

onMounted(() => {
  methods.setValues(props?.currentRow)
})

defineExpose({
  methods,
  elFormRef,
  schema
})
</script>

<template>
  <Form @register="register" />
</template>
