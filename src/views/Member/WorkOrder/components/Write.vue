<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, onMounted, computed } from 'vue'
// import { useI18n } from '@/hooks/web/useI18n'
import { useValidator } from '@/hooks/web/useValidator'
import { getApi } from '@/api/common'
import { getInOptionFormat, returnDateString } from '@/utils/common'
import dict from '@/config/dictionary.json'
import Comment from './Comment.vue'
import { WorkOrderType, CommentType } from '@/api/workorder/workorder/types'

const { required, isMobile } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<WorkOrderType>>,
    default: () => null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

// const { t } = useI18n()

const contactUserId = ref('')
const statusRef = ref('nothand')

const store = {
  orderTypes: ref<ComponentOptions[]>([]),
  sysUser: ref<ComponentOptions[]>([]),
  sysDeptList: ref<ComponentOptions[]>([]),
  transferId: ref<ComponentOptions[]>([]),
  comments: ref<CommentType[]>([]),
  contactUserId: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

const setComments = () => {
  getApi(`member/workorder/detail/list?id=${props.currentRow?.id}`).then((res) => {
    store.comments.value = res.data.map((item) => ({
      handlerName: item?.handlerName,
      createTime: item?.createTime,
      comment: item?.note
    }))
    console.log('when loaded: ', store.comments.value)
  })
}

onMounted(async () => {
  setStore('orderTypes', '/sys/dict/type/WORKORDER_Type', 'code', 'value')
  setStore(
    'contactUserId',
    `/member/relation/list?memberId=${contactUserId.value}`,
    'linkedMemberId',
    'name'
  )
  await setStore('sysUser', `/sys/user`, 'id', 'name')
  setStore('sysDeptList', `/sys/dept/list`, 'id', 'hospitalName+deptName')
  store.transferId.value = store.sysUser.value

  props.isEdit && setComments()
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

const handleTypeChange = (item: Recordable) => {
  getApi(`/member/workorder/getId?type=${item}`).then((res) => {
    const { setValues } = methods

    setValues({
      id: res.data
    })
  })
}

const handleStatusChange = (item: string) => {
  statusRef.value = item
  if (!(statusRef.value === 'nothand' || statusRef.value === 'handling')) {
    methods?.setValues({
      transferType: 'person'
    })
    methods?.setSchema([
      {
        field: 'transferId',
        path: 'componentProps.disabled',
        value: true
      }
    ])
  } else {
    methods?.setSchema([
      {
        field: 'transferId',
        path: 'componentProps.disabled',
        value: false
      }
    ])
  }
}

const transferTypeOptions = computed(() =>
  dict.member.workOrderTransferType.filter(
    (item) => statusRef.value === 'nothand' || statusRef.value === 'handling' || !item.disabled
  )
)

const handleTransferTypeChange = (item: string) => {
  store.transferId.value = item === 'person' ? store.sysUser.value : store.sysDeptList.value
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
    formItemProps: {
      rules: props.isEdit ? [] : [required()]
    },
    colProps: { span: props.isEdit ? 0 : 24 }
  },
  {
    field: 'id',
    label: '工單號',
    component: 'Input',
    componentProps: {
      style: 'width: 100%',
      placeholder: '工單號',
      disabled: true
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'type',
    label: '工單類型',
    component: 'Select',
    componentProps: {
      style: 'width: 100%',
      placeholder: '工單類型',
      options: store.orderTypes as any,
      onChange: handleTypeChange,
      disabled:
        props.isEdit &&
        (props.currentRow?.status === 'nohand' || props.currentRow?.status === 'handled')
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    },
    api: async () => {
      const res = await getApi(`/sys/dict/type/WORKORDER_Type`)
      return res.data
    }
  },
  {
    field: 'name',
    label: '客戶姓名',
    component: 'Input',
    componentProps: {
      style: 'width: 100%',
      placeholder: '客戶姓名',
      disabled: props.isEdit
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'mobile',
    label: '客戶電話',
    component: 'Input',
    componentProps: {
      style: 'width: 100%',
      placeholder: '客戶電話',
      disabled: props.isEdit
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (_, value, callback) => isMobile(value, callback, '联系人电话格式错误！')
        }
      ]
    }
  },
  {
    field: 'memberId',
    component: 'Hidden',
    colProps: { span: 0 }
  },
  {
    field: 'visitId',
    component: 'Hidden',
    colProps: { span: 0 }
  },
  {
    field: 'contactName',
    component: 'Hidden',
    colProps: { span: 0 }
  },
  {
    field: 'contactUserId',
    label: '聯繫人姓名',
    component: 'Select',
    componentProps: {
      style: 'width: 100%',
      placeholder: '聯繫人姓名',
      options: store.contactUserId as any,
      disabled: props.isEdit
    },
    colProps: { span: 12 }
  },
  {
    field: 'contactMobile',
    label: '聯繫人電話',
    component: 'Input',
    componentProps: {
      style: 'width: 100%',
      placeholder: '聯繫人電話',
      disabled: props.isEdit
    },
    colProps: { span: 12 }
  },
  {
    field: 'transferType',
    label: '轉交類型',
    component: 'Radio',
    componentProps: {
      style: 'width: 100%',
      placeholder: '',
      options: transferTypeOptions as any,
      onChange: handleTransferTypeChange,
      disabled:
        props.isEdit &&
        (props.currentRow?.status === 'nohand' || props.currentRow?.status === 'handled')
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    },
    value: 'person'
  },
  {
    field: 'transferId',
    label: '轉交编号',
    component: 'Select',
    componentProps: {
      disabled:
        false ||
        (props.isEdit &&
          (props.currentRow?.status === 'nohand' || props.currentRow?.status === 'handled')),
      style: 'width: 100%',
      placeholder: '轉交编号',
      options: store.transferId as any
    },
    colProps: { span: 12 }
  },
  {
    field: 'latestHandleTime',
    label: '最晚處理時效',
    component: 'DatePicker',
    componentProps: {
      style: 'width: 100%',
      placeholder: '最晚處理時效',
      type: 'datetime',
      format: 'YYYY/MM/DD HH:mm',
      valueFormat: 'YYYY-MM-DD HH:mm',
      disabled: props.isEdit
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'nextContactTime',
    label: '下次聯繫時間',
    component: 'DatePicker',
    componentProps: {
      style: 'width: 100%',
      placeholder: '下次聯繫時間',
      type: 'datetime',
      format: 'YYYY/MM/DD HH:mm',
      valueFormat: 'YYYY-MM-DD HH:mm',
      disabled: props.isEdit
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'isRemind',
    label: '是否創建提醒',
    component: 'Checkbox',
    value: [],
    componentProps: {
      style: 'width: 100%',
      placeholder: '是否創建提醒',
      options: dict.member.workOrderRemind,
      disabled:
        props.isEdit &&
        (props.currentRow?.status === 'nohand' || props.currentRow?.status === 'handled')
    },
    colProps: { span: props.isEdit ? 0 : 8 }
  },
  {
    field: 'status',
    label: '狀態',
    component: 'Radio',
    componentProps: {
      style: 'width: 100%',
      placeholder: '狀態',
      options: dict.member.workOrderStatus,
      onChange: handleStatusChange,
      disabled:
        props.isEdit &&
        (props.currentRow?.status === 'nohand' || props.currentRow?.status === 'handled')
    },
    colProps: { span: 16 },
    formItemProps: {
      rules: [required()]
    },
    value: statusRef.value
  },
  {
    field: 'comment',
    label: '溝通記錄',
    component: 'Input',
    componentProps: {
      style: 'width: 100%',
      placeholder: '溝通記錄',
      type: 'textarea',
      rows: 2,
      disabled:
        props.isEdit &&
        (props.currentRow?.status === 'nohand' || props.currentRow?.status === 'handled')
    },
    colProps: { span: 24 },
    formItemProps: {
      rules: [required()]
    },
    value: '無'
  }
])

const rules = reactive({
  title: [required()],
  author: [required()],
  importance: [required()],
  pageviews: [required()],
  display_time: [required()],
  content: [required()]
})

const { register, methods, elFormRef } = useForm({
  schema
})

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    const { setValues, setSchema } = methods
    setValues(currentRow)
    setSchema([
      {
        field: 'content',
        path: 'componentProps.defaultHtml',
        value: currentRow.content
      }
    ])
  },
  {
    deep: true,
    immediate: true
  }
)

watch(contactUserId, () => {
  setStore(
    'contactUserId',
    `/member/relation/list?memberId=${contactUserId.value}`,
    'linkedMemberId',
    'name'
  )
})

defineExpose({
  elFormRef,
  getFormData: methods.getFormData
})

const test = () => {
  schema.find((item) => item.field === 'transferType')!.value = 'dept'

  alert('Hello')
}
</script>

<template>
  <Form :rules="rules" @register="register">
    <template #query-default="{ item }">
      <div class="flex w-full justify-between">
        <span class="flex-1">{{ item.name }}</span>
        <span class="flex-1">{{ item.mobile }}</span>
        <span class="flex-1">{{ item.gender }}</span>
        <span class="flex-1">{{ item.archivesNo }}</span>
        <!-- <div class="value">{{ item.value }}</div>
        <span class="label">{{ item.label }}</span> -->
      </div>
    </template>
  </Form>

  <div v-if="props.isEdit">
    <Comment
      v-if="props.currentRow?.handlerName"
      :current-row="{
        handlerName: props.currentRow?.handlerName,
        createTime: props.currentRow?.createTime,
        comment: props.currentRow?.comment
      }"
    />

    <Comment
      v-for="comment in store.comments.value"
      :key="comment!.createTime"
      :current-row="comment"
    />
  </div>
</template>
