<script setup lang="ts">
import { Form } from '@/components/Form'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { onMounted, PropType, reactive, watch, ref, unref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
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

const { required } = useValidator()
const { emitter } = useEmitt()
const { push, go } = useRouter()
const { query } = useRoute()
const { t } = useI18n()

const store = {
  // doctorId: ref<ComponentOptions[]>([]),
  // feePayHospitalId: ref<ComponentOptions[]>([])
}
const memberId = ref<string | null>(null)

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

onMounted(async () => {
  // setStore('certificate', '/sys/dict/type/MEMBER_Certificate', 'code', 'value')
})

const schema = reactive<FormSchema[]>([
  {
    field: 'memberFilter',
    label: '患者：',
    component: 'Autocomplete',
    componentProps: {
      style: 'width: 100%',
      triggerOnFocus: false,
      fetchSuggestions: async (queryString: string, cb: Fn) => {
        const res = await getApi(`/member/info/query?keyWords=${queryString}`)
        const result = res?.data.map((item) => ({
          ...item,
          value: item.memberName,
          link: item.memberMobile
        }))
        cb(result)
      },
      onSelect: (item: Recordable) => {
        const { setValues } = methods

        setValues({
          memberName: item.memberName,
          memberMobile: item.memberMobile,
          memberSex: item.memberSex,
          memberBirthday: item.memberBirthday,
          memberAge: item.memberAge
        })
        memberId.value = item.id
      },
      slots: {
        default: true
      },
      placeholder: '患者姓名/拼音/手機/病案號'
    },
    colProps: { span: 18 }
  },
  {
    label: '患者',
    field: 'memberName',
    component: 'Input',
    colProps: { span: 6 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    label: '手機',
    field: 'memberMobile',
    component: 'Input',
    colProps: { span: 6 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'memberSex',
    label: '性別',
    component: 'Select',
    componentProps: {
      style: 'width: 100%',
      options: dict.sex
    },
    colProps: { span: 6 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'memberBirthday',
    label: '出生年月',
    component: 'DatePicker',
    componentProps: {
      type: 'date',
      valueFormat: 'YYYY-MM-DD'
    },
    colProps: { span: 6 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    label: '年齡',
    field: 'memberAge',
    component: 'Input',
    colProps: { span: 6 },
    componentProps: {
      readonly: true
    },
    formItemProps: {
      rules: [required()]
    }
  }
])

const { register, methods, elFormRef } = useForm({
  schema
})

defineExpose({
  memberId,
  elFormRef,
  getFormData: methods.getFormData,
  setValues: methods.setValues
})
</script>

<template>
  <Form :rules="rules" @register="register" />
</template>
