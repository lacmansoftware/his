<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElLink } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { reactive, ref, unref, onMounted } from 'vue'
// import { useRouter } from 'vue-router'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { inDict, getInOptionFormat, getDateInFormat } from '@/utils/common'
import Write from './components/Write.vue'
import dict from '@/config/dictionary.json'
import { getApi } from '@/api/common'

import { getTableListApi, delTableListApi, updateTableApi } from '@/api/workorder/workorder'

defineOptions({
  name: 'WorkOrderIndex'
})

const my = ref(false)
const notComplate = ref(false)
const writeRef = ref<ComponentRef<typeof Write>>()

const store = {
  feePayHospitalId: ref<ComponentOptions[]>([]),
  type: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

onMounted(async () => {
  // setStore('certificate', '/sys/dict/type/MEMBER_Certificate', 'code', 'value')
  setStore('feePayHospitalId', '/sys/hospital', 'id', 'name')
  setStore('type', '/sys/dict/query/WORKORDER_Type', 'code', 'value')

  const today = getDateInFormat(new Date(), '-')
  setValues({
    startTime: today,
    endTime: today
  })
  search()
})

const { register, tableObject, methods } = useTable<any>({
  getListApi: getTableListApi,
  delListApi: delTableListApi,
  response: {
    list: 'data',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

const { t } = useI18n()

const handleStatusChange = (item: Recordable) => {
  search()
}

const userIdSearch = async (queryString: string, cb: Fn) => {
  const res = await getApi(`/sys/user?keyWords=${queryString}`)
  const result = res?.data.map((item) => ({
    id: item.id,
    value: item.name
  }))
  cb(result)
}

const deptIdSearch = async (queryString: string, cb: Fn) => {
  const res = await getApi(`/sys/dept/list?keyWords=${queryString}`)
  const result = res?.data.map((item) => ({
    id: item.id,
    value: item.name
  }))
  cb(result)
}

const handleUserIdSelect = (item: Recordable) => {
  console.log(item)
}

const handleDeptIdSelect = (item: Recordable) => {
  console.log(item)
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action'
  },
  {
    label: '服務狀態',
    field: 'status',
    form: { show: false },
    search: {
      component: 'Radio',
      componentProps: {
        style: 'width: 100%',
        options: dict.member.workOrderStatus,
        onChange: handleStatusChange
      },
      colProps: { span: 24 },
      value: 'nothand',
      show: true
    }
  },
  {
    label: '工單號',
    field: 'id',
    form: { show: false },
    search: {
      component: 'Input',
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '客戶姓名',
    field: 'name',
    search: {
      component: 'Input',
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '客戶電話',
    field: 'mobile',
    form: { show: false },
    search: {
      component: 'Input',
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '處理時間',
    field: 'modifyTime'
  },
  {
    label: '轉交類型',
    field: 'transferType'
  },
  {
    label: '轉交人',
    field: 'transferName'
  },
  {
    label: '受理人',
    field: 'handlerName'
  },
  {
    label: '結束時間',
    field: 'latestHandleTime'
  },
  {
    label: '工單類型',
    field: 'typeName'
  },
  {
    label: '備註',
    field: 'comment',
    form: { show: false },
    search: {
      component: 'Input',
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '處理時間',
    field: 'startTime',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'DatePicker',
      componentProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD'
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '處理時間',
    field: 'endTime',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'DatePicker',
      componentProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD'
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '工單類型',
    field: 'type',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        options: store.type as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '轉交人',
    field: 'userId',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Autocomplete',
      componentProps: {
        style: { width: '100%' },
        fetchSuggestions: userIdSearch,
        onSelect: handleUserIdSelect
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '部門',
    field: 'deptId',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Autocomplete',
      componentProps: {
        style: { width: '100%' },
        fetchSuggestions: deptIdSearch,
        onSelect: handleDeptIdSelect
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'my',
    label: '',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Hidden',
      colProps: { span: 0 },
      value: my as any
    }
  },
  {
    field: 'notComplate',
    label: '',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Hidden',
      colProps: { span: 0 },
      value: notComplate as any
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const delLoading = ref(false)

const delData = async (row: any | null) => {
  tableObject.currentRow = row
  const { delList } = methods
  // const selections = await getSelections()
  delLoading.value = true
  await delList([row.id], false).finally(() => {
    delLoading.value = false
  })
}

const dialogVisible = ref(false)
const dialogTitle = ref('')
const actionType = ref('')

const action = (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  tableObject.currentRow = row
  dialogVisible.value = true
}

const loading = ref(false)
const searchRef = ref<ComponentRef<typeof Search>>()

const setValues = (value: object) => {
  const search = unref(searchRef)
  search?.setValues(value)
}

const search = () => {
  const search = unref(searchRef)
  search!.search()
}

const myOrder = () => {
  my.value = !my.value
  console.log(my.value)

  search()
}

const notComplateOrder = () => {
  notComplate.value = !notComplate.value
  search()
}

const save = async () => {
  const write = unref(writeRef)
  await write?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await write?.getFormData()) as any
      const res = await updateTableApi({
        workOrderId: data?.id,
        status: data?.status,
        transferType: data?.transferType,
        transferId: data?.transferId,
        transferName: data?.transferName,
        note: data?.comment,
        type: data?.type
      })
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      if (res) {
        dialogVisible.value = false
        tableObject.currentPage = 1
        getList()
      }
    }
  })
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

    <div class="mb-10px text-right relative">
      <ElButton type="primary" class="absolute bottom-4 right-38" @click="myOrder"
        >我的工單</ElButton
      >
      <ElButton type="success" class="absolute bottom-4 right-8" @click="notComplateOrder"
        >未完成工單</ElButton
      >
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
      :selection="false"
    >
      <template #action="{ row }">
        <ElLink type="primary" @click="action(row, 'edit')">受理</ElLink>
        <ElLink :loading="delLoading" type="danger" @click="delData(row)">刪除</ElLink>
      </template>

      <template #status="{ row }">
        {{ inDict(row.status, 'member.workOrderStatus') }}
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" width="90%">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="tableObject.currentRow"
      :is-edit="true"
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
.el-input__wrapper {
  width: 100%;
}
</style>
