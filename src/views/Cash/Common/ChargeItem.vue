<script lang="ts" setup>
const props = defineProps({
  chargeType: {
    type: Object,
    default: () => ({})
  }
})

defineExpose({
  props
})
</script>
<template>
  <p>{{ chargeType.label }}</p>
</template>
