<script lang="ts" setup>
import { ElRow, ElCol } from 'element-plus'
import TodayAppointmentTable from './components/WaitVisitList.vue'
import WaitVisitList from './components/WaitVisitList.vue'
import DoneVisitList from './components/DoneVisitList.vue'
</script>
<template>
  <ElRow>
    <ElCol :span="12">
      <TodayAppointmentTable />
    </ElCol>
    <ElCol :span="12">
      <WaitVisitList />
    </ElCol>
  </ElRow>
  <ElRow>
    <DoneVisitList />
  </ElRow>
</template>
