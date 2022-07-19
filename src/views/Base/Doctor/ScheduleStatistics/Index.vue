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

import {
  getTableListApi,
  delTableListApi,
  saveTableApi
} from '@/api/base/doctor/scheduleStatistics'
import { NotChargedTableData } from '@/api/base/doctor/scheduleStatistics/types'
import { dateCompare } from '@/utils/date'
import { genTableSchema, genSearchSchema } from '@/utils/schema'
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

getList()

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action',
    width: '150px'
  },
  { label: '大夫', field: 'doctorName' },
  { label: '待協調數', field: 'dqx' },
  { label: '已協調數', field: 'yxt' },
  { label: '停診總數', field: 'stopNum' },
  {
    label: '排班變更類型',
    field: 'type',
    formatter: function (row) {
      if (row.type) {
        row.type = row.type.toLowerCase()
        if (row.type === 'mb') {
          return '模板'
        }
        if (row.type === 'stop') {
          return '停診'
        }
        if (row.type === 'delete') {
          return '刪除門店'
        } else if (row.type === 'interval') {
          return '修改看診間隔'
        } else if (row.type === 'zdy') {
          return '自定義'
        } else {
          return '--'
        }
      }
    }
  },
  {
    label: '變更方式',
    field: 'changeMethod',
    formatter: function (row) {
      if (row.changeMethod) {
        row.changeMethod = row.changeMethod.toLowerCase()
        if (row.changeMethod === 'delete') {
          return '刪除'
        } else if (row.changeMethod === 'add') {
          return '新增'
        } else if (row.changeMethod === 'extend') {
          return '延長'
        } else if (row.changeMethod === 'shorten') {
          return '縮短'
        } else {
          return '--'
        }
      }
    }
  },
  {
    label: '日期',
    field: 'date',
    formatter: function (row) {
      if (row.type === 'MB') {
        return row.date + '~ 無限'
      } else if (row.endDate) {
        return row.date + '~' + row.endDate
      } else {
        return row.date
      }
    }
  },
  { label: '原出診時間', field: 'time' },
  { label: '新出診時間', field: 'newTime' },
  { label: '門店', field: 'hospitalName' },
  // Search Schema
  genSearchSchema('apiSelect', 'doctorId', '醫生', {
    placeholder: '請填寫',
    api: async () => {
      return await getInOptionFormat('doctor', 'id', 'name')
    },
    filterable: true
  }),
  genSearchSchema('apiSelect', 'hospitalId', '門店', {
    placeholder: '請選擇',
    api: async () => {
      return await getInOptionFormat('sys/hospital', 'id', 'name')
    }
  }),
  genSearchSchema('datePicker', 'startDate', '停診日期', { placeholder: null }),
  genSearchSchema('datePicker', 'endDate', '停診日期', { placeholder: null }),
  genSearchSchema('checkbox', 'yxtStr', '', { options: dict.yxt, value: [] })
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
  // if (
  //   row.productInventory.totalQty < row.minAlertQty ||
  //   row.productInventory.totalQty > row.maxAlertQty
  // ) {
  //   return 'tr-danger-row'
  // }

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
  // await setValues({
  //   startTime: getDateInFormat(new Date(), '-')
  // })
  // search()
  // const res = genSearchSchema('sourceSelect', 'createFrom', '訂單來源', {
  //   options: dict.product.promotionWay as any
  // })
  // console.log(res)
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
    >
      <template #action="{ row }">
        <ElLink type="primary" @click="settlement(row)" class="mr-5px">處理預約</ElLink>
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
