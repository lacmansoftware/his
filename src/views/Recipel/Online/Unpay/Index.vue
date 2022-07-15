<script setup lang="ts">
import { reactive, ref, unref, onMounted } from 'vue'
import { ElButton, ElLink, ElMessage } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { Table } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { inDict, getInOptionFormat } from '@/utils/common'
import { plusIcon } from '@/utils/iconList'
import Write from './components/Write.vue'
import dict from '@/config/dictionary.json'

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/recipel/online/unpay'

defineOptions({
  name: 'RecipelOnlineUnpayIndex'
})

const store = {
  type: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

onMounted(async () => {
  setStore('type', '/sys/dict/type/sms_tmp_type', 'code', 'value')
})

const { register, tableObject, methods } = useTable<any>({
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
    width: '120px',
    form: { show: false }
  },
  {
    label: '附加診費',
    field: 'consFee',
    width: '55px',
    formatter: function (row) {
      return row.consFee + '元'
    }
  },
  {
    label: '進度狀態',
    field: 'status',
    width: '80px',
    formatter: function (row) {
      return row.photoStatus.toLowerCase() === 'reject'
        ? '已駁回'
        : inDict(row.status, 'visitStatus')
    }
  },
  {
    label: '客戶姓名',
    field: 'memberName',
    width: '55px'
  },
  {
    label: '客人手機',
    field: 'memberMobile',
    width: '78px'
  },
  {
    label: '微信昵稱',
    field: 'nickName',
    width: '60px'
  },
  {
    label: '性別',
    field: 'memberSex',
    width: '40px',
    formatter: function (row) {
      return inDict(row.memberSex, 'sex')
    }
  },
  {
    label: '年齡',
    field: 'memberAge',
    width: '30px'
  },
  {
    label: '大夫姓名',
    field: 'doctorName',
    width: '55px'
  },
  {
    label: '大夫手機',
    field: 'doctorMobile',
    width: '78px'
  },
  {
    label: '錄方狀態',
    field: 'recipelStatus',
    width: '55px',
    formatter: function (row) {
      return inDict(row.recipelStatus, 'recipelInputStatus')
    }
  },
  {
    label: '照片數量',
    field: 'files',
    width: '40px',
    formatter: function (row) {
      if (row.files && row.files !== '--' && row.files !== 'null') {
        return row.files.split(',').length
      } else {
        return '0'
      }
    }
  },
  {
    label: '處方數量',
    field: 'recipelAmount',
    width: '40px'
  },
  {
    label: '錄方方式',
    field: 'type',
    width: '60px',
    formatter: function (row) {
      return inDict(row.type, 'onlineRecipelType')
    }
  },
  {
    label: '錄方人',
    field: 'recipelUser',
    width: '40px'
  },
  {
    label: '審核時間',
    field: 'auditTime',
    width: '90px'
  },
  {
    label: '提交時間',
    field: 'pullTime',
    width: '90px'
  },
  {
    label: '創建時間',
    field: 'createTime',
    width: '90px'
  },
  {
    label: '付款狀態',
    field: 'status',
    width: '55px',
    formatter: function (row) {
      if (row.status == 'A') {
        return '已付款'
      } else {
        return '未付款'
      }
    }
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
      componentProps: {},
      colProps: { span: 6 }
    }
  },
  {
    field: 'memberMobile',
    label: '客人手機',
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
    field: 'doctorName',
    label: '大夫姓名',
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
    field: 'type',
    label: '錄方方式',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          { value: 'photo', label: '醫生拍方' },
          { value: 'trans', label: '人際傳方' },
          { value: 'app', label: 'APP開方' }
        ]
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
    field: 'progressStatus',
    label: '進度狀態',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          { value: 'not_submit', label: '未提交' },
          { value: 'wait_audit', label: '待審核' },
          { value: 'submit', label: '已提交' },
          { value: 'reject', label: '駁回' }
        ]
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'debug',
    label: '測試醫生',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Checkbox',
      componentProps: {
        options: dict.isDebug
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

const delData = async (row: any | null, multiple: boolean) => {
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
  dialogTitle.value = '門診處方錄入'
  actionType.value = 'add'
  dialogWidth.value = '90%'
  tableObject.currentRow = null
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const action = (row: any, type: string) => {
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
        ElMessage.success(res.msg as string)
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
      :layout="'bottom'"
      :buttom-position="'right'"
      @search="setSearchParams"
      @reset="setSearchParams"
    />

    <div class="mb-10px ml-10px mt-[-32px]">
      <!-- <ElButton type="primary" @click="AddAction" :icon="plusIcon">新增</ElButton> -->
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
      <!-- <template #value="{ row }">
        {{ row.sysDict.value }}
      </template> -->
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="tableObject.currentRow"
      :params="{
        type: null
      }"
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
