<script setup lang="ts">
import { reactive, ref, unref, onMounted } from 'vue'
import { ElButton, ElLink, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { Table } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { inDict, getInOptionFormat, getDateInFormat, getAgeByBirthday } from '@/utils/common'
import { plusIcon } from '@/utils/iconList'
import Write from '@/views/Cash/NotCharged/components/Write.vue'

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/appoint/regist/registered'
import { NotChargedTableData } from '@/api/appoint/regist/registered/types'
import { dateCompare } from '@/utils/date'

defineOptions({
  name: 'CashNotChargedIndex'
})

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
    field: 'member',
    label: '客人',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '客人姓名/手機'
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'doctor',
    label: '醫生',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '醫生姓名/手機'
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'registerNum',
    label: '挂號編號',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '挂號編號'
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'registerTimeStart',
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
    field: 'registerTimeEnd',
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
    field: 'createTimeStart',
    label: '創建日期',
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
    field: 'createTimeEnd',
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
    field: 'paymentCategory',
    label: '支付類別',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        placeholder: '支付類別',
        options: [
          { value: 'YSK', label: '預收款' },
          { value: 'SFK', label: '實付款' }
        ] as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'needExpress',
    label: '',
    labelWidth: '0',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Checkbox',
      componentProps: {
        options: [{ value: 'EXPRESS', label: '需要快遞' }]
      },
      colProps: { span: 6 },
      value: []
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)

const dialogTitle = ref('')
const dialogWidth = ref('')

const delLoading = ref(false)

const delData = async (row: NotChargedTableData | null, multiple: boolean) => {
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
  push(`/cash/notcharged/add`)
}

const writeRef = ref<ComponentRef<typeof Write>>()

const action = (row: NotChargedTableData, type: string) => {
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
  const write = unref(writeRef)
  await write?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await write?.getFormData()) as any
      const res = await saveTableApi(
        actionType.value === 'add'
          ? data
          : {
              id: data.id,
              label: data.title,
              type: data.type,
              content: data.content
            }
      )
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      if (res) {
        dialogVisible.value = false
        ElMessage.success(res.msg as string)
        tableObject.currentPage = 1
        getList()
      }
    }
  })
}

const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.paymentStatus === 'PAYED') {
    return 'warning-row'
  }
  return ''
}

const settlement = (row: NotChargedTableData) => {
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
    createTimeStart: getDateInFormat(new Date(), '-')
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
        <ElLink v-if="row.status !== 'YTH'" type="primary" @click="settlement(row)" class="mr-5px"
          >退號</ElLink
        >
        <ElLink v-if="row.status !== 'YTH'" type="primary" @click="settlement(row)" class="mr-5px"
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
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="tableObject.currentRow"
    />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading" @click="save">
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
