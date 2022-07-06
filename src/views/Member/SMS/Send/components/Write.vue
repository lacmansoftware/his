<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
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
  }
})

const rules = reactive({
  title: [required()],
  author: [required()],
  importance: [required()],
  pageviews: [required()],
  display_time: [required()],
  content: [required()]
})

const { register, methods, elFormRef } = useForm({
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
  elFormRef,
  getFormData: methods.getFormData,
  setValues: methods.setValues
})
</script>

<template>
  <div>
    <h3>使用步驟及注意事項：</h3>
    <p>1. 上傳的文件請務必使用excel文件（xls類型）;</p>
    <p> 2. 手機號碼請務必用逗號(英文逗號[,])隔開； </p>
    <p> 3. 若要同時使用文件和手動輸入的方式,請先上傳文件,再追加號碼; </p>
    <p> 4. 短信模板使用：在短信模板頁面建立模板，發短信時選擇所需模板。 </p>
  </div>
  <Form :rules="rules" @register="register" />
</template>
