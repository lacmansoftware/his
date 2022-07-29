<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, unref, ref, PropType, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { ElDivider } from 'element-plus'

const props = defineProps({
  labelPosition: propTypes.string.def('left'),
  title: propTypes.string.def(''),
  schema: {
    type: Array as PropType<Array<FormSchema>>,
    default: () => []
  }
})

const schema = reactive<FormSchema[]>(props.schema)

const { register, methods, elFormRef } = useForm({
  schema
})

onMounted(() => console.log(props))

defineExpose({
  methods,
  elFormRef
})
</script>

<template>
  <ElDivider content-position="left">{{ title }}</ElDivider>
  <Form :label-position="`${labelPosition}`" @register="register" />
</template>
