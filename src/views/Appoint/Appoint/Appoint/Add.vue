<script setup lang="ts">
import { Form } from '@/components/Form'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { onMounted, reactive, ref, unref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useRouter, useRoute } from 'vue-router'
import { saveUpdateStatusApi } from '@/api/appoint/appoint/hospital'
import { UpdateStatusType } from '@/api/appoint/appoint/hospital/types'
import { getInOptionFormat, returnDateString } from '@/utils/common'
import { getApi } from '@/api/common'
import { genFormSchema } from '@/utils/schema'

import dict from '@/config/dictionary.json'

const { required } = useValidator()
const { emitter } = useEmitt()
const { push, go } = useRouter()
const { query } = useRoute()
const { t } = useI18n()

const store = {
  doctorId: ref<ComponentOptions[]>([]),
  feePayHospitalId: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

onMounted(async () => {
  // setStore('certificate', '/sys/dict/type/MEMBER_Certificate', 'code', 'value')
  setStore('feePayHospitalId', '/sys/hospital?special=Y', 'id', 'name')
  setStore('doctorId', '/doctor/getAuthPass', 'id', 'name')
})

const handleQuerySelect = (item: Recordable) => {
  const { setValues } = methods

  setValues({
    memberId: item.id,
    name: item.name,
    mobile: item.mobile,
    latestHandleTime: returnDateString(60),
    nextContactTime: returnDateString(15)
  })
  // contactUserId.value = item.id
}

const schema = reactive<FormSchema[]>([
  genFormSchema('autocomplete', 'query', '檢索姓名/檔案號/拼音/手機號', {
    url: '/member/info/get4workorder',
    itemValue: 'name',
    itemLink: 'id',
    placeholder: null
  }),
  genFormSchema('sourceSelect', 'source', '預約渠道', {
    placeholder: null,
    options: dict.appoint.source as any
  }),
  genFormSchema('hidden', 'specialistId', '', { placeholder: null }),
  genFormSchema('hidden', 'packageId', '', { placeholder: null }),
  genFormSchema('hidden', 'specialistName', '', { placeholder: null }),
  genFormSchema('hidden', 'packageName', '', { placeholder: null }),
  genFormSchema('apiSelect', 'hospitalId', '門店', {
    placeholder: null,
    api: async () => {
      return await getInOptionFormat('sys/hospital?special=Y', 'id', 'name')
    }
  }),
  genFormSchema('apiSelect', 'doctorId', '大夫', {
    placeholder: '請填寫',
    api: async () => {
      return await getInOptionFormat('doctor/getAuthPass', 'id', 'name')
    }
  }),
  genFormSchema('date', 'undefined', '約診時間', { type: 'datetimerange', placeholder: null }),
  genFormSchema('input', 'appointmentTimeStart', '約診時間', { placeholder: null }),
  genFormSchema('input', 'appointmentTimeEnd', '約診時間', { placeholder: null }),
  genFormSchema('sourceSelect', 'visitType', '初複診', {
    placeholder: null,
    options: dict.visitType as any
  }),
  genFormSchema('input', 'memberName', '姓名', { placeholder: null }),
  genFormSchema('hidden', 'memberId', '姓名', { placeholder: null }),
  genFormSchema('input', 'memberMobile', '電話', { placeholder: null }),
  genFormSchema('apiSelect', 'memberLevel', '會員級別', {
    placeholder: null,
    api: async () => {
      return await getInOptionFormat('sys/member/level', 'id', 'levelName')
    }
  }),
  genFormSchema('sourceSelect', 'memberGender', '性別', {
    placeholder: null,
    options: dict.sex as any
  }),
  genFormSchema('datePicker', 'memberBirthday', '出生年月', { placeholder: null }),
  genFormSchema('input', 'memberAge', '年齡', { placeholder: null }),
  genFormSchema('apiSelect', 'memberSource', '客戶來源', {
    placeholder: null,
    api: async () => {
      return await getInOptionFormat('sys/dict/type/MEMBER_Source', 'code', 'value')
    }
  }),
  genFormSchema('input', 'recommender', '來源詳情', { placeholder: null }),
  genFormSchema('apiSelect', 'importantGuest', '重要客戶類型', {
    placeholder: null,
    api: async () => {
      return await getInOptionFormat('sys/dict/type/MEMBER_ImportGuest', 'code', 'value')
    }
  }),
  genFormSchema('input', 'importantGuestComment', '重要客戶備註詳情', { placeholder: null }),
  genFormSchema('apiSelect', 'marketActivity', '市場活動', {
    placeholder: '請選擇',
    api: async () => {
      return await getInOptionFormat('market/activity/list?pageSize=0&type=0', 'id', 'name')
    }
  }),
  genFormSchema('textarea', 'note', '預約備註', { placeholder: null }),
  genFormSchema('textarea', 'conditionRemark', '病情備註', { placeholder: null }),
  genFormSchema('radio', 'hasHighMedicalInsurance', '是否有高端醫療險', {
    options: dict.appoint.hasHighMedicalInsurance,
    value: ''
  }),
  genFormSchema('radio', 'usePrCard', '是否使用公關卡', {
    options: dict.appoint.usePrCard,
    value: ''
  }),
  genFormSchema('input', 'consFee', '預約支付金額', { placeholder: null }),
  genFormSchema('textarea', 'cmpeRemark', '中醫體檢備註', { placeholder: null }),
  genFormSchema('radio', 'payType', '是否支付診費:', { options: dict.appoint.payType, value: '' })
])

const { register, methods, elFormRef } = useForm({
  schema
})

const loading = ref(false)

const save = async () => {
  await unref(elFormRef)?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await unref(methods)?.getFormData()) as UpdateStatusType
      const res = await saveUpdateStatusApi({
        id: query.id as string,
        datareplyChannel: data.source
      } as UpdateStatusType)
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      if (res) {
        ElMessage.success(res.msg as string)
        emitter.emit('getList', 'confirm')
        // push('/appoint/example-page')
        go(-1)
      }
    }
  })
}

onMounted(() => {
  if (!query?.id) {
    ElMessage.error('no id')
    go(-1)
  }
})

const rules = []
</script>

<template>
  <ContentDetailWrap title="選擇確認預約方式" @back="push('/appoint/appoint/list/index')">
    <Form :rules="rules" @register="register" />

    <template #right>
      <ElButton type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
    </template>
  </ContentDetailWrap>
</template>
