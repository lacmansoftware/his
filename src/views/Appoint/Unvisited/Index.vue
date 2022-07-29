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
import { plusIcon, minusIcon } from '@/utils/iconList'
import Write from '@/views/Cash/NotCharged/components/Write.vue'

import { delTableListApi, saveTableApi } from '@/api/appoint/regist/registered'
import { AppointRegisteredTableData } from '@/api/appoint/regist/registered/types'
import { dateCompare } from '@/utils/date'
import dict from '@/config/dictionary.json'
import { PATH_URL } from '@/config/axios'
import { getApi, postApi } from '@/api/common'
import InsurForm from '../Regist/components/InsurForm.vue'
import PackagePay from '../Regist/components/PackagePay.vue'
import {
  genSearchSchema,
  genFormSchema,
  getSchemaOptions,
  getSelectText,
  getValue
} from '@/utils/schema'
import { useEmitt } from '@/hooks/web/useEmitt'
import AddUncheck from './components/AddUncheck.vue'
import SimpleCrudTable from '@/views/common/SimpleCrudTable.vue'

defineOptions({
  name: 'CashNotChargedIndex'
})

const hasInsurRef = ref('N')
const isInsur = ref('')
const warning = ref(false)
const endInsurTime = ref('')
const currentRow = ref<any>({})
const deleteUncheckRef = ref<ComponentRef<typeof SimpleCrudTable>>()
const addUncheckRef = ref<ComponentRef<typeof AddUncheck>>()
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
  if (actionType.value === 'add_uncheck') {
    const addUncheck = unref(addUncheckRef)
    const data = await addUncheck.methods.getFormData()
    postApi('/member/visit/record/addUncheckMember', data)
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
  } else if (actionType.value === 'delete_uncheck') {
    const deleteUncheckComp = unref(deleteUncheckRef)
    const data = await deleteUncheckComp?.methods?.getSelections()
    const ids = data?.map((item) => item.id).join(',')

    postApi('/member/visit/record/deleteUncheckMember', { id: ids })
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

const addUncheck = (row) => {
  currentRow.value = row
  actionType.value = 'add_uncheck'
  dialogTitle.value = '新增凍結'
  dialogVisible.value = true
  dialogWidth.value = '30%'
}

const deleteUncheck = (row) => {
  currentRow.value = row
  actionType.value = 'delete_uncheck'
  dialogTitle.value = '解除凍結'
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

const deleteUncheckSchema = [
  { label: '姓名', field: 'name' },
  { label: '手機', field: 'mobile' },
  {
    label: '狀態',
    field: 'status',
    formatter: function () {
      return '已凍結'
    }
  },
  { label: '凍結時間', field: 'createTime' },
  {
    label: '重要客人',
    field: 'importantGuest',
    formatter: function (row) {
      return (row.importantGuest || '') + ' ' + (row.importantGuestComment || '')
    }
  },
  { label: '操作人', field: 'createUser' },

  genSearchSchema('input', 'search', '患者姓名/手機', {
    placeholder: '患者姓名/手機',
    labelWidth: '150px',
    span: 12
  })
]
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
      <ElButton type="primary" @click="addUncheck" :icon="plusIcon">新增凍結</ElButton>
      <ElButton type="warning" @click="deleteUncheck" :icon="minusIcon">解凍客人</ElButton>
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
        <ElLink
          v-if="row.unVisitStatus !== 'Y'"
          type="primary"
          @click="addWorkOrder(row)"
          class="mr-5px"
          >回訪</ElLink
        >
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth">
    <AddUncheck v-if="actionType === 'add_uncheck'" ref="addUncheckRef" :current-row="currentRow" />
    <SimpleCrudTable
      v-if="actionType === 'delete_uncheck'"
      ref="deleteUncheckRef"
      :current-row="currentRow"
      :url="`member/visit/record/uncheckMember`"
      :schema="deleteUncheckSchema"
    />

    <template #footer>
      <ElButton type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
