<script setup lang="ts">
import { reactive, ref, unref, onMounted } from 'vue'
import { ElFormItem, ElRadioGroup, ElRadio, ElButton, ElLink, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { Table } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { inDict, getInOptionFormat, getDateInFormat, getAgeByBirthday } from '@/utils/common'
import { getTableListApi, delTableListApi } from '@/api/appoint/regist/unregistered'
import { NotChargedTableData } from '@/api/appoint/regist/unregistered/types'
import dict from '@/config/dictionary.json'
import InsurForm from '../components/InsurForm.vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { getSchemaOptions, getSelectText, getValue } from '@/utils/schema'
import { postApi } from '@/api/common'
import PackagePay from '../components/PackagePay.vue'

defineOptions({
  name: 'CashNotChargedIndex'
})

const hasInsurRef = ref('N')
const isInsur = ref('')
const warning = ref(false)
const endInsurTime = ref('')
const insurFormRef = ref<ComponentRef<typeof InsurForm>>()
const searchRef = ref<ComponentRef<typeof Search>>()

const store = {
  type: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

const { push } = useRouter()

const { register, tableObject, methods } = useTable<NotChargedTableData>({
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
    width: '100px',
    form: { show: false }
  },
  {
    label: '客人姓名',
    field: 'memberName',
    width: '80px'
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
    label: '預約日期',
    field: 'appointmentTimeStart',
    width: '80px',
    formatter: function (row) {
      return row.appointmentTimeStart.split(/\s/)[0]
    }
  },
  {
    label: '預約時段',
    field: 'appointmentTimeStart',
    width: '100px',
    formatter: function (row) {
      const start = row.appointmentTimeStart.split(/\s/)[1]
      const end = row.appointmentTimeEnd.split(/\s/)[1]
      return start + '至' + end
    }
  },
  {
    label: '客人級別',
    field: 'memberLevelName',
    width: '100px'
  },
  {
    label: '檔案號',
    field: 'archivesNo',
    width: '100px'
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
    width: '100px',
    formatter: function (row) {
      const hasInsur =
        row.insurName || (row.hasHighMedicalInsurance == 1 ? '用戶選擇了高端保險' : '無')
      if (hasInsur) {
        return hasInsur
      }
      return '無'
    }
  },
  {
    label: '是否使用公關卡',
    field: 'usePrCard',
    width: '100px',
    formatter: function (row) {
      return inDict(row.usePrCard, 'appoint.usePrCard')
    }
  },
  {
    label: '是否支付診費',
    field: 'paymentStatus',
    width: '100px',
    formatter: function (row) {
      return inDict(row.paymentStatus, 'appoint.paymentStatus')
    }
  },
  {
    label: '備註',
    field: 'note',
    width: '100px'
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
    field: 'paymentStatus',
    label: '是否支付',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        filterable: true,
        options: dict.appoint.paymentStatus as any
      },
      colProps: { span: 6 }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)

const dialogTitle = ref('')
const dialogWidth = ref('')

const actionType = ref('')

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
  if (actionType.value === 'register_insur') {
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
    data.regId = tableObject.currentRow?.id
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
  // if (row.paymentStatus === 'PAYED') {
  //   return 'tr-danger-row'
  // }
  // return ''
}

onMounted(async () => {
  setStore('type', '/sys/dict/type/sms_tmp_type', 'code', 'value')
  await setValues({
    dateStart: getDateInFormat(new Date(), '-'),
    dateEnd: getDateInFormat(new Date(), '-')
  })
  search()
})

const packagePay = (row) => {
  tableObject.currentRow = row
  actionType.value = 'package_pay'
  dialogTitle.value = '修改約診類型'
  dialogVisible.value = true
  dialogWidth.value = '70%'
}

const registerInsur = (row) => {
  tableObject.currentRow = row
  actionType.value = 'register_insur'
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
      @search="setSearchParams"
      @reset="setSearchParams"
      ref="searchRef"
    />

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
        <ElLink type="primary" @click="registerInsur(row)" class="mr-5px">挂號</ElLink>
        <ElLink
          v-if="row.paymentStatus === 'UNPAY'"
          type="primary"
          @click="packagePay(row)"
          class="mr-5px"
          >改套餐</ElLink
        >
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth">
    <div v-if="actionType === 'register_insur'">
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
        :current-row="(tableObject.currentRow as any)"
      />
    </div>

    <PackagePay v-if="actionType === 'package_pay'" :current-row="tableObject.currentRow" />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
