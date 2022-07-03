<script setup lang="ts">
import { Form } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { reactive, unref, ref, onMounted } from 'vue'
import { ElButton } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { getApi } from '@/api/common'

const { required } = useValidator()

const { t } = useI18n()

const sMember = ref<string[]>(['', ''])

const memberNameSearch = async (queryString: string, cb: Fn) => {
  const res = await getApi(`/member/info/query?keyWords=${queryString}`)
  const result = res?.data.map((item) => ({
    id: item.memberId,
    value: item.memberName,
    label: item.memberMobile
  }))
  cb(result)
}

const handleMainSelect = (item: Recordable) => {
  sMember.value[0] = item.id
  const { setValues } = methods
  setValues({
    mainMemberMobile: item.label // mobile
  })
}

const handleLessSelect = (item: Recordable) => {
  sMember.value[1] = item.id
  const { setValues } = methods
  setValues({
    lessMemberMobile: item.label // mobile
  })
}

const schema = reactive<FormSchema[]>([
  {
    field: 'mainMemberName',
    label: '主賬號客人姓名/電話',
    component: 'Autocomplete',
    componentProps: {
      style: 'width: 100%',
      fetchSuggestions: memberNameSearch,
      onSelect: handleMainSelect,
      slots: {
        default: true
      }
    },
    formItemProps: {
      rules: [required()]
    },
    colProps: { span: 12 }
  },
  {
    field: 'mainMemberMobile',
    label: '對應客人電話',
    component: 'Input',
    componentProps: {
      readonly: true
    },
    colProps: { span: 12 }
  },
  {
    field: 'lessMemberName',
    label: '被合賬號客人/電話',
    component: 'Autocomplete',
    componentProps: {
      style: 'width: 100%',
      fetchSuggestions: memberNameSearch,
      onSelect: handleLessSelect,
      slots: {
        default: true
      }
    },
    formItemProps: {
      rules: [required()]
    },
    colProps: { span: 12 }
  },
  {
    field: 'lessMemberMobile',
    label: '對應客人電話',
    component: 'Input',
    componentProps: {
      readonly: true
    },
    colProps: { span: 12 }
  }
])

const { register, methods, elFormRef } = useForm({
  schema
})
</script>

<template>
  <Form :schema="schema" @register="register">
    <template #mainMemberName-default="{ item }">
      <div class="value">{{ item.value }}</div>
      <span class="label">{{ item.label }}</span>
    </template>
    <template #lessMemberName-default="{ item }">
      <div class="value">{{ item.value }}</div>
      <span class="label">{{ item.label }}</span>
    </template>
  </Form>
</template>
