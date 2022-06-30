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
import { searchConfig, crudConfig } from './index'
import { getApi } from '@/api/member/index'

defineOptions({
  name: 'MemberInfoIndex'
})

const store = {
  certificate: ref<ComponentOptions[]>([]),
  level: ref<ComponentOptions[]>([]),
  cardStatus: ref<ComponentOptions[]>([]),
  hospital: ref<ComponentOptions[]>([]),
  disease: ref<ComponentOptions[]>([])
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

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action',
    width: '120px'
  },
  {
    label: '姓名',
    field: 'memberName',
    placeholder: '請填寫'
  },
  {
    field: 'name',
    label: '姓名',
    form: {
      component: 'Input',
      colProps: {
        span: 24
      }
    },
    table: {
      show: false
    },
    search: {
      show: true
    }
  },
  {
    label: '手機號碼',
    field: 'mobile',
    width: '135px',
    placeholder: '請填寫',
    form: {
      component: 'Input',
      show: true
    },
    search: {
      show: true
    }
  },
  {
    label: '性別',
    field: 'gender',
    width: '60px'
  },
  {
    label: '年齡',
    field: 'age',
    width: '60px'
  },
  {
    label: '生日',
    field: 'birthday',
    width: '100px'
  },
  {
    field: 'identityType',
    label: '證件類型',
    table: {
      show: false
    },
    search: {
      component: 'Select',
      componentProps: {
        options: store.certificate
      },
      show: true
    }
  },
  {
    label: '檔案號',
    field: 'archivesNo',
    width: '100px',
    placeholder: '請填寫',
    search: {
      component: 'Input',
      show: true
    }
  },
  {
    label: '檔案存放地',
    field: 'profileLocationName',
    width: '125px',
    placeholder: '請選擇'
  },
  {
    field: 'profileLocation',
    label: '門店',
    table: {
      show: false
    },
    search: {
      component: 'Select',
      componentProps: {
        options: store.hospital
      },
      show: true
    }
  },
  {
    label: '證件類型',
    field: 'identityTypeName',
    width: '60px',
    placeholder: '請選擇'
  },
  {
    label: '證件號碼',
    field: 'identityCode',
    width: '100px',
    placeholder: '請填寫',
    search: {
      component: 'Input',
      show: true
    }
  },
  {
    label: '會員級別',
    field: 'levelName',
    width: '100px',
    placeholder: '請選擇'
  },
  {
    label: '會員級別',
    field: 'memberLevel',

    table: {
      show: false
    },
    search: {
      component: 'Select',
      componentProps: {
        options: store.level
      },
      show: true
    }
  },
  {
    label: '會員卡狀態',
    field: 'cardStatus',
    width: '100px',
    placeholder: '請選擇',

    table: {
      show: false
    },
    search: {
      component: 'Select',
      componentProps: {
        options: store.cardStatus
      },
      show: true
    }
  },
  {
    label: '會員卡號',
    field: 'cardNum',
    width: '100px',
    placeholder: '請填寫會員卡號'
  },
  {
    field: 'memberCardNum',
    label: '會員卡號',
    table: {
      show: false
    },
    search: {
      component: 'Input',
      componentProps: {
        options: store.level
      },
      show: true
    }
  },
  {
    label: '卡內餘額',
    field: 'balance',
    width: '100px'
  },
  {
    label: '辦卡時間',
    field: 'cardCreateTime',
    width: '100px'
  },
  {
    label: '創建人',
    field: 'createUser',
    width: '100px'
  },
  {
    label: '創建門店',
    field: 'createHospital',
    width: '100px'
  },
  {
    field: 'firstDisease',
    label: '病種',
    table: {
      show: false
    },
    search: {
      component: 'Input',
      componentProps: {
        options: store.disease
      },
      show: true
    }
  }
])

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
      :schema="allSchemas.searchSchema"
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
