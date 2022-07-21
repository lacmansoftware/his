<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
// import { useI18n } from '@/hooks/web/useI18n'
import { ElDatePicker } from 'element-plus'
import { Table } from '@/components/Table'
import { getTableListApi, getPrintApi } from '@/api/appoint/appoint/hospital'
import { useTable } from '@/hooks/web/useTable'
import { AppointHospitalTableData } from '@/api/appoint/appoint/hospital/types'
import { reactive, ref, unref, onMounted, watch, computed } from 'vue'
// import { useRouter } from 'vue-router'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
// import { useDictStoreWithOut } from '@/store/modules/dict'
import { getInOptionFormat, formatObject, getWeekSEDate } from '@/utils/common'
import { getApi } from '@/api/common'
import dict from '@/config/dictionary.json'
import ColumnView from './ColumnView.vue'

defineOptions({
  name: 'AppointManageHospitalIndex'
})

// const dictStore = useDictStoreWithOut()
const curWeek = ref(getWeekSEDate())
const curWeekDate = ref(curWeek.value.startDate)

const store = {
  allSelectData: ref<any>([]),
  feePayHospitalId: ref<ComponentOptions[]>([])
}

const sysCities = computed(() => formatObject(store.allSelectData.value?.sysCities, 'id', 'name'))

const sysHospitals = computed(() =>
  formatObject(store.allSelectData.value?.sysHospitals, 'id', 'name')
)

const doctorInfos = computed(() =>
  formatObject(store.allSelectData.value?.doctorInfos, 'id', 'name')
)

const sysDiseases = computed(() =>
  formatObject(store.allSelectData.value?.sysDiseases, 'id', 'name')
)

const getAllSelectData = async () => {
  const res = await getApi(`/member/appointment/init/allSelect`)

  if (res?.success === true) {
    store.allSelectData.value = res.data
  }
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

onMounted(async () => {
  // setStore('certificate', '/sys/dict/type/MEMBER_Certificate', 'code', 'value')
  setStore('feePayHospitalId', '/sys/hospital', 'id', 'name')
  updateTableCol()
  getAllSelectData()
  await setValues({
    viewType: 'basicWeek',
    startDate: curWeek.value.startDate,
    endDate: curWeek.value.endDate
  })
  search()
})

// const { push } = useRouter()

const { register, tableObject, methods } = useTable<AppointHospitalTableData>({
  getListApi: getTableListApi,
  response: {
    list: 'data',
    total: 'total'
  }
})

const { setSearchParams } = methods

// const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'city',
    label: '城市',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        options: sysCities as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'hospitalId',
    label: '門店',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        options: sysHospitals as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'doctorId',
    label: '醫生',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        options: doctorInfos as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'diseaseseId',
    label: '病情/醫生技能',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        options: sysDiseases as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'type',
    label: '',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Hidden',
      colProps: { span: 0 }
    }
  },
  {
    field: 'id',
    label: '',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Hidden',
      colProps: { span: 0 }
    }
  },
  {
    field: 'cityId',
    label: '',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Hidden',
      colProps: { span: 0 }
    }
  },
  {
    field: 'viewType',
    label: '',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Hidden',
      colProps: { span: 0 }
    }
  },
  {
    field: 'startDate',
    label: '',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Hidden',
      colProps: { span: 0 }
    }
  },
  {
    field: 'endDate',
    label: '',
    form: { show: false },
    table: { show: false },
    search: {
      show: true,
      component: 'Hidden',
      colProps: { span: 0 }
    }
  },
  {
    field: 'hospital',
    label: '门店'
  },
  {
    field: 'col0',
    label: '周日'
  },
  {
    field: 'col1',
    label: '周一'
  },
  {
    field: 'col2',
    label: '周二'
  },
  {
    field: 'col3',
    label: '周三'
  },
  {
    field: 'col4',
    label: '周四'
  },
  {
    field: 'col5',
    label: '周五'
  },
  {
    field: 'col6',
    label: '周六'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

// const loading = ref(false)
const searchRef = ref<ComponentRef<typeof Search>>()

const setValues = (value) => {
  const search = unref(searchRef)
  search?.setValues(value)
}

const search = () => {
  const search = unref(searchRef)
  search!.search()
}

const updateTableCol = () => {
  curWeek.value.range.map((item, index) => {
    const { setColumn } = methods
    setColumn([
      {
        field: `col${index}`,
        path: 'label',
        value: `${dict.weekday[index]}(${item.substring(5)})`
      }
    ])
  })
}

watch(curWeekDate, async () => {
  curWeek.value = getWeekSEDate(curWeekDate.value)
  updateTableCol()
  await setValues({
    startDate: curWeek.value.startDate,
    endDate: curWeek.value.endDate
  })
  search()
})
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

    <div class="mb-10px text-right mt-[-50px]">
      <ElDatePicker
        v-model="curWeekDate"
        type="week"
        size="large"
        format="[Week] ww - YYYY/MM/DD"
        placeholder="Pick a week"
        value-format="YYYY/MM/DD"
      />
    </div>

    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :selection="false"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #hospital="{ row }">
        <div class="flex flex-col align-middle">
          <p class="text-base text-green-500">{{ row?.name }}</p>
          <p>{{ `上限 ${row?.totalLimit} 人` }}</p>
          <p>{{ `已约 ${row?.totalMeet} 人` }}</p>
        </div>
      </template>
      <template #col0="{ row }">
        <div>
          <!-- <HandleColumn :row="row" :colId="0" /> -->
          <ColumnView :row="row" :col-id="0" :cur-week="curWeek" />
        </div>
      </template>
      <template #col1="{ row }">
        <div>
          <ColumnView :row="row" :colId="1" :cur-week="curWeek" />
        </div>
      </template>
      <template #col2="{ row }">
        <div>
          <ColumnView :row="row" :colId="2" :cur-week="curWeek" />
        </div>
      </template>
      <template #col3="{ row }">
        <div>
          <ColumnView :row="row" :colId="3" :cur-week="curWeek" />
        </div>
      </template>
      <template #col4="{ row }">
        <div>
          <ColumnView :row="row" :colId="4" :cur-week="curWeek" />
        </div>
      </template>
      <template #col5="{ row }">
        <div>
          <ColumnView :row="row" :colId="5" :cur-week="curWeek" />
        </div>
      </template>
      <template #col6="{ row }">
        <div>
          <ColumnView :row="row" :colId="6" :cur-week="curWeek" />
        </div>
      </template>
    </Table>
  </ContentWrap>
</template>

<style lang="less" scoped>
.el-input__wrapper {
  width: 100%;
}
</style>
