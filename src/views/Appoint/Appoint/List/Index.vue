<script setup lang="ts">
import { reactive, ref, unref, onMounted, watch, computed, h } from 'vue'
import { ElButton, ElTag, ElLink, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { Table } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useValidator } from '@/hooks/web/useValidator'
import { inDict, getAgeByBirthday, getInOptionFormat } from '@/utils/common'
import { plusIcon, deleteIcon } from '@/utils/iconList'
import Write from './components/Write.vue'
import dict from '@/config/dictionary.json'
import { useDictStoreWithOut } from '@/store/modules/dict'

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/appoint/appoint/list'
import { AppointListData } from '@/api/appoint/appoint/list/types'
import { getApi } from '@/api/common'

defineOptions({
  name: 'SMSSendIndex'
})
const { required, isMobile } = useValidator()
const dictStore = useDictStoreWithOut()

const typeRef = ref('')

const store = {
  type: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

onMounted(() => {
  setStore('type', '/sys/dict/type/sms_tmp_type', 'code', 'value')
})

const { push } = useRouter()

const { register, tableObject, methods } = useTable<MemberInfoTableData>({
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

const handleTypeChange = (item: Recordable) => {
  typeRef.value = item
}

const handleTempletChange = (item: Recordable) => {
  const curTemplet = store.templet.value.find((tmp) => tmp.value === item)

  const write = unref(writeRef)
  write?.setValues({
    content: curTemplet?.content
  })
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action',
    width: '250px',
    form: { show: false }
  },
  {
    label: '門店',
    field: 'hospitalName',
    width: '80px'
  },
  {
    label: '醫生',
    field: 'doctorName',
    width: '50px'
  },
  {
    label: '操作日期',
    field: 'createTime',
    width: '80px',
    formatter: function (row: AppointListData) {
      return row.createTime.substr(0, 10)
    }
  },
  {
    label: '約診時間',
    field: 'appointmentTimeStart',
    width: '80px'
  },
  {
    label: '客人姓名',
    field: 'memberName',
    width: '60px'
  },
  {
    label: '性別',
    field: 'memberGender',
    width: '40px',
    formatter: function (row: AppointListData) {
      return inDict(row.memberGender, 'sex')
    }
  },
  {
    label: '手機',
    field: 'memberMobile',
    width: '150px'
  },
  {
    label: '狀態',
    field: 'status',
    width: '80px',
    formatter: function (row: AppointListData) {
      return inDict(row.status, 'appoint.status')
    }
  },
  {
    label: '加診',
    field: 'pendingFlag',
    width: '100px',
    formatter: function (row: AppointListData) {
      return inDict(row.pendingFlag, 'appoint.pendingFlag')
    }
  },
  {
    label: '支付診費',
    field: 'paymentStatus',
    width: '60px',
    formatter: function (row: AppointListData) {
      return h(
        ElTag,
        {
          type: row.paymentStatus === 'PAYED' ? 'success' : 'danger'
        },
        () => inDict(row.paymentStatus, 'appoint.paymentStatus')
      )
    }
  },
  {
    label: '備註',
    field: 'note',
    width: '100px'
  },
  {
    label: '客人級別',
    field: 'levelName',
    width: '100px'
  },
  {
    label: '初複診',
    field: 'visitType',
    width: '50px',
    formatter: function (row: AppointListData) {
      return inDict(row.visitType, 'visitType')
    }
  },
  {
    label: '客人來源',
    field: 'memberSourceValue',
    width: '80px'
  },
  {
    label: '本單減免',
    field: 'discount',
    width: '70px'
  },
  {
    label: '保險',
    width: '100px',
    formatter: function (row: AppointListData) {
      var hasInsur =
        row.insurName || (row.hasHighMedicalInsurance == 1 ? '用戶選擇了高端保險' : '無')
      if (hasInsur) {
        return hasInsur
      }
      return '無'
    }
  },
  {
    label: '約診類型',
    field: 'appointmentType',
    width: '100px',
    formatter: function (row: AppointListData) {
      return inDict(row.appointmentType, 'isSpecialist')
    }
  },
  {
    label: '中醫體檢',
    field: 'cmpe',
    width: '100px'
  },
  {
    label: '專科',
    field: 'specialistName',
    width: '70px'
  },
  {
    label: '套餐',
    field: 'packageName',
    width: '70px'
  },
  {
    label: '渠道',
    field: 'source',
    width: '100px',
    formatter: function (row: AppointListData) {
      return inDict(row.source, 'appoint.source')
    }
  },
  {
    label: '重要客人',
    field: 'importantGuestName',
    width: '80px'
  },
  {
    label: '短信回復內容',
    field: 'smsContent',
    width: '100px'
  },
  {
    label: '創建人',
    field: 'createUser',
    width: '80px'
  },
  {
    label: '確認人',
    field: 'confirmUser',
    width: '80px'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)

const dialogTitle = ref('')
const dialogWidth = ref('')

const delLoading = ref(false)

const delData = async (row: MemberInfoTableData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple
      ? {
          multiple: multiple,
          data: selections.reduce((sum, v) => sum + (sum === '' ? '' : ',') + v.id, '') as string
        }
      : { multiple: multiple, data: tableObject.currentRow?.id as string },
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = '新增短信模板'
  actionType.value = 'add'
  dialogWidth.value = ''
  tableObject.currentRow = null
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const action = (row: TableData, type: string) => {
  dialogTitle.value = type === 'edit' ? '修改短信模板' : 'exampleDemo.detail'
  actionType.value = type
  tableObject.currentRow = row
  dialogVisible.value = true
}

const loading = ref(false)

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
        ElMessage.success(res.msg)
        tableObject.currentPage = 1
        getList()
      }
    }
  })
}

const confirm = (id: string) => {}
const update = (id: string) => {}
const cancel = (id: string) => {}
const check = (id: string) => {}
const packagePay = (id: string) => {}
const log = (id: string) => {}

watch(typeRef, () => {
  getTemplateOptions()
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
    />

    <div class="mb-10px ml-10px mt-[-32px]">
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">新增</ElButton>
      <ElButton :loading="delLoading" type="danger" @click="delData(null, true)" :icon="deleteIcon"
        >批量刪除</ElButton
      >
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
    >
      <template #action="{ row }">
        <div class="text-left">
          <ElLink v-if="row.status === 'YYY'" type="primary" @click="confirm(row.id)" class="mr-5px"
            >確認就診</ElLink
          >
          <ElLink
            v-if="row.status === 'YYY' || row.status == 'QRJZ'"
            type="primary"
            @click="
              update(
                row.id,
                row.hospitalId,
                row.doctorId,
                row.appointmentTimeStart,
                row.appointmentTimeEnd,
                row.memberId
              )
            "
            class="mr-5px"
            >修改</ElLink
          >
          <ElLink
            v-if="row.status === 'YYY' || row.status == 'QRJZ'"
            type="primary"
            @click="cancel(row.id)"
            class="mr-5px"
          >
            取消
          </ElLink>
          <span v-if="row.status === 'YYZ'" class="text-red mr-5px">【等待支付】</span>
          <ElLink
            v-if="row.status === 'YGH'"
            type="primary"
            @click="
              check(
                row.id,
                row.hospitalId,
                row.doctorId,
                row.appointmentTimeStart,
                row.appointmentTimeEnd,
                row.memberId
              )
            "
            class="mr-5px"
            >查看</ElLink
          >
          <ElLink
            v-if="row.paymentStatus === 'UNPAY'"
            type="primary"
            @click="packagePay(row.id, row.memberId, row.memberName, row.doctorId)"
            class="mr-5px"
            >改套餐</ElLink
          >
          <ElLink type="primary" @click="log(row.id)">日誌</ElLink>
        </div>
      </template>
      <template #value="{ row }">
        {{ row.sysDict.value }}
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

<style lang="less" scoped>
.@{elNamespace}-table {
  .cell {
    padding: 0 !important;
  }
}
</style>
