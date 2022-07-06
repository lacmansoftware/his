<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElLink, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { reactive, ref, unref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { inDict, getAgeByBirthday } from '@/utils/common'
import { callIcon, msgIcon, plusIcon, deleteIcon } from '@/utils/iconList'
import { searchConfig, crudConfig } from './index'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import dict from '@/config/dictionary.json'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getPinyinCode, getInOptionFormat } from '@/utils/common'

import { getTableListApi, delTableListApi, saveTableApi, getPrintApi } from '@/api/workorder/sms'
import { SMSSendData } from '@/api/workorder/sms/types'

defineOptions({
  name: 'SMSSendIndex'
})
const dictStore = useDictStoreWithOut()

const store = {
  certificate: ref<ComponentOptions[]>([]),
  level: ref<ComponentOptions[]>([]),
  cardStatus: ref<ComponentOptions[]>([]),
  hospital: ref<ComponentOptions[]>([]),
  country: ref<ComponentOptions[]>([]),
  nativePlace: ref<ComponentOptions[]>([]),
  nationality: ref<ComponentOptions[]>([]),
  education: ref<ComponentOptions[]>([]),
  isMarried: ref<ComponentOptions[]>([]),
  memberSource: ref<ComponentOptions[]>([]),
  disease: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

onMounted(() => {
  // setStore('certificate', '/sys/dict/type/MEMBER_Certificate', 'code', 'value')
  setStore('level', '/sys/member/level', 'id', 'levelName')
  setStore('cardStatus', '/sys/dict/type/MEMBER_CardStatus', 'code', 'value')
  setStore('hospital', '/sys/hospital', 'id', 'name')
  setStore('disease', '/sys/diseases', 'id', 'name')
  setStore('country', '/sys/dict/type/MEMBER_Country', 'code', 'value')
  setStore('nativePlace', '/sys/city/byLevel?level=1', 'id', 'name')
  setStore('nationality', '/sys/dict/childlist?type=MEMBER_Nation', 'code', 'value')
  setStore('education', '/sys/dict/type/MEMBER_Education', 'code', 'value')
  setStore('isMarried', '/sys/dict/type/MEMBER_Married', 'code', 'value')
  setStore('memberSource', '/sys/dict/type/MEMBER_Source', 'code', 'value')
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

const setPinyinCode = async (item: any) => {
  const write = unref(writeRef)
  const formData = (await write?.getFormData()) as any
  const py = getPinyinCode(formData.name)

  write?.setValues({
    pinyinCode: py
  })
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action',
    width: '120px',
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
  dialogTitle.value = '新增客人'
  actionType.value = 'add'
  dialogWidth.value = '90%'
  tableObject.currentRow = null
  dialogVisible.value = true
}

const action = (row: TableData, type: string) => {
  dialogTitle.value = type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail'
  dialogWidth.value = '90%'
  actionType.value = type
  tableObject.currentRow = row
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const loading = ref(false)

const outCall = (mobile: string) => {
  console.log('out going call: ', searchSchema[8].componentProps.options)
}

const sendMsg = (mobile: string) => {
  console.log('out going call: ', mobile)
}

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
</script>

<template>
  <ContentWrap>
    <Search
      :schema="allSchemas.searchSchema"
      :is-col="true"
      :inline="false"
      @search="setSearchParams"
      @reset="setSearchParams"
    />

    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction" :icon="msgIcon">發送短信</ElButton>
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
        <div class="flex gap-1">
          <ElLink type="primary" @click="action(row, 'edit')">
            {{ t('exampleDemo.edit') }}
          </ElLink>
          <ElLink type="danger" @click="delData(row, false)">
            {{ t('exampleDemo.del') }}
          </ElLink>
        </div>
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
