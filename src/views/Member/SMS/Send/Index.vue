<script setup lang="ts">
import { reactive, ref, unref, onMounted, watch, computed } from 'vue'
import { ElButton, ElLink, ElMessage } from 'element-plus'
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
import { msgIcon, deleteIcon } from '@/utils/iconList'
import Write from './components/Write.vue'
import dict from '@/config/dictionary.json'
import { useDictStoreWithOut } from '@/store/modules/dict'

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/workorder/sms/send'
import { SMSSendData } from '@/api/workorder/sms/send/types'
import { getApi } from '@/api/common'

defineOptions({
  name: 'SMSSendIndex'
})
const { required, isMobile } = useValidator()
const dictStore = useDictStoreWithOut()

const typeRef = ref('')

const store = {
  level: ref<ComponentOptions[]>([]),
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

onMounted(() => {
  // setStore('certificate', '/sys/dict/type/MEMBER_Certificate', 'code', 'value')
  setStore('level', '/sys/member/level', 'id', 'levelName')
  getTemplateOptions()
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
    width: '80px',
    form: { show: false }
  },
  {
    label: '發信人',
    field: 'name',
    width: '100px'
  },
  {
    label: '接收號碼',
    field: 'mobile',
    width: '120px',
    form: { show: false },
    search: {
      component: 'Input',
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '發送時間',
    field: 'sendDate',
    width: '180px',
    form: { show: false },
    search: {
      component: 'DatePicker',
      componentProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        placeholder: '搜素起始日期'
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '發送結果',
    field: 'status',
    width: '80px'
  },
  {
    label: '失敗原因',
    field: 'comment',
    width: '80px'
  },
  {
    label: '信息內容',
    field: 'content',
    form: { show: false },
    search: {
      component: 'Input',
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '至',
    field: 'endSendDate',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'DatePicker',
      componentProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        placeholder: '搜索結束日期'
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'file',
    label: '文件',
    form: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '文件'
      },
      colProps: { span: 12 }
    },
    table: { show: false }
  },
  {
    field: 'moblist',
    label: '號碼列表',
    form: {
      show: true,
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 2,
        placeholder: '號碼列表'
      },
      colProps: { span: 24 },
      formItemProps: {
        rules: [required()]
      }
    },
    table: { show: false }
  },
  {
    field: 'type',
    label: '短信分類',
    form: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '短信分類',
        onChange: handleTypeChange
      },
      colProps: { span: 12 },
      api: async () => {
        return await getInOptionFormat('/sys/dict/type/sms_tmp_type', 'code', 'value')
      }
    },
    table: { show: false }
  },
  {
    field: 'templet',
    label: '短信模板',
    form: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '短信模板',
        options: store.templet,
        onChange: handleTempletChange
      },
      colProps: { span: 12 }
    },
    table: { show: false }
  },
  {
    field: 'content',
    label: '短信內容',
    form: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '短信內容',
        type: 'textarea',
        rows: 2
      },
      colProps: { span: 24 }
    },
    table: { show: false }
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
  dialogTitle.value = '發送短信'
  actionType.value = 'add'
  dialogWidth.value = '70%'
  tableObject.currentRow = null
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const loading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  await write?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await write?.getFormData()) as any
      const res = await saveTableApi(data)
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
      <ElButton type="success" @click="AddAction" :icon="msgIcon">發送短信</ElButton>
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
        <ElLink type="danger" @click="delData(row, false)">
          {{ t('exampleDemo.del') }}
        </ElLink>
      </template>
      <template #status="{ row }">
        {{ inDict(row.status, 'smsStatus') }}
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
.el-input__wrapper {
  width: 100%;
}
</style>
