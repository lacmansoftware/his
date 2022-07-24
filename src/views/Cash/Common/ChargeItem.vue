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

const schema = {
  ZZBX: reactive<FormSchema[]>([
    genFormSchema('input', 'consFee', '診費：', { placeholder: null }),
    genFormSchema('input', 'drugFee', '藥費：', { placeholder: null }),
    genFormSchema('input', 'treatFee', '治療費：', { placeholder: null }),
    genFormSchema('input', 'makeFee', '藥品處置費：', { placeholder: null }),
    genFormSchema('input', 'expressFee', '快遞費：', { placeholder: null }),
    genFormSchema('input', 'projectFee', '國貨產品：', { placeholder: null }),
    genFormSchema('input', 'otherFee', '其他：', { placeholder: null }),
    genFormSchema('hidden', 'transactionId', '', { placeholder: null })
  ]),
  HYK: reactive<FormSchema[]>([
    genFormSchema('hidden', 'transactionId', '方式：會員卡', { placeholder: null }),
    genFormSchema('input', 'transactionNo', '方式：會員卡', { placeholder: null, readonly: true }),
    genFormSchema('input', 'balance', '方式：會員卡', { placeholder: null, readonly: true }),
    genFormSchema('input', 'amount', '方式：會員卡', { placeholder: null }),
    genFormSchema('input', 'undefined', '方式：會員卡', { placeholder: null, readonly: true })
  ]),
  TRDF: reactive<FormSchema[]>([
    genFormSchema('hidden', 'transactionId', '方式：他人會員卡', {
      placeholder: null,
      labelWidth: '150px'
    }),
    genFormSchema('input', 'transactionNo', '方式：他人會員卡', {
      placeholder: null,
      readonly: true,
      labelWidth: '150px'
    }),
    genFormSchema('input', 'balance', '方式：他人會員卡', {
      placeholder: null,
      readonly: true,
      labelWidth: '150px'
    }),
    genFormSchema('input', 'amount', '方式：他人會員卡', {
      placeholder: null,
      labelWidth: '150px'
    }),
    genFormSchema('input', 'undefined', '方式：他人會員卡', {
      placeholder: null,
      readonly: true,
      labelWidth: '150px'
    })
  ]),
  POS: reactive<FormSchema[]>([
    genFormSchema('apiSelect', 'transactionId', '方式：POS', {
      placeholder: null,
      api: async () => {
        return await getInOptionFormat('payment/method/pos', 'transactionId', 'transactionId')
      }
    }),
    genFormSchema('input', 'transactionNo', '方式：POS', { placeholder: null }),
    genFormSchema('input', 'amount', '方式：POS', { placeholder: null })
  ]),
  XJ: reactive<FormSchema[]>([
    genFormSchema('input', 'amount', '方式：現金', { placeholder: null })
  ]),
  GGK: reactive<FormSchema[]>([
    genFormSchema('input', 'amount', '方式：公關卡', { placeholder: null })
  ]),
  YHZZ: reactive<FormSchema[]>([
    genFormSchema('input', 'transactionNo', '方式：銀行轉賬', {
      placeholder: null,
      labelWidth: '150px'
    }),
    genFormSchema('input', 'amount', '方式：銀行轉賬', { placeholder: null, labelWidth: '150px' })
  ]),
  ZBTK: reactive<FormSchema[]>([]),
  ZP: reactive<FormSchema[]>([
    genFormSchema('input', 'amount', '方式：支票', { placeholder: null })
  ]),
  WEIDIAN: reactive<FormSchema[]>([
    genFormSchema('input', 'amount', '方式：微店', { placeholder: null })
  ]),
  PEACE_CARD: reactive<FormSchema[]>([
    genFormSchema('input', 'amount', '方式：安心卡', { placeholder: null, readonly: true }),
    genFormSchema('apiSelect', 'undefined', '方式：安心卡', {
      placeholder: null,
      api: async () => {
        return await getInOptionFormat('payment/method/peaceCard', 'peaceCardCode', 'peaceCardName')
      }
    })
  ]),
  WXPAY: reactive<FormSchema[]>([]),
  ALIPAY: reactive<FormSchema[]>([]),
  ARRE: reactive<FormSchema[]>([
    genFormSchema('input', 'amount', '方式：欠費', { placeholder: null })
  ]),
  YHQ: reactive<FormSchema[]>([
    genFormSchema('input', 'amount', '', { placeholder: null, readonly: true }),
    genFormSchema('radio', '', '', { options: dict.coupon_selector, value: '' }),
    genFormSchema('sourceSelect', 'transactionId', '', {
      placeholder: '下拉選擇優惠券',
      options: undefined as any
    }),
    genFormSchema('input', 'undefined', '面額', { placeholder: null, readonly: true }),
    genFormSchema('input', 'undefined', '', { placeholder: null, readonly: true }),
    genFormSchema('hidden', 'transactionId', '', { placeholder: null }),
    genFormSchema('hidden', 'transactionNo', '', { placeholder: null }),
    genFormSchema('input', 'undefined', '', { placeholder: null, readonly: true })
  ]),
  GIFT_CARD: reactive<FormSchema[]>([
    genFormSchema('input', 'transactionNo', '方式：充值卡', { placeholder: null }),
    genFormSchema('input', 'amount', '方式：充值卡', { placeholder: null }),
    genFormSchema('hidden', 'transactionId', '方式：充值卡', { placeholder: null })
  ]),
  USE_SPECIALIST: reactive<FormSchema[]>([
    genFormSchema('input', 'amount', '方式：專科', { placeholder: null }),
    genFormSchema('input', 'specialistName', '方式：專科', { placeholder: null, readonly: true })
  ]),
  USE_PACKAGE: reactive<FormSchema[]>([
    genFormSchema('input', 'amount', '方式：套餐', { placeholder: null }),
    genFormSchema('input', 'packageName', '方式：套餐', { placeholder: null, readonly: true })
  ]),
  WX_COUPON: reactive<FormSchema[]>([
    genFormSchema('input', 'transactionNo', '方式：膏方抵扣碼', {
      placeholder: null,
      labelWidth: '150px'
    }),
    genFormSchema('input', 'amount', '方式：膏方抵扣碼', {
      placeholder: null,
      readonly: true,
      labelWidth: '150px'
    }),
    genFormSchema('hidden', 'transactionId', '方式：膏方抵扣碼', {
      placeholder: null,
      labelWidth: '150px'
    })
  ]),
  MD: reactive<FormSchema[]>([genFormSchema('input', 'amount', 'MD', { placeholder: null })]),
  SENDURL: reactive<FormSchema[]>([
    genFormSchema('input', 'amount', '方式：推送支付鏈接', {
      placeholder: null,
      labelWidth: '150px'
    }),
    genFormSchema('radio', '', '方式：推送支付鏈接', {
      options: dict.urlReciveObject,
      value: '',
      labelWidth: '150px'
    }),
    genFormSchema('input', 'payMobile', '方式：推送支付鏈接', {
      placeholder: null,
      labelWidth: '150px'
    })
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
