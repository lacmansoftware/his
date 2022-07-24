<script setup lang="ts">
import { Form } from '@/components/Form'
import { onMounted, reactive, ref, unref } from 'vue'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter, useRoute } from 'vue-router'
import { genFormSchema } from '@/utils/schema'

const props = defineProps({
  chargeType: {
    type: Object,
    default: () => ({})
  }
})

const schema = {
  HYK: reactive<FormSchema[]>([
    genFormSchema('divider', '', '選擇特殊福利（如果有）'),
    genFormSchema('input', 'taikangka', '泰康卡號', { placeholder: null, span: 8 }),
    genFormSchema('divider', '', '選擇支付方式'),
    genFormSchema('divider', '', '收費金額'),
    {
      field: 'ChargeAmount',
      label: '',
      colProps: {
        span: 24
      }
    }
  ])
}

const { register, methods, elFormRef } = useForm({
  schema: schema[props.chargeType.value]
})
const rules = []
</script>

<template>
  <Form :rules="rules" @register="register" />
</template>
