<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
// import { useI18n } from '@/hooks/web/useI18n'
import { ElLink, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { getTableListApi, getPrintApi } from '@/api/protocol'
import { useTable } from '@/hooks/web/useTable'
import { MemberProtocolTableData } from '@/api/protocol/types'
import { reactive, ref, onMounted } from 'vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { inDict } from '@/utils/common'
import { printerIcon } from '@/utils/iconList'
import dict from '@/config/dictionary.json'
// import { useDictStoreWithOut } from '@/store/modules/dict'
import { getInOptionFormat } from '@/utils/common'

defineOptions({
  name: 'MemberProtocolManagement'
})

// const dictStore = useDictStoreWithOut()

const store = {
  feePayHospitalId: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

onMounted(() => {
  // setStore('certificate', '/sys/dict/type/MEMBER_Certificate', 'code', 'value')
  setStore('feePayHospitalId', '/sys/hospital', 'id', 'name')
})

const { register, tableObject, methods } = useTable<MemberProtocolTableData>({
  getListApi: getTableListApi,
  response: {
    list: 'data',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

// const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action',
    width: '120px',
    form: { show: false }
  },
  {
    label: '繳費門店',
    field: 'feePayHospitalName',
    width: '120px'
  },
  {
    label: '繳費時間',
    field: 'feePayTime',
    width: '135px'
  },
  {
    label: '會員卡號',
    field: 'memberCardNum',
    width: '85px'
  },
  {
    label: '繳費門店',
    field: 'feePayHospitalId',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        options: store.feePayHospitalId.value
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '會員繳費日期',
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
    label: '到',
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
    label: '會員卡號',
    field: 'memberCardNum',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Input',
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '狀態',
    field: 'status',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        options: dict.memberProtocol.status
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '姓名',
    field: 'memberName',
    form: { show: false },
    search: {
      component: 'Input',
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '檔案號',
    field: 'archivesNo',
    form: { show: false },
    search: {
      component: 'Input',
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '手機',
    field: 'memberMobile',
    form: { show: false },
    search: {
      component: 'Input',
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '協議編號',
    field: 'protocolCode',
    form: { show: false },
    search: {
      component: 'Input',
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '狀態',
    field: 'status',
    width: '60px'
  },
  {
    label: '簽署途徑',
    field: 'signType',
    width: '100px'
  },
  {
    label: '協議簽署時間',
    field: 'signTime',
    width: '100px'
  },
  {
    label: '協議簽署門店',
    field: 'protocalHospitalName',
    width: '100px'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const printAction = async (row: MemberProtocolTableData) => {
  const res = await getPrintApi(row.id)
  if (res.success) {
    ElMessage.success(res.msg as string)
  }
}

// const loading = ref(false)
</script>

<template>
  <ContentWrap>
    <Search
      :schema="allSchemas.searchSchema"
      :is-col="true"
      :inline="false"
      @search="setSearchParams"
      @reset="setSearchParams"
    />

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
        <ElLink type="primary" @click="printAction(row)" :icon="printerIcon" class="flex gap-1"
          >打印簽訂</ElLink
        >
      </template>

      <template #status="{ row }">
        {{ inDict(row.status, 'memberProtocol.status') }}
      </template>
    </Table>
  </ContentWrap>
</template>

<style lang="less" scoped>
.el-input__wrapper {
  width: 100%;
}
</style>
