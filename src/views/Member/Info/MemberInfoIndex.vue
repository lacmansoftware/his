<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElLink, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { getTableListApi, saveTableApi, delTableListApi, saveMergeApi } from '@/api/member'
import { useTable } from '@/hooks/web/useTable'
import { MemberInfoTableData } from '@/api/member/types'
import { reactive, ref, unref, onMounted } from 'vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { inDict, getAgeByBirthday } from '@/utils/common'
import { callIcon, msgIcon, plusIcon, mergeIcon } from '@/utils/iconList'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import Merge from './components/Merge.vue'
import dict from '@/config/dictionary.json'
import { getPinyinCode, getInOptionFormat } from '@/utils/common'

defineOptions({
  name: 'MemberInfoManagement'
})

const store = {
  certificate: ref<ComponentOptions[]>([]),
  level: ref<ComponentOptions[]>([]),
  cardStatus: ref<ComponentOptions[]>([]),
  hospital: ref<ComponentOptions[]>([]),
  country: ref<ComponentOptions[]>([]),
  nativePlace: ref<ComponentOptions[]>([]),
  nationality: ref<ComponentOptions[]>([]),
  education: ref<ComponentOptions[]>([]),
  isMarried: ref<ComponentOptions[]>([]),
  memberSource: ref<ComponentOptions[]>([]),
  disease: ref<ComponentOptions[]>([])
}

const setStore = async (key: string, url: string, valueField: string, labelField: string) => {
  store[key].value = await getInOptionFormat(url, valueField, labelField)
}

onMounted(() => {
  // setStore('certificate', '/sys/dict/type/MEMBER_Certificate', 'code', 'value')
  setStore('level', '/sys/member/level', 'id', 'levelName')
  setStore('cardStatus', '/sys/dict/type/MEMBER_CardStatus', 'code', 'value')
  setStore('hospital', '/sys/hospital', 'id', 'name')
  setStore('disease', '/sys/diseases', 'id', 'name')
  setStore('country', '/sys/dict/type/MEMBER_Country', 'code', 'value')
  setStore('nativePlace', '/sys/city/byLevel?level=1', 'id', 'name')
  setStore('nationality', '/sys/dict/childlist?type=MEMBER_Nation', 'code', 'value')
  setStore('education', '/sys/dict/type/MEMBER_Education', 'code', 'value')
  setStore('isMarried', '/sys/dict/type/MEMBER_Married', 'code', 'value')
  setStore('memberSource', '/sys/dict/type/MEMBER_Source', 'code', 'value')
})

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

const { t } = useI18n()

const setPinyinCode = async (item: any) => {
  const write = unref(writeRef)
  const formData = (await write?.getFormData()) as any
  const py = getPinyinCode(formData.name)

  write?.setValues({
    pinyinCode: py
  })
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '操作',
    field: 'action',
    width: '120px',
    form: {
      show: false
    }
  },
  {
    label: '姓名',
    field: 'memberName',
    form: {
      show: false
    }
  },
  {
    field: 'name',
    label: '姓名',
    form: {
      colProps: {
        span: 8
      },
      componentProps: {
        onKeyup: setPinyinCode,
        placeholder: '請填寫'
      },
      show: true
    },
    table: {
      show: false
    },
    search: {
      component: 'Input',
      colProps: {
        span: 6
      },
      show: true
    }
  },
  {
    field: 'pinyinCode',
    label: '姓名拼音碼',
    form: {
      component: 'Input',
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    label: '性別',
    field: 'gender',
    width: '60px',
    form: {
      component: 'Select',
      componentProps: {
        style: { width: '100%' },
        options: dict.sex
      },
      colProps: {
        span: 8
      },
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
      colProps: {
        span: 8
      },
      show: true
    },
    search: {
      component: 'Input',
      colProps: {
        span: 6
      },
      show: true
    }
  },
  {
    label: '生日',
    field: 'birthday',
    width: '100px',
    form: {
      label: '生日（陽曆）',
      component: 'DatePicker',
      componentProps: {
        style: { width: '100%' }
      },
      colProps: {
        span: 8
      },
      show: true
    }
  },
  {
    field: 'birthdayLunar',
    label: '生辰（農曆）',
    form: {
      component: 'DatePicker',
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    field: 'birthdayHour',
    label: '',
    form: {
      component: 'Hidden',
      colProps: { span: 0 },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    label: '年齡',
    field: 'age',
    width: '60px',
    form: { show: false }
  },
  {
    field: 'identityType',
    label: '證件類型',
    form: {
      component: 'Select',
      componentProps: {
        style: { width: '100%' }
      },
      api: async () => {
        const res = await getInOptionFormat('/sys/dict/type/MEMBER_Certificate', 'code', 'value')
        return res
      },
      colProps: { span: 8 },
      show: true
    },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        options: store.certificate as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '證件號碼',
    field: 'identityCode',
    width: '100px',
    placeholder: '請填寫',
    form: {
      colProps: {
        span: 8
      },
      show: true
    },
    search: {
      component: 'Input',
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'country',
    label: '國家',
    form: {
      component: 'Select',
      componentProps: {
        style: { width: '100%' },
        options: store.country as any
      },
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    field: 'nativePlace',
    label: '籍貫',
    form: {
      component: 'Select',
      componentProps: {
        style: { width: '100%' },
        options: store.nativePlace as any
      },
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    field: 'nationality',
    label: '民族',
    form: {
      component: 'Select',
      componentProps: {
        style: { width: '100%' },
        options: store.nationality as any
      },
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    field: 'occupation',
    label: '職業',
    form: {
      component: 'Input',
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    field: 'education',
    label: '文化程度',
    form: {
      component: 'Select',
      componentProps: {
        style: { width: '100%' },
        options: store.education as any
      },
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    field: 'isMarried',
    label: '婚姻狀況',
    form: {
      component: 'Select',
      componentProps: {
        style: { width: '100%' },
        options: store.isMarried as any
      },
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    field: 'hasChild',
    label: '生育情況',
    form: {
      component: 'Select',
      componentProps: {
        style: { width: '100%' }
      },
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    field: 'boyNum',
    label: '',
    form: {
      component: 'Hidden',
      colProps: {
        span: 0
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    field: 'girlNum',
    label: '',
    form: {
      component: 'Hidden',
      colProps: {
        span: 0
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    field: 'height',
    label: '身高（厘米）',
    form: {
      component: 'Input',
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    field: 'weight',
    label: '體重（公斤）',
    form: {
      component: 'Input',
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    field: 'memberSource',
    label: '客戶來源',
    form: {
      component: 'Select',
      componentProps: {
        style: { width: '100%' },
        options: store.memberSource as any
      },
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    field: 'recommender',
    label: '來源詳情',
    form: {
      component: 'Input',
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    field: 'createHospitalId',
    label: '初登門店',
    form: {
      component: 'Input',
      componentProps: {
        disabled: true
      },
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    label: '檔案號',
    field: 'archivesNo',
    width: '100px',
    placeholder: '請填寫',
    form: {
      component: 'Input',
      componentProps: {
        disabled: true
      },
      colProps: {
        span: 8
      },
      show: true
    },
    search: {
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'otherPhone',
    label: '其他電話',
    form: {
      component: 'Input',
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    field: 'profileLocation',
    label: '門店',
    form: {
      label: '檔案所在門店',
      component: 'Select',
      componentProps: {
        style: { width: '100%' },
        options: store.hospital as any
      },
      colProps: { span: 16 },
      show: true
    },
    table: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        options: store.hospital as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'contactPreference',
    label: '預約聯繫方式',
    form: {
      component: 'Radio',
      componentProps: {
        options: dict.member.contactPreference
      },
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    }
  },
  {
    label: '檔案存放地',
    field: 'profileLocationName',
    width: '125px',
    placeholder: '請選擇',
    form: {
      show: false
    }
  },
  {
    label: '證件類型',
    field: 'identityTypeName',
    width: '60px',
    placeholder: '請選擇',
    form: {
      show: false
    }
  },
  {
    label: '會員級別',
    field: 'levelName',
    width: '100px',
    placeholder: '請選擇',
    form: {
      show: false
    }
  },
  {
    label: '會員等級',
    field: 'memberLevel',
    form: {
      component: 'Select',
      componentProps: {
        options: store.level as any,
        style: { width: '100%' }
      },
      colProps: {
        span: 8
      },
      show: true
    },
    table: {
      show: false
    },
    search: {
      component: 'Select',
      componentProps: {
        options: store.level as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '會員卡狀態',
    field: 'cardStatus',
    width: '100px',
    placeholder: '請選擇',
    form: { show: false },
    search: {
      component: 'Select',
      componentProps: {
        options: store.cardStatus as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '會員卡號',
    field: 'cardNum',
    width: '100px',
    placeholder: '請填寫會員卡號',
    form: { show: false }
  },
  {
    field: 'memberCardNum',
    label: '會員卡號',
    form: { show: false },
    table: { show: false },
    search: {
      component: 'Input',
      componentProps: {
        options: store.level as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    label: '卡內餘額',
    field: 'balance',
    width: '100px',
    form: {
      colProps: { span: 8 },
      show: false
    }
  },
  {
    label: '辦卡時間',
    field: 'cardCreateTime',
    width: '100px',
    form: { show: false }
  },
  {
    label: '創建人',
    field: 'createUser',
    width: '100px',
    form: { show: false }
  },
  {
    label: '創建門店',
    field: 'createHospital',
    width: '100px',
    form: { show: false }
  },
  {
    field: 'firstDisease',
    label: '病種',
    form: { show: false },
    table: {
      show: false
    },
    search: {
      component: 'Select',
      componentProps: {
        options: store.disease as any
      },
      colProps: { span: 6 },
      show: true
    }
  },
  {
    field: 'email',
    label: '郵箱',
    form: {
      component: 'Input',
      colProps: { span: 8 },
      show: true
    },
    table: { show: false }
  },
  {
    field: 'weibo',
    label: '微博',
    form: {
      component: 'Input',
      colProps: { span: 8 },
      show: true
    },
    table: { show: false }
  },
  {
    field: 'wechat',
    label: '微信',
    form: {
      component: 'Input',
      colProps: { span: 8 },
      show: true
    },
    table: { show: false }
  },
  {
    field: 'urgentContact',
    label: '緊急聯繫人',
    form: {
      component: 'Input',
      colProps: { span: 8 },
      show: true
    },
    table: { show: false }
  },
  {
    field: 'urgentContactTel',
    label: '緊急聯繫人電話',
    form: {
      component: 'Input',
      colProps: { span: 8 },
      show: true
    },
    table: { show: false }
  },
  {
    field: 'urgentContactRel',
    label: '緊急聯繫人關係',
    form: {
      component: 'Input',
      colProps: { span: 8 },
      show: true
    },
    table: { show: false }
  },
  {
    field: 'certificatesUrlFace',
    label: '上傳身份證正面照片',
    form: {
      component: 'Input',
      colProps: { span: 24 },
      show: true
    },
    table: { show: false }
  },
  {
    field: 'certificatesUrlBack',
    label: '上傳身份證反面照片',
    form: {
      component: 'Input',
      colProps: { span: 24 },
      show: true
    },
    table: { show: false }
  },
  {
    field: 'appointRemark',
    label: '預約備註',
    form: {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 2
      },
      colProps: { span: 24 },
      show: true
    },
    table: { show: false }
  },
  {
    field: 'md5',
    label: '',
    form: {
      component: 'Hidden',
      colProps: { span: 0 },
      show: true,
      value: '70adeb9506cb8291177d784dc4dc3759'
    },
    table: { show: false }
  },
  {
    field: 'comment',
    label: '備註',
    form: {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 2
      },
      colProps: { span: 24 },
      show: true
    },
    table: { show: false }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)

const dialogTitle = ref('')
const dialogWidth = ref('')

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

const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = '新增客人'
  actionType.value = 'add'
  dialogWidth.value = '90%'
  tableObject.currentRow = null
  dialogVisible.value = true
}

const MergeAction = () => {
  dialogTitle.value = '合併客人'
  dialogWidth.value = ''
  actionType.value = 'merge'
  dialogVisible.value = true
}

const action = (row: MemberInfoTableData, type: string) => {
  dialogTitle.value = type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail'
  dialogWidth.value = '90%'
  actionType.value = type
  tableObject.currentRow = row
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()
const mergeRef = ref<ComponentRef<typeof Merge>>()

const loading = ref(false)

const outCall = (mobile: string) => {
  console.log('out going call: ', mobile)
}

const sendMsg = (mobile: string) => {
  console.log('out going call: ', mobile)
}

const save = async () => {
  if (actionType.value === 'add') {
    const write = unref(writeRef)
    await write?.elFormRef?.validate(async (isValid) => {
      if (isValid) {
        loading.value = true
        const data = (await write?.getFormData()) as any
        const res = await saveTableApi(data)
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
  } else if (actionType.value === 'merge') {
    const merge = unref(mergeRef)
    const { sMember }: { sMember: string[] } = merge
    await merge?.elFormRef?.validate(async (isValid) => {
      if (isValid) {
        loading.value = true
        const res = await saveMergeApi({
          mainId: sMember[0],
          lessId: sMember[1]
        })
          .catch(() => {})
          .finally(() => {
            loading.value = false
          })
        if (res) {
          dialogVisible.value = false
          ElMessage.success(res.msg as string)
        }
      }
    })
  }
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
      expand
      expand-field="archivesNo"
    />

    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction" :icon="plusIcon">新增客人</ElButton>
      <ElButton :loading="delLoading" type="danger" @click="MergeAction" :icon="mergeIcon"
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
      <template #cardStatus="{ row }">
        {{ !row.cardStatus ? '無卡' : inDict(row.cardStatus, 'memberCard.status') }}
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

  <Dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth">
    <Write
      v-if="actionType !== 'detail' && actionType !== 'merge'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="tableObject.currentRow"
    />

    <Detail
      v-if="actionType === 'detail'"
      :detail-schema="allSchemas.detailSchema"
      :current-row="tableObject.currentRow"
    />

    <Merge v-if="actionType === 'merge'" ref="mergeRef" />

    <!-- <template #header="{ titleId, titleClass }">
      <div class="flex justify-between">
        <h4 :id="titleId" :class="titleClass">This is a custom header!</h4>
      </div>
    </template>
 -->
    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
.el-input__wrapper {
  width: 100%;
}
</style>
