<script setup lang="tsx">
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

import { getTableListApi, delTableListApi, saveTableApi } from '@/api/pharmacy/tjgl/distribution'
import { NotChargedTableData } from '@/api/pharmacy/tjgl/distribution/types'
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
    width: '200px',
    form: { show: false }
  },
  {
    label: '藥房',
    width: '70px',
    field: 'pharmacyName'
  },
  {
    label: '錄單狀態',
    field: 'deliveryStatus',
    width: '70px',
    formatter: function (row) {
      return inDict(row.deliveryStatus, 'deliveryStatus')
    }
  },
  {
    label: '客人',
    field: 'memberName',
    width: '50px'
  },
  {
    label: '客人手機',
    field: 'memberMobile',
    width: '50px'
  },
  {
    label: '大夫',
    field: 'doctorName',
    width: '50px'
  },
  {
    label: '配送方式',
    field: 'expressType',
    width: '70px',
    formatter: function (row) {
      return inDict(row.expressType, 'expressType')
    }
  },
  {
    label: '物流編號',
    field: 'expressNo',
    width: '70px'
  },
  {
    label: '訂單來源',
    field: 'origin',
    width: '40px',
    formatter: function (row) {
      if ((row.origin & 1) == 0) {
        return '網診'
      } else {
        return '門診'
      }
    }
  },
  {
    label: '訂單類型',
    field: 'logisticsOrderType',
    width: '40px',
    formatter: function (row) {
      if (row.type === 'internal') {
        return '內部快遞'
      }
      return inDict(row.logisticsOrderType, 'allOrderType')
    }
  },
  {
    label: '劑型',
    field: 'dosageform',
    width: '40px'
  },
  {
    label: '訂單編號',
    field: 'logisticsOrderNo',
    width: '70px'
  },
  {
    label: '地址數量',
    field: 'addressCount',
    width: '70px'
  },
  {
    label: '支付狀態',
    field: 'logisticsOrderStatus',
    width: '70px',
    formatter: function (row) {
      return inDict(row.logisticsOrderStatus, 'orderStatus')
    }
  },
  {
    label: '下單時間',
    width: '70px',
    field: 'logisticsOrderTime'
  },
  {
    label: '是否包郵',
    width: '70px',
    field: 'expressFee',
    formatter: function (row) {
      var expressType = row.expressType
      var fee = Number(row.expressFee)
      if (fee === 0) {
        if (expressType != 'sfdf' && expressType != 'ssdf') {
          return '包郵'
        }
      }
      return '不包郵'
    }
  },
  {
    label: '支付快遞費',
    width: '70px',
    field: 'expressFee'
  },
  {
    label: '收件人',
    field: 'deliverName',
    width: '70px'
  },
  {
    label: '收件人手機',
    field: 'deliverMobile',
    width: '70px'
  },
  {
    label: '配送地址',
    field: 'address',
    width: '70px'
  },
  {
    label: '本次備註',
    field: 'remark',
    width: '70px'
  },

  // Search Schema
  genSearchSchema('apiSelect', 'pharmacyId', '藥房', {
    placeholder: '選擇藥房',
    api: async () => {
      return await getInOptionFormat('index/pharmacys', 'id', 'name')
    }
  }),
  genSearchSchema('sourceSelect', 'deliveryStatus', '錄單狀態', {
    placeholder: '錄單狀態',
    options: dict.deliveryStatus as any
  }),
  genSearchSchema('input', 'expressNo', '物流編號', { placeholder: '物流編號' }),
  genSearchSchema('sourceSelect', 'expressType', '配送方式', {
    placeholder: '配送方式',
    options: dict.expressType as any
  }),
  genSearchSchema('input', 'logisticsOrderNo', '訂單編號', { placeholder: '訂單編號' }),
  genSearchSchema('input', 'memberName', '客人/手機', { placeholder: '客人/手機' }),
  genSearchSchema('input', 'doctorName', '醫生姓名', { placeholder: '醫生姓名' }),
  genSearchSchema('input', 'businessId', '處方編號', { placeholder: '處方編號' }),
  genSearchSchema('datePicker', 'startTime', '下單時間', { placeholder: '下單時間' }),
  genSearchSchema('datePicker', 'endTime', '到', { placeholder: '下單時間' }),
  genSearchSchema('input', 'deliverName', '收件人', { placeholder: '收件人/手機號' })
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
  if ((row.origin & 1) == 0) {
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

const ActionCol = (props) => {
  const { row } = props
  const createForm = inDict(row.createFrom, 'createFrom')
  let ludan = '錄單'
  if (row.expressType === 'SF' || row.expressType === 'sfdf') {
    ludan = '打印運單'
  }
  return (
    <>
      {null === row.logisticsOrderId ? (
        <>
          <ElLink
            type="primary"
            onClick={() => {
              settlement(row)
            }}
            class="mr-5px"
          >
            {ludan}
          </ElLink>
          <ElLink
            type="primary"
            onClick={() => {
              settlement(row)
            }}
            class="mr-5px"
          >
            物流
          </ElLink>
          <ElLink
            type="primary"
            onClick={() => {
              settlement(row)
            }}
            class="mr-5px"
          >
            日誌
          </ElLink>
        </>
      ) : null}
      {row.pharmacyName !== '廣州康美藥房' && row.pharmacyName !== '廣州至信藥房' ? (
        <ElLink
          type="primary"
          onClick={() => {
            settlement(row)
          }}
          class="mr-5px"
        >
          {ludan}
        </ElLink>
      ) : null}
      <ElLink
        type="primary"
        onClick={() => {
          settlement(row)
        }}
        class="mr-5px"
      >
        物流
      </ElLink>
      <ElLink
        type="primary"
        onClick={() => {
          settlement(row)
        }}
        class="mr-5px"
      >
        訂單
      </ElLink>
      <ElLink
        type="primary"
        onClick={() => {
          settlement(row)
        }}
        class="mr-5px"
      >
        日誌
      </ElLink>
    </>
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
        <ActionCol :row="row" />
      </template>
      <template #addressCount="{ row }">
        <div v-if="row.logisticsOrderNo">
          <ElLink type="primary" @click="settlement(row)" class="mr-5px">{{
            row.addressCount
          }}</ElLink>
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
