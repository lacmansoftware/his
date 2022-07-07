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
import { AppointHospitalTableData } from '@/api/appoint/appoint/types'

const { t } = useI18n()

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

const data = props.row?.children.find((item) => {
  if (item.start === props.curWeek.range[props.colId]) return true
})

const schema = data?.children.map((doctor) => ({
  icon: '',
  label: `<div class="flex items-center justify-between gap-4"><p>${doctor.name}</p><p>已约/上限: ${doctor.meet}/${doctor.limit}</p></div>`,
  command: () => {}
}))
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
