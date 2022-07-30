<script setup lang="ts">
import dayjs from 'dayjs'
import { Form } from '@/components/Form'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { onBeforeMount, onMounted, PropType, reactive, ref, unref, watch } from 'vue'
import { ElDivider, ElCol, ElRow, ElButton } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useRouter, useRoute } from 'vue-router'
import { getAgeByBirthday, getInOptionFormat, returnDateString } from '@/utils/common'
import {
  getSelectText,
  getValue,
  getSchemaOptions,
  genFormSchema,
  setDisabled
} from '@/utils/schema'
import { getApi, postApi } from '@/api/common'
import dict from '@/config/dictionary.json'
import { AppointDoctorType } from '@/api/appoint/appoint/appoint/types'
import ChargeType from '@/views/Cash/Common/ChargeType.vue'
import { AppointListData } from '@/api/appoint/appoint/list/types'
import TypeOption from '@/views/Appoint/Regist/components/TypeOption.vue'
import InsurForm from '.@/views/Appoint/Regist/components/InsurForm.vue'
import UseFormDemo from '@/views/Components/Form/UseFormDemo.vue'
import SimpleForm from '@/views/common/SimpleForm.vue'

const { required } = useValidator()
const { emitter } = useEmitt()
const { push, go } = useRouter()
const { params } = useRoute()
const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => {}
  }
})

const typeRef = ref<string>('normal')
const hasInsurRef = ref<string>('N')
const isInsurRef = ref<string>('N')
const currentRow = ref<AppointListData>()
const hasHighMedicalInsuranceInfoRef = ref('')
const insurFormRef = ref<ComponentRef<typeof InsurForm>>()
const typeOptionRef = ref<ComponentRef<typeof TypeOption>>()
let sendMessage = ''
let appointmentType = 'normal'

const store = {
  doctorId: ref<ComponentOptions[]>([]),
  hospitalId: ref<ComponentOptions[]>([]),
  importantGuest: ref<ComponentOptions[]>([])
}

const schema = reactive<FormSchema[]>([
  genFormSchema('sourceSelect', 'pharmacyId', '', {
    placeholder: null,
    options: undefined as any,
    labelWidth: '0',
    span: 8
  }),
  genFormSchema('sourceSelect', 'tempType', '', {
    placeholder: null,
    options: dict.recipeType as any,
    labelWidth: '0',
    span: 6
  }),
  genFormSchema('autocomplete', '', '', {
    url: '',
    itemValue: 'drugName',
    itemLink: 'drugId',
    placeholder: '藥品名稱/拼音',
    labelWidth: '0',
    span: 10
  }),
  genFormSchema('hidden', 'drugPrice', '單價', { placeholder: null }),
  genFormSchema('input', 'drugUnitnum', '用量', { placeholder: null, labelWidth: '50px', span: 8 }),
  genFormSchema('blank', 'addDrugBtn', '', { span: 4 }),
  genFormSchema('checkbox', 'riHideRecipel', '', { options: dict.reciHide, value: [], span: 6 }),
  genFormSchema('input', 'riRecipelName', '處方名稱', { placeholder: null, span: 6 }),
  genFormSchema('divider', '', '用藥說明'),
  genFormSchema('radio', 'dosageform', '劑型', {
    options: dict.dosageform,
    value: '',
    required: true,
    span: 24
  }),
  genFormSchema('radio', 'subDosageform', '', {
    options: undefined,
    labelWidth: '0',
    value: '',
    span: 0
  }),
  genFormSchema('radio', 'useRoute', '給葯途徑', {
    options: dict.useRoute,
    value: '',
    required: true,
    span: 24
  }),
  genFormSchema('blank', 'totalAmountSpan', '', { span: 3 }),
  genFormSchema('input', 'totalNum', '共', {
    placeholder: null,
    required: true,
    span: 4,
    labelWidth: '50px'
  }),
  genFormSchema('input', 'splitNum', '劑', {
    placeholder: null,
    required: true,
    span: 4,
    labelWidth: '50px'
  }),
  genFormSchema('input', 'splitDay', '劑服', {
    placeholder: null,
    required: true,
    span: 4,
    labelWidth: '50px'
  }),
  genFormSchema('blank', 'totalAmountEndSpan', '', { span: 1 }),
  genFormSchema('input', 'dailyNum', '每日', {
    placeholder: null,
    required: true,
    span: 4,
    labelWidth: '50px'
  }),
  genFormSchema('apiSelect', 'onceNumSelect', '次一次', {
    placeholder: null,
    api: async () => {
      return await getInOptionFormat('sys/dict/query/ml_config', 'code', 'value')
    },
    required: true,
    span: 4,
    labelWidth: '70px'
  }),
  genFormSchema('input', 'onceNum', '用量', { placeholder: null, required: true, span: 0 }),
  genFormSchema('apiRadio', 'medicineTime', '用藥時間', {
    api: async () => {
      return await getInOptionFormat('recipel/dict/medicine_time', 'value', 'label')
    },
    value: '',
    span: 18
  }),
  genFormSchema('blank', 'medicineTimeBtn', '', { span: 6 }),
  genFormSchema('textarea', 'supplement', '用藥補充說明', {
    placeholder: '如有其他服藥說明，請在此填寫',
    span: 24
  }),
  genFormSchema('divider', '', '煎藥說明'),
  genFormSchema('blank', 'groupDrugsSpan', '', { span: 4 }),
  genFormSchema('input', 'firstBrewingTime', '一煎', {
    placeholder: null,
    required: true,
    span: 4,
    labelWidth: '50px'
  }),
  genFormSchema('blank', 'firstBrewingTimeAfter', '', { span: 4 }),
  genFormSchema('input', 'secondBrewingTime', '二煎', {
    placeholder: null,
    span: 4,
    labelWidth: '50px'
  }),
  genFormSchema('blank', 'secondBrewingTimeAfter', '', { span: 4 }),
  genFormSchema('input', 'thirdBrewingTime', '三煎', {
    placeholder: null,
    span: 4,
    labelWidth: '50px'
  }),
  genFormSchema('divider', '', '煎藥補充說明'),
  genFormSchema('textarea', 'decoction', '煎藥補充說明', {
    placeholder: '如有某單個藥品需要單獨處理，或者需要特殊備註煎煮時間請填寫',
    span: 24
  }),
  genFormSchema('apiCheckbox', 'avoid', '忌口', {
    api: async () => {
      return await getInOptionFormat('recipel/dict/avoid', 'value', 'label')
    },
    value: [],
    span: 24
  }),
  genFormSchema('apiCheckbox', 'taboo', '禁忌', {
    api: async () => {
      return await getInOptionFormat('recipel/dict/taboo', 'value', 'label')
    },
    value: [],
    span: 24
  }),
  genFormSchema('checkbox', 'self', '', { options: dict.allself, value: [] })
])

const { register, methods, elFormRef } = useForm({
  schema
})

const loading = ref(false)

const save = async () => {}

const rules = []

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    const { setValues } = methods
    setValues({
      ...currentRow,
      timeRange: [currentRow.appointmentTimeStart, currentRow.appointmentTimeEnd]
    })
  },
  {
    deep: true,
    immediate: true
  }
)

const addDrug = () => {}
</script>

<template>
  <ElRow>
    <ElCol :span="12">
      <el-divider content-position="left">書寫處方</el-divider>
    </ElCol>
    <ElCol :span="12">
      <el-divider content-position="right"
        >處方金額：<span class="text-xl text-red-500">0</span>元</el-divider
      >
    </ElCol>
  </ElRow>
  <Form :rules="rules" @register="register">
    <template #addDrugBtn>
      <ElButton type="primary" @click="addDrug">添加</ElButton>
    </template>
    <template #totalAmountSpan>
      <span class="w-[100%] text-right">用量</span>
    </template>
    <template #totalAmountEndSpan>
      <span class="w-[100%]">天</span>
    </template>
    <template #groupDrugsSpan>
      <span class="w-[100%] text-right">群葯煎煮時間</span>
    </template>
    <template #firstBrewingTimeAfter>
      <span class="">分<span style="color: #ccc">(建議20-45分鐘)&nbsp;&nbsp;</span></span>
    </template>
    <template #secondBrewingTimeAfter>
      <span class="">分<span style="color: #ccc">(建議15-20分鐘)&nbsp;&nbsp;</span></span>
    </template>
  </Form>
</template>
