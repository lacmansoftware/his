<script setup lang="ts">
import { reactive, ref, unref, onMounted, h, PropType } from 'vue'
import { ElButton, ElLink, ElMessage, ElTag } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { NotChargedTableData } from '@/api/sys/user/types'
import { propTypes } from '@/utils/propTypes'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useCache } from '@/hooks/web/useCache'
import { getApi } from '@/api/common'

defineOptions({
  name: 'CashNotChargedIndex'
})

const props = defineProps({
  url: propTypes.string.def(''),
  crudSchemas: {
    type: Array as PropType<Array<CrudSchema>>,
    default: () => []
  },
  title: propTypes.string.def('')
})

const appStore = useAppStoreWithOut()
const { wsCache } = useCache()

const getCustomTableListApi = (params: any) => {
  const userInfo = wsCache.get(appStore.getUserInfo)
  params.hospitalId = userInfo.hospitalId
  return getApi(props.url, params)
}

const { register, tableObject, methods } = useTable<NotChargedTableData>({
  getListApi: getCustomTableListApi,
  response: {
    list: 'data',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

const crudSchemas = reactive<CrudSchema[]>(props.crudSchemas)

const { allSchemas } = useCrudSchemas(crudSchemas)

const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  return ''
}
</script>

<template>
  <ContentWrap :title="title">
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
