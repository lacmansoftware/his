<script lang="ts" setup>
import { inDict } from '@/utils/common'
import DataTable from './DataTable.vue'

const crudSchemas = [
  { label: '預約時段', field: 'appointmentTimeCut' },
  { label: '姓名', field: 'memberName' },
  {
    label: '性別',
    field: 'memberGender',
    formatter: function (row) {
      return inDict(row.memberGender, 'sex')
    }
  },
  { label: '年齡', field: 'age' },
  {
    label: '初複診',
    field: 'visitType',
    formatter: function (row) {
      return inDict(row.visitType, 'visitType')
    }
  }
]
</script>
<template>
  <DataTable
    url="workstation/todayAppointmentList"
    :crudSchemas="crudSchemas"
    title="今日預約：0人(未挂號：0人 已挂號：0人）"
  />
</template>
