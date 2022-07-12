<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { getTableListApi } from '@/api/table'
import { TableData } from '@/api/table/types'
import { ref, h } from 'vue'
import { ElTag, ElButton, ElFormItem, ElAutocomplete, ElInput } from 'element-plus'
import { getInOptionFormat } from '@/utils/common'
import { propTypes } from '@/utils/propTypes'

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
    field: 'amount'
    // formatter: function (row) {
    //   return (
    //     '<input type="text" style="width:50%;" value="' + row.amount + '" data-allow="number"/>'
    //   )
    // }
  },
  {
    label: '折扣率',
    field: 'discount'
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

let tableDataList = ref<TableData[]>([])

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

const projectFilter = ref(null)
const discountNumber = ref(98)

const handleProjectFilterSelect = (item: Recordable) => {
  tableDataList.value.push({
    ...item,
    recommendDoctor: '--',
    price: item.unitPrice,
    dataType: 'life',
    amount: 1,
    drugId: item.id,
    discount: discountNumber.value
  })
  console.log(tableDataList.value)
}

const handleAmountChange = (rowId, value) => {
  console.log(rowId, value)
}
</script>

<template>
  <ElFormItem prop="projectFilter" label="添加：">
    <ElAutocomplete
      v-model="projectFilter"
      :fetch-suggestions="
        async (queryString: string, cb: Fn) => {
          const res = await getInOptionFormat(`/charges/projects?keyWords=${queryString}&memberId=${memberId}`, 'title', 'title', 'filter')
          cb(res)
        }
      "
      @select="handleProjectFilterSelect"
      trigger-on-focus="false"
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
      <!-- <ElInput
        :value="data.row.amount"
        @input="handleAmountChange(data.$index, $event.target.value)"
      /> -->
    </template>
    <template #action="data">
      <!-- <ElButton type="primary" @click="acitonFn(data as TableSlotDefault)">
        {{ t('tableDemo.action') }}
      </ElButton> -->
    </template>
  </Table>
</template>
