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

import { saveTableApi } from '@/api/base/hospital/user'
import { NotChargedTableData } from '@/api/base/hospital/user/types'
import { dateCompare } from '@/utils/date'
import { genTableSchema, genSearchSchema } from '@/utils/schema'
import dict from '@/config/dictionary.json'
import { getApi } from '@/api/common'

defineOptions({
  name: 'CashNotChargedIndex'
})

const searchRef = ref<ComponentRef<typeof Search>>()

const userInfo = reactive<any>({})
const store = {
  type: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

const { push } = useRouter()

const getTableListApi = (params: any) => {
  return getApi('doctor/hospital/doctor/work/day/list', params)
}

const { register, tableObject, methods } = useTable<NotChargedTableData>({
  getListApi: getTableListApi,
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
    label: '醫生',
    field: 'doctorName'
  },
  {
    label: '出診日期',
    field: 'dateView'
  },
  {
    label: '就診數',
    field: 'registerNum'
  },
  {
    label: '零診費',
    field: 'registerNum',
    formatter: function (row) {
      return row.registerNum - row.clinicNum
    }
  },
  {
    label: '診費',
    field: 'consFeeAll',
    children: [
      {
        label: '收款',
        field: 'consFeeAll'
      },
      {
        label: '掛賬',
        field: 'consFeeArrears'
      },
      {
        label: '退款',
        field: 'consFeeBack'
      }
    ]
  },
  {
    label: '藥費',
    field: 'drugFeeAll',
    children: [
      {
        label: '收款',
        field: 'drugFeeAll'
      },
      {
        label: '掛賬',
        field: 'drugFeeArrears'
      },
      {
        label: '退款',
        field: 'drugFeeBack'
      }
    ]
  },
  {
    label: '治療費',
    field: 'action',
    children: [
      {
        label: '收款',
        field: 'treatFeeAll'
      },
      {
        label: '掛賬',
        field: 'treatFeeArrears'
      },
      {
        label: '退款',
        field: 'treatFeeBack'
      }
    ]
  },
  {
    label: '商品',
    field: 'action',
    children: [
      {
        label: '收款',
        field: 'projectFeeAll'
      },
      {
        label: '掛賬',
        field: 'projectFeeArrears'
      },
      {
        label: '退款',
        field: 'projectFeeBack'
      }
    ]
  },
  {
    label: '其他',
    field: 'action',
    children: [
      {
        label: '收款',
        field: 'otherFeeAll'
      },
      {
        label: '掛賬',
        field: 'otherFeeArrears'
      },
      {
        label: '退款',
        field: 'otherFeeBack'
      }
    ]
  },

  // Search Schema
  genSearchSchema('datePicker', 'startTime', '看診日期', { placeholder: '起始' }),
  genSearchSchema('datePicker', 'endTime', '到', { placeholder: '結束' })
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

onMounted(() => {
  search()
})

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
  getApi(`index/userinfo`).then((res) => {
    userInfo.hospitalName = res.data.hospitalName
  })
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

<style scoped>
.success-row {
  background: red;
}
</style>
