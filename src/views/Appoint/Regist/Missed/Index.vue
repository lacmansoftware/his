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
import { inDict, getInOptionFormat } from '@/utils/common'
import { AppointRegisteredTableData } from '@/api/appoint/regist/registered/types'
import { getApi, postApi } from '@/api/common'
import { genSearchSchema } from '@/utils/schema'
import ReturnFee from './components/ReturnFee.vue'

defineOptions({
  name: 'CashNotChargedIndex'
})

const currentRow = ref<any>({})
const returnFeeRef = ref<ComponentRef<typeof ReturnFee>>()
const searchRef = ref<ComponentRef<typeof Search>>()

const getCustomTableListApi = (params: any) => {
  return getApi(`member/appointment/missappointment/list`, params)
}

const { register, tableObject, methods } = useTable<AppointRegisteredTableData>({
  getListApi: getCustomTableListApi,
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
    width: '180px',
    form: { show: false }
  },
  { label: '實付金額', field: 'paymentActPrice' },
  { label: '已退金額', field: 'returnFee' },
  {
    label: '可退金額',
    field: 'moreReturnFee',
    formatter: function (row) {
      return row.paymentActPrice - row.returnFee
    }
  },
  { label: '扣費設置額', field: 'missDeduction' },
  { label: '門店', field: 'hospitalName' },
  { label: '客人姓名', field: 'memberName' },
  { label: '手機', field: 'memberMobile' },
  {
    label: '性別',
    field: 'memberGender',
    formatter: function (row) {
      return inDict(row.memberGender, 'sex')
    }
  },
  { label: '年齡', field: 'memberAge' },
  { label: '醫生', field: 'doctorName' },
  {
    label: '約診類型',
    field: 'appointmentType',
    formatter: function (row) {
      return inDict(row.appointmentType, 'isSpecialist')
    }
  },
  { label: '套餐', field: 'packageName' },
  { label: '專科名稱', field: 'specialistName' },
  {
    label: '預約日期',
    field: 'appointmentTimeStart',
    formatter: function (row) {
      return row.appointmentTimeStart.split(/\s/)[0]
    }
  },
  {
    label: '預約時段',
    field: 'appointmentTimeDisp',
    formatter: function (row) {
      return row.appointmentTimeStart + '~' + row.appointmentTimeEnd.split(' ')[1]
    }
  },
  { label: '檔案號', field: 'archivesNo' },
  {
    label: '是否支付',
    field: 'paymentStatus',
    formatter: function (row) {
      return inDict(row.paymentStatus, 'appoint.paymentStatus')
    }
  },

  // Search Schema
  genSearchSchema('input', 'memberName', '客人姓名', { placeholder: '請填寫' }),
  genSearchSchema('input', 'memberMobile', '手機號', { placeholder: '請填寫' }),
  genSearchSchema('apiSelect', 'doctorId', '醫生', {
    placeholder: '請填寫',
    api: async () => {
      return await getInOptionFormat('doctor', 'id', 'name')
    },
    filterable: true
  }),
  genSearchSchema('apiSelect', 'hospitalId', '門店', {
    placeholder: '門店',
    api: async () => {
      return await getInOptionFormat('sys/hospital', 'id', 'name')
    }
  }),
  genSearchSchema('datePicker', 'appointmentDateStart', '約診開始時間', { placeholder: '請選擇' }),
  genSearchSchema('datePicker', 'appointmentDateEnd', '約診結束時間', { placeholder: '請選擇' })
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)

const dialogTitle = ref('')
const dialogWidth = ref('')

const actionType = ref('')

const loading = ref(false)

const save = async () => {
  if (actionType.value === 'return_fee') {
    const returnFee = unref(returnFeeRef)
    let isReturnFeeValid = false
    await returnFee?.elFormRef?.validate(async (isValid) => {
      isReturnFeeValid = isValid
    })
    if (!isReturnFeeValid) return
    const formData = await returnFee?.methods.getFormData()
    if (Number(formData!.refundAmount) > Number(currentRow.value?.moreReturnFee)) {
      ElMessage.error('退費金額不能大於可退金額')
      return
    }
    postApi(`member/appointment/refund`, formData)
      .then((result) => {
        if (result.success) {
          getList()
        }
      })
      .finally(() => {
        dialogVisible.value = false
      })
  }
}

const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  return ''
}

const retureFee = (row) => {
  currentRow.value = row
  actionType.value = 'return_fee'
  dialogTitle.value = '爽約退費'
  dialogVisible.value = true
  dialogWidth.value = '70%'
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
    >
      <template #action="{ row }">
        <ElLink
          v-if="row.paymentActPrice - row.returnFee > 0"
          type="primary"
          @click="retureFee(row)"
          class="mr-5px"
          >退費</ElLink
        >
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth">
    <ReturnFee v-if="actionType === 'return_fee'" ref="returnFeeRef" :current-row="currentRow" />

    <template #footer>
      <ElButton type="primary" :loading="loading" @click="save">
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
