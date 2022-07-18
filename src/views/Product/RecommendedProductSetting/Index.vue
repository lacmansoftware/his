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

import {
  getTableListApi,
  delTableListApi,
  saveTableApi
} from '@/api/product/recommendedProductSettings'
import { NotChargedTableData } from '@/api/product/recommendedProductSettings/types'
import { dateCompare } from '@/utils/date'
import { genTableSchema, genSearchSchema } from '@/utils/schema'
import dict from '@/config/dictionary.json'

defineOptions({
  name: 'CashNotChargedIndex'
})

const props = defineProps({
  pageType: {
    type: String,
    default: ''
  }
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

// getList()

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action',
    form: { show: false }
  },
  {
    label: '名稱',
    field: 'title'
  },
  {
    label: '關聯大夫',
    field: 'doctorName'
  },
  {
    label: '显示順序',
    field: 'seq'
  },
  {
    label: '横幅',
    field: 'isBannerShow',
    formatter: function (row) {
      return inDict(row.isBannerShow, 'product.isShowInBanner')
    }
  },
  {
    label: '大夫介紹頁',
    field: 'isIntroduceShow',
    formatter: function (row) {
      return inDict(row.isIntroduceShow, 'product.isShowInBanner')
    }
  },
  {
    label: '活動狀態',
    field: 'startTime',
    formatter: function (row) {
      if (new Date() < new Date(row.startTime)) return '未開始'
      if (new Date() > new Date(row.endTime)) return '已結束'
      return '進行中'
    }
  },
  {
    label: '開始時間',
    field: 'startTime'
  },
  {
    label: '結束時間',
    field: 'endTime'
  },
  {
    label: '創建時間',
    field: 'createTime'
  },
  {
    label: '創建人',
    field: 'createUser'
  },
  {
    label: '最後修改時間',
    field: 'modifyTime'
  },
  {
    label: '最後修改人',
    field: 'modifyUser'
  },

  // Search Schema
  genSearchSchema('input', 'title', '名稱', { placeholder: null }),
  genSearchSchema('apiSelect', 'doctorId', '大夫', {
    placeholder: null,
    api: async () => {
      return await getInOptionFormat('doctor/', 'id', 'name')
    },
    filterable: true
  }),
  genSearchSchema('sourceSelect', 'state', '活動狀態', {
    placeholder: null,
    options: dict.product.activityStatus as any
  }),
  genSearchSchema('sourceSelect', 'order', '显示順序', {
    placeholder: null,
    options: dict.product.order as any
  })
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
  await setValues({
    startTime: getDateInFormat(new Date(), '-')
  })
  search()
  // const res = genSearchSchema('sourceSelect', 'createFrom', '訂單來源', {
  //   options: dict.product.promotionWay as any
  // })
  // console.log(res)
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
      :layout="'bottom'"
      :buttom-position="'right'"
      @search="setSearchParams"
      @reset="setSearchParams"
      ref="searchRef"
    />

    <div v-if="pageType !== 'approve'" class="mb-10px ml-10px mt-[-32px]">
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">新增</ElButton>
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
      :row-class-name="tableRowClassName"
    >
      <template #action="{ row }">
        <ElLink type="primary" @click="settlement(row)" class="mr-5px">編輯</ElLink>
        <ElLink type="primary" @click="settlement(row)" class="mr-5px">刪除</ElLink>
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
