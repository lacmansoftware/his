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

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/product/inventory'
import { NotChargedTableData } from '@/api/product/inventory/types'
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
  type: ref<ComponentOptions[]>([]),
  merge: [{ value: 'Y', label: '合併庫存' }],
  expire: [{ value: 'Y', label: '只看過期' }],
  alert: [
    { value: 'GREATER', label: '高於' },
    { value: 'LESSER', label: '低於' },
    { value: 'NORMAL', label: '正常' }
  ]
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
    form: { show: false }
  },
  {
    label: '門店',
    field: 'hospitalName',
    width: '120px'
  },
  {
    label: '商品名稱',
    field: 'productName',
    width: '100px'
  },
  {
    label: '商品編碼',
    field: 'productId',
    width: '60px'
  },
  {
    label: '規格',
    field: 'standard',
    width: '60px'
  },
  {
    label: '批次號',
    field: 'batchId',
    width: '100px'
  },
  {
    label: '總量',
    field: 'totalQty',
    width: '60px'
  },
  {
    label: '當前量',
    field: 'currentQty',
    width: '60px'
  },
  {
    label: '零售價',
    field: 'sellingUnitPrice',
    width: '60px'
  },
  {
    label: '類別',
    field: 'productType',
    width: '60px',
    formatter: function (row) {
      return inDict(row.productType, 'product.type')
    }
  },
  {
    label: '供應商',
    field: 'supplier',
    width: '90px'
  },
  {
    label: '創建日期',
    field: 'createTime',
    width: '90px'
  },

  // Search Schema
  genSearchSchema('datePicker', 'queryStockInStartDate', '入庫日期', { placeholder: '入庫日期' }),
  genSearchSchema('datePicker', 'queryStockInEndDate', '到', { placeholder: '日期' }),
  genSearchSchema('datePicker', 'qeuryInvalidStartDate', '失效日期', { placeholder: '失效日期' }),
  genSearchSchema('datePicker', ' queryInvalidEndDate', '到', { placeholder: '日期' }),
  genSearchSchema('input', 'productCode', '產品名稱/拼音', { placeholder: '產品名稱/拼音' }),
  genSearchSchema('apiSelect', 'productType', '類型', {
    placeholder: '類型',
    api: async () => {
      return await getInOptionFormat('sys/dict/type/PRODUCT_TYPE', 'code', 'value')
    }
  }),
  genSearchSchema('apiSelect', 'productSubType', '子類型', {
    placeholder: '子類型',
    api: async () => {
      return await getInOptionFormat('sys/dict/type/PRODUCT_SUB_TYPE', 'code', 'value')
    }
  }),
  genSearchSchema('input', 'batchId', '批次號', { placeholder: '批次號' }),
  genSearchSchema('sourceSelect', 'queryInventoryAlert', '預警值', {
    placeholder: '預警值',
    options: store.alert as any
  }),
  genSearchSchema('checkbox', 'isExpired', '', {
    options: store.expire,
    value: [],
    labelWidth: true
  }),
  genSearchSchema('checkbox', 'isMerge', '', { options: store.merge, value: [], labelWidth: true })
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
    startTime: getDateInFormat(new Date(), '-')
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
      <!-- <ElButton type="primary" @click="AddAction" :icon="plusIcon">購買產品</ElButton> -->
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
        <div class="flex">
          <div v-if="row.isMerge === 'Y'">
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">查看庫存記錄</ElLink>
          </div>
          <div v-else>
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">查看庫存記錄</ElLink>
          </div>
          <div v-if="row.status === 'Y'">
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">禁用</ElLink>
          </div>
          <div v-else>
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">啟用</ElLink>
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
