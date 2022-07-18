<script setup lang="ts">
import { reactive, ref, unref, onMounted } from 'vue'
import { ElButton, ElLink, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { Table } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { inDict, getInOptionFormat, getDateInFormat } from '@/utils/common'
import { plusIcon } from '@/utils/iconList'
import Write from '@/views/Cash/NotCharged/components/Write.vue'

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/order/offline/paid'
import { NotChargedTableData } from '@/api/order/offline/paid/types'
import { dateCompare } from '@/utils/date'
import dict from '@/config/dictionary.json'

defineOptions({
  name: 'CashNotChargedIndex'
})

const searchRef = ref<ComponentRef<typeof Search>>()

const store = {
  type: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

const { push } = useRouter()

const { register, tableObject, methods } = useTable<NotChargedTableData>({
  getListApi: getTableListApi,
  delListApi: delTableListApi,
  response: {
    list: 'data',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

// getList()

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action',
    width: '100px',
    form: { show: false }
  },
  {
    label: '訂單編號',
    field: 'orderNo',
    width: '140px'
  },
  {
    label: '下單時間',
    field: 'createTime',
    width: '120px'
  },
  {
    label: '訂單類型',
    field: 'orderType',
    width: '120px',
    formatter: function (row) {
      return inDict(row.orderType, 'allOrderType')
    }
  },
  {
    label: '價格（元）',
    field: 'paymentPrice',
    width: '70px'
  },
  {
    label: '客人',
    field: 'memberName',
    width: '70px'
  },
  {
    label: '性別',
    field: 'memberSex',
    width: '50px',
    formatter: function (row) {
      return inDict(row.memberSex, 'sex')
    }
  },
  {
    label: '年齡',
    field: 'memberAge',
    width: '50px'
  },
  {
    label: '手機',
    field: 'memberMobile',
    width: '80px'
  },
  {
    label: '微信昵稱',
    field: 'wxName',
    width: '70px'
  },
  {
    label: '門店',
    field: 'hospitalName',
    width: '70px'
  },
  {
    label: '大夫',
    field: 'doctorName',
    width: '70px'
  },
  {
    label: '支付狀態',
    field: 'status',
    width: '70px',
    formatter: function (row) {
      if ('END' === row.status || 'UNPAY' === row.status) {
        return '未付款'
      } else if ('REFUNDING' === row.status) {
        return '退款中'
      } else if ('REFUND' === row.status) {
        return '退款'
      } else {
        return '已付款'
      }
    }
  },
  {
    label: '訂單狀態',
    field: 'status',
    width: '70px',
    formatter: function (row) {
      if (row.orderType === 'recipel') {
        if ('' === row.dispensingStatus) {
          return '調劑中'
        }
      }
      if (row.orderType === 'recipel') {
        if (row.expressType === 'SELF' && 'SEND' === row.dispensingStatus) {
          return '已完成'
        }
      }
      if (
        (row.orderSubType === 'GHSP' || row.orderSubType === 'DLDX') &&
        row.expressType !== 'SELF'
      ) {
        if (row.expressStatus === 'WAITING') {
          return '調劑中'
        }
        return inDict(row.expressStatus, 'expressStatus')
      }
      if (row.orderSubType === 'YNZJ' && row.expressType !== 'SELF') {
        if ('' === row.dispensingStatus) {
          return '調劑中'
        }
      }
      if (row.expressType === 'SELF' && row.orderType === 'life') {
        return '已完成'
      }
      if (row.expressType !== 'SELF' && 'SEND' === row.dispensingStatus) {
        if (row.expressStatus === 'WAITING') {
          return '調劑完成'
        }
        return inDict(row.expressStatus, 'expressStatus')
      } else {
        if (row.status === 'PAYED' && row.orderType !== 'recipel' && row.orderType !== 'life') {
          return '已付款'
        }
      }
    }
  },
  {
    label: '配送方式',
    field: 'expressType',
    width: '70px',
    formatter: function (row) {
      if (row.expressType === null || row.expressType === '') {
        return '--'
      }
      return inDict(row.expressType, 'expressType')
    }
  },
  {
    label: '預約時間',
    field: 'appointmentTimeStart',
    width: '150px',
    formatter: function (row) {
      if (row.appointmentTimeEnd) {
        return (
          row.appointmentTimeStart +
          '-' +
          row.appointmentTimeEnd.substr(11, row.appointmentTimeEnd.length)
        )
      }
    }
  },
  {
    label: '操作員',
    field: 'modifyUser',
    width: '70px'
  },
  {
    label: '操作時間',
    field: 'modifyTime',
    width: '120px'
  },

  // Search Schema
  {
    field: 'orderTimeStart',
    label: '下單時間',
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
    field: 'orderTimeEnd',
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
    field: 'orderNo',
    label: '訂單編號',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '訂單編號'
      },
      colProps: { span: 6 }
    }
  },

  {
    field: 'member',
    label: '客人',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '姓名/手機號'
      },
      colProps: { span: 6 }
    }
  },

  {
    field: 'doctor',
    label: '大夫',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '大夫姓名'
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'orderTypes',
    label: '訂單類型',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        placeholder: '訂單類型',
        options: dict.offlineOrderType as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'status',
    label: '支付狀態',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        placeholder: '支付狀態',
        options: dict.offlinePaymentStatus as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'expressType',
    label: '配送方式',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        placeholder: '配送方式',
        options: dict.expressType as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'comboStatus',
    label: '訂單狀態',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        placeholder: '訂單狀態',
        options: dict.comboOrderStatus as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'modifyTimeStart',
    label: '操作時間',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        placeholder: '起始'
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'modifyTimeEnd',
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
        return await getInOptionFormat('/sys/hospital', 'id', 'name')
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)

const dialogTitle = ref('')
const dialogWidth = ref('')

const delLoading = ref(false)

const delData = async (row: NotChargedTableData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

const actionType = ref('')

const AddAction = () => {
  push(`/cash/notcharged/add`)
}

const writeRef = ref<ComponentRef<typeof Write>>()

const action = (row: NotChargedTableData, type: string) => {
  dialogTitle.value = type === 'edit' ? '修改短信模板' : 'exampleDemo.detail'
  actionType.value = type
  tableObject.currentRow = row
  dialogVisible.value = true
}

const loading = ref(false)

const setValues = (value) => {
  const search = unref(searchRef)
  search?.setValues(value)
}

const search = () => {
  const search = unref(searchRef)
  search!.search()
}

const save = async () => {
  const write = unref(writeRef)
  await write?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await write?.getFormData()) as any
      const res = await saveTableApi(
        actionType.value === 'add'
          ? data
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
        ElMessage.success(res.msg as string)
        tableObject.currentPage = 1
        getList()
      }
    }
  })
}

const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.recipelAmount > 0) {
    return 'tr-success-row'
  }
  return ''
}

const settlement = (row: NotChargedTableData) => {
  // push({
  //   name: 'CashNotChargedAdd',
  //   params: {
  //     id: row.id,
  //     // wxId: row.wxId,
  //     memberId: row.memberId,
  //     memberInsurId: row.memberInsurId,
  //     isCache: row.isCache,
  //     ooClass: 'offline',
  //     // sheet: row.sheet,
  //     doctorName: row.doctorName,
  //     doctorId: row.doctorId
  //   }
  // })
}

onMounted(async () => {
  setStore('type', '/sys/dict/type/sms_tmp_type', 'code', 'value')
  await setValues({
    createTimeStart: getDateInFormat(new Date(), '-')
  })
  search()
})

const canMakeUp = (orderType) => {
  return (
    orderType !== 'buyCard' &&
    orderType !== 'recharge' &&
    orderType !== 'package' &&
    orderType !== 'specialist'
  )
}
</script>

<template>
  <ContentWrap>
    <Search
      :schema="allSchemas.searchSchema"
      :is-col="true"
      :inline="false"
      @search="setSearchParams"
      @reset="setSearchParams"
      ref="searchRef"
    />

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
      :row-class-name="tableRowClassName"
    >
      <template #action="{ row }">
        <ElLink type="primary" @click="settlement(row)" class="mr-5px">回訪</ElLink>
        <ElLink type="primary" @click="settlement(row)" class="mr-5px">訂單詳情</ElLink>
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth">
    <Write
      v-if="actionType !== 'detail'"
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

<style scoped>
.success-row {
  background: red;
}
</style>
