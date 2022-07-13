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
import { saveTableApi } from '@/api/cash/notcharged'
import { ChargeItemType } from '@/api/cash/notcharged/types'
import { ref, unref, reactive, computed } from 'vue'
import Write from './Write.vue'
// import Detail from './Detail.vue'
import ProductItem from './ProductItem.vue'
import { propTypes } from '@/utils/propTypes'

interface Params {
  pageNum?: number
  pageSize?: number
}

const props = defineProps({
  memberId: propTypes.string.def('')
})

const productRef = ref<ComponentRef<typeof ProductItem>>()
const writeRef = ref<ComponentRef<typeof Write>>()
const { t } = useI18n()
const itemKind = ref<any>(null)
const itemKindData = [
  { id: 'life', text: '產品' },
  { id: 'express', text: '快遞費' },
  { id: 'other', text: '其他' }
]
// let chargeItemList = ref<ChargeItemType[]>([])
let chargeItemList = computed(() => {
  return unref(productRef)?.tableDataList as ChargeItemType[]
})

const loading = ref(false)

const getTableList = async (params?: Params) => {
  loading.value = false
}

getTableList()

const columns: TableColumn[] = [
  {
    label: '名稱',
    field: 'title'
  },
  {
    label: '單位',
    field: 'unit'
  },
  {
    label: '產品類型',
    field: 'businessSubType',
    formatter: function (row) {
      if (row.businessSubType == 'PRODUCT') {
        return '商品'
      } else if (row.businessSubType == 'YNZJ') {
        return '自有產品'
      } else if (row.businessSubType == 'DLDX') {
        return '代理代銷'
      }
    }
  },
  {
    label: '單價',
    field: 'originUnitPrice'
  },
  {
    label: '庫存量',
    field: 'currentQty'
  },
  {
    label: '購買量',
    field: 'amount',
    width: '150px'
  },
  {
    label: '折扣率(%)',
    field: 'discount',
    width: '150px'
    // formatter: function (row) {
    //   var row = row
    //   if (row.activityId) {
    //     //活動不允許設置折扣率
    //     return (
    //       '<input type="text" readonly="readonly" style="width:50%;background: #ccc" value="' +
    //       row.amount +
    //       '" data-allow="number"/>%'
    //     )
    //   }
    //   return (
    //     '<input type="text" style="width:50%;" value="' + row.discount + '" data-allow="number"/>%'
    //   )
    // }
  },
  {
    label: '總價(原價)',
    field: 'originPrice'
  },
  {
    label: '折后價',
    field: 'price'
  },
  {
    label: '是否預售',
    field: 'isPresell',
    formatter: function (row) {
      if (row.isPresell === 'Y') {
        return '是'
      }
      return '否'
    }
  },
  {
    label: '大夫推薦',
    field: 'recommendDoctor'
  },
  {
    label: '操作',
    field: 'action'
  }
]

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
  // tableObject.currentRow = null
  itemKindDialogVisible.value = true
}

const AddItem = () => {
  itemKindDialogVisible.value = false
  itemDetailDialogVisible.value = true
  itemDetailDialogTitle.value = itemKindData.find((item) => item.id === itemKind.value)!.text
  itemDetailDialogWidth.value = '80%'
}

const delLoading = ref(false)

const delData = async (row: ChargeItemType | null, multiple: boolean) => {
  // tableObject.currentRow = row
  // const { delList, getSelections } = methods
  // const selections = await getSelections()
  // delLoading.value = true
  // await delList(
  //   multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
  //   multiple
  // ).finally(() => {
  //   delLoading.value = false
  // })
}

const actionType = ref('')

const action = (row: ChargeItemType, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  // tableObject.currentRow = row
  dialogVisible.value = true
}

const saveProductItem = () => {
  const product = unref(productRef)
  product?.setTableDataEmpty()
  itemDetailDialogVisible.value = false

  // await write?.elFormRef?.validate(async (isValid) => {
  //   if (isValid) {
  //     loading.value = true
  //     const data = (await write?.getFormData()) as ChargeItemType
  //     const res = await saveTableApi(data)
  //       .catch(() => {})
  //       .finally(() => {
  //         loading.value = false
  //       })
  //     if (res) {
  //       dialogVisible.value = false
  //       // tableObject.currentPage = 1
  //       // getList()
  //     }
  //   }
  // })
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

  <Table :columns="columns" :data="chargeItemList" :loading="loading" :selection="false">
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
    <!-- <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="tableObject.currentRow"
    />

    <Detail
      v-if="actionType === 'detail'"
      :detail-schema="allSchemas.detailSchema"
      :current-row="tableObject.currentRow"
    /> -->

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
    <ProductItem v-if="itemKind === 'life'" :member-id="memberId" ref="productRef" />
    <template #footer>
      <ElButton type="primary" @click="saveProductItem">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="itemDetailDialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </ElDialog>
</template>
