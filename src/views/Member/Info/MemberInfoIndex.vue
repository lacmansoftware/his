<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElTag } from 'element-plus'
import { Table } from '@/components/Table'
import { getTableListApi, delTableListApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { h, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'

defineOptions({
  name: 'MemberInfoIndex'
})

const { push } = useRouter()

const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getTableListApi,
  delListApi: delTableListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action',
    width: '120px'
  },
  {
    label: '姓名',
    field: 'memberName',
    width: '120px',
    search: {
      show: true
    },
    placeholder: '請填寫'
  },
  {
    label: '手機號碼',
    field: 'mobile',
    width: '135px',
    search: {
      show: true
    },
    placeholder: '請填寫'
  },
  {
    label: '性別',
    field: 'gender',
    width: '85px'
  },
  // {
  //   label: '年齡',
  //   field: 'birthday',
  //   width: '60px'
  // },
  {
    label: '生日',
    field: 'birthday',
    width: '125px'
  },
  {
    label: '檔案號',
    field: 'archivesNo',
    width: '60px',
    search: {
      show: true
    },
    placeholder: '請填寫'
  },
  {
    label: '檔案存放地',
    field: 'profileLocationName',
    width: '125px',
    search: {
      show: true
    },
    placeholder: '請選擇'
  },
  {
    label: '證件類型',
    field: 'identityTypeName',
    width: '60px',
    search: {
      show: true
    },
    placeholder: '請選擇'
  },
  {
    label: '證件號碼',
    field: 'identityCode',
    width: '100px',
    search: {
      show: true
    },
    placeholder: '請填寫'
  },
  {
    label: '會員級別',
    field: 'levelName',
    width: '100px',
    search: {
      show: true
    },
    placeholder: '請選擇'
  },
  {
    label: '會員卡狀態',
    field: 'cardStatus',
    width: '100px',
    search: {
      show: true
    },
    placeholder: '請選擇'
  },
  {
    label: '會員卡號',
    field: 'cardNum',
    width: '100px',
    search: {
      show: true
    },
    placeholder: '請填寫會員卡號'
  },
  {
    label: '卡內餘額',
    field: 'balance',
    width: '100px'
  },
  {
    label: '辦卡時間',
    field: 'cardCreateTime',
    width: '100px'
  },
  {
    label: '創建人',
    field: 'createUser',
    width: '100px'
  },
  {
    label: '創建門店',
    field: 'createHospital',
    width: '100px'
  },
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const AddAction = () => {
  push('/example/example-add')
}

const delLoading = ref(false)

const delData = async (row: TableData | null, multiple: boolean) => {
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

const action = (row: TableData, type: string) => {
  push(`/example/example-${type}?id=${row.id}`)
}
</script>

<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</ElButton>
      <ElButton :loading="delLoading" type="danger" @click="delData(null, true)">
        {{ t('exampleDemo.del') }}
      </ElButton>
    </div>

    <Table v-model:pageSize="tableObject.pageSize" v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns" :data="tableObject.tableList" :loading="tableObject.loading" :pagination="{
        total: tableObject.total
      }" @register="register">
      <template #action="{ row }">
        <!-- <ElButton type="primary" @click="action(row, 'edit')">
          {{ t('exampleDemo.edit') }}
        </ElButton>
        <ElButton type="success" @click="action(row, 'detail')">
          {{ t('exampleDemo.detail') }}
        </ElButton>
        <ElButton type="danger" @click="delData(row, false)">
          {{ t('exampleDemo.del') }}
        </ElButton> -->
      </template>
    </Table>
  </ContentWrap>
</template>
