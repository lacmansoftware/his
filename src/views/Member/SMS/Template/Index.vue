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
import { plusIcon, deleteIcon } from '@/utils/iconList'
import Write from './components/Write.vue'
import dict from '@/config/dictionary.json'
import { useDictStoreWithOut } from '@/store/modules/dict'

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/workorder/sms/templet'
import { SMSTemplateData } from '@/api/workorder/sms/templet/types'
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
    width: '120px',
    form: { show: false }
  },
  {
    label: '主題',
    field: 'title',
    width: '150px',
    form: {
      label: '模板主題',
      show: true,
      component: 'Input',
      colProps: { span: 24 }
    },
    search: {
      component: 'Input',
      colProps: { span: 8 },
      show: true
    }
  },
  {
    label: '分類',
    field: 'value',
    width: '200px'
  },
  {
    label: '內容',
    field: 'content'
  },
  {
    label: '創建時間',
    field: 'createTime',
    width: '200px'
  },
  {
    field: 'type',
    label: '分類',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '分類',
        options: store.type
      },
      colProps: { span: 12 }
    },
    form: {
      label: '模板分類',
      show: true,
      component: 'Select',
      componentProps: {
        style: { width: '100%' },
        placeholder: '分類',
        options: store.type
      },
      formItemProps: {
        rules: [required()]
      },
      colProps: { span: 24 }
    },
    table: { show: false }
  },
  {
    field: 'content',
    label: '內容',
    form: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width: 100%',
        placeholder: '溝通記錄',
        type: 'textarea',
        rows: 3
      },
      colProps: { span: 24 },
      formItemProps: {
        rules: [required()]
      }
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
              title: data.title,
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
        <ElLink type="primary" @click="action(row, 'edit')" class="mr-5px">編輯</ElLink>
        <ElLink type="danger" @click="delData(row, false)">
          {{ t('exampleDemo.del') }}
        </ElLink>
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
.el-input__wrapper {
  width: 100%;
}
</style>
