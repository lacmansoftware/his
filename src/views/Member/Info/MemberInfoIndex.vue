<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElTag, ElLink } from 'element-plus'
import { Table } from '@/components/Table'
import { getTableListApi, delTableListApi } from '@/api/member'
import { useTable } from '@/hooks/web/useTable'
import { MemberInfoTableData } from '@/api/member/types'
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { inDict, getAgeByBirthday } from '@/utils/common'
import { callIcon, msgIcon, plusIcon, mergeIcon } from '@/utils/iconList'
import { searchConfig, crudConfig } from './index.ts'
import { getApi } from '@/api/member/index.ts'

defineOptions({
  name: 'MemberInfoIndex'
})

const store = {
  certificate: ref([]),
  level: ref([]),
  cardStatus: ref([]),
  hospital: ref([]),
  disease: ref([])
}

const setStore = (key: string, url: string, valueField: string, labelField: string) => {
  getApi(url).then((res: any) => {
    store[key].value = res?.data.map((item) => ({
      label: item[labelField],
      value: item[valueField]
    }))
  })
}

onMounted(() => {
  setStore('certificate', '/sys/dict/type/MEMBER_Certificate', 'code', 'value')
  setStore('level', '/sys/member/level', 'id', 'levelName')
  setStore('cardStatus', '/sys/dict/type/MEMBER_CardStatus', 'code', 'value')
  setStore('hospital', '/sys/hospital', 'id', 'name')
  setStore('disease', '/sys/diseases', 'id', 'name')
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

useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

const { t } = useI18n()

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '姓名',
    component: 'Input'
  },
  {
    field: 'mobile',
    label: '手機號',
    component: 'Input'
  },
  {
    field: 'identityType',
    label: '證件類型',
    component: 'Select',
    componentProps: {
      options: store.certificate
    }
  },
  {
    field: 'identityCode',
    label: '證件號碼',
    component: 'Input'
  },
  {
    field: 'archivesNo',
    label: '檔案號',
    component: 'Input'
  },
  {
    field: 'memberLevel',
    label: '會員級別',
    component: 'Select',
    componentProps: {
      options: store.level
    }
  },
  {
    field: 'cardStatus',
    label: '會員卡狀態',
    component: 'Select',
    componentProps: {
      options: store.cardStatus
    }
  },
  {
    field: 'memberCardNum',
    label: '會員卡號',
    component: 'Input'
  },
  {
    field: 'profileLocation',
    label: '門店',
    component: 'Select',
    componentProps: {
      options: store.hospital
    }
  },
  {
    field: 'firstDisease',
    label: '病種',
    component: 'Select',
    componentProps: {
      options: store.disease
    }
  }
])

const crudSchemas = reactive<CrudSchema[]>(crudConfig)

const { allSchemas } = useCrudSchemas(crudSchemas)

const AddAction = () => {
  push('/member/info-add')
}

const delLoading = ref(false)

const delData = async (row: MemberInfoTableData | null, multiple: boolean) => {
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

const action = (row: MemberInfoTableData, type: string) => {
  push(`/example/example-${type}?id=${row.id}`)
}

const outCall = (mobile: string) => {
  console.log('out going call: ', searchSchema[8].componentProps.options)
}

const sendMsg = (mobile: string) => {
  console.log('out going call: ', mobile)
}
</script>

<template>
  <ContentWrap>
    <Search
      :schema="searchSchema"
      @search="setSearchParams"
      @reset="setSearchParams"
      expand
      expand-field="archivesNo"
    />

    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">新增客人</ElButton>
      <ElButton :loading="delLoading" type="danger" @click="delData(null, true)" :icon="mergeIcon"
        >合併客人</ElButton
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
        <ElLink type="primary" @click="action(row, 'edit')">
          {{ t('exampleDemo.edit') }}
        </ElLink>
        <ElLink type="success" @click="action(row, 'detail')">
          {{ t('exampleDemo.detail') }}
        </ElLink>
        <ElLink type="danger" @click="delData(row, false)">
          {{ t('exampleDemo.del') }}
        </ElLink>
      </template>
      <template #gender="{ row }">
        {{ inDict(row.gender, 'sex') }}
      </template>
      <template #age="{ row }">
        {{ getAgeByBirthday(row.birthday) }}
      </template>
      <template #mobile="{ row }">
        <div class="flex items-center gap-1">
          <span>{{ row.mobile }}</span>
          <ElLink type="primary" @click="outCall(row.mobile)" title="打電話" :icon="callIcon" />
          <ElLink type="primary" @click="sendMsg(row.mobile)" title="發短信" :icon="msgIcon" />
        </div>
      </template>
    </Table>
  </ContentWrap>
</template>

<style lang="less" scoped></style>
