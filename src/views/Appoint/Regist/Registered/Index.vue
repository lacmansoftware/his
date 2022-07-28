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

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/appoint/regist/registered'
import { AppointRegisteredTableData } from '@/api/appoint/regist/registered/types'
import { dateCompare } from '@/utils/date'
import dict from '@/config/dictionary.json'
import { PATH_URL } from '@/config/axios'
import { postApi } from '@/api/common'
import InsurForm from '../components/InsurForm.vue'
import { getSchemaOptions, getSelectText, getValue } from '@/utils/schema'
import { useEmitt } from '@/hooks/web/useEmitt'

defineOptions({
  name: 'CashNotChargedIndex'
})

const hasInsurRef = ref('N')
const isInsur = ref('')
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
    label: '狀態',
    field: 'status',
    width: '100px',
    formatter: function (row) {
      return inDict(row.status, 'appoint.status')
    }
  },
  {
    label: '門店',
    field: 'hospitalName',
    width: '100px'
  },
  {
    label: '客人姓名',
    field: 'memberName',
    width: '50px'
  },
  {
    label: '手機',
    field: 'memberMobile',
    width: '70px'
  },
  {
    label: '性別',
    field: 'memberGender',
    width: '50px',
    formatter: function (row) {
      return inDict(row.memberGender, 'sex')
    }
  },
  {
    label: '年齡',
    field: 'memberBirthday',
    width: '70px',
    formatter: function (row) {
      return getAgeByBirthday(row.memberBirthday)
    }
  },
  {
    label: '醫生',
    field: 'doctorName',
    width: '50px'
  },
  {
    label: '約診類型',
    field: 'appointmentType',
    width: '70px',
    formatter: function (row) {
      return inDict(row.appointmentType, 'isSpecialist')
    }
  },
  {
    label: '套餐',
    field: 'packageName',
    width: '70px'
  },
  {
    label: '專科名稱',
    field: 'specialistName',
    width: '80px'
  },
  {
    label: '挂號時間',
    field: 'registerDate',
    width: '80px'
  },
  {
    label: '預約時間',
    field: 'appointmentTimeStart',
    width: '80px'
  },
  {
    label: '客人級別',
    field: 'memberLevelName',
    width: '100px'
  },
  {
    label: '檔案號',
    field: 'archivesNo',
    width: '80px'
  },
  {
    label: '初複診',
    field: 'visitType',
    width: '100px',
    formatter: function (row) {
      return inDict(row.visitType, 'visitType')
    }
  },
  {
    label: '重要客人',
    field: 'importantGuestName',
    width: '100px'
  },
  {
    label: '保險',
    field: 'insurName',
    width: '100px'
  },
  {
    label: '備註',
    field: 'note',
    width: '100px',
    formatter: function (row) {
      // if (row.paymentStatus == 'PAYED') {
      //   highLight.push(row._uuid)
      // }
      return row.note
    }
  },
  {
    label: '高端醫療險種類',
    field: 'hasHighMedicalInsurance',
    width: '100px',
    formatter: function (row) {
      return inDict(row.hasHighMedicalInsurance, 'appoint.hasHighMedicalInsurance')
    }
  },

  // Search Schema
  {
    field: 'memberName',
    label: '客人姓名',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '請填寫'
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'memberMobile',
    label: '手機號',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '請填寫'
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'archivesNo',
    label: '檔案號',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '請填寫'
      },
      colProps: { span: 6 }
    }
  },
  {
    label: '醫生',
    field: 'doctorId',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        filterable: true
      },
      colProps: { span: 6 },
      api: async () => {
        return await getInOptionFormat('/doctor', 'id', 'name')
      }
    }
  },
  {
    field: 'dateStart',
    label: '挂號日期',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        placeholder: '挂號日期'
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'dateEnd',
    label: '到',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD'
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'memberLevel',
    label: '會員級別',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        filterable: true
      },
      colProps: { span: 6 },
      api: async () => {
        return await getInOptionFormat('/sys/member/level', 'id', 'levelName')
      }
    }
  },
  {
    field: 'visitType',
    label: '初複診',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        filterable: true,
        options: dict.visitType as any
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'appointmentType',
    label: '約診類型',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        filterable: true,
        options: dict.isSpecialist as any
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'marketActivity',
    label: '活動',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        filterable: true
      },
      colProps: { span: 6 },
      api: async () => {
        return await getInOptionFormat('/market/activity/list?pageSize=0&type=0', 'id', 'name')
      }
    }
  },
  {
    field: 'firstDisease',
    label: '病種',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        filterable: true
      },
      colProps: { span: 6 },
      api: async () => {
        return await getInOptionFormat('/sys/diseases', 'id', 'name')
      }
    }
  }
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
    dateStart: getDateInFormat(new Date(), '-'),
    dateEnd: getDateInFormat(new Date(), '-')
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

useEmitt({
  name: 'hasInsur',
  callback: (val: string) => {
    hasInsurRef.value = val
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
          @click="settlement(row)"
          class="mr-5px"
          >改套餐</ElLink
        >
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth">
    <div v-if="actionType === 'update_insur'">
      <ElFormItem label="是否有保險" class="ml-6">
        <ElRadioGroup v-model="isInsur">
          <ElRadio label="Y">是</ElRadio>
          <ElRadio label="N">否</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <InsurForm
        v-if="isInsur !== 'N'"
        ref="insurFormRef"
        page-type="update_insur"
        :current-row="currentRow"
      />
    </div>

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
