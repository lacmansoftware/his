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

import {
  getTableListApi,
  delTableListApi,
  saveTableApi
} from '@/api/base/doctor/medicalRecordAudit'
import { NotChargedTableData } from '@/api/base/doctor/medicalRecordAudit/types'
import { dateCompare } from '@/utils/date'
import { genTableSchema, genSearchSchema } from '@/utils/schema'
import dict from '@/config/dictionary.json'

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

getList()

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action',
    width: '150px'
  },
  {
    label: '審核狀態',
    field: 'status',
    width: '60px',
    formatter: function (row) {
      return inDict(row.status, 'checked')
    }
  },
  {
    label: '就診類型',
    field: 'type',
    width: '60px',
    formatter: function (row) {
      if ('online' === row.ooClass) {
        return '網診'
      }
      return inDict(row.type, 'offlineRecipelType2')
    }
  },
  {
    label: '就診門店',
    field: 'hospitalName',
    width: '60px',
    formatter: function (row) {
      if ('online' === row.ooClass) {
        return '網診'
      }
      return row.hospitalName
    }
  },
  { label: '看診時間', field: 'appointmentTimeStart', width: '135px' },
  { label: '挂號編號', field: 'registerNum', width: '120px' },
  { label: '客人', field: 'memberName', width: '60px' },
  {
    label: '年齡',
    field: 'birthday',
    width: '125px',
    formatter: function (row) {
      if (row.birthday) {
        return getAgeByBirthday(row.birthday)
      } else if (row.memberAge !== null) {
        return row.memberAge + '歲'
      }
    }
  },
  {
    label: '初複診',
    field: 'visitType',
    width: '100px',
    formatter: function (row) {
      return inDict(row.visitType, 'visitType')
    }
  },
  { label: '大夫', field: 'doctorName', width: '100px' },
  { label: '補錄人', field: 'createUser', width: '100px' },
  { label: '補錄時間', field: 'createTime', width: '100px' },
  { label: '審核人', field: 'approveUser', width: '100px' },
  { label: '審核時間', field: 'approveTime', width: '100px' },

  // Search Schema
  genSearchSchema('sourceSelect', 'status', '審核狀態', {
    placeholder: null,
    options: dict.checked as any
  }),
  genSearchSchema('apiSelect', 'hospitalId', '就診門店', {
    placeholder: '門店',
    api: async () => {
      return await getInOptionFormat('sys/hospital/wz999hospital', 'id', 'name')
    }
  }),
  genSearchSchema('input', 'memberName', '客人姓名', { placeholder: null }),
  genSearchSchema('input', 'memberMobile', '客人手機', { placeholder: null }),
  genSearchSchema('input', 'doctorName', '大夫', { placeholder: null }),
  genSearchSchema('datePicker', 'startTime', '補錄時間', { placeholder: '起始' }),
  genSearchSchema('datePicker', 'endTime', '到', { placeholder: '結束' })
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
  // if (
  //   row.productInventory.totalQty < row.minAlertQty ||
  //   row.productInventory.totalQty > row.maxAlertQty
  // ) {
  //   return 'tr-danger-row'
  // }

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
  // await setValues({
  //   startTime: getDateInFormat(new Date(), '-')
  // })
  // search()
  // const res = genSearchSchema('sourceSelect', 'createFrom', '訂單來源', {
  //   options: dict.product.promotionWay as any
  // })
  // console.log(res)
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
      :layout="'bottom'"
      :buttom-position="'right'"
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
        <ElLink
          v-if="row.inspectStatus === 'N'"
          type="primary"
          @click="settlement(row)"
          class="mr-5px"
          >檢查</ElLink
        >
        <ElLink v-else type="primary" @click="settlement(row)" class="mr-5px">查看</ElLink>
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
