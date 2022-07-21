<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
// import { useI18n } from '@/hooks/web/useI18n'
import { CustomDropdown } from '@/components/ContextMenu'
import {
  AppointHospitalTableData,
  AppointHospitalType,
  CurWeekType
} from '@/api/appoint/appoint/hospital/types'
import { useRouter } from 'vue-router'

// const { t } = useI18n()
const { push } = useRouter()

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
    type: Object as PropType<CurWeekType>,
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
    command: () => {
      // doctor name: doctor.id
      // hospital id: props.row.id
      // start date: props.curWeek.startDate
      // end date: props.curWeek.endDate
      push({
        name: 'AppointManageAppointIndex',
        params: {
          doctorId: doctor.id,
          hospitalId: props.row.id,
          startDate: props.curWeek.startDate,
          endDate: props.curWeek.endDate
        }
      })
    }
  }))
})
</script>

<template>
  <CustomDropdown v-if="typeof data !== 'undefined'" trigger="hover" :schema="schema">
    <div class="flex flex-col gap-2">
      <p class="text-base text-green-500">{{ row?.name }}</p>
      <p>{{ `已约/上限: ${data?.totalMeet}/${data?.totalLimit}` }}</p>
    </div>
  </CustomDropdown>
</template>

<style lang="less" scoped></style>
