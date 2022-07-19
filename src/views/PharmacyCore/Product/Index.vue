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

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/product'
import { NotChargedTableData } from '@/api/product/types'
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
    width: '150px',
    form: { show: false }
  },
  {
    label: '產品名稱',
    field: 'name'
  },
  {
    label: '產品編碼',
    field: 'id'
  },
  {
    label: '拼音碼',
    field: 'quanpin'
  },
  {
    label: '產品類型',
    field: 'type',
    formatter: function (row) {
      return inDict(row.type, 'product.type')
    }
  },
  {
    label: '產品子類型',
    field: 'subType',
    formatter: function (row) {
      return inDict(row.subType, 'product.subType')
    }
  },
  {
    label: '是否預售',
    field: 'isPresell',
    formatter: function (row) {
      return inDict(row.isPresell, 'display')
    }
  },
  {
    label: '產品種類',
    field: 'kind',
    formatter: function (row) {
      return row.kind
        .split(',')
        .map(function (t) {
          return inDict(t, 'product.kind')
        })
        .join(',')
    }
  },
  {
    label: '審核狀態',
    field: 'approveStatus',
    formatter: function (row) {
      return inDict(row.approveStatus, 'product.approveStatus')
    }
  },
  {
    label: '審核意見',
    field: 'approveRemark'
  },
  {
    label: '使用狀態',
    field: 'status',
    formatter: function (row) {
      return inDict(row.status, 'product.status')
    }
  },
  {
    label: '毛利分類',
    field: 'epType'
  },
  {
    label: '創建時間',
    field: 'createTime'
  },
  {
    label: '創建人',
    field: 'createUser'
  },
  {
    label: '最後修改時間',
    field: 'modifyTime',
    width: '80px'
  },
  {
    label: '修改人',
    field: 'modifyUser'
  },

  // Search Schema
  {
    field: 'name',
    label: '產品名稱',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '產品名稱'
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'type',
    label: '產品類型',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        placeholder: '訂單類型',
        options: dict.product.type as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'subType',
    label: '產品子類型',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        placeholder: '訂單類型',
        options: dict.product.subType as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'isPresell',
    label: '是否可以預售',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        placeholder: '訂單類型',
        options: dict.display as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'approveStatus',
    label: '審核狀態',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        placeholder: '訂單類型',
        options: dict.product.approveStatus as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'status',
    label: '使用狀態',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        placeholder: '訂單類型',
        options: dict.product.status as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'hospitalId',
    label: '使用門店',
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
  },
  {
    field: 'isReqProduct',
    label: '創建時間',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        placeholder: '訂單類型',
        options: dict.product.isReqProduct as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'createDate',
    label: '創建時間',
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
      :layout="'bottom'"
      :buttom-position="'right'"
      @search="setSearchParams"
      @reset="setSearchParams"
      ref="searchRef"
    />

    <div class="mb-10px ml-10px mt-[-32px]">
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">新增</ElButton>
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">批量操作</ElButton>
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">提交</ElButton>
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">審核</ElButton>
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">刪除</ElButton>
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">停用</ElButton>
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">啟用</ElButton>
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
        <div v-if="row.approveStatus === 'DTJ' || row.approveStatus === 'YBH'">
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">編輯</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">查看</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">刪除</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">提交</ElLink>
        </div>
        <div v-else-if="row.approveStatus === 'YTJ'">
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">編輯</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">查看</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">撤回</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">審核</ElLink>
        </div>
        <div v-else-if="row.approveStatus === 'YSH'">
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">編輯</ElLink>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">查看</ElLink>
          <ElLink v-if="row.status === 'N'" type="primary" @click="settlement(row)" class="mr-5px"
            >啟用</ElLink
          >
          <ElLink v-else type="primary" @click="settlement(row)" class="mr-5px">停用</ElLink>
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
