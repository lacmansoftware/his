<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElTag, ElLink, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { reactive, ref, unref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { inDict, getAgeByBirthday, getPinyinCode, getInOptionFormat } from '@/utils/common'
import { printerIcon } from '@/utils/iconList'
import { searchConfig, crudConfig } from './index'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import dict from '@/config/dictionary.json'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getApi } from '@/api/common'

import { getTableListApi } from '@/api/workorder/workorder'
import { MemberInfoTableData } from '@/api/workorder/workorder/types'

defineOptions({
  name: 'WorkOrderIndex'
})

const dictStore = useDictStoreWithOut()
const my = ref(false)
const notComplate = ref(false)

const store = {
  feePayHospitalId: ref<ComponentOptions[]>([]),
  type: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

onMounted(() => {
  // setStore('certificate', '/sys/dict/type/MEMBER_Certificate', 'code', 'value')
  setStore('feePayHospitalId', '/sys/hospital', 'id', 'name')
  setStore('type', '/sys/dict/query/WORKORDER_Type', 'code', 'value')

  search()
})

const { push } = useRouter()

const { register, tableObject, methods } = useTable<MemberInfoTableData>({
  getListApi: getTableListApi,
  response: {
    list: 'data',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

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
      value: '2022-07-06',
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
      value: '2022-07-06',
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
        options: store.type
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
      value: my
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
      value: notComplate
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const printAction = async (row: TableData) => {
  // const res = await getPrintApi(row.id)
  // if (res.success) {
  //   ElMessage.success(res.msg)
  // }
}

const loading = ref(false)
const searchRef = ref<ComponentRef<typeof Search>>()

const setValues = (value: object) => {
  const search = unref(searchRef)
  search?.setValues(value)
}

const search = () => {
  const search = unref(searchRef)
  search.search()
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
    >
      <template #action="{ row }">
        <ElLink type="primary" @click="printAction(row)">受理</ElLink>
        <ElLink type="danger" @click="printAction(row)">刪除</ElLink>
      </template>

      <template #status="{ row }">
        {{ inDict(row.status, 'member.workOrderStatus') }}
      </template>
    </Table>
  </ContentWrap>
</template>

<style lang="less" scoped>
.el-input__wrapper {
  width: 100%;
}
</style>
