<script setup lang="ts">
import { Form } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { reactive, unref, ref } from 'vue'
import { ElButton } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { genFormSchema } from '@/utils/schema'

const { required } = useValidator()

const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  genFormSchema('sourceSelect', 'memberInsur', '選擇保險產品', {
    placeholder: null,
    options: undefined as any
  }),
  genFormSchema('input', 'insuranceCardNumber', '保險卡號', { placeholder: null, required: true }),
  genFormSchema('datePicker', 'registerTime', '登記時間', { placeholder: null, required: true }),
  genFormSchema('datePicker', 'dueTime', '到期時間', { placeholder: null, required: true }),
  genFormSchema('divider', '', '保險福利確認'),
  genFormSchema('hidden', 'memberInsurLimit[0].code', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[0].id', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[0].name', '保險福利確認', { placeholder: null }),
  genFormSchema('input', 'memberInsurLimit[0].available', '診費可用額度（元）', {
    placeholder: null,
    span: 8,
    labelWidth: '250px'
  }),
  genFormSchema('input', 'memberInsurLimit[0].number', '診費可用次數（次）', {
    placeholder: null,
    span: 8,
    labelWidth: '250px'
  }),
  genFormSchema('input', 'memberInsurLimit[0].singleLimit', '診費單次額度上限（元）', {
    placeholder: null,
    span: 8,
    labelWidth: '250px'
  }),
  genFormSchema('hidden', 'memberInsurLimit[1].code', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[1].name', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[1].id', '保險福利確認', { placeholder: null }),
  genFormSchema('input', 'memberInsurLimit[1].available', '藥費可用額度（元）', {
    span: 8,
    placeholder: null,
    labelWidth: '250px'
  }),
  genFormSchema('input', 'memberInsurLimit[1].number', '藥費可用次數（次）', {
    span: 8,
    placeholder: null,
    labelWidth: '250px'
  }),
  genFormSchema('input', 'memberInsurLimit[1].singleLimit', '藥費單次額度上限（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('hidden', 'memberInsurLimit[2].code', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[2].name', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[2].id', '保險福利確認', { placeholder: null }),
  genFormSchema('input', 'memberInsurLimit[2].available', '治療費可用額度（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[2].number', '治療費可用次數（次）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[2].singleLimit', '治療費單次額度上限（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('hidden', 'memberInsurLimit[3].code', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[3].name', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[3].id', '保險福利確認', { placeholder: null }),
  genFormSchema('input', 'memberInsurLimit[3].available', '藥品處置費可用額度（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[3].number', '藥品處置費可用次數（次）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[3].singleLimit', '藥品處置費單次額度上限（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('hidden', 'memberInsurLimit[4].code', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[4].name', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[4].id', '保險福利確認', { placeholder: null }),
  genFormSchema('input', 'memberInsurLimit[4].available', '快遞費可用額度（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[4].number', '快遞費可用次數（次）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[4].singleLimit', '快遞費單次額度上限（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('hidden', 'memberInsurLimit[5].code', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[5].name', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[5].id', '保險福利確認', { placeholder: null }),
  genFormSchema('input', 'memberInsurLimit[5].available', '國貨鋪費可用額度（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[5].number', '國貨鋪費可用次數（次）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[5].singleLimit', '國貨鋪費單次額度上限（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('hidden', 'memberInsurLimit[6].code', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[6].name', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[6].id', '保險福利確認', { placeholder: null }),
  genFormSchema('input', 'memberInsurLimit[6].available', '其他費可用額度（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[6].number', '其他費可用次數（次）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[6].singleLimit', '其他費單次額度上限（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),

  genFormSchema('input', 'fileUrl', '上傳證件', { placeholder: null }),
  genFormSchema('textarea', 'remark', '保險備註', { placeholder: null, span: 24 })
])

const { register, methods, elFormRef } = useForm({
  schema
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
