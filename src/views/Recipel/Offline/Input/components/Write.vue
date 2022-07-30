<script setup lang="ts">
import dayjs from 'dayjs'
import { Form } from '@/components/Form'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { onBeforeMount, onMounted, PropType, reactive, ref, unref, watch } from 'vue'
import { ElRow, ElCol, ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useRouter, useRoute } from 'vue-router'
import { getAgeByBirthday, getInOptionFormat, returnDateString } from '@/utils/common'
import {
  getSelectText,
  getValue,
  getSchemaOptions,
  genFormSchema,
  setDisabled
} from '@/utils/schema'
import { getApi, postApi } from '@/api/common'
import dict from '@/config/dictionary.json'
import { AppointDoctorType } from '@/api/appoint/appoint/appoint/types'
import ChargeType from '@/views/Cash/Common/ChargeType.vue'
import { AppointListData } from '@/api/appoint/appoint/list/types'
import TypeOption from '@/views/Appoint/Regist/components/TypeOption.vue'
import InsurForm from '.@/views/Appoint/Regist/components/InsurForm.vue'
import UseFormDemo from '@/views/Components/Form/UseFormDemo.vue'
import SimpleForm from '@/views/common/SimpleForm.vue'
import CommonRecipel from './CommonRecipel.vue'

const { required } = useValidator()
const { emitter } = useEmitt()
const { push, go } = useRouter()
const { params } = useRoute()
const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => {}
  }
})

const typeRef = ref<string>('normal')
const hasInsurRef = ref<string>('N')
const isInsurRef = ref<string>('N')
const currentRow = ref<AppointListData>()
const hasHighMedicalInsuranceInfoRef = ref('')
const insurFormRef = ref<ComponentRef<typeof InsurForm>>()
const typeOptionRef = ref<ComponentRef<typeof TypeOption>>()
let sendMessage = ''
let appointmentType = 'normal'

const store = {
  doctorId: ref<ComponentOptions[]>([]),
  hospitalId: ref<ComponentOptions[]>([]),
  importantGuest: ref<ComponentOptions[]>([])
}

onMounted(async () => {
  console.log(props.currentRow)
  // if (
  //   !params.actionType ||
  //   !(params.actionType === 'add' || params.actionType === 'edit' || params.actionType === 'view')
  // ) {
  //   go(-1)
  // }
  // if (params.actionType === 'add') {
  //   if (!params.doctorId) {
  //     ElMessage.error('需要医生身份证')
  //     go(-1)
  //   } else {
  //     const { setValues } = methods
  //     setValues({
  //       hospitalId: params?.hospitalId,
  //       doctorId: params?.doctorId,
  //       timeRange: [params?.startTime, params?.endTime]
  //     })
  //   }
  // } else if (params.actionType === 'edit') {
  //   if (params.currentRow) {
  //   } else {
  //     console.error('error: params.currentRow is missing')
  //     go(-1)
  //   }
  // } else if (params.actionType === 'view') {
  //   if (params.currentRow) {
  //     const { setProps } = methods
  //     setProps({
  //       disabled: true
  //     })
  //   } else {
  //     console.error('error: params.currentRow is missing')
  //     go(-1)
  //   }
  // }

  methods.setValues({
    registerDate: dayjs().format('YYYY-MM-DD HH:mm')
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
        setDisabled(methods, 'payType', false)
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

const queryMemberInsur = async () => {
  const { memberId } = (await methods.getFormData()) as any
  if (memberId) {
    getApi('/member/insur/list', {
      memberId: memberId,
      status: 'Y'
    }).then((result) => {
      if (result.success) {
        methods.setValues({ isInsur: 'Y' })
        // $('#warining').hide()
        if (result.data.length > 0) {
          const insur = unref(insurFormRef)
          insur?.methods?.setValues({
            ...result.data[0],
            memberInsur: result.data[0].id
          })
          insur?.methods?.setSchema([
            {
              field: 'memberInsur',
              path: 'componentProps.options',
              value: result.data.map((item) => ({
                ...item,
                value: item.id,
                label: item.insurName
              }))
            }
          ])
          hasInsurRef.value = 'Y'

          // insurForm.setData(data[0])
          // showEndInsur(data[0])
          // for (var i = 0; i < data[0].limitCount; i++) {
          //   namespace.addSchool(data[0])
          // }
        } else {
          //當前用戶沒有保險，需要新加保險，所以查詢的是合作保險名
          methods.setValues({ isInsur: 'N' })
          // $('#warining').show()
          hasInsurRef.value = 'N'
          getApi('/market/insur').then((result) => {
            if (result.success) {
              const insur = unref(insurFormRef)
              insur?.methods?.setSchema([
                {
                  field: 'memberInsur',
                  path: 'componentProps.options',
                  value: result.data.map((item) => ({
                    ...item,
                    value: item.id,
                    label: item.productName
                  }))
                }
              ])
              insur?.methods?.setValues({ memberInsur: '' })
            }
          })
        }
      }
    })
  } else {
    hasInsurRef.value = 'N'
    // $('#warining').show()
    // var c = namespace.schoolIndex
    // for (var j = 7; j <= c; j++) {
    //   namespace.removeSchool(j, [])
    // }
    getApi('/market/insur').then((result) => {
      if (result.success) {
        const insur = unref(insurFormRef)
        insur?.methods?.setSchema([
          {
            field: 'memberInsur',
            path: 'componentProps.options',
            value: result.data.map((item) => ({
              ...item,
              value: item.id,
              label: item.productName
            }))
          }
        ])
        insur?.methods?.setValues({ memberInsur: '' })
      }
    })
  }
}

const handleMemberSearchSelect = (item: Recordable) => {
  if (Object.keys(item).length === 0) {
    widgetControl(false)
    unref(elFormRef)?.resetFields()
  } else {
    widgetControl(true)
    const { setValues } = methods
    setValues(item)
    // doctorHabit.options.memberId = e.value
    // doctorHabit._loadRecipel(doctorSearch.getValue(), e.value)
  }
}

const handleMemberBirthdayChange = (item) => {
  methods.setValues({
    memberAge: getAgeByBirthday(item)
  })
}

const widgetControl = (flag) => {
  setDisabled(methods, 'memberName', flag)
  setDisabled(methods, 'memberMobile', flag)
  setDisabled(methods, 'memberSex', flag)
  setDisabled(methods, 'memberBirthday', flag)
}

const renderPlan = (id) => {
  // renderInputPlan(id || params.id)
}

const schema = reactive<FormSchema[]>([
  genFormSchema('blank', 'recipelSourcesSpan', '', { span: 24 }),
  genFormSchema('blank', 'recipelModeSpan', '', { span: 3 }),
  genFormSchema('autocomplete', 'doctorSearch', '醫生：', {
    url: '/doctor/query',
    itemValue: 'doctorName',
    itemLink: 'doctorId',
    placeholder: '姓名/手機',
    span: 10
  }),
  genFormSchema('autocomplete', 'memberSearch', '患者：', {
    url: '/member/info/query',
    itemValue: 'memberName',
    itemLink: 'memberId',
    placeholder: '姓名/手機',
    span: 11,
    onSelect: handleMemberSearchSelect
  }),
  genFormSchema('input', 'memberName', '姓名：', { placeholder: null, span: 4 }),
  genFormSchema('hidden', 'memberId', '姓名：', { placeholder: null, span: 4 }),
  genFormSchema('sourceSelect', 'memberSex', '姓名：', {
    placeholder: '選擇',
    options: dict.sex as any,
    span: 4
  }),
  genFormSchema('input', 'memberMobile', '姓名：', { placeholder: null, span: 4 }),
  genFormSchema('datePicker', 'memberBirthday', '姓名：', {
    placeholder: null,
    span: 4,
    onChange: handleMemberBirthdayChange
  }),
  genFormSchema('input', 'memberAge', '姓名：', { placeholder: null, readonly: true, span: 4 })
])

const { register, methods, elFormRef } = useForm({
  schema
})

const loading = ref(false)

const save = async () => {
  const insur = unref(insurFormRef)
  const typeOption = unref(typeOptionRef)
  console.log(await getSelectText(insur?.methods, insur?.schema, 'memberInsur'))
  // console.log(await getValue(insur?.methods, 'memberInsur'))
  // console.log(getSchemaOptions(insur?.schema, 'memberInsur'))

  let insurFormData: any = {}
  let insurIsValid = false
  let insurId = ''
  let memberInsurId = ''
  hasInsurRef.value &&
    (await insur?.elFormRef?.validate(async (isValid) => {
      if (isValid) {
        insurIsValid = true
      }
    }))
  insurFormData = (await insur?.methods?.getFormData()) as any
  const typeOptionFormData = (await typeOption?.methods?.getFormData()) as any
  if (hasInsurRef.value === 'Y' && !insurIsValid) return
  if (isInsurRef.value === 'Y') {
    if (hasInsurRef.value === 'N') {
      insurId = await getValue(insur?.methods, 'memberInsur')
      memberInsurId = ''
    } else {
      memberInsurId = await getValue(insur?.methods, 'memberInsur')
      insurId = getSchemaOptions(insur?.schema, 'memberInsur')[0]!.insurId
    }
  }
  insurFormData.doctorName = await getSelectText(methods, schema, 'doctorId')
  insurFormData.insurName = await getSelectText(insur?.methods, insur?.schema, 'memberInsur')
  insurFormData.insurId = insurId
  insurFormData.memberInsurId = memberInsurId
  insurFormData.isInsur = isInsurRef.value
  insurFormData.memberLevelName = await getSelectText(methods, schema, 'memberLevel')
  insurFormData.importantGuestName = await getSelectText(methods, schema, 'importGuest')
  insurFormData.appointmentType = await getValue(methods, 'type')
  insurFormData.specialistId = await getValue(typeOption?.methods, 'marketingList')
  insurFormData.specialistName = await getSelectText(
    typeOption?.methods,
    typeOption?.schema,
    'marketingList'
  )
  insurFormData.packageId = await getValue(typeOption?.methods, 'marketPackage')
  insurFormData.packageName = await getSelectText(
    typeOption?.methods,
    typeOption?.schema,
    'marketPackage'
  )

  await unref(elFormRef)?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await unref(methods)?.getFormData()) as any
      const res = await postApi('member/appointment/registeration/add', {
        ...data,
        ...insurFormData,
        ...typeOptionFormData,
        plusType: await getValue(methods, 'plusType')[0]
      })
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
    }
  })
}

const rules = []

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    const { setValues } = methods
    setValues({
      ...currentRow,
      timeRange: [currentRow.appointmentTimeStart, currentRow.appointmentTimeEnd]
    })
  },
  {
    deep: true,
    immediate: true
  }
)

const syptomSchema = [
  genFormSchema('textarea', 'slaveSymptom', '診斷', {
    placeholder: '請輸入內容',
    span: 24,
    rows: 5
  }),
  genFormSchema('textarea', 'medicalHistory', '主訴及現病史', {
    placeholder: '請輸入內容',
    span: 24,
    rows: 5
  })
]
</script>

<template>
  <Form :rules="rules" @register="register">
    <template #recipelSourcesSpan>
      <span>{{ currentRow?.recipelSources }}</span>
    </template>
    <template #recipelModeSpan>
      <span>方式： {{ currentRow?.recipelMode }}</span>
    </template>
  </Form>

  <ElRow :gutter="20">
    <ElCol :span="4">
      <SimpleForm label-position="top" title="書寫病案" :schema="syptomSchema" />
      <!-- <InsurForm ref="insurFormRef" v-if="hasInsurRef === 'Y'" /> -->
    </ElCol>
    <ElCol :span="14">
      <CommonRecipel />
    </ElCol>
    <ElCol :span="6">c </ElCol>
  </ElRow>
</template>
