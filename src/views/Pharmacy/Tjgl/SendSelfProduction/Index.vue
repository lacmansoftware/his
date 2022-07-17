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

import {
  getTableListApi,
  delTableListApi,
  saveTableApi
} from '@/api/pharmacy/tjgl/sendselfproduction'
import { NotChargedTableData } from '@/api/pharmacy/tjgl/sendselfproduction/types'
import { dateCompare } from '@/utils/date'
import { genTableSchema, genSearchSchema } from '@/utils/schema'
import dict from '@/config/dictionary.json'

defineOptions({
  name: 'CashNotChargedIndex'
})

const props = defineProps({
  pageType: {
    type: String,
    default: ''
  }
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
    width: '150px',
    form: { show: false }
  },
  { label: '出貨門店', field: 'hospitalName' },
  { label: '藥房', field: 'pharmacyName' },
  {
    label: '備貨狀態',
    field: 'sendStatus',
    width: '60px',
    formatter: function (row) {
      if ('SEND' === row.sendStatus) {
        return '已備貨'
      } else {
        return '未備貨'
      }
    }
  },
  {
    label: '訂單來源',
    field: 'createFrom',
    width: '60px',
    formatter: function (row) {
      return inDict(row.createFrom, 'createFrom2')
    }
  },
  { label: '訂單編號', field: 'orderNo' },
  {
    label: '處方編號',
    field: 'reciId',
    formatter: function (row) {
      return row.reciId
    }
  },
  { label: '產品名稱', field: 'productName', width: '60px' },
  {
    label: '產品子類型',
    field: 'businessSubType',
    width: '60px',
    formatter: function (row) {
      return inDict(row.businessSubType, 'drugTypeList')
    }
  },
  {
    label: '劑型',
    field: 'dosageform',
    width: '60px',
    formatter: function (row) {
      return inDict(row.dosageform, 'dosageform')
    }
  },
  { label: '購買數量', field: 'totalNum', width: '60px' },
  {
    label: '退貨狀態',
    field: 'returnStatus',
    width: '60px',
    formatter: function (row) {
      var num = row.totalNum - row.returnAmount
      if (row.totalNum === num) {
        return '未退貨'
      } else if (0 === num) {
        return '全退'
      } else if (0 < num && num < row.totalNum) {
        return '部分退'
      }
      return '未退貨'
    }
  },
  { label: '退貨數量', field: 'returnAmount', width: '60px' },
  { label: '患者', field: 'memberName', width: '60px' },
  { label: '電話', field: 'memberMobile', width: '85px' },
  { label: '醫生', field: 'doctorName', width: '70px' },
  {
    label: '配送方式',
    field: 'expressType',
    width: '60px',
    formatter: function (row) {
      if (row.expressType === null) {
        return '自取'
      }
      return inDict(row.expressType, 'expressType')
    }
  },
  { label: '下單時間', field: 'createTime', width: '70px' },
  {
    label: '支付狀態',
    field: 'orderStatus',
    width: '70px',
    formatter: function (row) {
      return inDict(row.orderStatus, 'orderStatus')
    }
  },
  { label: '備貨人', field: 'sendUser', width: '70px' },
  { label: '備貨時間', field: 'sendTime', width: '70px' },

  // Search Schema
  genSearchSchema('apiSelect', 'hospitalId', '出貨門店', {
    placeholder: '選擇門店',
    api: async () => {
      return await getInOptionFormat('sys/hospital/hospitals', 'id', 'name')
    }
  }),
  genSearchSchema('input', 'orderNo', '訂單編號', { placeholder: '訂單編號' }),
  genSearchSchema('sourceSelect', 'createFrom', '訂單來源', {
    placeholder: '訂單來源',
    options: dict.createFrom2 as any
  }),
  genSearchSchema('apiSelect', 'pharmacyId', '藥房', {
    placeholder: '選擇藥房',
    api: async () => {
      return await getInOptionFormat('index/pharmacys', 'id', 'name')
    }
  }),
  genSearchSchema('input', 'doctorName', '醫生姓名', { placeholder: '醫生姓名' }),
  genSearchSchema('input', 'memberNameOrPhone', '患者姓名/手機', { placeholder: '患者姓名/手機' }),
  genSearchSchema('sourceSelect', 'dosageform', '劑型', {
    placeholder: '劑型',
    options: dict.dosageform as any
  }),
  genSearchSchema('sourceSelect', 'businessSubType', '產品子類型', {
    placeholder: '產品子類型',
    options: [{ value: 'ynzj', label: '自有產品' }] as any
  }),
  genSearchSchema('sourceSelect', 'expressType', '配送方式', {
    placeholder: '配送方式',
    options: dict.expressType as any
  }),
  genSearchSchema('datePicker', 'startDate', '下單時間', { placeholder: '下單時間' }),
  genSearchSchema('datePicker', 'endDate', '到', { placeholder: '下單時間' }),
  genSearchSchema('sourceSelect', 'sendStatus', '備貨狀態', {
    placeholder: '備貨狀態',
    options: dict.product.sendStatus as any
  }),
  genSearchSchema('sourceSelect', 'returnStatus', '退貨狀態', {
    placeholder: '退貨狀態',
    options: dict.product.returnStatus as any
  })
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
  if (row.createFrom === 'mobile') {
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
    startDate: getDateInFormat(new Date(), '-')
  })
  search()
  // const res = genSearchSchema('sourceSelect', 'createFrom', '訂單來源', {
  //   options: dict.product.promotionWay as any
  // })
  // console.log(res)
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
      :layout="'bottom'"
      :buttom-position="'right'"
      @search="setSearchParams"
      @reset="setSearchParams"
      ref="searchRef"
    />

    <div v-if="pageType !== 'approve'" class="mb-10px ml-10px mt-[-32px]">
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">全部備貨</ElButton>
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
      :row-class-name="tableRowClassName"
    >
      <template #action="{ row }">
        <ElLink
          v-if="row.sendStatus == 'WAITING'"
          type="primary"
          @click="settlement(row)"
          class="mr-5px"
          >備貨</ElLink
        >
        <ElLink type="primary" @click="settlement(row)" class="mr-5px">查看</ElLink>
        <ElLink type="primary" @click="settlement(row)" class="mr-5px">打印</ElLink>
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
