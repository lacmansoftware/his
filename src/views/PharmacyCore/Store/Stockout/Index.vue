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

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/pharmacyCore/store/stockout'
import { NotChargedTableData } from '@/api/pharmacyCore/store/stockout/types'
import { dateCompare } from '@/utils/date'
import { genTableSchema, genSearchSchema } from '@/utils/schema'
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
    field: 'action'
  },
  { label: '出庫單編號', field: 'id', width: '110px' },
  { label: '藥房', field: 'pharmacyName', width: '100px' },
  { label: '供應商', field: 'supplier', width: '100px' },
  {
    label: '狀態',
    field: 'status',
    width: '55px',
    formatter: function (row) {
      return inDict(row.status, 'pharmacy.stockoutStatus')
    }
  },
  { label: '創建人', field: 'createUser', width: '55px' },
  { label: '創建日期', field: 'createTime', width: '90px' },
  { label: '審核人', field: 'approver', width: '55px' },
  { label: '審核時間', field: 'approveTime', width: '90px' },
  { label: '藥房調撥時間', field: 'transferTime', width: '90px' },
  { label: '出庫備註', field: 'remark', width: '90px' },
  { label: '藥房調撥備註', field: 'transferRemark', width: '90px' },

  // Search Schema
  genSearchSchema('input', 'id', '出庫單號', { placeholder: '出庫單號' }),
  genSearchSchema('input', 'stockInId', '入庫單號', { placeholder: '入庫單號' }),
  genSearchSchema('sourceSelect', 'status', '狀態', {
    placeholder: '狀態',
    options: dict.pharmacy.stockoutStatus as any
  }),
  genSearchSchema('apiSelect', 'pharmacyId', '藥房', {
    placeholder: '請選擇',
    api: async () => {
      return await getInOptionFormat('pharmacy/info', 'id', 'name')
    }
  }),
  genSearchSchema('apiSelect', 'supplierId', '供應商', {
    placeholder: '請選擇',
    api: async () => {
      return await getInOptionFormat('sys/supplier', 'id', 'name')
    }
  }),
  genSearchSchema('datePicker', 'startDate', '日期', { placeholder: '日期' }),
  genSearchSchema('datePicker', 'endDate', '到', { placeholder: '日期' }),
  genSearchSchema('input', 'drugName', '藥品', { placeholder: '藥品' }),
  genSearchSchema('radio', 'isMake', '是否製作產品', {
    placeholder: '狀態',
    options: dict.isMakeProduct as any
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

    <div class="mb-10px ml-10px mt-[-32px]">
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">導出</ElButton>
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">新增</ElButton>
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
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">修改</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">提交審核</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">刪除</ElLink>
        </div>
        <div v-else-if="row.status === 'W'">
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">審核</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">查看</ElLink>
        </div>
        <div v-else-if="row.status === 'L'">
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">撤銷</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">查看</ElLink>
        </div>
        <div v-else>
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
