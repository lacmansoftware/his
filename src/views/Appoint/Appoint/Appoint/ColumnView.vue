<script setup lang="ts">
import { onMounted, computed, ref, PropType } from 'vue'
import { useRouter } from 'vue-router'
// import { useI18n } from '@/hooks/web/useI18n'
import { CustomDropdown } from '@/components/ContextMenu'
import { AppointDoctorTableData, AppointDoctorType } from '@/api/appoint/appoint/appoint/types'
import { timelineLabels, isValidTime } from '@/utils/common'

// const { t } = useI18n()
const { push } = useRouter()

const props = defineProps({
  row: {
    type: Object as PropType<AppointDoctorTableData>,
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

const data = computed<AppointDoctorType>(() => {
  return props.row?.children.find((item) => {
    if (item.start === props.curWeek.range[props.colId]) return true
  }) as AppointDoctorType
})

const schema = computed(() => {
  const timeLabels = timelineLabels(
    data.value.startTime,
    data.value.endTime,
    data.value.cycle,
    'minute'
  )
  return timeLabels.map((time, index) => ({
    icon: '',
    disabled: !isValidTime(data.value.start, time),
    label: `<div class="flex items-center justify-between gap-4"><p>${time}</p><p>添加預約</p></div>`,
    command: () => {
      // doctorId: props.row.id
      // hospitalId: data.value.hospitalId
      // startTime: data.value.date + " " + time
      // endTime: data.value.date + " " + timeLabels[index + 1]
      push({
        name: 'AppointManageAppointAdd',
        params: {
          doctorId: props.row.id,
          hospitalId: data.value.hospitalId,
          startTime: data.value.date + ' ' + time,
          endTime: data.value.date + ' ' + timeLabels[index + 1]
        }
      })
    }
  }))
})

onMounted(() => {
  // console.log(props.row)
})
</script>

<template>
  <CustomDropdown v-if="typeof data !== 'undefined'" trigger="hover" :schema="schema">
    <div class="flex flex-col gap-2">
      <p class="text-base text-blue-400">{{ data.name }}</p>
      <p>{{ `已约/上限: ${data.addLimit}/${data.limit}` }}</p>
    </div>
  </CustomDropdown>
</template>

<style lang="less" scoped></style>
