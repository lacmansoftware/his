<script setup lang="ts">
import { Form } from '@/components/Form'
import { ElInput, ElSelect, ElOption } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { MemberInfoTableData } from '@/api/member/types'
import { useValidator } from '@/hooks/web/useValidator'
import dict from '@/config/dictionary.json'

const { required, isMobile } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<MemberInfoTableData>>,
    default: () => null
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  }
})

const rules = reactive({
  memberName: [required()],
  pinyinCode: [required()],
  gender: [required()],
  // mobile: [required(), isMobile()],
  mobile: [required()],
  memberLevel: [required()],
  birthday: [required()]
  // title: [required()],
  // author: [required()],
  // importance: [required()],
  // pageviews: [required()],
  // display_time: [required()],
  // content: [required()]
})

const { register, methods, elFormRef } = useForm({
  schema: props.formSchema
})

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    const { setValues } = methods
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  elFormRef,
  getFormData: methods.getFormData
})

const temp = [
  {
    value: 'weg',
    label: 'weweg'
  }
]

const setPinyinCode = (item: any) => {
  console.log('clicked ', item)
}
</script>

<template>
  <Form :rules="rules" @register="register">
    <template #birthdayLunar="form">
      <div class="w-[100%] flex">
        <ElInput v-model="form['birthdayLunar']" :disabled="true" />
        <ElSelect v-model="form['birthdayLunar2']">
          <ElOption
            v-for="item in temp"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </div>
    </template>
    <template #hasChild="form">
      <div class="w-[100%] flex">
        <ElSelect
          v-model="form['hasChild']"
          class="flex-auto w-[30%]"
          @change="handleHasChildChange"
        >
          <ElOption
            v-for="item in dict.hasChild"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
        <ElSelect v-model="form['boyNum']" class="flex-1" :disabled="form['hasChild'] !== 'Y'">
          <ElOption
            v-for="item in dict.numList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
        <span class="flex-none mx-1">男</span>
        <ElSelect v-model="form['girlNum']" class="flex-1" :disabled="form['hasChild'] !== 'Y'">
          <ElOption
            v-for="item in dict.numList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
        <span class="flex-none mx-1">女</span>
      </div>
    </template>

    <!-- <template #birthday="form">
      <div class="w-[100%] flex">
        <ElInput v-model="form['birthday']['form']" placeholder="abc" />
      </div>
    </template> -->
  </Form>
</template>

<style lang="less" scoped></style>
