<script setup lang="ts">
import { reactive, ref, PropType, onMounted } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { AppointRegisteredTableData } from '@/api/appoint/regist/registered/types'
import { getApi } from '@/api/common'
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  url: propTypes.string.def(''),
  schema: {
    type: Array as PropType<Array<CrudSchema>>,
    default: () => []
  }
})

const searchRef = ref<ComponentRef<typeof Search>>()

const getTableListApi = (params: any) => {
  return getApi(props.url, params)
}

const { register, tableObject, methods } = useTable<AppointRegisteredTableData>({
  getListApi: getTableListApi,
  response: {
    list: 'data',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

const crudSchemas = reactive<CrudSchema[]>(props.schema)

const { allSchemas } = useCrudSchemas(crudSchemas)

const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  return ''
}

defineExpose({
  methods
})
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
    />
  </ContentWrap>
</template>
