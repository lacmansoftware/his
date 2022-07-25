<script setup lang="ts">
import { reactive, ref, unref, onMounted, watch, h } from 'vue'
import { ElButton, ElTag, ElLink, ElMessage, ElMessageBox } from 'element-plus'
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
import { inDict, getInOptionFormat, getDateInFormat } from '@/utils/common'
import { topIcon, downloadIcon, groupIcon, callIcon, msgIcon } from '@/utils/iconList'
import dict from '@/config/dictionary.json'

import { getTableListApi, delTableListApi, saveGroupMsgApi } from '@/api/appoint/appoint/cancelList'
import { AppointListData } from '@/api/appoint/appoint/cancelList/types'
import { getApi, postApi } from '@/api/common'
import Cancel from '../Appoint/Cancel.vue'

defineOptions({
  name: 'SMSSendIndex'
})
const { required } = useValidator()

const typeRef = ref<any>(null)
const cancelRef = ref<ComponentRef<typeof Cancel>>()

const store = {
  type: ref<ComponentOptions[]>([]),
  templet: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

const getTemplateOptions = () => {
  getApi(`/sms/templet${typeRef.value !== '' ? `/type/${typeRef.value}` : ''}`).then((res) => {
    store.templet.value = res?.data.map((item) => ({
      value: item.id,
      label: item.title,
      content: item.content
    }))
  })
}

onMounted(async () => {
  setStore('type', '/sys/dict/type/sms_tmp_type', 'code', 'value')

  const today = getDateInFormat(new Date(), '-')
  await setValues({
    dateStart: today,
    dateEnd: today
  })
  search()
})

const { push } = useRouter()

const { register, tableObject, methods } = useTable<AppointListData>({
  getListApi: getTableListApi,
  delListApi: delTableListApi,
  response: {
    list: 'data',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'confirm') {
    }
    getList()
  }
})

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action',
    width: '150px',
    form: { show: false }
  },
  { label: '門店', field: 'hospitalName' },
  { label: '醫生', field: 'doctorName' },
  {
    label: '操作日期',
    field: 'createTime',
    formatter: function (row) {
      return row.createTime.substr(0, 10)
    }
  },
  { label: '約診時間', field: 'appointmentTimeStart' },
  { label: '客人姓名', field: 'memberName' },
  {
    label: '性別',
    field: 'memberGender',
    formatter: function (row) {
      return inDict(row.memberGender, 'sex')
    }
  },
  {
    label: '手機',
    field: 'memberMobile',
    formatter: function (row) {
      return row.memberMobile
    }
  },
  { label: '客人級別', field: 'memberLevelName' },
  {
    label: '初複診',
    field: 'visitType',
    formatter: function (row) {
      return inDict(row.visitType, 'visitType')
    }
  },
  {
    label: '約診類型',
    field: 'appointmentType',
    formatter: function (row) {
      return inDict(row.appointmentType, 'isSpecialist')
    }
  },
  { label: '重要客人', field: 'importantGuestName' },
  { label: '客人來源', field: 'memberSourceValue' },
  { label: '備註', field: 'note' },
  { label: '保險', field: 'insurName' },
  { label: '短信回復內容', field: 'smsContent' },
  {
    label: '狀態',
    field: 'status',
    formatter: function (row) {
      return inDict(row.status, 'appoint.status')
    }
  },
  {
    label: '操作',
    formatter: function (row) {
      var result = '修改 '
      result += '取消 '
      return result
    }
  },
  // Search Schema
  {
    field: 'hospitalId',
    label: '門店',
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
        return await getInOptionFormat('/member/appointment/hospitals', 'id', 'name')
      }
    }
  },
  {
    field: 'doctorId',
    label: '醫生',
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
        return await getInOptionFormat('/doctor/getAuthPass', 'id', 'name')
      }
    }
  },
  {
    field: 'memberName',
    label: '客人姓名',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Input',
      componentProps: {},
      colProps: { span: 6 }
    }
  },
  {
    field: 'week',
    label: '星期',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dict.week
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'dateStart',
    label: '約診時間',
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
    field: 'memberMobile',
    label: '手機號碼',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Input',
      componentProps: {},
      colProps: { span: 6 }
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
        options: dict.visitType
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
        options: dict.isSpecialist
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'specialistId',
    label: '專科',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {},
      colProps: { span: 6 },
      api: async () => {
        return await getInOptionFormat('/market/specialist/list?pageSize=0', 'id', 'specialistName')
      }
    }
  },
  {
    field: 'source',
    label: '預約渠道',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dict.appoint.source
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

const searchRef = ref<ComponentRef<typeof Search>>()

const setValues = (value: object) => {
  const search = unref(searchRef)
  search?.setValues(value)
}

const search = () => {
  const search = unref(searchRef)
  search!.search()
}

const loading = ref(false)

const save = async () => {
  if (actionType.value === 'cancel') {
    const cancel = unref(cancelRef)
    await cancel?.elFormRef?.validate(async (isValid) => {
      if (isValid) {
        loading.value = true
        const data = (await cancel?.getFormData()) as any

        const res = await postApi('/member/appointment/cancelDQX', {
          id: cancel.curId,
          replyChannel: data.source
        })
          .catch(() => {})
          .finally(() => {
            loading.value = false
          })
        if (res) {
          dialogVisible.value = false
          ElMessage.success(res.msg as string)
          tableObject.currentPage = 1
          getList()

          ElMessageBox.confirm('取消成功，是否發送短信/微信?', t('common.reminder'), {
            confirmButtonText: t('common.ok'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
          }).then(() => {
            postApi(`member/appointment/cancelMsg`, {
              id: cancel.curId
            }).then((cancleMsgRes) => {
              ElMessage.success(cancleMsgRes.msg as string)
            })
          })
        }
      }
    })
  } else {
  }
}

const update = (row: AppointListData) => {
  push({
    name: 'AppointManageAppointAdd',
    params: {
      actionType: 'edit',
      currentRow: JSON.stringify(row)
    }
  })
}

const cancel = (row) => {
  actionType.value = 'cancel'
  dialogTitle.value = '選擇取消預約方式'
  tableObject.currentRow = row
  dialogVisible.value = true
}

const groupMsg = () => {
  dialogTitle.value = '發送短信'
  actionType.value = 'add'
  dialogWidth.value = '70%'
  tableObject.currentRow = null
  dialogVisible.value = true
}

const outCall = (mobile: string) => {
  console.log('out going call: ', mobile)
}

const sendMsg = (mobile: string) => {
  console.log('out going call: ', mobile)
}

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
      ref="searchRef"
    />

    <div class="mb-10px ml-10px mt-[-32px]">
      <ElButton type="success" @click="groupMsg" :icon="groupIcon">短信群發</ElButton>
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
          <ElLink type="primary" @click="update(row)" class="mr-5px">修改</ElLink>
          <ElLink type="primary" @click="cancel(row)" class="mr-5px"> 取消 </ElLink>
        </div>
      </template>
      <template #memberMobile="{ row }">
        <div class="flex items-center gap-1">
          <span>{{ row.memberMobile }}</span>
          <ElLink
            type="primary"
            @click="outCall(row.memberMobile)"
            title="打電話"
            :icon="callIcon"
          />
          <ElLink
            type="primary"
            @click="sendMsg(row.memberMobile)"
            title="發短信"
            :icon="msgIcon"
          />
        </div>
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth">
    <Cancel v-if="actionType === 'cancel'" ref="cancelRef" :current-row="tableObject.currentRow" />

    <template #footer>
      <ElButton v-if="actionType === 'cancel'" type="primary" :loading="loading" @click="save">
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
