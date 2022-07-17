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

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/pharmacy/tjgl/decoction'
import { NotChargedTableData } from '@/api/pharmacy/tjgl/decoction/types'
import { dateCompare } from '@/utils/date'
import { genTableSchema, genSearchSchema } from '@/utils/schema'
import dict from '@/config/dictionary.json'

defineOptions({
  name: 'CashNotChargedIndex'
})

const props = defineProps({
  pageType: {
    type: String,
    default: ''
  }
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

// getList()

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action',
    width: '150px',
    form: { show: false }
  },
  {
    label: '處置狀態',
    field: 'makeStatus',
    formatter: function (row) {
      return inDict(row.makeStatus, 'adjustStatus')
    }
  },
  { label: '訂單編號', field: 'orderNo' },
  { label: '藥房', field: 'pharmacyName' },
  { label: '處方編號', field: 'recipelCode' },
  { label: '患者', field: 'patientName', width: '70px' },
  { label: '手機', field: 'patientMobile', width: '70px' },
  { label: '醫生', field: 'doctorName', width: '70px' },
  {
    label: '處方類型',
    field: 'tempType',
    width: '70px',
    formatter: function (row) {
      return inDict(row.tempType, 'recipeType')
    }
  },
  { label: '劑型', field: 'dosageform', width: '70px' },
  { label: '總劑數', field: 'totalNum', width: '70px' },
  { label: '代煎劑數', field: 'decoNum', width: '70px' },
  { label: '鍋', field: 'potName' },
  {
    label: '配送方式',
    field: 'expressName',
    width: '70px',
    formatter: function (row) {
      return inDict(row.expressName, 'expressType')
    }
  },
  {
    label: '訂單來源',
    field: 'orderOrigin',
    formatter: function (row) {
      return row.orderOrigin
    }
  },
  {
    label: '支付狀態',
    field: 'orderStatus',
    formatter: function (row) {
      return inDict(row.orderStatus, 'orderStatus')
    }
  },
  { label: '下單時間', field: 'time', width: '80px' },
  { label: '煎藥人', field: 'makeUserId', width: '80px' },
  { label: '煎完時間', field: 'makeTime', width: '80px' },
  { label: '出葯時間', field: 'drugTime', width: '80px' },
  {
    label: '超時',
    field: 'makeStatus',
    formatter: function (row) {
      if (row.drugTime) {
        var drugTime = new Date(row.drugTime)
        var makeTime
        if (row.makeTime) {
          makeTime = new Date(row.makeTime)
        } else {
          makeTime = new Date()
        }
        if (makeTime > drugTime) {
          return '已超時'
        }
      }
    }
  },
  {
    label: '退葯狀態',
    field: 'returnDrugMark',
    formatter: function (row) {
      if (!row.returnDrugMark) {
        return '未退葯'
      }
      return inDict(row.returnDrugMark, 'drug.returnStatus')
    }
  },

  // Search Schema
  genSearchSchema('apiSelect', 'pharmacyId', '藥房', {
    placeholder: '選擇藥房',
    api: async () => {
      return await getInOptionFormat('index/pharmacys', 'id', 'name')
    }
  }),
  genSearchSchema('input', 'recipelCode', '處方編號', { placeholder: '處方編號' }),
  genSearchSchema('input', 'orderNo', '訂單編號', { placeholder: '訂單編號' }),
  genSearchSchema('input', 'patientName', '患者姓名/手機', { placeholder: '患者姓名/手機' }),
  genSearchSchema('input', 'doctorName', '醫生', { placeholder: '醫生' }),
  genSearchSchema('sourceSelect', 'expressType', '配送方式', {
    placeholder: '配送方式',
    options: dict.expressType as any
  }),
  genSearchSchema('sourceSelect', 'orderOrigin', '訂單來源', {
    placeholder: '訂單來源',
    options: dict.orderOrigin as any
  }),
  genSearchSchema('sourceSelect', 'tempType', '處方類型', {
    placeholder: '處方類型',
    options: dict.recipeType as any
  }),
  genSearchSchema('sourceSelect', 'returnDrugMark', '退葯狀態', {
    placeholder: '退葯狀態',
    options: dict.drug.returnStatus as any
  }),
  genSearchSchema('datePicker', 'startDate', '下單時間', { placeholder: '下單時間' }),
  genSearchSchema('datePicker', 'endDate', '到', { placeholder: '下單時間' }),
  genSearchSchema('sourceSelect', 'drugState', '劑型', {
    placeholder: '劑型',
    options: dict.dosageform as any
  }),
  genSearchSchema('sourceSelect', 'makeStatus', '處置狀態', {
    placeholder: '處置狀態',
    options: dict.adjustStatus as any
  })
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
  if (row.orderOrigin === '網診') {
    return 'tr-success-row'
  }
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
  await setValues({
    startDate: getDateInFormat(new Date(), '-')
  })
  search()
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
        <ElLink v-if="row.makeStatus === 'N'" type="primary" @click="settlement(row)" class="mr-5px"
          >煎完</ElLink
        >
        <ElLink type="primary" @click="settlement(row)" class="mr-5px">查看處方</ElLink>
        <ElLink type="primary" @click="settlement(row)" class="mr-5px">打印煎藥貼</ElLink>
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
