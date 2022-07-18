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

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/pharmacyCore/drug/drugThree'
import { NotChargedTableData } from '@/api/pharmacyCore/drug/drugThree/types'
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
  { label: '名稱', field: 'name', width: '60px' },
  { label: '編碼', field: 'id', width: '60px' },
  { label: '拼音碼', field: 'pinyinCode', width: '60px' },
  {
    label: '所屬藥典',
    field: 'theirPharmacopoeia',
    width: '60px',
    formatter: function (row) {
      if (row.theirPharmacopoeia === 'N') {
        return '北方藥典'
      } else if (row.theirPharmacopoeia === 'S') {
        return '南方藥典'
      } else {
        return '通用藥典'
      }
    }
  },
  {
    label: '類別',
    field: 'type',
    width: '60px',
    formatter: function (row) {
      if (row.type === 'ZCNY') {
        return '中成藥'
      }
      if (row.type === 'ZCY') {
        return '中草藥'
      }
      if (row.type === 'YNCP') {
        return '國貨產品'
      }
      if (row.type === 'YNZJ') {
        return '自有產品'
      }
    }
  },
  {
    label: '狀態',
    field: 'status',
    width: '60px',
    formatter: function (row) {
      if (row.status === 'N') {
        return '禁用'
      }
      if (row.status === 'Y') {
        return '啟用'
      }
    }
  },
  {
    label: '產地',
    field: 'areaid',
    width: '60px',
    formatter: function (row) {
      if (row.sysDict) {
        return row.sysDict.value || ''
      }
    }
  },
  { label: '規格', field: 'standard', width: '60px' },
  {
    label: '來源',
    field: 'source',
    width: '60px',
    formatter: function (row) {
      return inDict(row.source, 'drug.source')
    }
  },
  { label: '價格', field: 'price', width: '60px' },
  {
    label: '供應商',
    field: 'supplierId',
    width: '60px',
    formatter: function (row) {
      if (row.sysSupplier) {
        return row.sysSupplier.name || ''
      }
    }
  },
  { label: '創建人', field: 'createUser', width: '60px' },
  { label: '修改人', field: 'modifyUser', width: '60px' },
  { label: '創建時間', field: 'createTime', width: '120px' },
  { label: '更新時間', field: 'modifyTime', width: '60px' },

  // Search Schema
  genSearchSchema('input', 'name', '藥品名稱/拼音', { placeholder: '藥品名稱/拼音' }),
  genSearchSchema('sourceSelect', 'type', '所屬類別', {
    placeholder: '類別',
    options: dict.drugTypeList as any
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
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">新增藥典</ElButton>
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
        <div v-if="row.status === 'Y'">
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">編輯</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">禁用</ElLink>
        </div>
        <div v-else>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">編輯</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">啟用</ElLink>
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
