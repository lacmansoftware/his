<script lang="ts" setup>
import { inDict } from '@/utils/common'
import DataTable from './DataTable.vue'

const crudSchemas = [
  {
    label: '門診類型',
    field: 'appointmentType',
    formatter: function (row) {
      return inDict(row.appointmentType, 'offlineRecipelType2')
    }
  },
  { label: '挂號時間', field: 'registerDate' },
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
  },
  {
    label: '預約類型',
    field: 'registerType',
    formatter: function (row) {
      return inDict(row.registerType, 'appoint.registerType')
    }
  },
  { label: '處方數', field: 'countRecipel' },
  {
    label: '駁回數',
    field: 'countBh',
    formatter: function (row) {
      return row.countBh
    }
  }
]
</script>
<template>
  <DataTable url="workstation/doneVisitList" :crudSchemas="crudSchemas" title="已看診：0人" />
</template>
