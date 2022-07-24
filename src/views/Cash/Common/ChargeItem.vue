<script lang="ts" setup>
const props = defineProps({
  chargeType: {
    type: Object,
    default: () => ({})
  }
})
</script>
<template>
  <p>{{ chargeType.label }}</p>
</template>
