<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, onMounted } from 'vue'
import { TableData } from '@/api/table/types'
import { useI18n } from '@/hooks/web/useI18n'
import { useValidator } from '@/hooks/web/useValidator'
import { IDomEditor } from '@wangeditor/editor'
import { CommentType } from '@/api/workorder/workorder/types'

const { required, isMobile } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as CommentType,
    default: () => null
  }
})

const { t } = useI18n()

onMounted(() => {
  console.log(props.currentRow)
})

const schema = reactive<FormSchema[]>([
  {
    label: '操作人',
    field: 'handlerName',
    component: 'Input',
    componentProps: {
      style: 'width: 100%',
      placeholder: '操作人',
      disabled: true
    },
    colProps: { span: 24 },
    value: props.currentRow?.handlerName,
    formItemProps: {
      rules: [required()]
    }
  },
  {
    label: '處理時間',
    field: 'createTime',
    component: 'Input',
    componentProps: {
      style: 'width: 100%',
      placeholder: '處理時間',
      disabled: true
    },
    colProps: { span: 24 },
    value: props.currentRow?.createTime,
    formItemProps: {
      rules: [required()]
    }
  },
  {
    label: '溝通記錄',
    field: 'comment',
    component: 'Input',
    componentProps: {
      style: 'width: 100%',
      placeholder: '溝通記錄',
      disabled: true
    },
    colProps: { span: 24 },
    value: props.currentRow?.comment,
    formItemProps: {
      rules: [required()]
    }
  }
])

const { register, methods, elFormRef } = useForm({
  schema
})

defineExpose({
  elFormRef,
  getFormData: methods.getFormData
})
</script>

<template>
  <Form
    :rules="rules"
    @register="register"
    class="pt-4 border-t-[1px] border-dashed border-yellow-600"
  />
</template>
