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
import Write from '@/views/Appoint/Appoint/List/components/Write.vue'
import Cancel from '../Appoint/Cancel.vue'
import { genSearchSchema } from '@/utils/schema'

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
    width: '150px',
    form: { show: false }
  },
  {
    label: '支付倒計時',
    field: 'countDown',
    formatter: function (row) {
      if (row.state === 'YYZ') {
        return new Date(row.createTime)
        // return new Date(new Date().setMinutes(30) - new Date(new Date() - new Date(row.createTime)))
        // yui.formatDate('mi:ss')
      }
      return 0
    }
  },
  { label: '推送時間', field: 'createTime'},
  {
    label: '狀態',
    field: 'state',
    formatter: function (row) {
      return inDict(row.state, 'appoint.payState')
    }
  },
  { label: '客人姓名', field: 'memberName'},
  {
    label: '接收手機',
    field: 'memberMobile',
    formatter: function (row) {
      return row.memberMobile
    }
  },
  { label: '代付手機', field: 'payMoblie'},
  { label: '門店', field: 'hospitalName' },
  { label: '醫生', field: 'doctorName' },
  { label: '約診時間', field: 'appointmentTimeStart' },
  {
    label: '性別',
    field: 'memberGender',
    formatter: function (row) {
      return inDict(row.memberGender, 'sex')
    }
  },
  { label: '年齡', field: 'age' },
  { label: '預約備註', field: 'note' },
  {
    label: '支付時長',
    field: 'note',
    formatter: function (row) {
      if (row.state === 'PAYED') {
        return new Date(row.createTime)
        // return new Date(new Date(row.paymentTime) - new Date(row.createTime))
        // yui.formatDate('mi:ss')
      }
      return '--'
    }
  },

  // Search Schema
  genSearchSchema('apiSelect', 'hospitalId', '門店', {
    placeholder: '請選擇',
    api: async () => {
      return await getInOptionFormat('member/appointment/hospitals', 'id', 'name')
    }
  }),
  genSearchSchema('apiSelect', 'doctorId', '醫生', {
    placeholder: '請填寫',
    api: async () => {
      return await getInOptionFormat('doctor/getAuthPass', 'id', 'name')
    },
    filterable: true
  }),
  genSearchSchema('input', 'memberName', '客人姓名', { placeholder: '請填寫' }),
  genSearchSchema('input', 'memberMobile', '客人手機', { placeholder: '請填寫' }),
  genSearchSchema('datePicker', 'dateStart', '推送時間', { placeholder: '請選擇' }),
  genSearchSchema('datePicker', 'dateEnd', '到', { placeholder: '請選擇' }),
  genSearchSchema('input', 'payMoblie', '代付手機', { placeholder: '請填寫' }),
  genSearchSchema('sourceSelect', 'state', '狀態', {
    placeholder: '請選擇',
    options: dict.appoint.payState as any
  })
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)

const dialogTitle = ref('')
const dialogWidth = ref('')

const actionType = ref('')

const writeRef = ref<ComponentRef<typeof Write>>()
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
    const write = unref(writeRef)
    await write?.elFormRef?.validate(async (isValid) => {
      if (isValid) {
        loading.value = true
        const data = (await write?.getFormData()) as any
        const res = await saveGroupMsgApi(
          actionType.value === 'add'
            ? {
                mobiles: data.moblist,
                content: data.content
              }
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
}

const invalid = (row) => {
  dialogTitle.value = '支付失效設置'
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
          <ElLink v-if="row.state === 'YYZ'" type="primary" @click="invalid(row)" class="mr-5px"
            >支付失效設置</ElLink
          >
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
    <Write
      v-if="actionType === 'add'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="tableObject.currentRow"
    />
    <Cancel v-if="actionType === 'cancel'" ref="cancelRef" :current-row="tableObject.currentRow" />

    <template #footer>
      <ElButton
        v-if="actionType === 'cancel' || actionType === 'add'"
        type="primary"
        :loading="loading"
        @click="save"
      >
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
