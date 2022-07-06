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
import { inDict, getAgeByBirthday } from '@/utils/common'
import { printerIcon } from '@/utils/iconList'
import { searchConfig, crudConfig } from './index'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import dict from '@/config/dictionary.json'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getPinyinCode, getInOptionFormat } from '@/utils/common'

import { getTableListApi, getPrintApi } from '@/api/workorder/sms'
import { SMSSendData } from '@/api/workorder/sms/types'

defineOptions({
  name: 'SMSSendIndex'
})

const dictStore = useDictStoreWithOut()

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

const { push } = useRouter()

const { register, tableObject, methods } = useTable<SMSSendData>({
  getListApi: getTableListApi,
  response: {
    list: 'data',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action',
    form: { show: false }
  },
  {
    label: '發信人',
    field: 'name'
  },
  {
    label: '接收號碼',
    field: 'mobile'
  },
  {
    label: '發送時間',
    field: 'sendDate'
  },
  {
    label: '發送結果',
    field: 'status'
  },
  {
    label: '失敗原因',
    field: 'comment'
  },
  {
    label: '信息內容',
    field: 'content'
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
