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
import TypeOption from './components/TypeOption.vue'
import InsurForm from './components/InsurForm.vue'
import UseFormDemo from '@/views/Components/Form/UseFormDemo.vue'

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

onBeforeMount(() => {
  params.actionType = 'add'
  // if (!params.actionType) params.actionType = 'add'
})

onMounted(async () => {
  params.actionType = 'add'
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
    memberBirthday: item.birthday,
    memberAge: getAgeByBirthday(item.birthday),
    recommender: item.recommender,
    importantGuest: item.importantGuest,
    importantGuestComment: item.importantGuestComment
  })

  queryMemberInsur()
  setDisabled(methods, 'memberLevel', true)
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
    // span: params.actionType === 'add' ? 24 : 0,
    span: 24,
    onSelect: handleQuerySelect
  }),
  genFormSchema('datePicker', 'registerDate', '挂號時間', {
    placeholder: null,
    required: true,
    type: 'datetime',
    format: 'YYYY-MM-DD HH:mm',
    valueFormat: 'YYYY-MM-DD HH:mm'
  }),
  genFormSchema('radio', 'type', '約診類型', {
    options: [
      { value: 'normal', label: '普通門診' },
      { value: 'package', label: '套餐門診' },
      { value: 'specialist', label: '專科門診' }
    ],
    value: 'normal',
    onChange: (item) => {
      typeRef.value = item
    },
    span: 8
  }),
  {
    field: 'typeOption',
    label: '',
    colProps: {
      span: 10
    }
  },
  genFormSchema('apiSelect', 'doctorId', '大夫', {
    placeholder: '請填寫',
    filterable: true,
    api: async () => {
      return await getInOptionFormat('doctor/getAuthPass', 'id', 'name')
    },
    required: true
  }),
  genFormSchema('input', 'memberName', '姓名', { placeholder: null, required: true }),
  genFormSchema('hidden', 'memberId', '姓名', { placeholder: null }),
  genFormSchema('input', 'memberMobile', '電話', { placeholder: null, required: true }),
  genFormSchema('sourceSelect', 'memberGender', '性別', {
    placeholder: null,
    options: dict.sex as any,
    required: true
  }),
  genFormSchema('datePicker', 'memberBirthday', '出生年月', { placeholder: null, required: true }),
  genFormSchema('input', 'memberAge', '年齡', { placeholder: null, readonly: true }),
  genFormSchema('apiSelect', 'memberLevel', '會員級別', {
    placeholder: '請選擇',
    api: async () => {
      return await getInOptionFormat('sys/member/level', 'id', 'levelName')
    },
    required: true,
    readonly: true
  }),
  genFormSchema('sourceSelect', 'visitType', '初複診', {
    placeholder: null,
    options: dict.visitType as any,
    required: true
  }),
  genFormSchema('radio', 'usePrCard', '是否使用公關卡', {
    options: dict.appoint.usePrCard,
    value: '',
    labelWidth: '150px'
  }),
  genFormSchema('apiSelect', 'memberSource', '客戶來源', {
    placeholder: null,
    api: async () => {
      return await getInOptionFormat('sys/dict/type/MEMBER_Source', 'code', 'value')
    }
  }),
  genFormSchema('input', 'recommender', '來源詳情', { placeholder: null }),
  genFormSchema('apiSelect', 'importantGuest', '重要客戶備註', {
    placeholder: null,
    api: async () => {
      return await getInOptionFormat('sys/dict/type/MEMBER_ImportGuest', 'code', 'value')
    }
  }),
  genFormSchema('input', 'importantGuestComment', '備註詳情', { placeholder: null }),
  genFormSchema('textarea', 'note', '挂號備註', { placeholder: null, span: 24 }),
  genFormSchema('sourceSelect', 'marketActivity', '市場活動', {
    placeholder: '請選擇',
    options: undefined as any,
    span: 24
  }),
  genFormSchema('checkbox', 'plusType', '加號', {
    options: dict.appointment_plus_type,
    value: [''],
    span: 24
  }),
  genFormSchema('radio', 'isInsur', '是否有保險', {
    options: dict.display,
    value: 'N',
    required: true,
    span: 24,
    onChange: (item) => {
      isInsurRef.value = item
    }
  })
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
</script>

<template>
  <ContentDetailWrap title="選擇確認預約方式" @back="push('/appoint/appoint/list/index')">
    <Form :rules="rules" @register="register">
      <template #hasHighMedicalInsuranceInfo>
        <span>{{ hasHighMedicalInsuranceInfoRef }}</span>
      </template>

      <template #typeOption>
        <TypeOption ref="typeOptionRef" :type="typeRef" />
        <!-- <ElRow v-if="typeRef === 'package'">package </ElRow>
        <ElRow v-if="typeRef === 'specialist'"> specialist </ElRow> -->
      </template>
    </Form>

    <ElRow>
      <ElCol :offset="2" :span="22">
        <InsurForm ref="insurFormRef" v-if="hasInsurRef === 'Y'" />
      </ElCol>
    </ElRow>

    <template #right>
      <ElButton type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
    </template>
  </ContentDetailWrap>
</template>
