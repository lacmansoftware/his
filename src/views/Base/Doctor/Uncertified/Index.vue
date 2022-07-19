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

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/base/doctor/certified'
import { NotChargedTableData } from '@/api/base/doctor/certified/types'
import { dateCompare } from '@/utils/date'
import { genTableSchema, genSearchSchema } from '@/utils/schema'
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

const getCustomTableListApi = (params: any) => {
  return getTableListApi(params, 'uncertified')
}

const { register, tableObject, methods } = useTable<NotChargedTableData>({
  getListApi: getCustomTableListApi,
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
    width: '150px'
  },
  {
    label: '認證狀態',
    field: 'authStatus',
    formatter: function (row) {
      if (row.authStatus === 'REG') {
        return '已登記'
      } else if (row.authStatus === 'AP') {
        return '待認證'
      } else if (row.authStatus === 'REJ') {
        return '未通過'
      }
    }
  },
  { label: '大夫姓名', field: 'name' },
  {
    label: '性別',
    field: 'sex',
    formatter: function (row) {
      return inDict(row.sex, 'sex')
    }
  },
  { label: '醫院', field: 'hospital' },
  { label: '職稱', field: 'titlesName' },
  { label: '區域', field: 'city' },
  { label: '經紀人', field: 'bdNames' },
  { label: '城市經理', field: 'bdCityNames' },
  {
    label: '是否排班',
    field: 'isSchedule',
    formatter: function (row) {
      return inDict(row.isSchedule, 'isSchedule')
    }
  },
  {
    label: '開通網診',
    field: 'serviceSwitch',
    formatter: function (row) {
      return inDict(row.serviceSwitch, 'serviceSwitch')
    }
  },
  { label: '出診門店', field: 'hospitalName' },
  {
    label: '是否測試',
    field: 'debug',
    formatter: function (row) {
      return inDict(row.debug, 'isdebugYN')
    }
  },
  { label: '推薦人', field: 'inviteName' },
  { label: '推薦人手機', field: 'inviteMobile' },
  { label: '創建時間', field: 'createTime' },
  { label: '審核時間', field: 'approveTime' },
  { label: '城市', field: 'city' },
  {
    label: '啟用狀態',
    field: 'status',
    formatter: function (row) {
      return inDict(row.status, 'doctorStatus2')
    }
  },
  // Search Schema
  genSearchSchema('apiSelect', 'hospitalId', '門診出診門店', {
    placeholder: '請選擇',
    api: async () => {
      return await getInOptionFormat('member/appointment/hospitals', 'id', 'name')
    },
    filterable: true
  }),
  genSearchSchema('input', 'name', '醫生姓名/手機', { placeholder: null }),
  genSearchSchema('input', 'hospital', '醫院', { placeholder: null }),
  genSearchSchema('apiSelect', 'bdId', '經紀人', {
    placeholder: null,
    api: async () => {
      return await getInOptionFormat('/bd/info', 'id', 'name')
    }
  }),
  genSearchSchema('apiSelect', 'city', '所在城市', {
    placeholder: null,
    api: async () => {
      return await getInOptionFormat('/sys/dict/type/doctor_city', 'code', 'value')
    }
  }),
  genSearchSchema('sourceSelect', 'authStatus', '認證狀態', {
    placeholder: null,
    options: dict.doctorStatus as any
  }),
  genSearchSchema('sourceSelect', 'debug', '是否測試', {
    placeholder: null,
    options: dict.isdebug as any
  }),
  genSearchSchema('sourceSelect', 'isSchedule', '是否排班', {
    placeholder: null,
    options: dict.isSchedule as any
  }),
  genSearchSchema('sourceSelect', 'serviceSwitch', '開通網診', {
    placeholder: null,
    options: dict.serviceSwitch as any
  }),
  genSearchSchema('apiSelect', 'bdManager', '城市經理', {
    placeholder: null,
    api: async () => {
      return await getInOptionFormat('/bd/info/listBdManager?isManager=Y', 'id', 'name')
    }
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
  // if (
  //   row.productInventory.totalQty < row.minAlertQty ||
  //   row.productInventory.totalQty > row.maxAlertQty
  // ) {
  //   return 'tr-danger-row'
  // }

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
  // await setValues({
  //   startTime: getDateInFormat(new Date(), '-')
  // })
  // search()
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

    <div class="mb-10px ml-10px mt-[-32px]">
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">新增醫生</ElButton>
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
        <div class="flex">
          <div v-if="row.authStatus === 'AP'">
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">編輯</ElLink>
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">審核</ElLink>
          </div>
          <div v-else-if="row.authStatus === 'REJ'">
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">編輯</ElLink>
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">審核</ElLink>
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">駁回原因</ElLink>
          </div>
          <div v-else-if="row.authStatus === 'REG'">
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">編輯</ElLink>
          </div>

          <div v-if="row.authStatus === 'REG'">
            <ElLink type="primary" @click="settlement(row)" class="mr-5px">刪除</ElLink>
          </div>
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">回訪</ElLink>
        </div>
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
