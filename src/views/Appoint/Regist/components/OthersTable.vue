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
import { inDict, getInOptionFormat, getDateInFormat, getAgeByBirthday } from '@/utils/common'
import { plusIcon } from '@/utils/iconList'
import Write from '@/views/Cash/NotCharged/components/Write.vue'

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/appoint/regist/registered'
import { NotChargedTableData } from '@/api/appoint/regist/registered/types'
import { dateCompare } from '@/utils/date'
import dict from '@/config/dictionary.json'
import { genSearchSchema } from '@/utils/schema'

defineOptions({
  name: 'CashNotChargedIndex'
})

const searchRef = ref<ComponentRef<typeof Search>>()

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
  { label: '套餐名稱', field: 'packageName' },

  // Search Schema
  genSearchSchema('input', 'mobile', '請輸入手機號碼：', {
    placeholder: '他人電話號碼',
    labelWidth: '150px',
    span: 12
  })
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const search = () => {
  const search = unref(searchRef)
  search!.search()
}

const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  // if (row.paymentStatus === 'PAYED') {
  //   return 'tr-danger-row'
  // }
  return ''
}

onMounted(async () => {
  search()
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
