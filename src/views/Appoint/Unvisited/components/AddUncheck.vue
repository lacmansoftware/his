<script setup lang="ts">
import { Form } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { reactive, unref, ref, onMounted, PropType } from 'vue'
import { AppointRegisteredTableData } from '@/api/appoint/regist/registered/types'
import { ElButton } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { genFormSchema, getSchemaOptions, setDisabled } from '@/utils/schema'
import { getApi } from '@/api/common'
import { propTypes } from '@/utils/propTypes'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useRouter } from 'vue-router'

const props = defineProps({
  pageType: propTypes.string.def(''),
  currentRow: {
    type: Object as PropType<AppointRegisteredTableData>,
    default: () => {}
  }
})

const { emitter } = useEmitt()
const { push } = useRouter()
const { required } = useValidator()
const { t } = useI18n()

const handleMemberSearchChange = (row) => {
  console.log(row)

  if (Object.keys(row).length === 0) {
    setDisabled(methods, 'memberName', false)
    setDisabled(methods, 'memberMobile', false)
  } else {
    setDisabled(methods, 'memberName', true)
    setDisabled(methods, 'memberMobile', true)
    methods?.setValues(row)
  }
}

const schema = reactive<FormSchema[]>([
  genFormSchema('autocomplete', 'member_search', '患者姓名/手機', {
    url: '/member/info/query',
    itemValue: 'memberName',
    itemLink: 'memberId',
    placeholder: '客人姓名/手機',
    labelWidth: '150px',
    span: 24,
    onSelect: handleMemberSearchChange
  }),
  genFormSchema('input', 'memberName', '姓名', {
    placeholder: null,
    required: true,
    readonly: true,
    span: 24
  }),
  genFormSchema('hidden', 'memberId', '姓名', { placeholder: null }),
  genFormSchema('input', 'memberMobile', '電話', {
    placeholder: null,
    required: true,
    readonly: true,
    span: 24
  })
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
