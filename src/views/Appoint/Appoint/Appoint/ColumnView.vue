<script setup lang="ts">
import { onMounted, watch, computed, unref, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouterLinkProps } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import { useI18n } from '@/hooks/web/useI18n'
import { filterAffixTags } from './helper'
import { CustomDropdown } from '@/components/ContextMenu'
import { useDesign } from '@/hooks/web/useDesign'
import { useTemplateRefsList } from '@vueuse/core'
import { ElScrollbar } from 'element-plus'
import { useScrollTo } from '@/hooks/event/useScrollTo'
import { AppointDoctorTableData, AppointDoctorType } from '@/api/appoint/appoint/types'
import { timelineLabels } from '@/utils/common'

const { t } = useI18n()

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

const data = ref<AppointDoctorType>(
  props.row?.children.find((item) => {
    if (item.start === props.curWeek.range[props.colId]) return true
  })
)

const schema = computed(() => {
  const timeLabels = timelineLabels(
    data.value.startTime,
    data.value.endTime,
    data.value.cycle,
    'minute'
  )
  return timeLabels.map((time) => ({
    icon: '',
    label: `<div class="flex items-center justify-between gap-4"><p>${time}</p></div>`,
    command: () => {}
  }))
})

onMounted(() => {
  // console.log(props.row)
})
</script>

<template>
  <CustomDropdown v-if="typeof data !== 'undefined'" trigger="hover" :schema="schema">
    <div class="flex flex-col gap-2">
      <p>{{ data.name }}</p>
      <p>{{ `已约/上限: ${data.addLimit}/${data.limit}` }}</p>
    </div>
  </CustomDropdown>
</template>

<style lang="less" scoped></style>
