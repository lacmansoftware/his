<script setup lang="ts">
import { ref } from 'vue'
import { propTypes } from '@/utils/propTypes'
import {
  ElForm,
  ElDivider,
  ElCheckbox,
  ElRadio,
  ElRadioGroup,
  ElFormItem,
  ElInput,
  ElRow,
  ElCol
} from 'element-plus'
import dict from '@/config/dictionary.json'
// import { useI18n } from '@/hooks/web/useI18n'
import DeliveryTableVue from './DeliveryTable.vue'
import AddressTable from './AddressTable/Index.vue'

// const { t } = useI18n()
const props = defineProps({
  memberId: propTypes.string.def('')
})
const expressTypeRef = ref()
const useOtherExpressRef = ref(false)
const remarkRef = ref('')
const expressPriceRef = ref('')
</script>

<template>
  <ElDivider content-position="left">標註需快遞的處方</ElDivider>
  <DeliveryTableVue :member-id="memberId" />
  <ElRow>
    <ElCol :span="12">
      <ElDivider content-position="left">選擇配送方式</ElDivider>
    </ElCol>
    <ElCol :span="12">
      <ElDivider content-position="right">
        <ElCheckbox v-model="useOtherExpressRef" label="使用他人快遞" />
      </ElDivider>
    </ElCol>
  </ElRow>

  <ElForm>
    <el-radio-group v-model="expressTypeRef">
      <el-radio v-for="item in dict.noSelfExpressType" :key="item.value" :label="item.label" />
    </el-radio-group>
  </ElForm>

  <AddressTable />

  <ElDivider content-position="left">快遞備註</ElDivider>
  <ElFormItem prop="remark" label="填寫備註" label-width="150px">
    <ElInput v-model="remarkRef" :rows="2" type="textarea" />
  </ElFormItem>

  <ElDivider content-position="left"
    >快遞費用(根據公司策略調整,翼+自送和閃送將會自動添加2元費用,收銀人員無需擔心)</ElDivider
  >
  <ElFormItem prop="expressPrice" label="合計" label-width="150px">
    <ElInput v-model="expressPriceRef" />
  </ElFormItem>
</template>
