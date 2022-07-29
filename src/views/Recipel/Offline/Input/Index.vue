<script setup lang="ts">
import { reactive, ref, unref, onMounted, h } from 'vue'
import { ElButton, ElLink, ElMessage, ElTag } from 'element-plus'
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

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/recipel/offline/input'

defineOptions({
  name: 'SMSSendIndex'
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
    label: '處方數量',
    field: 'recipelAmount'
  },
  {
    label: '客人姓名',
    field: 'memberName'
  },
  {
    label: '客人手機',
    field: 'memberMobile',
    width: '100px'
  },
  {
    label: '性別',
    field: 'memberSex',
    formatter: function (row) {
      return inDict(row.memberSex, 'sex')
    }
  },
  {
    label: '年齡',
    field: 'memberAge',
    width: '70px'
  },
  {
    label: '大夫姓名',
    field: 'doctorName'
  },
  {
    label: '初複診',
    field: 'visitStatus',
    formatter: function (row) {
      return inDict(row.visitStatus, 'visitType')
    }
  },
  {
    label: '錄方狀態',
    field: 'recipelStatus',
    formatter: function (row) {
      return inDict(row.recipelStatus, 'recipelInputStatus')
    }
  },
  {
    label: '門診分類',
    field: 'type',
    formatter: function (row) {
      return inDict(row.type, 'offlineRecipelType')
    }
  },
  {
    label: '開方方式',
    field: 'origin',
    formatter: function (row) {
      return inDict(row.origin, 'onlineRecipelOrigin')
    }
  },
  {
    label: '錄方人',
    field: 'recipelUser'
  },
  {
    label: '是否保險',
    field: 'memberInsurName',
    formatter: function (row) {
      if (row.recipelBhAmount > 0) {
        return h(ElTag, { type: 'success' }, () =>
          inDict(row.paymentStatus, 'appoint.paymentStatus')
        )
      }
      return row.recipelBhAmount
    }
  },
  {
    label: '挂號編號',
    field: 'registerNum'
  },
  {
    label: '挂號時間',
    field: 'registerDate',
    width: '140px'
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
    field: 'recipelStatus',
    label: '錄方狀態',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dict.recipelInputStatus
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'offlineType',
    label: '門診類型',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dict.offlineRecipelType
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
        valueFormat: 'YYYY-MM-DD'
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
    field: 'insurStatus',
    label: '保險客人',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Checkbox',
      componentProps: {
        options: dict.isInsur
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

const addAction = (row: any = {}) => {
  const recipelMode = row?.type ? inDict(row?.type, 'offlineRecipelType') : '照方抓藥'
  dialogTitle.value = row?.id ? '門診處方編輯' : '門診處方錄入'
  row.recipelAction = row?.id ? 'recipel_edit_action' : 'recipel_add_action' //告訴下個頁面當前開方是編輯還是新增
  row.pharmacyUrl = '/recipel/pharmacy' //藥房URL
  row.url = '/recipel/saveOfflineOther'
  row.recipelMode = recipelMode
  if (row?.type === 'normal' || row?.type === 'package' || row?.type === 'special') {
    row.url = '/recipel/saveClinic'
  }
  actionType.value = 'add'
  dialogWidth.value = '90%'
  tableObject.currentRow = row
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
      <ElButton type="primary" @click="addAction" :icon="plusIcon">照方抓藥</ElButton>
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
        <ElLink type="primary" @click="addAction(row)" class="mr-5px">
          {{ row.recipelStatus === 'Y' ? '編輯' : '錄方' }}
        </ElLink>
      </template>
      <!-- <template #value="{ row }">
        {{ row.sysDict.value }}
      </template> -->
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth">
    <Write
      v-if="actionType === 'add'"
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
