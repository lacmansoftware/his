<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
// import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { reactive, ref, onMounted } from 'vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getInOptionFormat } from '@/utils/common'

import { getTableListApi } from '@/api/workorder/sms/reply'

defineOptions({
  name: 'SMSReplyIndex'
})

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

const { register, tableObject, methods } = useTable<any>({
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
    label: '消息ID',
    field: 'msgId',
    width: '200px'
  },
  {
    label: '手機',
    field: 'mobile',
    width: '150px',
    form: { show: false },
    search: {
      component: 'Input',
      colProps: { span: 12 },
      show: true
    }
  },
  {
    label: '回復內容',
    field: 'content'
  },
  {
    label: '回復時間',
    field: 'createTime',
    width: '200px'
  },
  {
    label: '回復時間段',
    field: 'startCreateTime',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'DatePicker',
      componentProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        placeholder: '搜素起始日期'
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '至',
    field: 'endCreateTime',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'DatePicker',
      componentProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        placeholder: '搜索結束日期'
      },
      colProps: { span: 6 },
      show: true
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

// const loading = ref(false)
</script>

<template>
  <ContentWrap>
    <Search
      :schema="allSchemas.searchSchema"
      :is-col="true"
      :inline="false"
      layout="bottom"
      buttom-position="right"
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
      :selection="false"
    />
  </ContentWrap>
</template>

<style lang="less" scoped>
.el-input__wrapper {
  width: 100%;
}
</style>
