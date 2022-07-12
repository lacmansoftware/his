<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
// import { useI18n } from '@/hooks/web/useI18n'
import { CustomDropdown } from '@/components/ContextMenu'
import { AppointHospitalTableData, AppointHospitalType } from '@/api/appoint/appoint/hospital/types'

// const { t } = useI18n()

const props = defineProps({
  row: {
    type: Object as PropType<AppointHospitalTableData>,
    default: () => ({})
  },
  colId: {
    type: Number,
    default: 0
  },
  curWeek: {
    type: null,
    default: () => ({})
  }
})

const data = ref<AppointHospitalType>(
  props.row?.children.find((item) => {
    if (item.start === props.curWeek.range[props.colId]) return true
  }) as AppointHospitalType
)

const schema = computed(() => {
  return data?.value.children.map((doctor) => ({
    icon: '',
    label: `<div class="flex items-center justify-between gap-4"><p>${doctor.name}</p><p>已约/上限: ${doctor.meet}/${doctor.limit}</p></div>`,
    command: () => {}
  }))
})
</script>

<template>
  <CustomDropdown v-if="typeof data !== 'undefined'" trigger="hover" :schema="schema">
    <div class="flex flex-col gap-2">
      <p>{{ row?.name }}</p>
      <p>{{ `已约/上限: ${data?.totalMeet}/${data?.totalLimit}` }}</p>
    </div>
  </CustomDropdown>
</template>

<style lang="less" scoped></style>
