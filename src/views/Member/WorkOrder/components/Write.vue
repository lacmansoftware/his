<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, onMounted } from 'vue'
import { TableData } from '@/api/table/types'
import { useI18n } from '@/hooks/web/useI18n'
import { useValidator } from '@/hooks/web/useValidator'
import { IDomEditor } from '@wangeditor/editor'
import { getApi } from '@/api/common'
import { getInOptionFormat } from '@/utils/common'

const { required, isMobile } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<TableData>>,
    default: () => null
  }
})

const { t } = useI18n()

const store = {
  orderTypes: ref<ComponentOptions[]>([]),
  contactUserid: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

onMounted(() => {
  setStore('orderTypes', '/sys/dict/type/WORKORDER_Type', 'code', 'value')
  setStore('contactUserid', `/member/relation/list`, 'linkedMemberId', 'name')
})

const querySearch = async (queryString: string, cb: Fn) => {
  const res = await getApi(`/member/info/get4workorder?keyWords=${queryString}`)
  const result = res?.data.map((item) => ({
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
  // sMember.value[0] = item.id
  // const { setValues } = methods
  // setValues({
  //   mainMemberMobile: item.label // mobile
  // })
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
      rules: [required()]
    },
    colProps: { span: 24 }
  },
  {
    field: 'id',
    label: '工單號',
    component: 'Input',
    componentProps: {
      style: 'width: 100%',
      placeholder: '工單號',
      readonly: true
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
      options: store.orderTypes
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    },
    api: async () => {
      const res = await getApi(`/sys/dict/type/WORKORDER_Type`)
      console.log(res)
      return res.data
    }
  },
  {
    field: 'name',
    label: '客戶姓名',
    component: 'Input',
    componentProps: {
      style: 'width: 100%',
      placeholder: '客戶姓名'
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
      placeholder: '客戶電話'
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
    field: 'contactName',
    component: 'Hidden',
    componentProps: {
      style: 'width: 100%'
    },
    colProps: { span: 0 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'contactUserid',
    label: '聯繫人姓名',
    component: 'Select',
    componentProps: {
      style: 'width: 100%',
      placeholder: '聯繫人姓名',
      options: store.contactUserid
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'contactMobile',
    label: '聯繫人電話',
    component: '',
    componentProps: {
      style: 'width: 100%',
      placeholder: '聯繫人電話'
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'transferType',
    label: '',
    component: '',
    componentProps: {
      style: 'width: 100%',
      placeholder: ''
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'transferId',
    label: 'style',
    component: '',
    componentProps: {
      style: 'width: 100%',
      placeholder: 'style'
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'latestHandleTime',
    label: '最晚處理時效',
    component: '',
    componentProps: {
      style: 'width: 100%',
      placeholder: '最晚處理時效'
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'nextContactTime',
    label: '下次聯繫時間',
    component: '',
    componentProps: {
      style: 'width: 100%',
      placeholder: '下次聯繫時間'
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'isRemind',
    label: '是否創建提醒',
    component: '',
    componentProps: {
      style: 'width: 100%',
      placeholder: '是否創建提醒'
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'status',
    label: '狀態',
    component: '',
    componentProps: {
      style: 'width: 100%',
      placeholder: '狀態'
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'comment',
    label: '溝通記錄',
    component: '',
    componentProps: {
      style: 'width: 100%',
      placeholder: '溝通記錄'
    },
    colProps: { span: 12 },
    formItemProps: {
      rules: [required()]
    }
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

defineExpose({
  elFormRef,
  getFormData: methods.getFormData
})
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
</template>
