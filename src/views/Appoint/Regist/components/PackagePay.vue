<script setup lang="ts">
import { PropType } from 'vue'
import NormalTable from '@/views/common/NormalTable.vue'
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => {}
  }
})

const schema1: any = [
  { label: '專科名稱', field: 'specialistName' },
  { label: '門店', field: 'hospitalName' },
  { label: '醫生', field: 'doctorNames' },
  { label: '專科含次數', field: 'totalTimes' },
  {
    label: '剩餘次數',
    formatter: function (row) {
      return row.totalTimes - row.usedTimes
    }
  },
  { label: '專科總價', field: 'comboTotalPrice' },
  { label: '專科單次價', field: 'comboUnitPrice' },
  {
    label: '專科有效期',
    formatter: function (row) {
      if (row.doctorIds.indexOf(props?.currentRow?.doctorId) === -1) {
        row._disabled = true
      }
      return row.startTime + '到' + row.endTime
    }
  }
]
</script>

<template>
  <ContentWrap :title="`${currentRow?.memberName}的專科`">
    <NormalTable
      :current-row="props?.currentRow"
      :url="`/member/special/remainderList/${currentRow?.memberId}?status=N`"
      :columns="schema1"
    />
  </ContentWrap>
  <ContentWrap title="他人的專科">
    <NormalTable
      :current-row="props?.currentRow"
      :url="`member/info/get4workorder`"
      :columns="schema1"
    />
  </ContentWrap>
</template>
