<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { postAddressItemsApi, postProductPriceApi } from '@/api/cash/notcharged'
import { ProductItemType } from '@/api/cash/notcharged/types'
import { onMounted, ref, watch, watchEffect } from 'vue'
import { ElButton, ElFormItem, ElAutocomplete, ElMessage, ElInputNumber } from 'element-plus'
import { getInOptionFormat } from '@/utils/common'
import { propTypes } from '@/utils/propTypes'
import { mul } from '@/utils/number'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { postApi } from '@/api/common'

interface Params {
  pageNum?: number
  pageSize?: number
}

const dictStore = useDictStoreWithOut()
const { t } = useI18n()
const props = defineProps({
  memberId: propTypes.string.def('')
})

const columns: TableColumn[] = [
  {
    label: '處方編號',
    field: 'recipelId',
    formatter: function (row) {
      return row.recipelId
      // if (e.row.drugState === '國貨產品') {
      //   return '<span>' + e.value + '</span>'
      // }
      // return (
      //   '<span onclick="getRecipelDetail(\'' +
      //   e.value +
      //   '\');" style="cursor:pointer;color:#D1A673;">' +
      //   e.value +
      //   '</span>'
      // )
    }
  },
  {
    label: '類型',
    field: 'tempTypeName'
  },
  {
    label: '劑型',
    field: 'drugState'
  },
  {
    label: '總數',
    field: 'totalNum'
  },
  {
    label: '已快遞劑數',
    field: 'expressNum'
  },
  {
    label: 'ml/每袋',
    field: 'onceNum'
  },
  {
    label: '是否代煎',
    field: 'proxy',

    formatter: function (row) {
      // if (e.row.drugState === '湯劑') {
      //   if (e.value === 'Y') {
      //     return (
      //       '<select">' +
      //       '<option value="Y">是</option>' +
      //       '<option value="N">否</option>' +
      //       '</select>'
      //     )
      //   } else if (e.value === 'N') {
      //     return (
      //       '<select">' +
      //       '<option value="N">否</option>' +
      //       '<option value="Y">是</option>' +
      //       '</select>'
      //     )
      //   } else {
      //     return (
      //       '<select">' +
      //       '<option>請選擇</option>' +
      //       '<option value="Y">是</option>' +
      //       '<option value="N">否</option>' +
      //       '</select>'
      //     )
      //   }
      // }
      return '--'
    }
  },
  {
    label: '本次快遞劑數',
    field: 'num',
    formatter: function (row) {
      const value = row.num || ''
      return '<input type="text" style="width:50%;" value="' + value + '" data-allow="number"/>'
    }
  }
]

const loading = ref(true)

// let tableDataList = dictStore.chargeItemList
let tableDataList = ref<ProductItemType[]>(dictStore.chargeItemList.value)

const getTableList = async (params?: Params) => {
  loading.value = false
}

getTableList()

const deleteFn = (data: TableSlotDefault) => {
  tableDataList.value = tableDataList.value.filter((item) => item.id !== data.row.id)
  console.log(data)
}

const discountNumber = ref(98)

watch(tableDataList.value, (value, oldValue) => {
  tableDataList.value.forEach((row) => {
    row.originPrice = mul(row.unitPrice, row.amount)
    row.price = mul(row.unitPrice, row.amount, row.discount / 100.0)
  })
  // console.log('tableDataList changed wegwg: ', value, oldValue)
})

watchEffect(() => {
  // console.log('table list length: wewegge ', tableDataList.value.length)
})

const handleAmountChange = (row: ProductItemType, value: number) => {
  if (row.isPresell !== 'Y' && value > row.currentQty) {
    ElMessage.error('禁止超過當前庫存量！')
    row.amount = row.currentQty
    return
  }
}

const handleDiscountChange = (row: ProductItemType, value: number) => {
  if (value > 200 || value < 80) {
    row.discount = discountNumber.value
    ElMessage.error('折扣範圍80-200')
  }
}

const setTableDataEmpty = () => {
  tableDataList.value = []
}

defineExpose({
  tableDataList,
  setTableDataEmpty
})

// onMounted(async () => {
//   const res1 = await postApi('/price/cart', {
//     cartArray: dictStore.chargeItemList.value.map((item: ProductItemType) => ({
//       ...item,
//       _status: 'add',
//       activityId: '',
//       free: 'N',
//       referee: '',
//       refereeName: ''
//     })) as ProductItemType[],
//     payArray: [],
//     memberId: props.memberId
//   })
//   console.log(res1)

//   const res = await postProductPriceApi({
//     memberId: props.memberId,
//     cartArray: dictStore.chargeItemList.value.map((item: ProductItemType) => ({
//       ...item,
//       _status: 'add',
//       activityId: '',
//       free: 'N',
//       referee: '',
//       refereeName: ''
//     })) as ProductItemType[]
//   })
//   postAddressItemsApi({
//     items: dictStore.chargeItemList.value as CartItemType[]
//   }).then((res) => {
//     console.log(res)
//   })
// })
</script>

<template>
  <Table :columns="columns" :data="tableDataList" :loading="loading" :selection="false">
    <template #amount="data">
      <ElInputNumber
        class="!w-[100%]"
        v-model="data.row.amount"
        @change="(value) => handleAmountChange(data.row, value as number)"
        :min="1"
      />
    </template>
    <template #discount="data">
      <ElInputNumber
        class="!w-[100%]"
        v-model="data.row.discount"
        @change="(value) => handleDiscountChange(data.row, value as number)"
        :min="80"
        :max="200"
      />
    </template>
    <template #action="data">
      <ElButton type="primary" @click="deleteFn(data as TableSlotDefault)">
        {{ t('formDemo.delete') }}
      </ElButton>
    </template>
  </Table>
</template>
