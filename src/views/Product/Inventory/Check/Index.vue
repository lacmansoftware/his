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

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/product/inventory/check'
import { NotChargedTableData } from '@/api/product/inventory/check/types'
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
    width: '200px',
    form: { show: false }
  },
  {
    label: '盤庫單編號',
    field: 'id'
  },
  {
    label: '狀態',
    field: 'status',
    formatter: function (row) {
      return inDict(row.status, 'pharmacy.stockinStatus')
    }
  },
  {
    label: '創建日期',
    field: 'createTime'
  },
  {
    label: '創建人',
    field: 'createUser'
  },
  {
    label: '審核時間',
    field: 'approveTime'
  },
  {
    label: '審核人',
    field: 'approver'
  },
  {
    label: '盤庫類型',
    field: 'checkType',
    formatter: function (row) {
      if ('A' === row.checkType) {
        return '全盤'
      } else {
        return '普通盤庫'
      }
    }
  },
  {
    label: '是否合併庫存',
    field: 'isMergedBatch',
    formatter: function (row) {
      if ('Y' === row.isMergedBatch) {
        return '是'
      } else {
        return '否'
      }
    }
  },

  // Search Schema
  genSearchSchema('datePicker', 'approveStartTm', '審核日期', { placeholder: '審核日期' }),
  genSearchSchema('datePicker', 'approveEndTm', '到', { placeholder: '日期' }),
  genSearchSchema('sourceSelect', 'status', '狀態', {
    placeholder: '狀態',
    options: dict.pharmacy.stockinStatus as any
  }),
  genSearchSchema('input', 'productKeywords', '商品', { placeholder: '商品' }),
  genSearchSchema('datePicker', 'startTm', '創建日期', { placeholder: '創建日期' }),
  genSearchSchema('datePicker', 'endTm', '到', { placeholder: '日期' }),
  genSearchSchema('input', 'id', '盤庫單編號', { placeholder: '盤庫單編號' })
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
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">新增</ElButton>
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
        <div v-if="row.status === 'T'">
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">導出明細</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">提交</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">修改</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">導入</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">查看</ElLink>
        </div>
        <div v-else-if="row.status === 'W'">
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">導出明細</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">審核</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">查看</ElLink>
        </div>
        <div v-else-if="row.status === 'P'">
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">導出明細</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">查看</ElLink>
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
