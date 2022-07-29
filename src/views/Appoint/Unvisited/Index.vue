<script setup lang="ts">
import { reactive, ref, unref, onMounted } from 'vue'
import {
  ElFormItem,
  ElRadioGroup,
  ElRadio,
  ElButton,
  ElLink,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import { useRouter } from 'vue-router'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { Table } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { inDict, getInOptionFormat, getDateInFormat, getAgeByBirthday } from '@/utils/common'
import { downloadIcon } from '@/utils/iconList'
import Write from '@/views/Cash/NotCharged/components/Write.vue'

import { delTableListApi, saveTableApi } from '@/api/appoint/regist/registered'
import { AppointRegisteredTableData } from '@/api/appoint/regist/registered/types'
import { dateCompare } from '@/utils/date'
import dict from '@/config/dictionary.json'
import { PATH_URL } from '@/config/axios'
import { getApi, postApi } from '@/api/common'
import InsurForm from '../Regist/components/InsurForm.vue'
import PackagePay from '../Regist/components/PackagePay.vue'
import { genSearchSchema, getSchemaOptions, getSelectText, getValue } from '@/utils/schema'
import { useEmitt } from '@/hooks/web/useEmitt'

defineOptions({
  name: 'CashNotChargedIndex'
})

const hasInsurRef = ref('N')
const isInsur = ref('')
const warning = ref(false)
const endInsurTime = ref('')
const currentRow = ref<any>({})
const insurFormRef = ref<ComponentRef<typeof InsurForm>>()
const searchRef = ref<ComponentRef<typeof Search>>()

const store = {
  type: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

const { push } = useRouter()

const getTableListApi = (params: any) => {
  return getApi('member/visit/record/unVisitList', params)
}

const { register, tableObject, methods } = useTable<AppointRegisteredTableData>({
  getListApi: getTableListApi,
  delListApi: delTableListApi,
  response: {
    list: 'data',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

// getList()

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action',
    width: '180px',
    form: { show: false }
  },
  {
    label: '處理狀態',
    field: 'unVisitStatus',
    width: '80px',
    formatter: function (row) {
      if (row.unVisitStatus === 'Y') {
        return '已回訪'
      }
      if (row.unVisitStatus === 'N') {
        return '已過期'
      } else return '未回訪'
    }
  },
  { label: '回訪備註', field: 'comment', width: '150px' },
  {
    label: '地點',
    field: 'hospitalName',
    width: '50px',
    formatter: function (row) {
      return row.hospitalName ? row.hospitalName : '網診'
    }
  },
  { label: '大夫', field: 'doctorName', width: '50px' },
  { label: '最後看診時間', field: 'createTime', width: '150px' },
  { label: '建議複診時間', field: 'newFurtherTime', width: '80px' },
  { label: '姓名', field: 'memberName', width: '60px' },
  {
    label: '手機號碼',
    field: 'memberMobile',
    width: '150px',
    formatter: function (row) {
      return row.memberMobile
    }
  },
  {
    label: '性別',
    field: 'gender',
    width: '40px',
    formatter: function (row) {
      return inDict(row.gender, 'sex')
    }
  },
  {
    label: '年齡',
    field: 'birthday',
    width: '50px',
    formatter: function (row) {
      return getAgeByBirthday(row.birthday)
    }
  },
  { label: '回訪人', field: 'createUserName', width: '80px' },
  { label: '回訪時間', field: 'visitCreateTime', width: '100px' },
  {
    label: '過期后預約數',
    field: 'countAppoint',
    width: '80px',
    formatter: function (row) {
      return row.countAppoint
    }
  },
  { label: '客人級別', field: 'memberLevelName', width: '50px' },
  {
    label: '初複診',
    field: 'visitStatus',
    width: '50px',
    formatter: function (row) {
      return inDict(row.visitStatus, 'visitType')
    }
  },
  {
    label: '約診類型',
    field: 'appointmentType',
    width: '80px',
    formatter: function (row) {
      return inDict(row.appointmentType, 'isSpecialist')
    }
  },
  { label: '套餐', field: 'packageName', width: '40px' },
  { label: '專科', field: 'specialName', width: '40px' },
  {
    label: '加診',
    field: 'pendingFlag',
    width: '40px',
    formatter: function (row) {
      return inDict(row.pendingFlag, 'appoint.pendingFlag')
    }
  },
  {
    label: '渠道',
    field: 'source',
    width: '40px',
    formatter: function (row) {
      return inDict(row.source, 'appoint.source')
    }
  },
  { label: '重要客人', field: 'importantGuestName', width: '80px' },
  { label: '客人來源', field: 'memberSource', width: '80px' },
  { label: '備註', field: 'note', width: '100px' },
  {
    label: '保險',
    width: '100px',
    formatter: function (row) {
      var hasInsur =
        row.insurName || (row.hasHighMedicalInsurance === 1 ? '用戶選擇了高端保險' : '無')
      if (hasInsur) {
        return hasInsur
      }
      return '無'
    }
  },

  // Search Schema
  genSearchSchema('apiSelect', 'hospitalId', '地點', {
    placeholder: '請選擇',
    api: async () => {
      return await getInOptionFormat('sys/hospital/wz999hospital', 'id', 'name')
    },
    filterable: true
  }),
  genSearchSchema('apiSelect', 'doctorId', '大夫', {
    placeholder: '請填寫',
    api: async () => {
      return await getInOptionFormat('doctor/getAuthPass', 'id', 'name')
    },
    filterable: true
  }),
  genSearchSchema('input', 'memberName', '客人姓名', { placeholder: '請填寫' }),
  genSearchSchema('input', 'memberMobile', '手機', { placeholder: '請填寫' }),
  genSearchSchema('sourceSelect', 'status', '處理狀態', {
    placeholder: '請選擇',
    options: dict.unVisitStatus as any
  }),
  genSearchSchema('datePicker', 'startTime', '看診時間', { placeholder: '請選擇' }),
  genSearchSchema('datePicker', 'endTime', '到', { placeholder: '請選擇' }),
  genSearchSchema('sourceSelect', 'visitType', '初複診', {
    placeholder: '請選擇',
    options: dict.visitType as any
  }),
  genSearchSchema('sourceSelect', 'appointmentType', '約診類型', {
    placeholder: '請選擇',
    options: dict.isSpecialist as any
  }),
  genSearchSchema('datePicker', 'furtherTimeStart', '建議複診時間', { placeholder: '請選擇' }),
  genSearchSchema('datePicker', 'furtherTimeEnd', '到', { placeholder: '請選擇' }),
  genSearchSchema('sourceSelect', 'source', '預約渠道', {
    placeholder: '請選擇',
    options: dict.appoint.source as any
  }),
  genSearchSchema('apiSelect', 'createUserId', '回訪人', {
    placeholder: null,
    api: async () => {
      return await getInOptionFormat('/sys/user/unVisitListUser', 'id', 'name')
    },
    filterable: true
  }),
  genSearchSchema('sourceSelect', 'unCheck', '是否凍結', {
    placeholder: null,
    options: dict.unCheck as any
  })
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)

const dialogTitle = ref('')
const dialogWidth = ref('')

const delLoading = ref(false)

const delData = async (row: AppointRegisteredTableData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

const actionType = ref('')

const AddAction = () => {
  // push(`/cash/notcharged/add`)
}

const writeRef = ref<ComponentRef<typeof Write>>()

const action = (row: AppointRegisteredTableData, type: string) => {
  dialogTitle.value = type === 'edit' ? '修改短信模板' : 'exampleDemo.detail'
  actionType.value = type
  tableObject.currentRow = row
  dialogVisible.value = true
}

const loading = ref(false)

const setValues = (value) => {
  const search = unref(searchRef)
  search?.setValues(value)
}

const search = () => {
  const search = unref(searchRef)
  search!.search()
}

const save = async () => {
  if (actionType.value === 'update_insur') {
    const insur = unref(insurFormRef)
    let insurId = await getValue(insur?.methods, 'memberInsur')
    const insurName = await getSelectText(insur?.methods, insur?.schema, 'memberInsur')
    let memberInsurId = ''
    if (!isInsur.value) {
      ElMessage.error('請先選擇是否有保險')
      return
    }
    if (isInsur.value === 'Y') {
      let isInsurFormValid = false
      await insur?.elFormRef?.validate(async (isValid) => {
        isInsurFormValid = isValid
      })
      if (!isInsurFormValid) return
      if (hasInsurRef.value !== 'N') {
        memberInsurId = insurId
        insurId = getSchemaOptions(insur?.schema, 'memberInsur')[0]!.insurId
      }
    } else {
      insurId = ''
      memberInsurId = ''
    }
    const data: any = await insur?.methods?.getFormData()
    data.regId = currentRow.value?.id
    data.insurName = insurName
    data.insurId = insurId
    data.isInsur = isInsur.value
    data.memberInsurId = memberInsurId
    data.updateReg = 1
    loading.value = true
    postApi('/member/appointment/registeration/reg', data)
      .then((result) => {
        if (result?.success) {
          ElMessage.success(result.msg as string)
          search()
          dialogVisible.value = false
        } else {
          ElMessage.error(result.msg as string)
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.paymentStatus === 'PAYED') {
    return 'tr-danger-row'
  }
  return ''
}

const settlement = (row: AppointRegisteredTableData) => {
  // push({
  //   name: 'CashNotChargedAdd',
  //   params: {
  //     id: row.id,
  //     // wxId: row.wxId,
  //     memberId: row.memberId,
  //     memberInsurId: row.memberInsurId,
  //     isCache: row.isCache,
  //     ooClass: 'offline',
  //     // sheet: row.sheet,
  //     doctorName: row.doctorName,
  //     doctorId: row.doctorId
  //   }
  // })
}

onMounted(async () => {
  setStore('type', '/sys/dict/type/sms_tmp_type', 'code', 'value')
  await setValues({
    status: 'W',
    unCheck: 'Y'
  })
  search()
})

const canMakeUp = (orderType) => {
  return (
    orderType !== 'buyCard' &&
    orderType !== 'recharge' &&
    orderType !== 'package' &&
    orderType !== 'specialist'
  )
}

const exportExcel = async () => {
  const search = unref(searchRef)
  const data = (await search?.getFormData()) as any
  const queryParams = new URLSearchParams({
    status: 'YGH',
    dateStart: data.dateStart || '',
    dateEnd: data.dateEnd || '',
    memberName: data.memberName || '',
    memberMobile: data.memberMobile || '',
    archivesNo: data.archivesNo || '',
    doctorId: data.doctorId || '',
    memberLevel: data.memberLevel || '',
    visitType: data.visitType || '',
    appointmentType: data.appointmentType || '',
    marketActivity: data.marketActivity || '',
    firstDisease: data.firstDisease || ''
  })

  const path = `${PATH_URL}/member/appointment/registeration/list/exportRegisteration?${queryParams.toString()}`
  window.open(path, '_blank')
}

const backReg = (row) => {
  ElMessageBox.confirm('確認要退號嗎?', t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  }).then(() => {
    postApi('/member/appointment/registeration/back', {
      id: row.id
    }).then((result) => {
      if (result.success) {
        ElMessage.success(result.msg as string)
        search()
      } else {
        ElMessage.error(result.msg as string)
      }
    })
  })
}

const updateInsur = (row) => {
  currentRow.value = row
  actionType.value = 'update_insur'
  dialogTitle.value = '選擇保險'
  dialogVisible.value = true
  dialogWidth.value = '80%'
}

const packagePay = (row) => {
  currentRow.value = row
  actionType.value = 'package_pay'
  dialogTitle.value = '修改約診類型'
  dialogVisible.value = true
  dialogWidth.value = '70%'
}

useEmitt({
  name: 'hasInsur',
  callback: (val: string) => {
    hasInsurRef.value = val
  }
})
useEmitt({
  name: 'setEndInsurTime',
  callback: (val: string) => {
    endInsurTime.value = val
  }
})
useEmitt({
  name: 'trigWarning',
  callback: (val: boolean) => {
    warning.value = val
  }
})
</script>

<template>
  <ContentWrap>
    <Search
      :schema="allSchemas.searchSchema"
      :is-col="true"
      :inline="false"
      :layout="'bottom'"
      :buttom-position="'right'"
      @search="setSearchParams"
      @reset="setSearchParams"
      ref="searchRef"
    />

    <div class="mb-10px ml-10px mt-[-32px]">
      <ElButton type="warning" @click="exportExcel" :icon="downloadIcon">導出</ElButton>
    </div>

    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
      :row-class-name="tableRowClassName"
    >
      <template #action="{ row }">
        <ElLink v-if="row.status !== 'YTH'" type="primary" @click="backReg(row)" class="mr-5px"
          >退號</ElLink
        >
        <ElLink v-if="row.status !== 'YTH'" type="primary" @click="updateInsur(row)" class="mr-5px"
          >更新保險</ElLink
        >
        <ElLink
          v-if="row.status !== 'YTH' && row.paymentStatus === 'UNPAY'"
          type="primary"
          @click="packagePay(row)"
          class="mr-5px"
          >改套餐</ElLink
        >
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth">
    <div v-if="actionType === 'update_insur'">
      <div class="flex items-center justify-between">
        <ElFormItem label="是否有保險" class="ml-6">
          <ElRadioGroup v-model="isInsur">
            <ElRadio label="Y">是</ElRadio>
            <ElRadio label="N">否</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <span v-if="warning" class="text-red-500">客人未登記過保險</span>
        <span v-if="endInsurTime" class="mr-6 text-red-500">{{ endInsurTime }}</span>
      </div>
      <InsurForm
        v-if="isInsur !== 'N'"
        ref="insurFormRef"
        page-type="update_insur"
        :current-row="currentRow"
      />
    </div>
    <PackagePay v-if="actionType === 'package_pay'" :current-row="currentRow" />

    <template #footer>
      <ElButton type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>

<style scoped>
.success-row {
  background: red;
}
</style>
