<script setup lang="ts">
import { Form } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { reactive, unref, ref, onMounted, PropType } from 'vue'
import { AppointRegisteredTableData } from '@/api/appoint/regist/registered/types'
import { ElButton } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { genFormSchema, getSchemaOptions } from '@/utils/schema'
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

const arrearageText = ref<string>('')
const currentOwe = ref<boolean>(false)

const handleDueTimeChange = (item: string) => {
  const s1 = new Date(item.replace(/-/g, '/'))
  const s2 = new Date() //當前日期：2017-04-24
  const days = s1.getTime() - s2.getTime()
  const time = days / (1000 * 60 * 60 * 24) + 2
  const endInsurTime = 0 < time ? '(還有 ' + time.toFixed(0) + ' 天過期)' : '(保險已過期)'
  emitter.emit('setEndInsurTime', endInsurTime)
}

const schema = reactive<FormSchema[]>([
  {
    field: 'arrearage',
    label: '',
    colProps: { span: 0 }
  },
  genFormSchema('sourceSelect', 'memberInsur', '選擇保險產品', {
    placeholder: null,
    options: undefined as any,
    onSelected: async (item) => {
      if (item) {
        // if (namespace.hasInsur == 'Y') {
        // }
        const data = (await getSchemaOptions(schema, 'memberInsur'))[0]
        data.memberInsur = item
        methods.setValues({ ...data, fileUrl: '' })
        // var c = namespace.schoolIndex
        // for (var j = 7; j <= c; j++) {
        //   namespace.removeSchool(j, e)
        // }
        // for (var i = 0; i < data.limitCount; i++) {
        //   namespace.addSchool(data)
        // }
      }
    }
  }),
  genFormSchema('input', 'insuranceCardNumber', '保險卡號', { placeholder: null, required: true }),
  genFormSchema('datePicker', 'registerTime', '登記時間', { placeholder: null, required: true }),
  genFormSchema('datePicker', 'dueTime', '到期時間', {
    placeholder: null,
    required: true,
    onChange: handleDueTimeChange
  }),
  genFormSchema('divider', '', '保險福利確認'),
  genFormSchema('hidden', 'memberInsurLimit[0].code', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[0].id', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[0].name', '保險福利確認', { placeholder: null }),
  genFormSchema('input', 'memberInsurLimit[0].available', '診費可用額度（元）', {
    placeholder: null,
    span: 8,
    labelWidth: '250px'
  }),
  genFormSchema('input', 'memberInsurLimit[0].number', '診費可用次數（次）', {
    placeholder: null,
    span: 8,
    labelWidth: '250px'
  }),
  genFormSchema('input', 'memberInsurLimit[0].singleLimit', '診費單次額度上限（元）', {
    placeholder: null,
    span: 8,
    labelWidth: '250px'
  }),
  genFormSchema('hidden', 'memberInsurLimit[1].code', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[1].name', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[1].id', '保險福利確認', { placeholder: null }),
  genFormSchema('input', 'memberInsurLimit[1].available', '藥費可用額度（元）', {
    span: 8,
    placeholder: null,
    labelWidth: '250px'
  }),
  genFormSchema('input', 'memberInsurLimit[1].number', '藥費可用次數（次）', {
    span: 8,
    placeholder: null,
    labelWidth: '250px'
  }),
  genFormSchema('input', 'memberInsurLimit[1].singleLimit', '藥費單次額度上限（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('hidden', 'memberInsurLimit[2].code', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[2].name', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[2].id', '保險福利確認', { placeholder: null }),
  genFormSchema('input', 'memberInsurLimit[2].available', '治療費可用額度（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[2].number', '治療費可用次數（次）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[2].singleLimit', '治療費單次額度上限（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('hidden', 'memberInsurLimit[3].code', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[3].name', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[3].id', '保險福利確認', { placeholder: null }),
  genFormSchema('input', 'memberInsurLimit[3].available', '藥品處置費可用額度（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[3].number', '藥品處置費可用次數（次）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[3].singleLimit', '藥品處置費單次額度上限（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('hidden', 'memberInsurLimit[4].code', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[4].name', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[4].id', '保險福利確認', { placeholder: null }),
  genFormSchema('input', 'memberInsurLimit[4].available', '快遞費可用額度（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[4].number', '快遞費可用次數（次）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[4].singleLimit', '快遞費單次額度上限（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('hidden', 'memberInsurLimit[5].code', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[5].name', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[5].id', '保險福利確認', { placeholder: null }),
  genFormSchema('input', 'memberInsurLimit[5].available', '國貨鋪費可用額度（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[5].number', '國貨鋪費可用次數（次）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[5].singleLimit', '國貨鋪費單次額度上限（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('hidden', 'memberInsurLimit[6].code', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[6].name', '保險福利確認', { placeholder: null }),
  genFormSchema('hidden', 'memberInsurLimit[6].id', '保險福利確認', { placeholder: null }),
  genFormSchema('input', 'memberInsurLimit[6].available', '其他費可用額度（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[6].number', '其他費可用次數（次）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),
  genFormSchema('input', 'memberInsurLimit[6].singleLimit', '其他費單次額度上限（元）', {
    placeholder: null,
    labelWidth: '250px',
    span: 8
  }),

  genFormSchema('input', 'fileUrl', '上傳證件', { placeholder: null }),
  genFormSchema('textarea', 'remark', '保險備註', { placeholder: null, span: 24 })
])

const { register, methods, elFormRef } = useForm({
  schema
})

onMounted(() => {
  console.log(props.pageType)
  if (!props.pageType || props.pageType !== 'update_insur') return
  getApi('/doctor/checkUseInsur', {
    visitType: props?.currentRow?.visitType,
    doctorId: props?.currentRow?.doctorId
  }).then((result) => {
    getApi('/member/insur/list', { memberId: props?.currentRow?.memberId, status: 'Y' }).then(
      (result) => {
        if (result.success) {
          methods.setValues({ isInsur: 'Y' })
          emitter.emit('trigWarning', false)
          if (result.data.length > 0) {
            emitter.emit('hasInsur', 'Y')

            methods?.setValues({
              ...result.data[0],
              memberInsur: result.data[0].id
            })
            handleDueTimeChange(result.data[0]?.dueTime)
            methods?.setSchema([
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

            // for (var i = 0; i < data[0].limitCount; i++) {
            //   namespace.addSchool(data[0])
            // }

            handleDueTimeChange(result.data[0]?.dueTime)
            // for (var i = 0; i < data[0].limitCount; i++) {
            //   namespace.addSchool(data[0])
            // }
          } else {
            //當前用戶沒有保險，需要新加保險，所以查詢的是合作保險名
            methods.setValues({ isInsur: 'N' })
            emitter.emit('trigWarning', true)
            emitter.emit('hasInsur', 'N')
            getApi('/market/insur').then((result) => {
              if (result.success) {
                methods?.setSchema([
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
                methods?.setValues({ memberInsur: '' })
              }
            })
          }
        }
      }
    )

    getApi('/order/arrearage/member/' + props?.currentRow?.memberId, function (result2) {
      if (result2.success) {
        const data = result2.data
        if (data.owe && data.owe !== 'null' && data.owe !== 'undefined') {
          const oweText = data.oweText
          arrearageText.value = oweText
          if (data.currentOwe && data.currentOwe !== 'null' && data.currentOwe !== 'undefined') {
            currentOwe.value = true
            // $('#arrearage').after(
            //   '&nbsp;<span onclick="gotoArre2(\'' +
            //     props?.currentRow?.memberId +
            //     '\');" style="cursor:pointer;color:#016cdf;">前往處理</span>'
            // )
          }
        }
      }
    })
  })
})

defineExpose({
  methods,
  elFormRef,
  schema
})

const gotoArre2 = () => {
  push({
    path: 'cash/pending/index',
    query: { memberId: props?.currentRow?.memberId }
  })
}
</script>

<template>
  <Form @register="register">
    <template #arrearage>
      <span>{{ arrearageText }}</span>
      <ElLink v-if="currentOwe" type="primary" @click="gotoArre2" class="mr-5px">前往處理</ElLink>
    </template>
  </Form>
</template>
