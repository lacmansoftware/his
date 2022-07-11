<script setup lang="ts">
import { Form } from '@/components/Form'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { onMounted, PropType, reactive, watch, ref, unref } from 'vue'
import { ElButton, ElMessage, ElDivider } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useRouter, useRoute } from 'vue-router'
import { saveUpdateStatusApi } from '@/api/appoint/appoint/hospital'
import { UpdateStatusType } from '@/api/appoint/appoint/hospital/types'
import { IDomEditor } from '@wangeditor/editor'
import { getInOptionFormat, returnDateString } from '@/utils/common'
import { getApi } from '@/api/common'

import dict from '@/config/dictionary.json'
import PatientSelect from './components/PatientSelect.vue'
import ChargeItemTable from './components/ChargeItemTable.vue'

const { required } = useValidator()
const { emitter } = useEmitt()
const { push, go } = useRouter()
const { query } = useRoute()
const { t } = useI18n()

const store = {
  doctorId: ref<ComponentOptions[]>([]),
  feePayHospitalId: ref<ComponentOptions[]>([])
}
const patientRef = ref<ComponentRef<typeof PatientSelect>>()

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

onMounted(async () => {
  // setStore('certificate', '/sys/dict/type/MEMBER_Certificate', 'code', 'value')
  setStore('feePayHospitalId', '/sys/hospital?special=Y', 'id', 'name')
  setStore('doctorId', '/doctor/getAuthPass', 'id', 'name')
})

const querySearch = async (queryString: string, cb: Fn) => {
  const res = await getApi(`/member/info/get4workorder?keyWords=${queryString}`)
  const result = res?.data.map((item) => ({
    id: item.id,
    name: item.name,
    mobile: item.mobile,
    gender: item.gender,
    archivesNo: item.archivesNo,
    value: item.name,
    label: item.name
  }))
  cb(result)
}

const handleQuerySelect = (item: Recordable) => {
  const { setValues } = methods

  setValues({
    memberId: item.id,
    name: item.name,
    mobile: item.mobile,
    latestHandleTime: returnDateString(60),
    nextContactTime: returnDateString(15)
  })
  contactUserId.value = item.id
}

const schema = reactive<FormSchema[]>([
  {
    field: 'query',
    label: '檢索姓名/檔案號/拼音/手機號',
    component: 'Autocomplete',
    componentProps: {
      style: 'width: 100%',
      triggerOnFocus: false,
      fetchSuggestions: querySearch,
      onSelect: handleQuerySelect,
      slots: {
        default: true
      },
      placeholder: '檢索姓名/檔案號/拼音/手機號'
    },
    colProps: { span: 18 }
  },
  {
    field: 'source',
    label: '預約渠道',
    component: 'Select',
    componentProps: {
      style: 'width: 100%',
      placeholder: '預約渠道',
      options: dict.appoint.source
    },
    colProps: { span: 6 },
    formItemProps: {
      rules: [required()]
    },
    value: 'TEL'
  },
  {
    field: 'specialistId',
    label: '',
    component: 'Hidden',
    colProps: { span: 0 }
  },
  {
    field: 'packageId',
    label: '',
    component: 'Hidden',
    colProps: { span: 0 }
  },
  {
    field: 'specialistName',
    label: '',
    component: 'Hidden',
    colProps: { span: 0 }
  },
  {
    field: 'packageName',
    label: '',
    component: 'Hidden',
    colProps: { span: 0 }
  },
  {
    field: 'hospitalId',
    label: '門店',
    component: 'Select',
    componentProps: {
      options: store.feePayHospitalId
    },
    colProps: { span: 6 }
  },
  {
    field: 'doctorId',
    label: '大夫',
    show: true,
    component: 'Select',
    componentProps: {
      filterable: true,
      options: store.doctorId
    },
    colProps: { span: 6 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'appointmentTimeStart',
    label: ''
  },
  {
    field: 'appointmentTimeEnd',
    label: ''
  },
  {
    field: 'visitType',
    label: ''
  },
  {
    field: 'memberName',
    label: ''
  },
  {
    field: 'memberId',
    label: ''
  },
  {
    field: 'memberMobile',
    label: ''
  },
  {
    field: 'memberLevel',
    label: ''
  },
  {
    field: 'memberGender',
    label: ''
  },
  {
    field: 'memberBirthday',
    label: ''
  },
  {
    field: 'memberAge',
    label: ''
  },
  {
    field: 'memberSource',
    label: ''
  },
  {
    field: 'recommender',
    label: ''
  },
  {
    field: 'importantGuest',
    label: ''
  },
  {
    field: 'importantGuestComment',
    label: ''
  },
  {
    field: 'marketActivity',
    label: ''
  },
  {
    field: 'note',
    label: ''
  },
  {
    field: 'isUpdateAppointRemark',
    label: ''
  },
  {
    field: 'conditionRemark',
    label: ''
  },
  {
    field: 'isUpdateConditionRemark',
    label: ''
  },
  {
    field: 'hasHighMedicalInsurance',
    label: ''
  },
  {
    field: 'usePrCard',
    label: ''
  },
  {
    field: 'cmpe',
    label: ''
  },
  {
    field: 'consFee',
    label: ''
  },
  {
    field: 'cmpeRemark',
    label: ''
  },
  {
    field: 'payType',
    label: ''
  },
  {
    field: 'pendingFlag',
    label: ''
  },
  {
    field: 'firstVisitTime',
    label: ''
  }
])

const { register, methods, elFormRef } = useForm({
  schema
})

const loading = ref(false)

const save = async () => {
  let isPatientValid = true
  await unref(patientRef)?.elFormRef?.validate((isValid) => {
    isPatientValid = isValid
  })

  await unref(elFormRef)?.validate(async (isValid) => {
    if (isPatientValid && isValid) {
      loading.value = true
      const data = (await unref(methods)?.getFormData()) as UpdateStatusType
      console.log(data)
      const res = await saveUpdateStatusApi({
        id: query.id,
        datareplyChannel: data.source
      })
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      if (res) {
        ElMessage.success(res.msg)
        emitter.emit('getList', 'confirm')
        // push('/appoint/example-page')
        go(-1)
      }
    }
  })
}

onMounted(() => {
  // if (!query?.id) {
  //   ElMessage.error('no id')
  //   go(-1)
  // }
})
</script>

<template>
  <ContentDetailWrap title="收銀結算" @back="push('/cash/notcharged/index')">
    <ElDivider content-position="left" class="mt-0">患者信息</ElDivider>
    <PatientSelect ref="patientRef" />

    <ChargeItemTable />

    <Form :rules="rules" @register="register" />

    <template #right>
      <ElButton type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
    </template>
  </ContentDetailWrap>
</template>
