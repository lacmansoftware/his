<script setup lang="ts">
// import { useI18n } from '@/hooks/web/useI18n'
import { propTypes } from '@/utils/propTypes'

import DeliveryTableVue from './DeliveryTable.vue'

// const { t } = useI18n()
const props = defineProps({
  memberId: propTypes.string.def('')
})
</script>

<template>
  <DeliveryTableVue />
</template>
