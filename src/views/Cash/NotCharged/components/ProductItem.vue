<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { getTableListApi } from '@/api/table'
import { TableData } from '@/api/table/types'
import { ref, h } from 'vue'
import { ElTag, ElButton } from 'element-plus'

interface Params {
  pageNum?: number
  pageSize?: number
}

const { t } = useI18n()

const columns: TableColumn[] = [
  {
    label: '名稱',
    field: 'title'
  },
  {
    label: '單位',
    field: 'unit',
    width: '40px'
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
    field: 'originUnitPrice',
    width: '50px'
  },
  {
    label: '庫存量',
    field: 'currentQty',
    width: '50px'
  },
  {
    label: '購買量',
    field: 'amount',
    width: '50px',
    formatter: function (row) {
      return (
        '<input type="text" style="width:50%;" value="' + row.amount + '" data-allow="number"/>'
      )
    }
  },
  {
    label: '折扣率',
    field: 'discount',
    formatter: function (row) {
      var row = row
      if (row.activityId) {
        //活動不允許設置折扣率
        return (
          '<input type="text" readonly="readonly" style="width:50%;background: #ccc" value="' +
          row.amount +
          '" data-allow="number"/>%'
        )
      }
      return (
        '<input type="text" style="width:50%;" value="' + row.discount + '" data-allow="number"/>%'
      )
    }
  },
  {
    label: '總價(原價)',
    field: 'originPrice',
    width: '70px'
  },
  {
    label: '折后價',
    field: 'price',
    width: '50px'
  },
  {
    label: '是否預售',
    field: 'isPresell',
    width: '50px',
    formatter: function (row) {
      if (row.isPresell === 'Y') {
        return '是'
      }
      return '否'
    }
  },
  {
    label: '大夫推薦',
    field: 'recommendDoctor',
    width: '80px'
  },
  {
    label: '操作',
    width: '50px',
    formatter: function (row) {
      return (
        '<span onclick="namespace.del(\'' +
        row._uuid +
        '\');" style="cursor:pointer;color:#016cdf;">刪除</span>'
      )
    }
  }
]

const loading = ref(true)

let tableDataList = ref<TableData[]>([])

const getTableList = async (params?: Params) => {
  const res = await getTableListApi(
    params || {
      pageNum: 1,
      pageSize: 10
    }
  )
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
  if (res) {
    tableDataList.value = res.data.list
  }
}

getTableList()

const acitonFn = (data: TableSlotDefault) => {
  console.log(data)
}
</script>

<template>
  <Table :columns="columns" :data="tableDataList" :loading="loading" :selection="false">
    <template #action="data">
      <ElButton type="primary" @click="acitonFn(data as TableSlotDefault)">
        {{ t('tableDemo.action') }}
      </ElButton>
    </template>
  </Table>
</template>
