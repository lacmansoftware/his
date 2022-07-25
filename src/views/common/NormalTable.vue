<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { TableData } from '@/api/table/types'
import { ref, h, reactive, unref, PropType, onMounted } from 'vue'
import { ElTag, ElButton } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { propTypes } from '@/utils/propTypes'
import { getApi } from '@/api/common'

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  url: propTypes.string.def(''),
  columns: {
    type: Array as PropType<Array<TableColumn>>,
    default: () => []
  }
})

const getTableListApi = (params: any) => {
  return getApi(props.url, params)
}

const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getTableListApi,
  response: {
    list: 'data',
    total: 'total'
  }
})

onMounted(() => console.log(props.url))

const { getList } = methods

getList()

const { t } = useI18n()

const columns = reactive<TableColumn[]>(props.columns)
</script>

<template>
  <Table
    v-model:pageSize="tableObject.pageSize"
    v-model:currentPage="tableObject.currentPage"
    :columns="columns"
    :data="tableObject.tableList"
    :loading="tableObject.loading"
    :pagination="{
      total: tableObject.total
    }"
    @register="register"
  >
    <!-- <template #action="data">
      <ElButton type="primary" @click="acitonFn(data as TableSlotDefault)">
        {{ t('tableDemo.action') }}
      </ElButton>
    </template> -->

    <!-- <template #expand="data">
      <div class="ml-30px">
        <div>{{ t('tableDemo.title') }}：{{ data.row.title }}</div>
        <div>{{ t('tableDemo.author') }}：{{ data.row.author }}</div>
        <div>{{ t('tableDemo.displayTime') }}：{{ data.row.display_time }}</div>
      </div>
    </template> -->
  </Table>
</template>
