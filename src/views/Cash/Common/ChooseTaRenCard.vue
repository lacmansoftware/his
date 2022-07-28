<script setup lang="ts">
import { Form } from '@/components/Form'
import { onMounted, reactive, ref, unref } from 'vue'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter, useRoute } from 'vue-router'
import { genFormSchema } from '@/utils/schema'
import { getInOptionFormat } from '@/utils/common'
import dict from '@/config/dictionary.json'

const props = defineProps({
  chargeType: {
    type: Object,
    default: () => ({})
  }
})

const schema = reactive<FormSchema[]>([
  genFormSchema('input', 'keyword', '', { placeholder: '卡主姓名/手機/卡號' }),
  genFormSchema('input', 'memberName', '卡主', { placeholder: null, readonly: true }),
  genFormSchema('input', 'memberMobile', '手機號', { placeholder: null, readonly: true }),
  genFormSchema('input', 'transactionNo', '卡號', { placeholder: null, readonly: true }),
  genFormSchema('input', 'balance', '卡餘額', { placeholder: null, readonly: true }),
  genFormSchema('hidden', 'transactionId', '', { placeholder: null })
])

const { register, methods, elFormRef } = useForm({
  schema
})

const rules = []

defineExpose({
  elFormRef,
  methods
})
</script>

<template>
  <Form :rules="rules" @register="register" />
</template>
