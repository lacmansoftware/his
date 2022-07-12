<script setup lang="ts">
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElRow,
  ElCol,
  ElDialog,
  ElMessage
} from 'element-plus'
import { Table } from '@/components/Table'
import { getTableListApi, saveTableApi, delTableListApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { ref, unref, reactive } from 'vue'
import Write from './Write.vue'
import Detail from './Detail.vue'
import ProductItem from './ProductItem.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { propTypes } from '@/utils/propTypes'

const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getTableListApi,
  delListApi: delTableListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})

const props = defineProps({
  memberId: propTypes.string.def('')
})

const { getList } = methods

// getList()

const { t } = useI18n()
const itemKind = ref<any>(null)
const itemKindData = [
  { id: 'life', text: '產品' },
  { id: 'express', text: '快遞費' },
  { id: 'other', text: '其他' }
]

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '處方編號',
    field: 'recipelId',
    width: '120px',
    formatter: function (row) {
      if (row.recipelId) {
        return (
          '<span onclick="utils.recipel.getRecipelDetail(\'' +
          row.recipelId +
          '\');" style="cursor:pointer;color:#016cdf;">' +
          row.recipelId +
          '</span>'
        )
      } else {
        return '-'
      }
    }
  },
  {
    label: '類別',
    field: 'dataTypeName',
    width: '70px'
  },
  {
    label: '明細',
    field: 'title',
    width: '70px',
    formatter: function (row) {
      return row.title
    }
  },
  {
    label: '數量',
    field: 'amount',
    width: '60px',
    formatter: function (row) {
      if (row.amount) {
        return row.amount
      } else {
        return '-'
      }
    }
  },
  {
    label: '劑型',
    field: 'dosageformName',
    width: '60px'
  },
  {
    label: '原價',
    field: 'originPrice',
    width: '60px',
    formatter: function (row) {
      return row.originPrice || row.price
    }
  },
  {
    label: '折后金額',
    field: 'price',
    formatter: function (row) {
      if (row.tips) {
        var html = ''
        var top = (row._rowIndex + 1) * 40 - 10 + 'px'
        html +=
          '<div><span>' +
          row.price +
          '</span><span class="table_tips" style="top: ' +
          top +
          '">' +
          row.tips +
          '</span></div>'
        return html
      }
      return row.price
    }
  },
  {
    field: 'action',
    width: '260px',
    label: t('tableDemo.action'),
    form: {
      show: false
    },
    detail: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const itemKindDialogVisible = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const itemDetailDialogVisible = ref(false)
const itemDetailDialogTitle = ref<string | undefined>('')
const itemDetailDialogWidth = ref('')

const SelectItemKind = () => {
  if (!props.memberId) {
    ElMessage.error(
      '請先輸入客人信息，再添加產品！注：錄入信息后，添加產品時才能核算是否走員工價。'
    )
    return
  }
  tableObject.currentRow = null
  itemKindDialogVisible.value = true
}

const AddItem = () => {
  itemKindDialogVisible.value = false
  itemDetailDialogVisible.value = true
  itemDetailDialogTitle.value = itemKindData.find((item) => item.id === itemKind.value)!.text
  itemDetailDialogWidth.value = '80%'
}

const delLoading = ref(false)

const delData = async (row: TableData | null, multiple: boolean) => {
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

const action = (row: TableData, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  tableObject.currentRow = row
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const loading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  await write?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await write?.getFormData()) as TableData
      const res = await saveTableApi(data)
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      if (res) {
        dialogVisible.value = false
        tableObject.currentPage = 1
        getList()
      }
    }
  })
}
</script>

<template>
  <ElRow>
    <ElCol :span="12">
      <ElDivider content-position="left">收費項目</ElDivider>
    </ElCol>
    <ElCol :span="12">
      <ElDivider content-position="right">
        <div class="flex-0 ml-10px text-right">
          <ElButton type="primary" @click="SelectItemKind">{{ t('exampleDemo.add') }}</ElButton>
          <ElButton :loading="delLoading" type="danger" @click="delData(null, true)">
            {{ t('exampleDemo.del') }}
          </ElButton>
        </div>
      </ElDivider>
    </ElCol>
  </ElRow>

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
      <ElButton type="primary" @click="action(row, 'edit')">
        {{ t('exampleDemo.edit') }}
      </ElButton>
      <ElButton type="success" @click="action(row, 'detail')">
        {{ t('exampleDemo.detail') }}
      </ElButton>
      <ElButton type="danger" @click="delData(row, false)">
        {{ t('exampleDemo.del') }}
      </ElButton>
    </template>
  </Table>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="tableObject.currentRow"
    />

    <Detail
      v-if="actionType === 'detail'"
      :detail-schema="allSchemas.detailSchema"
      :current-row="tableObject.currentRow"
    />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>

  <ElDialog v-model="itemKindDialogVisible" title="添加收費項目" width="30%" center>
    <ElSelect v-model="itemKind" placeholder="选择项目" class="w-[100%]">
      <ElOption v-for="item in itemKindData" :key="item.id" :label="item.text" :value="item.id" />
    </ElSelect>
    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="itemKindDialogVisible = false">
          {{ t('dialogDemo.close') }}
        </ElButton>
        <ElButton type="primary" @click="AddItem" :disabled="itemKind === null">
          {{ t('exampleDemo.save') }}
        </ElButton>
      </span>
    </template>
  </ElDialog>

  <ElDialog
    v-model="itemDetailDialogVisible"
    :title="itemDetailDialogTitle"
    :width="itemDetailDialogWidth"
  >
    <ProductItem v-if="itemKind === 'life'" :member-id="memberId" />
  </ElDialog>
</template>
