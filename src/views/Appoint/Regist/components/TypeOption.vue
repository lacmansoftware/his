<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { computed, onMounted, PropType, reactive, ref, watch } from 'vue'
import { ElLink } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useValidator } from '@/hooks/web/useValidator'
import { IDomEditor } from '@wangeditor/editor'
import { AppointListData } from '@/api/appoint/appoint/list/types'
import dict from '@/config/dictionary.json'
import { genFormSchema } from '@/utils/schema'
import { getInOptionFormat } from '@/utils/common'
import { propTypes } from '@/utils/propTypes'

const { required } = useValidator()
const curId = ref()

const props = defineProps({
  type: propTypes.string.def('')
})

const { t } = useI18n()
const type = computed(() => props.type)
const packSpanRef = ref(0)
const specSpanRef = ref(0)

const schema = reactive<FormSchema[]>([
  genFormSchema('apiSelect', 'marketPackage', '', {
    placeholder: null,
    api: async () => {
      return await getInOptionFormat('market/package/list?pageSize=0', 'id', 'packageName')
    },
    filterable: true,
    labelWidth: '0',
    span: packSpanRef,
    required: packSpanRef
  }),
  genFormSchema('apiSelect', 'marketingList', '', {
    placeholder: null,
    api: async () => {
      return await getInOptionFormat('market/specialist?pageSize=0', 'id', 'specialistName')
    },
    filterable: true,
    labelWidth: '0',
    span: specSpanRef,
    required: specSpanRef
  }),
  {
    field: 'packBtn',
    label: '',
    colProps: {
      span: packSpanRef
    }
  }
])

const { register, methods, elFormRef } = useForm({
  schema
})

defineExpose({
  elFormRef,
  getFormData: methods.getFormData
})

watch(
  () => type.value,
  (val) => {
    if (val === 'normal') {
      packSpanRef.value = 0
      specSpanRef.value = 0
    } else if (val === 'package') {
      packSpanRef.value = 12
      specSpanRef.value = 0
    } else if (val === 'specialist') {
      packSpanRef.value = 0
      specSpanRef.value = 12
    }
    console.log(schema)
  }
)

const taren = () => {}
</script>

<template>
  <Form @register="register">
    <template #packBtn>
      <ElLink type="primary" @click="taren">使用他人套餐</ElLink>
    </template>
  </Form>
</template>
