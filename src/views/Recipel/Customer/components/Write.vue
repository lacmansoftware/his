<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, onMounted } from 'vue'
import { TableData } from '@/api/table/types'
// import { useValidator } from '@/hooks/web/useValidator'
import { getApi } from '@/api/common'
import dict from '@/config/dictionary.json'
import {
  ElForm,
  ElRow,
  ElCol,
  ElFormItem,
  ElAutocomplete,
  ElInput,
  ElDivider,
  ElSelect,
  ElOption
} from 'element-plus'

// const { required } = useValidator()

const writeForm = reactive<{
  doctorId: any
  doctorFilter: any
  memberFilter: any
  memberName: string
  memberId: string
  memberSex: string
  memberMobile: string
  memberBirthday: string
  memberAge: string
  slaveSymptom: string
  medicalHistory: string
  pharmacyId: string
  drugType: string
  drugFilter: string
}>({
  doctorId: null,
  doctorFilter: null,
  memberFilter: null,
  memberName: '',
  memberId: '',
  memberSex: '',
  memberMobile: '',
  memberBirthday: '',
  memberAge: '',
  slaveSymptom: '',
  medicalHistory: '',
  pharmacyId: '',
  drugType: '',
  drugFilter: ''
})

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<TableData>>,
    default: () => null
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  params: {
    type: Object,
    default: () => {
      type: null
    }
  },
  store: {
    type: Object,
    default: () => {}
  }
})

const rules = reactive({
  // title: [required()],
  // author: [required()],
  // importance: [required()],
  // pageviews: [required()],
  // display_time: [required()],
  // content: [required()]
})

const { register, methods, elFormRef, formRef } = useForm({
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
  formRef,
  elFormRef,
  getFormData: methods.getFormData,
  setValues: methods.setValues
})

onMounted(() => {
  // console.log(elFormRef)
  // console.log(formRef)
})

const doctorFilterSearch = async (queryString: string, cb: Fn): Promise<any> => {
  const res = await getApi(`/doctor/query?keyWords=${queryString}`)
  const result = res?.data.map((item) => ({
    ...item,
    value: item.doctorName,
    link: item.doctorMobile
  }))
  cb(result)
}

const memberFilterSearch = async (queryString: string, cb: Fn): Promise<any> => {
  const res = await getApi(`/member/info/query?keyWords=${queryString}`)
  const result = res?.data.map((item) => ({
    ...item,
    value: item.memberName,
    link: item.memberMobile
  }))
  cb(result)
}

const drugFilterSearch = async (queryString: string, cb: Fn): Promise<any> => {
  const res = await getApi(
    `/recipel/drug?keyWords=${queryString}&pharmacyId=${writeForm.pharmacyId}&drugType=${writeForm.drugType}&doctorId=${writeForm.doctorId}`
  )
  const result = res?.data.map((item) => ({
    ...item,
    value: item.drugName,
    link: item.drugName
  }))
  cb(result)
}

const handleMemberFilterSelect = (item: Recordable) => {
  console.log(item)
  // const { setValues } = methods

  // setValues({
  //   memberId: item.id,
  //   name: item.name,
  //   mobile: item.mobile,
  //   latestHandleTime: returnDateString(60),
  //   nextContactTime: returnDateString(15)
  // })
  // contactUserId.value = item.id
}

const handleDrugFilterSelect = (item: Recordable) => {
  console.log(item)
  // const { setValues } = methods

  // setValues({
  //   memberId: item.id,
  //   name: item.name,
  //   mobile: item.mobile,
  //   latestHandleTime: returnDateString(60),
  //   nextContactTime: returnDateString(15)
  // })
  // contactUserId.value = item.id
}

onMounted(() => {
  console.log(props.store)
})

const handleDoctorFilterSelect = () => {}
</script>

<template>
  <Form :rules="rules" @register="register"> abc </Form>
  <ElForm :model="writeForm">
    <ElRow :gutter="20">
      <ElCol :span="4">方式：照方抓藥</ElCol>
      <ElCol :span="10">
        <ElFormItem prop="doctorFilter" label="醫生：">
          <ElAutocomplete
            v-model="writeForm.doctorFilter"
            :fetch-suggestions="doctorFilterSearch"
            @select="handleDoctorFilterSelect"
            class="w-[100%]"
            :trigger-on-focus="false"
          >
            <template #default="{ item }">
              <div class="flex w-full" justify="evenly">
                <span class="flex-1">{{ item.value }}</span>
                <span class="flex-1">{{ item.link }}</span>
              </div>
            </template>
          </ElAutocomplete>
        </ElFormItem>
      </ElCol>
      <ElCol :span="10">
        <ElFormItem prop="memberFilter" label="患者：">
          <ElAutocomplete
            v-model="writeForm.memberFilter"
            :fetch-suggestions="memberFilterSearch"
            @select="handleMemberFilterSelect"
            class="w-[100%]"
            :trigger-on-focus="false"
          >
            <template #default="{ item }">
              <div class="flex w-full" justify="evenly">
                <span class="flex-1">{{ item.value }}</span>
                <span class="flex-1">{{ item.link }}</span>
              </div>
            </template>
          </ElAutocomplete>
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElRow :gutter="20">
      <ElCol :span="4">
        <ElFormItem prop="memberName" label="姓名：">
          <ElInput v-model="writeForm.memberName" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="4">
        <ElFormItem prop="memberId" label="100px">
          <ElInput v-model="writeForm.memberId" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="4">
        <ElFormItem prop="memberSex" label="性別：">
          <ElInput v-model="writeForm.memberSex" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="4">
        <ElFormItem prop="memberMobile" label="手機：">
          <ElInput v-model="writeForm.memberMobile" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="4">
        <ElFormItem prop="memberBirthday" label="生日：">
          <ElInput v-model="writeForm.memberBirthday" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="4">
        <ElFormItem prop="memberAge" label="年齡：">
          <ElInput v-model="writeForm.memberAge" />
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElRow :gutter="20">
      <ElCol :span="4">
        <el-divider content-position="left">書寫病案</el-divider>
        <ElFormItem prop="slaveSymptom" label="診斷" class="el-form-item--label-top">
          <ElInput v-model="writeForm.slaveSymptom" :rows="2" type="textarea" />
        </ElFormItem>
        <ElFormItem prop="medicalHistory" label="主訴及現病史" class="el-form-item--label-top">
          <ElInput v-model="writeForm.medicalHistory" :rows="2" type="textarea" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="12">
        <ElRow>
          <ElCol :span="12">
            <el-divider content-position="left">書寫處方</el-divider>
          </ElCol>
          <ElCol :span="12">
            <el-divider content-position="right">處方金額：0元</el-divider>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="6">
            <ElFormItem prop="pharmacyId" label="" label-width="0">
              <ElSelect v-model="writeForm.pharmacyId">
                <ElOption
                  v-for="item in store.pharmacyId.value"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem prop="drugType" label="" label-width="0" :span="6">
              <ElSelect v-model="writeForm.drugType">
                <ElOption
                  v-for="item in dict.recipeType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem prop="drugFilter" label="" label-width="0" :span="12">
              <ElAutocomplete
                v-model="writeForm.drugFilter"
                :fetch-suggestions="drugFilterSearch"
                @select="handleDrugFilterSelect"
                class="w-[100%]"
                :trigger-on-focus="false"
              >
                <template #default="{ item }">
                  <div class="flex w-full" justify="evenly">
                    <span class="flex-1">{{ item.drugName }}</span>
                    <span class="flex-1">{{ item.unitStandard }}</span>
                    <span class="flex-1">{{ item.unitPrice }}</span>
                    <span class="flex-1">{{ item.currentQty }}</span>
                  </div>
                </template>
              </ElAutocomplete>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElCol>
      <ElCol :span="6">aa</ElCol>
    </ElRow>
  </ElForm>
</template>
<style lang="less" scoped>
.@{elNamespace}-form-item--label-top {
  display: inline-block !important;
  .@{elNamespace}-form-item__label {
    width: auto !important;
    float: none;
    display: inline-block !important;
    text-align: left;
    padding: 0 0 10px;
    color: red;
  }
}

.@{elNamespace}-form-item--label-top .@{elNamespace}-form-item__content {
  margin-left: 0 !important;
}
</style>
