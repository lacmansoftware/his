<script setup lang="ts">
import { PropType, reactive } from 'vue'
import type { WorkOrderType } from '@/api/workorder/workorder/types'
import { Descriptions } from '@/components/Descriptions'

defineProps({
  currentRow: {
    type: Object as PropType<Nullable<WorkOrderType>>,
    default: () => null
  }
})

const schema = reactive<DescriptionsSchema[]>([
  {
    label: '操作人',
    field: 'handlerName'
  },
  {
    label: '處理時間',
    field: 'createTime'
  },
  {
    label: '溝通記錄',
    field: 'comment',
    span: 24
  }
])
</script>

<template>
  <Descriptions :schema="schema" :data="currentRow || {}">
    <template #label> Hello </template>
  </Descriptions>
</template>
