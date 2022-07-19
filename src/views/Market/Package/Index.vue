<script setup lang="ts">
import { reactive, ref, unref, onMounted, computed } from 'vue'
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

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/market/package'
import { NotChargedTableData } from '@/api/market/package/types'
import { dateCompare } from '@/utils/date'
import { genTableSchema, genSearchSchema } from '@/utils/schema'
import dict from '@/config/dictionary.json'
import { propTypes } from '@/utils/propTypes'

defineOptions({
  name: 'MarketPackageOffline'
})

const props = defineProps({
  pageType: propTypes.string.def(''),
  pageName: propTypes.string.def('')
})
const PACKAGETYPE = computed(() => props.pageType)
const PACKAGETYPENAME = computed(() => decodeURI(props.pageName))

const searchRef = ref<ComponentRef<typeof Search>>()

const store = {
  type: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

const { push } = useRouter()

const getCustomTableListApi = (params: any) => {
  return getTableListApi(params, PACKAGETYPE.value)
}

const { register, tableObject, methods } = useTable<NotChargedTableData>({
  getListApi: getCustomTableListApi,
  delListApi: delTableListApi,
  response: {
    list: 'data',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>(
  props.pageType !== 'combo'
    ? [
        {
          label: '操作',
          field: 'action',
          width: '150px'
        },
        { label: PACKAGETYPENAME.value + '套餐名稱', field: 'packageName' },
        { label: '大夫數量', field: 'doctorCount' },
        { label: '大夫姓名', field: 'doctorNames' },
        { label: '套餐總價', field: 'comboTotalPrice' },
        { label: '總次數', field: 'comboTotalTimes' },
        { label: '單次價格', field: 'comboUnitPrice' },
        { label: '套餐說明', field: 'description' },
        { label: '購買基數', field: 'baseNum' },
        {
          label: '已購人數',
          field: 'sendCount',
          formatter: function (row) {
            return '' + row.sendCount + ''
          }
        },
        {
          label: '狀態',
          field: 'isActive',
          formatter: function (row) {
            return inDict(row.isActive, 'insurActive')
          }
        },
        { label: '創建人', field: 'createUser' },
        { label: '創建時間', field: 'createTime' },
        { label: '更新人', field: 'modifyUser' },
        { label: '更新時間', field: 'modifyTime' },

        // Search Schema
        genSearchSchema('input', 'packageName', '套餐名稱', { placeholder: '套餐名稱' }),
        genSearchSchema('input', 'doctorNames', '大夫姓名', { placeholder: '大夫姓名' }),
        genSearchSchema('sourceSelect', 'isActive', '狀態', {
          placeholder: '狀態',
          options: dict.insurActive as any
        })
      ]
    : [
        {
          label: '操作',
          field: 'action',
          width: '150px'
        },
        { label: PACKAGETYPENAME.value + '套餐名稱', field: 'packageName' },
        { label: '大夫數量', field: 'doctorCount' },
        { label: '大夫姓名', field: 'doctorNames' },
        { label: '套餐總價', field: 'comboTotalPrice' },
        { label: '總次數', field: 'comboTotalTimes' },
        { label: '門診次數', field: 'mdTotalTimes' },
        { label: '網診次數', field: 'wzTotalTimes' },
        { label: '套餐說明', field: 'description' },
        { label: '購買基數', field: 'baseNum' },
        {
          label: '已購人數',
          field: 'sendCount',

          formatter: function (row) {
            return '' + row.sendCount + ''
          }
        },
        {
          label: '狀態',
          field: 'isActive',

          formatter: function (row) {
            return inDict(row.isActive, 'insurActive')
          }
        },
        { label: '創建人', field: 'createUser' },
        { label: '創建時間', field: 'createTime' },
        { label: '更新人', field: 'createUser' },
        { label: '更新時間', field: 'createTime' },

        // Search Schema
        genSearchSchema('input', 'packageName', '套餐名稱', { placeholder: '套餐名稱' }),
        genSearchSchema('input', 'doctorNames', '大夫姓名', { placeholder: '大夫姓名' }),
        genSearchSchema('sourceSelect', 'isActive', '狀態', {
          placeholder: '狀態',
          options: dict.insurActive as any
        })
      ]
)

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
      :layout="'bottom'"
      :buttom-position="'right'"
      @search="setSearchParams"
      @reset="setSearchParams"
      ref="searchRef"
    />

    <div class="mb-10px ml-10px mt-[-32px]">
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">新增門診專科</ElButton>
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
      :row-class-name="tableRowClassName"
    >
      <template #action="{ row }">
        <ElLink type="primary" @click="settlement(row)" class="mr-5px">查看</ElLink>
        <ElLink type="primary" @click="settlement(row)" class="mr-5px">編輯</ElLink>
        <ElLink v-if="row.sendCount === 0" type="primary" @click="settlement(row)" class="mr-5px"
          >刪除</ElLink
        >
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
