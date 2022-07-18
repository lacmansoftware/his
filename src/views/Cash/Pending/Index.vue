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
import { inDict, getInOptionFormat, getDateInFormat } from '@/utils/common'
import { plusIcon } from '@/utils/iconList'
import Write from '@/views/Cash/NotCharged/components/Write.vue'

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/cash/pending'
import { NotChargedTableData } from '@/api/cash/pending/types'
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
    width: '200px',
    form: { show: false }
  },
  {
    label: '欠費類型',
    field: 'type',
    width: '90px',
    formatter: function (row) {
      return inDict(row.type, 'arrearType')
    }
  },
  {
    label: '挂號編號',
    field: 'registerNum',
    width: '100px'
  },
  {
    label: '客人',
    field: 'memberName',
    width: '80px'
  },
  {
    label: '手機',
    field: 'memberMobile',
    width: '100px'
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
    field: 'memberAge',
    width: '40px'
  },
  {
    label: '大夫',
    field: 'doctorName',
    width: '100px'
  },
  {
    label: '欠費門店',
    field: 'hospitalName',
    width: '60px'
  },
  {
    label: '初複診',
    field: 'visitTypeName',
    width: '60px'
  },
  {
    label: '就診時間',
    field: 'visitTime',
    width: '100px'
  },
  {
    label: '就診待遇',
    field: 'memberLevelName',
    width: '100px'
  },
  {
    label: '是否保險',
    field: 'memberInsurName',
    width: '100px'
  },
  {
    label: '欠費金額',
    field: 'amount',
    width: '70px'
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
      componentProps: {
        placeholder: '大夫姓名'
      },
      colProps: { span: 6 }
    }
  },
  {
    field: 'registerNum',
    label: '挂號編號',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '挂號編號'
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
    field: 'type',
    label: '欠費類型',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        placeholder: '欠費類型',
        options: dict.arrearType as any
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
  if (row.recipelAmount > 0) {
    return 'tr-success-row'
  }
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
        <ElLink type="primary" @click="settlement(row)" class="mr-5px">結算</ElLink>
        <ElLink type="primary" @click="settlement(row)" class="mr-5px">補收</ElLink>
        <ElLink v-if="row.type !== 'BXQF'" type="primary" @click="settlement(row)" class="mr-5px"
          >小票</ElLink
        >
        <ElLink type="primary" @click="settlement(row)" class="mr-5px">補收鏈接</ElLink>
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
