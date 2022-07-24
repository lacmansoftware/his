<script setup lang="ts">
import { Form } from '@/components/Form'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { onMounted, reactive, ref, unref } from 'vue'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useRouter, useRoute } from 'vue-router'
import { saveUpdateStatusApi } from '@/api/appoint/appoint/hospital'
import { UpdateStatusType } from '@/api/appoint/appoint/hospital/types'
import { getAgeByBirthday, getInOptionFormat, returnDateString } from '@/utils/common'
import { getApi, postApi } from '@/api/common'
import { genFormSchema } from '@/utils/schema'

import dict from '@/config/dictionary.json'
import { AppointDoctorType } from '@/api/appoint/appoint/appoint/types'
import ChargeType from '@/views/Cash/Common/ChargeType.vue'

const { required } = useValidator()
const { emitter } = useEmitt()
const { push, go } = useRouter()
const { params } = useRoute()
const { t } = useI18n()

const hasHighMedicalInsuranceInfoRef = ref('')
const payTypeRef = ref('0')
let sendMessage = ''
let appointmentType = 'normal'

const store = {
  doctorId: ref<ComponentOptions[]>([]),
  hospitalId: ref<ComponentOptions[]>([]),
  importantGuest: ref<ComponentOptions[]>([])
}

onMounted(async () => {
  if (!params.doctorId) {
    ElMessage.error('需要医生身份证')
    go(-1)
  }
  const { setValues } = methods
  setValues({
    hospitalId: params?.hospitalId,
    doctorId: params?.doctorId,
    timeRange: [params?.startTime, params?.endTime]
  })
})

const queryIntro = () => {}

const showEndInsur = (data) => {
  let s1 = data.dueTime
  s1 = new Date(s1.replace(/-/g, '/'))
  let s2 = new Date() //當前日期：2017-04-24
  const days = s1.getTime() - s2.getTime()
  const time = days / (1000 * 60 * 60 * 24) + 2
  return 0 < time ? '(還有' + time + '天過期)' : '(保險已過期)'
}

const getInsur = (id) => {
  getApi(`/member/insur/list?memberId=${id}&status=Y`).then((result) => {
    let insurNames = []
    let insurNameStr = ''
    if (result.success) {
      if (result.data.length > 0 && result.data[0].insurId) {
        methods.setValues({
          hasHighMedicalInsurance: 1,
          payType: '0'
        })
        setDisabled('payType', false)
        insurNames = result.data.map((item) => item.insurName + showEndInsur(item))
        insurNameStr = insurNames.join(',')
        hasHighMedicalInsuranceInfoRef.value = insurNameStr
      } else {
        hasHighMedicalInsuranceInfoRef.value = insurNameStr
      }
    }
  })
}

const getVisitType = async () => {
  const { memberId, memberName, memberMobile, doctorId } = (await methods.getFormData()) as any
  //獲取初複診類型
  if (memberId && memberName && memberMobile && doctorId) {
    getApi('/member/appointment/get/visitType', {
      doctorId: doctorId,
      memberId: memberId,
      memberMobile: memberMobile,
      memberName: memberName
    }).then((result) => {
      if (result.success) {
        methods.setValues({
          visitType: result.data.visitType
        })
        // $('#pay').text(result.data.price)
        if (params?.pendingFlag === 'Y') {
          return
        }
        // calculateAppointTime(result.data.visitType)
      }
    })
  }
  queryIntro()
}

const setDisabled = (fieldName, value) => {
  methods.setSchema([
    {
      field: fieldName,
      path: 'componentProps.disabled',
      value: value
    }
  ])
}

const handlePayTypeChange = (item: string) => {
  payTypeRef.value = item
}

const handleQuerySelect = (item: Recordable) => {
  const { setValues } = methods
  // console.log(item.name)

  setValues({
    memberName: item.name,
    memberMobile: item.mobile,
    memberId: item.id,
    memberGender: item.gender,
    memberLevel: item.memberLevel,
    memberSource: item.memberSource,
    recommender: item.recommender,
    importantGuest: item.importantGuest,
    importantGuestComment: item.importantGuestComment,
    usePrCard: item.usePrCard,
    memberBirthday: item.birthday,
    memberAge: getAgeByBirthday(item.birthday),
    note: item.appointRemark,
    conditionRemark: item.conditionRemark
  })

  setDisabled('memberLevel', true)
  getVisitType()
  getInsur(item.id)
  // contactUserId.value = item.id
}

const schema = reactive<FormSchema[]>([
  genFormSchema('autocomplete', 'query', '檢索姓名/檔案號/拼音/手機號', {
    url: '/member/info/get4workorder',
    itemValue: 'name',
    itemLink: 'id',
    placeholder: '檢索姓名/檔案號/拼音/手機號',
    labelWidth: '250px',
    span: 18,
    onSelect: handleQuerySelect
  }),
  genFormSchema('sourceSelect', 'source', '預約渠道', {
    placeholder: null,
    options: dict.appoint.source as any,
    required: true,
    value: 'TEL'
  }),
  genFormSchema('divider'),
  genFormSchema('hidden', 'specialistId', '', { placeholder: null }),
  genFormSchema('hidden', 'packageId', '', { placeholder: null }),
  genFormSchema('hidden', 'specialistName', '', { placeholder: null }),
  genFormSchema('hidden', 'packageName', '', { placeholder: null }),
  genFormSchema('apiSelect', 'hospitalId', '門店', {
    placeholder: null,
    api: async () => {
      store.hospitalId.value = await getInOptionFormat('sys/hospital?special=Y', 'id', 'name')
      return store.hospitalId.value
    },
    required: true,
    readonly: true
  }),
  genFormSchema('apiSelect', 'doctorId', '大夫', {
    placeholder: '請填寫',
    api: async () => {
      store.doctorId.value = await getInOptionFormat('doctor/getAuthPass', 'id', 'name')
      return store.doctorId.value
    },
    readonly: true
  }),
  genFormSchema('date', 'timeRange', '約診時間', {
    type: 'datetimerange',
    placeholder: null,
    required: true,
    span: 12,
    format: 'YYYY-MM-DD HH:mm',
    valueFormat: 'YYYY-MM-DD HH:mm'
  }),
  genFormSchema('sourceSelect', 'visitType', '初複診', {
    placeholder: null,
    options: dict.visitType as any,
    required: true
  }),
  genFormSchema('input', 'memberName', '姓名', { placeholder: null, required: true }),
  genFormSchema('hidden', 'memberId', '姓名', { placeholder: null }),
  genFormSchema('input', 'memberMobile', '電話', { placeholder: null, required: true }),
  genFormSchema('apiSelect', 'memberLevel', '會員級別', {
    placeholder: null,
    api: async () => {
      return await getInOptionFormat('sys/member/level', 'id', 'levelName')
    }
  }),
  genFormSchema('sourceSelect', 'memberGender', '性別', {
    placeholder: null,
    options: dict.sex as any,
    required: true
  }),
  genFormSchema('datePicker', 'memberBirthday', '出生年月', { placeholder: null, required: true }),
  genFormSchema('input', 'memberAge', '年齡', { placeholder: null, readonly: true }),
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
      store.importantGuest.value = await getInOptionFormat(
        'sys/dict/type/MEMBER_ImportGuest',
        'code',
        'value'
      )
      return store.importantGuest.value
    }
  }),
  genFormSchema('input', 'importantGuestComment', '重要客戶備註詳情', {
    placeholder: null,
    labelWidth: '150px'
  }),
  genFormSchema('apiSelect', 'marketActivity', '市場活動', {
    placeholder: '請選擇',
    api: async () => {
      return await getInOptionFormat('market/activity/list?pageSize=0&type=0', 'id', 'name')
    }
  }),
  genFormSchema('divider'),
  genFormSchema('textarea', 'note', '預約備註', { placeholder: null, span: 24 }),
  genFormSchema('checkbox', 'isUpdateAppointRemark', '', {
    options: dict.saveRemark,
    value: [],
    labelWidth: '200px',
    span: 24
  }),
  genFormSchema('divider'),
  genFormSchema('textarea', 'conditionRemark', '病情備註', { placeholder: null, span: 24 }),
  genFormSchema('checkbox', 'isUpdateConditionRemark', '', {
    options: dict.saveRemark,
    value: [],
    labelWidth: '200px',
    span: 24
  }),
  genFormSchema('radio', 'hasHighMedicalInsurance', '是否有高端醫療險', {
    options: dict.appoint.hasHighMedicalInsurance,
    value: '',
    labelWidth: '150px',
    span: 6
  }),
  {
    field: 'hasHighMedicalInsuranceInfo',
    label: '',
    formItemProps: {
      labelWidth: 0
    },
    colProps: { span: 16 }
  },
  genFormSchema('radio', 'usePrCard', '是否使用公關卡', {
    options: dict.appoint.usePrCard,
    value: '',
    labelWidth: '150px',
    span: 24
  }),
  genFormSchema('sourceSelect', 'cmpe', '選擇中醫體檢項目', {
    placeholder: null,
    options: undefined as any
  }),
  genFormSchema('input', 'consFee', '預約支付金額', { placeholder: null, readonly: true }),
  genFormSchema('textarea', 'cmpeRemark', '中醫體檢備註', {
    placeholder: null,
    span: 24,
    readonly: true
  }),
  genFormSchema('radio', 'payType', '是否支付診費:', {
    options: dict.appoint.payType,
    value: '0',
    labelWidth: '150px',
    span: 24,
    onChange: handlePayTypeChange
  }),
  {
    field: 'chargeType',
    label: '',
    colProps: {
      span: 24
    }
  }
])

const { register, methods, elFormRef } = useForm({
  schema
})

const loading = ref(false)

const getSelectText = async (fieldName) => {
  const formData = await methods.getFormData()
  return schema
    .find((item) => item.field === fieldName)
    ?.componentProps?.options?.find((item) => item.value === formData![fieldName])?.label
}

const save = async () => {
  const { payType } = (await methods.getFormData()) as any
  if (
    !schema.find((item) => item.field === 'payType')?.componentProps?.disabled &&
    payType === ''
  ) {
    ElMessage.error('請選擇是否支付診費')
    return
  }
  await unref(elFormRef)?.validate(async (isValid) => {
    if (isValid) {
      ElMessageBox.confirm('是否發送短信?', t('common.reminder'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
        .then(() => {
          sendMessage = 'Y'
        })
        .catch(() => {
          sendMessage = 'N'
        })
        .finally(async () => {
          loading.value = true
          const data = (await unref(methods)?.getFormData()) as any

          const subData = {
            memberId: data?.memberId,
            hospitalId: data?.hospitalId,
            hospitalName: await getSelectText('hospitalId'),
            doctorName: await getSelectText('doctorId'),
            importantGuestName: await getSelectText('importantGuest'),
            workOrderId: params?.workOrderId,
            payType: data?.payType,
            appointmentType: appointmentType,
            memberLevelName: await getSelectText('memberLevel'),
            sendMessage: sendMessage,
            hasHighMedicalInsurance: data?.hasHighMedicalInsurance,
            payMobile: data?.payMobile
          }

          if (appointmentType === 'specialist' || appointmentType === 'package') {
            subData.payType = ''
          }

          if (subData.payType === '1') {
            if (appointmentType === 'normal') {
              //套餐或者專科不校驗支付方式
              // if (!childIframe.contentWindow.namespace.getPayArray()) {
              //   return
              // }
              // subData.payArray = JSON.stringify(childIframe.contentWindow.namespace.getPayArray())
            }
          }

          console.log(subData)

          const res = await postApi('member/appointment/add', subData)
            .catch(() => {})
            .finally(() => {
              loading.value = false
            })
          if (res) {
            ElMessage.success(res.msg as string)
            // emitter.emit('getList', 'confirm')
            // push('/appoint/example-page')
            // go(-1)
          }
        })
    }
  })
}

const rules = []
</script>

<template>
  <ContentDetailWrap title="選擇確認預約方式" @back="push('/appoint/appoint/list/index')">
    <Form :rules="rules" @register="register">
      <template #hasHighMedicalInsuranceInfo>
        <span>{{ hasHighMedicalInsuranceInfoRef }}</span>
      </template>

      <template #chargeType>
        <ChargeType v-if="payTypeRef === '1'" />
      </template>
    </Form>

    <template #right>
      <ElButton type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
    </template>
  </ContentDetailWrap>
</template>
