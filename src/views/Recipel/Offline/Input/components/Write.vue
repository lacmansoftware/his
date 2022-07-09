<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, onMounted } from 'vue'
import { TableData } from '@/api/table/types'
import { useValidator } from '@/hooks/web/useValidator'

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<TableData>>,
    default: () => null
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  params: {
    type: Object,
    default: () => {
      type: null
    }
  }
})

const rules = reactive({
  // title: [required()],
  // author: [required()],
  // importance: [required()],
  // pageviews: [required()],
  // display_time: [required()],
  // content: [required()]
})

const { register, methods, elFormRef, formRef } = useForm({
  schema: props.formSchema
})

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    const { setValues } = methods
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  formRef,
  elFormRef,
  getFormData: methods.getFormData,
  setValues: methods.setValues
})

onMounted(() => {
  // console.log(elFormRef)
  // console.log(formRef)
})
</script>

<template>
  <Form :rules="rules" @register="register">
    <template #doctorSearch-default="{ item }">
      <div class="flex w-full justify-between">
        <span class="flex-1">{{ item.doctorName }}</span>
        <span class="flex-1">{{ item.doctorMobile }}</span>
      </div>
    </template>
    <template #memberSearch-default="{ item }">
      <div class="flex w-full justify-between">
        <span class="flex-1">{{ item.memberName }}</span>
        <span class="flex-1">{{ item.memberMobile }}</span>
      </div>
    </template>
  </Form>
</template>
