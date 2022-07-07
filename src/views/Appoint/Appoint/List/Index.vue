<script setup lang="ts">
import { reactive, ref, unref, onMounted, watch, computed, h } from 'vue'
import { ElButton, ElTag, ElLink, ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { Table } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useValidator } from '@/hooks/web/useValidator'
import { inDict, getAgeByBirthday, getInOptionFormat, getDateInFormat } from '@/utils/common'
import {
  topIcon,
  downloadIcon,
  uploadIcon,
  groupIcon,
  callIcon,
  msgIcon,
  plusIcon,
  deleteIcon
} from '@/utils/iconList'
import Write from './components/Write.vue'
import dict from '@/config/dictionary.json'
import { useDictStoreWithOut } from '@/store/modules/dict'

import {
  getTableListApi,
  delTableListApi,
  saveGroupMsgApi,
  getExportExcelApi
} from '@/api/appoint/appoint/list'
import { AppointListData } from '@/api/appoint/appoint/list/types'
import { getApi } from '@/api/common'

import { PATH_URL } from '@/config/axios'

defineOptions({
  name: 'SMSSendIndex'
})
const { required, isMobile } = useValidator()
const dictStore = useDictStoreWithOut()

const typeRef = ref('')

const store = {
  type: ref<ComponentOptions[]>([]),
  templet: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

const getTemplateOptions = () => {
  getApi(`/sms/templet${typeRef.value !== '' ? `/type/${typeRef.value}` : ''}`).then((res) => {
    store.templet.value = res?.data.map((item) => ({
      value: item.id,
      label: item.title,
      content: item.content
    }))
  })
}

onMounted(async () => {
  setStore('type', '/sys/dict/type/sms_tmp_type', 'code', 'value')

  const today = getDateInFormat(new Date(), '-')
  await setValues({
    dateStart: today,
    dateEnd: today
  })
  search()
})

const { push } = useRouter()

const { register, tableObject, methods } = useTable<AppointListData>({
  getListApi: getTableListApi,
  delListApi: delTableListApi,
  response: {
    list: 'data',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'confirm') {
    }
    getList()
  }
})

const { t } = useI18n()

const handleTypeChange = (item: Recordable) => {
  typeRef.value = item
}

const handleTempletChange = (item: Recordable) => {
  const curTemplet = store.templet.value.find((tmp) => tmp.value === item)

  const write = unref(writeRef)
  write?.setValues({
    content: curTemplet?.content
  })
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action',
    width: '250px',
    form: { show: false }
  },
  {
    label: '門店',
    field: 'hospitalName',
    width: '80px'
  },
  {
    label: '醫生',
    field: 'doctorName',
    width: '50px'
  },
  {
    label: '操作日期',
    field: 'createTime',
    width: '80px',
    formatter: function (row: AppointListData) {
      return row.createTime.substr(0, 10)
    }
  },
  {
    label: '約診時間',
    field: 'appointmentTimeStart',
    width: '80px'
  },
  {
    label: '客人姓名',
    field: 'memberName',
    width: '60px'
  },
  {
    label: '性別',
    field: 'memberGender',
    width: '40px',
    formatter: function (row: AppointListData) {
      return inDict(row.memberGender, 'sex')
    }
  },
  {
    label: '手機',
    field: 'memberMobile',
    width: '150px'
  },
  {
    label: '狀態',
    field: 'status',
    width: '80px',
    formatter: function (row: AppointListData) {
      return inDict(row.status, 'appoint.status')
    }
  },
  {
    label: '加診',
    field: 'pendingFlag',
    width: '100px',
    formatter: function (row: AppointListData) {
      return inDict(row.pendingFlag, 'appoint.pendingFlag')
    }
  },
  {
    label: '支付診費',
    field: 'paymentStatus',
    width: '60px',
    formatter: function (row: AppointListData) {
      return h(
        ElTag,
        {
          type: row.paymentStatus === 'PAYED' ? 'success' : 'danger'
        },
        () => inDict(row.paymentStatus, 'appoint.paymentStatus')
      )
    }
  },
  {
    label: '備註',
    field: 'note',
    width: '100px'
  },
  {
    label: '客人級別',
    field: 'levelName',
    width: '100px'
  },
  {
    label: '初複診',
    field: 'visitType',
    width: '50px',
    formatter: function (row: AppointListData) {
      return inDict(row.visitType, 'visitType')
    }
  },
  {
    label: '客人來源',
    field: 'memberSourceValue',
    width: '80px'
  },
  {
    label: '本單減免',
    field: 'discount',
    width: '70px'
  },
  {
    label: '保險',
    width: '100px',
    formatter: function (row: AppointListData) {
      var hasInsur =
        row.insurName || (row.hasHighMedicalInsurance == 1 ? '用戶選擇了高端保險' : '無')
      if (hasInsur) {
        return hasInsur
      }
      return '無'
    }
  },
  {
    label: '約診類型',
    field: 'appointmentType',
    width: '100px',
    formatter: function (row: AppointListData) {
      return inDict(row.appointmentType, 'isSpecialist')
    }
  },
  {
    label: '中醫體檢',
    field: 'cmpe',
    width: '100px'
  },
  {
    label: '專科',
    field: 'specialistName',
    width: '70px'
  },
  {
    label: '套餐',
    field: 'packageName',
    width: '70px'
  },
  {
    label: '渠道',
    field: 'source',
    width: '100px',
    formatter: function (row: AppointListData) {
      return inDict(row.source, 'appoint.source')
    }
  },
  {
    label: '重要客人',
    field: 'importantGuestName',
    width: '80px'
  },
  {
    label: '短信回復內容',
    field: 'smsContent',
    width: '100px'
  },
  {
    label: '創建人',
    field: 'createUser',
    width: '80px'
  },
  {
    label: '確認人',
    field: 'confirmUser',
    width: '80px'
  },
  // Search Schema
  {
    field: 'hospitalId',
    label: '門店',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        filterable: true
      },
      colProps: { span: 6 },
      api: async () => {
        return await getInOptionFormat('/member/appointment/hospitals', 'id', 'name')
      }
    }
  },
  {
    field: 'doctorId',
    label: '醫生',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        filterable: true
      },
      colProps: { span: 6 },
      api: async () => {
        return await getInOptionFormat('/doctor/getAuthPass', 'id', 'name')
      }
    }
  },
  {
    field: 'memberName',
    label: '客人姓名',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Input',
      componentProps: {},
      colProps: { span: 6 }
    }
  },
  {
    field: 'week',
    label: '星期',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dict.week
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'dateStart',
    label: '約診時間',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD'
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'dateEnd',
    label: '到',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD'
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'memberMobile',
    label: '手機號碼',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Input',
      componentProps: {},
      colProps: { span: 6 }
    }
  },
  {
    field: 'visitType',
    label: '初複診',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dict.visitType
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'appointmentType',
    label: '約診類型',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dict.isSpecialist
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'specialistId',
    label: '專科',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {},
      colProps: { span: 6 },
      api: async () => {
        return await getInOptionFormat('/market/specialist/list?pageSize=0', 'id', 'specialistName')
      }
    }
  },
  {
    field: 'source',
    label: '預約渠道',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dict.appoint.source
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'replyChannel',
    label: '回復渠道',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dict.appoint.replyChannel
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'pendingFlag',
    label: '是否加診',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dict.appoint.pendingFlag
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'status',
    label: '狀態',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dict.appoint.status
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'marketActivity',
    label: '活動篩選',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: { options: dict.activityList },
      colProps: { span: 6 }
    }
  },
  {
    field: 'subType',
    label: '項目',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: { options: dict.subTypeList },
      colProps: { span: 6 }
    }
  },
  {
    field: 'paymentStatus',
    label: '支付診費',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: { options: dict.appoint.paymentStatus },
      colProps: { span: 6 }
    }
  },
  {
    field: 'noCancel',
    label: '不显示取消的預約',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Checkbox',
      componentProps: {
        options: dict.appoint.showCancel
      },
      colProps: { span: 6 },
      value: [],
      formItemProps: {
        labelWidth: '175px'
      }
    }
  },

  // push msge form
  {
    field: 'moblist',
    label: '號碼列表',
    form: {
      show: true,
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 2,
        placeholder: '號碼列表'
      },
      colProps: { span: 24 },
      formItemProps: {
        rules: [required()]
      }
    },
    table: { show: false }
  },
  {
    field: 'type',
    label: '短信分類',
    form: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '短信分類',
        onChange: handleTypeChange
      },
      colProps: { span: 12 },
      api: async () => {
        return await getInOptionFormat('/sys/dict/type/sms_tmp_type', 'code', 'value')
      }
    },
    table: { show: false }
  },
  {
    field: 'templet',
    label: '短信模板',
    form: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '短信模板',
        options: store.templet,
        onChange: handleTempletChange
      },
      colProps: { span: 12 }
    },
    table: { show: false }
  },
  {
    field: 'content',
    label: '短信內容',
    form: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '短信內容',
        type: 'textarea',
        rows: 2
      },
      colProps: { span: 24 }
    },
    table: { show: false }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)

const dialogTitle = ref('')
const dialogWidth = ref('')

const delLoading = ref(false)

const delData = async (row: MemberInfoTableData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple
      ? {
          multiple: multiple,
          data: selections.reduce((sum, v) => sum + (sum === '' ? '' : ',') + v.id, '') as string
        }
      : { multiple: multiple, data: tableObject.currentRow?.id as string },
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = '新增短信模板'
  actionType.value = 'add'
  dialogWidth.value = ''
  tableObject.currentRow = null
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()
const searchRef = ref<ComponentRef<typeof Search>>()

const setValues = (value: object) => {
  const search = unref(searchRef)
  search?.setValues(value)
}

const search = () => {
  const search = unref(searchRef)
  search.search()
}

const action = (row: TableData, type: string) => {
  dialogTitle.value = type === 'edit' ? '修改短信模板' : 'exampleDemo.detail'
  actionType.value = type
  tableObject.currentRow = row
  dialogVisible.value = true
}

const loading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  await write?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await write?.getFormData()) as any

      const res = await saveGroupMsgApi(
        actionType.value === 'add'
          ? {
              mobiles: data.moblist,
              content: data.content
            }
          : {
              id: data.id,
              label: data.title,
              type: data.type,
              content: data.content
            }
      )
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      if (res) {
        dialogVisible.value = false
        ElMessage.success(res.msg)
        tableObject.currentPage = 1
        getList()
      }
    }
  })
}

const confirm = (id: string) => {
  push(`/appoint/appoint/appoint/confirm?id=${id}`)
}
const update = (id: string) => {}
const cancel = (id: string) => {}
const check = (id: string) => {}
const packagePay = (id: string) => {}
const log = (id: string) => {}

const pushMsg = () => {
  getApi(`member/appointment/unconfirm/total`).then((res) => {
    if (res?.data) {
      ElMessageBox.confirm(
        `第二天共有${res.data}位客人未確認就診, 需要發${res.data}條短信, 是否確認發送?`,
        t('common.reminder'),
        {
          confirmButtonText: t('common.ok'),
          cancelButtonText: t('common.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          getApi(`member/appointment/unconfirm/pushMsg`).then((pushRes) => {
            ElMessage.success(pushRes.msg)
          })
        })
        .catch(() => {})
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const groupMsg = () => {
  dialogTitle.value = '發送短信'
  actionType.value = 'add'
  dialogWidth.value = '70%'
  tableObject.currentRow = null
  dialogVisible.value = true
}

const exportExcel = async () => {
  const search = unref(searchRef)
  const data = (await search?.getFormData()) as any
  const queryParams = new URLSearchParams(data)

  const path = `${PATH_URL}/member/appointment/exportAppointmentList?${queryParams.toString()}`
  window.open(path, '_blank')
}

const outCall = (mobile: string) => {
  console.log('out going call: ', searchSchema[8].componentProps.options)
}

const sendMsg = (mobile: string) => {
  console.log('out going call: ', mobile)
}

watch(typeRef, () => {
  getTemplateOptions()
})
</script>

<template>
  <ContentWrap>
    <Search
      :schema="allSchemas.searchSchema"
      :is-col="true"
      :inline="false"
      :layout="'bottom'"
      :buttom-position="'right'"
      @search="setSearchParams"
      @reset="setSearchParams"
      ref="searchRef"
    />

    <div class="mb-10px ml-10px mt-[-32px]">
      <ElButton type="primary" @click="pushMsg" :icon="topIcon">推送消息</ElButton>
      <ElButton type="success" @click="groupMsg" :icon="groupIcon">短信群發</ElButton>
      <ElButton type="warning" @click="exportExcel" :icon="downloadIcon">導出</ElButton>
    </div>

    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #action="{ row }">
        <div class="text-left">
          <ElLink v-if="row.status === 'YYY'" type="primary" @click="confirm(row.id)" class="mr-5px"
            >確認就診</ElLink
          >
          <ElLink
            v-if="row.status === 'YYY' || row.status == 'QRJZ'"
            type="primary"
            @click="
              update(
                row.id,
                row.hospitalId,
                row.doctorId,
                row.appointmentTimeStart,
                row.appointmentTimeEnd,
                row.memberId
              )
            "
            class="mr-5px"
            >修改</ElLink
          >
          <ElLink
            v-if="row.status === 'YYY' || row.status == 'QRJZ'"
            type="primary"
            @click="cancel(row.id)"
            class="mr-5px"
          >
            取消
          </ElLink>
          <span v-if="row.status === 'YYZ'" class="text-red mr-5px">【等待支付】</span>
          <ElLink
            v-if="row.status === 'YGH'"
            type="primary"
            @click="
              check(
                row.id,
                row.hospitalId,
                row.doctorId,
                row.appointmentTimeStart,
                row.appointmentTimeEnd,
                row.memberId
              )
            "
            class="mr-5px"
            >查看</ElLink
          >
          <ElLink
            v-if="row.paymentStatus === 'UNPAY'"
            type="primary"
            @click="packagePay(row.id, row.memberId, row.memberName, row.doctorId)"
            class="mr-5px"
            >改套餐</ElLink
          >
          <ElLink type="primary" @click="log(row.id)">日誌</ElLink>
        </div>
      </template>
      <template #memberMobile="{ row }">
        <div class="flex items-center gap-1">
          <span>{{ row.memberMobile }}</span>
          <ElLink
            type="primary"
            @click="outCall(row.memberMobile)"
            title="打電話"
            :icon="callIcon"
          />
          <ElLink
            type="primary"
            @click="sendMsg(row.memberMobile)"
            title="發短信"
            :icon="msgIcon"
          />
        </div>
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth">
    <Write
      v-if="actionType === 'add' || actionType === 'edit'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="tableObject.currentRow"
    />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
.@{elNamespace}-table {
  .cell {
    padding: 0 !important;
  }
}
</style>
