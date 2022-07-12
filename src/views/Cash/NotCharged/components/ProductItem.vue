<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ProductItemType } from '@/api/cash/notcharged/types'
import { ref } from 'vue'
import { ElButton, ElFormItem, ElAutocomplete, ElMessage, ElInputNumber } from 'element-plus'
import { getInOptionFormat } from '@/utils/common'
import { propTypes } from '@/utils/propTypes'
import { mul } from '@/utils/number'

interface Params {
  pageNum?: number
  pageSize?: number
}

const { t } = useI18n()
const props = defineProps({
  memberId: propTypes.string.def('')
})

const columns: TableColumn[] = [
  {
    label: '名稱',
    field: 'title'
  },
  {
    label: '單位',
    field: 'unit'
  },
  {
    label: '產品類型',
    field: 'businessSubType',
    formatter: function (row) {
      if (row.businessSubType == 'PRODUCT') {
        return '商品'
      } else if (row.businessSubType == 'YNZJ') {
        return '自有產品'
      } else if (row.businessSubType == 'DLDX') {
        return '代理代銷'
      }
    }
  },
  {
    label: '單價',
    field: 'originUnitPrice'
  },
  {
    label: '庫存量',
    field: 'currentQty'
  },
  {
    label: '購買量',
    field: 'amount',
    width: '150px'
  },
  {
    label: '折扣率(%)',
    field: 'discount',
    width: '150px'
    // formatter: function (row) {
    //   var row = row
    //   if (row.activityId) {
    //     //活動不允許設置折扣率
    //     return (
    //       '<input type="text" readonly="readonly" style="width:50%;background: #ccc" value="' +
    //       row.amount +
    //       '" data-allow="number"/>%'
    //     )
    //   }
    //   return (
    //     '<input type="text" style="width:50%;" value="' + row.discount + '" data-allow="number"/>%'
    //   )
    // }
  },
  {
    label: '總價(原價)',
    field: 'originPrice'
  },
  {
    label: '折后價',
    field: 'price'
  },
  {
    label: '是否預售',
    field: 'isPresell',
    formatter: function (row) {
      if (row.isPresell === 'Y') {
        return '是'
      }
      return '否'
    }
  },
  {
    label: '大夫推薦',
    field: 'recommendDoctor'
  },
  {
    label: '操作',
    field: 'action'
  }
]

const loading = ref(true)

let tableDataList = ref<ProductItemType[]>([])

const getTableList = async (params?: Params) => {
  loading.value = false
}

getTableList()

const acitonFn = (data: TableSlotDefault) => {
  //   $index: 0
  // cellIndex: 11
  // column: {order: '', id: 'el-table_3_column_33', type: 'default', property: 'action', align: 'is-left', …}
  // expanded: false
  // row: Proxy {id: 'NO20180528114428', name: '兒童退燒藥浴包（官捨）', dataTypeName: '自有产品', dataType: 'life', title: '兒童退燒藥浴包（官捨）', …}
  // store: {ns: {…}, assertRowKey: ƒ, updateColumns: ƒ, scheduleLayout: ƒ, isSelected: ƒ, …}
  // _self: {uid: 1990, vnode: {…}, type: {…}, parent: {…}, appContext: {…}, …}
  console.log(data)
}

const projectFilter = ref<any>(null)
const discountNumber = ref(98)

const handleProjectFilterSelect = (item: Recordable) => {
  tableDataList.value.push({
    ...item,
    unitPrice: item.originUnitPrice,
    recommendDoctor: '--',
    dataType: 'life',
    amount: 1,
    drugId: item.id,
    discount: discountNumber.value,
    originPrice: item.originUnitPrice,
    price: mul(item.originUnitPrice, discountNumber.value / 100.0)
  } as ProductItemType)
}

const handleAmountChange = (row: ProductItemType, value: number) => {
  if (row.isPresell !== 'Y' && value > row.currentQty) {
    ElMessage.error('禁止超過當前庫存量！')
    row.amount = row.currentQty
    return
  }
  row.originPrice = mul(row.unitPrice, value)
  row.price = mul(row.unitPrice, value, row.discount / 100.0)
}

const handleDiscountChange = (row: ProductItemType, value: number) => {
  if (value > 200 || value < 80) {
    row.discount = discountNumber.value
    ElMessage.error('折扣範圍80-200')
  }
}
</script>

<template>
  <ElFormItem prop="projectFilter" label="添加：">
    <ElAutocomplete
      v-model="projectFilter"
      :fetch-suggestions="
        async (queryString: string, cb: Fn): Promise<any> => {
          const res = await getInOptionFormat(`/charges/projects?keyWords=${queryString}&memberId=${memberId}`, 'title', 'title', 'filter')
          cb(res)
        }
      "
      @select="handleProjectFilterSelect"
      :trigger-on-focus="false"
      placeholder="名稱/拼音"
    >
      <template #default="{ item }">
        <div class="flex w-full" justify="evenly">
          <span class="flex-1">{{ item.title }}</span>
          <span class="flex-1">{{ item.originUnitPrice }}</span>
        </div>
      </template>
    </ElAutocomplete>
  </ElFormItem>
  <Table :columns="columns" :data="tableDataList" :loading="loading" :selection="false">
    <template #amount="data">
      <ElInputNumber
        class="!w-[100%]"
        v-model="data.row.amount"
        @change="(value) => handleAmountChange(data.row, value as number)"
      />
    </template>
    <template #discount="data">
      <ElInputNumber
        class="!w-[100%]"
        v-model="data.row.discount"
        @change="(value) => handleDiscountChange(data.row, value as number)"
      />
    </template>
    <template #action="data">
      <ElButton type="primary" @click="acitonFn(data as TableSlotDefault)">
        {{ t('tableDemo.action') }}
      </ElButton>
    </template>
  </Table>
</template>
