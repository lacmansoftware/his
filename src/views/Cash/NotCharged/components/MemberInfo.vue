<script setup lang="ts">
import { inDict } from '@/utils/common'
import {
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElRow,
  ElCol,
  ElDialog,
  ElMessage
} from 'element-plus'
import { onMounted, PropType, ref } from 'vue'
import { getSettlementMemberApi } from '@/api/cash/notcharged'
import { settleMemberInfoType } from '@/api/cash/notcharged/types'

const props = defineProps({
  memberInfo: {
    type: Object as PropType<Partial<settleMemberInfoType>>,
    default: () => {}
  }
})

const memberInfoRef = ref<settleMemberInfoType>()

onMounted(() => {
  console.log('props: ', props.memberInfo)
  getSettlementMemberApi({
    memberId: props.memberInfo?.memberId,
    id: props.memberInfo?.id
  }).then((res) => {
    memberInfoRef.value = res.data
    console.log('member se: ', res)
  })
})
</script>

<template>
  <div class="px-4">
    <ElRow class="text-red-600">
      遺留優惠券已經去掉，有遺留券的走公關卡，公關卡的權限只有店長有,請找店長處理!
    </ElRow>
    <ElRow class="flex justify-between">
      <span>患者： {{ memberInfoRef?.memberName }}</span>
      <span>手機： {{ memberInfoRef?.memberMobile }}</span>
      <span>性別： {{ inDict(memberInfoRef?.memberSex, 'sex') }}</span>
      <span>年齡： {{ memberInfoRef?.memberAge }}</span>
      <span>就診類型： {{ memberInfoRef?.visitType }}</span>
      <span>就診待遇： {{ memberInfoRef?.levelName }}</span>
      <span>保險： {{ memberInfoRef?.memberInsurId }}</span>
    </ElRow>
  </div>
</template>
