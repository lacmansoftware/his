<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElTag, ElRow, ElCol, ElDivider } from 'element-plus'
import { Table } from '@/components/Table'
import { getAddressTableListApi, saveTableApi } from '@/api/cash/notcharged'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { h, ref, unref, reactive, watch } from 'vue'
import Write from './Write.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { inDict } from '@/utils/common'
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  memberId: propTypes.string.def('')
})

const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getAddressTableListApi,
  // getListApi: (option: any): Promise<any> =>
  //   getAddressTableListApi({
  //     ...option,
  //     memberId: props.memberId
  //   }),
  response: {
    list: 'list',
    total: 'total'
  }
})

watch(tableObject, (value, oldValue) => {
  console.log(value, oldValue)
})

const { getList } = methods

getList()

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '分類',
    field: 'addressType',
    formatter: function (row) {
      return inDict(row.addressType, 'member.addressType')
    }
  },
  {
    label: '收件人',
    field: 'addressee'
  },
  {
    label: '收件人手機',
    field: 'mobile'
  },
  {
    label: '所在地區',
    field: 'cityName'
  },
  {
    label: '詳細地區',
    field: 'addressDetail'
  },
  {
    label: '備註',
    field: 'remark'
  },
  {
    label: '默認地址',
    field: 'isDefault',
    formatter: function (row) {
      if (row.isDefault === 'Y') {
        return '<input type="radio" name="isDefault" checked="true"/>默認地址'
      } else {
        return (
          '<label for="isDefault' +
          row.id +
          '" style="cursor: pointer;"><input id="isDefault' +
          row.id +
          '" type="radio" name="isDefault"/>設為默認地址</label>'
        )
      }
    }
  },
  {
    label: '操作',
    field: 'action'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)

const dialogTitle = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  tableObject.currentRow = null
  dialogVisible.value = true
}

const actionType = ref('')

const action = (row: TableData, type: string) => {
  dialogTitle.value = type === 'edit' ? '點擊收起' : 'exampleDemo.detail'
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
      <ElDivider content-position="left">選擇或填寫地址（選擇某行即設置為本次收件地址）</ElDivider>
    </ElCol>
    <ElCol :span="12">
      <ElDivider content-position="right">
        <div class="mb-10px">
          <ElButton type="primary" @click="AddAction">新增地址</ElButton>
          <!-- <ElButton :loading="delLoading" type="danger" @click="delData(null, true)">
            {{ t('exampleDemo.del') }}
          </ElButton> -->
        </div>
      </ElDivider>
    </ElCol>
  </ElRow>

  <ContentWrap>
    <!-- <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" /> -->

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
        <ElButton type="primary" @click="action(row, 'edit')"> 編輯 </ElButton>
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
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
