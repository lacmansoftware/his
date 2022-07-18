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

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/pharmacy/inventory/inventory'
import { NotChargedTableData } from '@/api/pharmacy/inventory/inventory/types'
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
    width: '250px',
    form: { show: false }
  },
  { label: '藥房', field: 'pharmacyName', width: '120px' },
  { label: '藥品名稱', field: 'drugName', width: '100px' },
  {
    label: '狀態',
    field: 'status',
    width: '60px',
    formatter: function (row) {
      return inDict(row.status, 'status')
    }
  },
  { label: '藥品編碼', field: 'drugId', width: '60px' },
  { label: '批次號', field: 'batchId', width: '100px' },
  { label: '總量', field: 'totalQty', width: '60px' },
  {
    label: '當前量',
    field: 'currentQty',
    width: '60px',
    formatter: function (row) {
      return row.currentQty
    }
  },
  {
    label: '零售價',
    width: '60px',
    formatter: function (row) {
      if (row.pharmacyId === 'YFshyf-keliji' || row.pharmacyId === 'keliji') {
        return row.sellingUnitPriceOrigin
      } else {
        return row.sellingUnitPrice
      }
    }
  },
  { label: '供應商', field: 'supplier', width: '90px' },
  {
    label: '類別',
    field: 'drugType',
    width: '60px',
    formatter: function (row) {
      return inDict(row.drugType, 'pharmacy.drugType')
    }
  },
  { label: '劑型', field: 'dosagform', width: '60px' },
  { label: '創建日期', field: 'createTime', width: '90px' },

  // Search Schema
  genSearchSchema('datePicker', 'queryStockInStartDate', '入庫日期', { placeholder: '入庫日期' }),
  genSearchSchema('datePicker', 'queryStockInEndDate', '到', { placeholder: '日期' }),
  genSearchSchema('datePicker', 'qeuryInvalidStartDate', '失效日期', { placeholder: '失效日期' }),
  genSearchSchema('datePicker', 'queryInvalidEndDate', '到', { placeholder: '日期' }),
  genSearchSchema('checkbox', 'isExpired', '', {
    labelWidth: true,
    options: [{ value: 'Y', label: '只看過期' }],
    value: []
  }),
  genSearchSchema('checkbox', 'isMerge', '', {
    labelWidth: true,
    options: [{ value: 'Y', label: '合併庫存' }],
    value: []
  }),
  genSearchSchema('input', 'drugCode', '藥品名稱/拼音', { placeholder: '藥品名稱/拼音' }),
  genSearchSchema('sourceSelect', 'drugType', '類型', {
    placeholder: '類型',
    options: dict.pharmacy.drugType as any
  }),
  genSearchSchema('input', 'batchId', '批次號', { placeholder: '批次號' }),
  genSearchSchema('sourceSelect', 'queryInventoryAlert', '預警值', {
    placeholder: '預警值',
    options: dict.alert as any
  }),
  genSearchSchema('sourceSelect', 'status', '狀態', {
    placeholder: '請選擇',
    options: dict.inventoryStatus as any
  }),
  genSearchSchema('sourceSelect', 'inventoryQtySort', '當前量', {
    placeholder: '請選擇',
    options: dict.inventoryQtySort as any
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
  if (null !== row.minAlertQty) {
    if (row.currentQty <= row.minAlertQty) {
      return 'tr-success-row'
    } else if (row.currentQty >= row.maxAlertQty) {
      return 'tr-danger-row'
    }
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
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">導出</ElButton>
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
        <div v-if="'T' === row.status">
          <div v-if="row.childSize > 0">
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">修改</ElLink>
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">提交中心</ElLink>
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">刪除</ElLink>
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">取消合併</ElLink>
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">子請貨單</ElLink>
          </div>
          <div v-else>
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">修改</ElLink>
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">提交中心</ElLink>
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">刪除</ElLink>
          </div>
        </div>
        <div v-else>
          <div v-if="row.childSize > 0">
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">查看</ElLink>
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">子請貨單</ElLink>
          </div>
          <div v-else>
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">查看</ElLink>
          </div>
        </div>
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
