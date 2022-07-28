<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, ref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useValidator } from '@/hooks/web/useValidator'
import { IDomEditor } from '@wangeditor/editor'
import { AppointListData } from '@/api/appoint/appoint/list/types'
import dict from '@/config/dictionary.json'
import { genFormSchema } from '@/utils/schema'

const { required } = useValidator()
const curId = ref()

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<AppointListData>>,
    default: () => null
  }
})

const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  genFormSchema('sourceSelect', 'source', '選擇方式:', {
    placeholder: null,
    options: dict.appoint.source as any,
    required: true,
    span: 24,
    labelWidth: '200px'
  })
])

const { register, methods, elFormRef } = useForm({
  schema
})

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    const { setValues, setSchema } = methods
    setValues(currentRow)
    curId.value = currentRow.id
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  curId: curId.value,
  elFormRef,
  getFormData: methods.getFormData
})
</script>

<template>
  <Form @register="register" />
</template>
