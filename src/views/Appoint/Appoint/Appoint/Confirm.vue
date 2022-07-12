<script setup lang="ts">
import { Form } from '@/components/Form'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { onMounted, reactive, ref, unref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useRouter, useRoute } from 'vue-router'
import { saveUpdateStatusApi } from '@/api/appoint/appoint/hospital'
import { UpdateStatusType } from '@/api/appoint/appoint/hospital/types'

import dict from '@/config/dictionary.json'

const { required } = useValidator()
const { emitter } = useEmitt()
const { push, go } = useRouter()
const { query } = useRoute()
const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'source',
    label: '選擇方式',
    component: 'Select',
    componentProps: {
      style: 'width: 100%',
      placeholder: '選擇方式',
      options: dict.appoint.source
    },
    colProps: { offset: 6, span: 12 },
    formItemProps: {
      rules: [required()]
    }
  }
])

const { register, methods, elFormRef } = useForm({
  schema
})

const loading = ref(false)

const save = async () => {
  await unref(elFormRef)?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await unref(methods)?.getFormData()) as UpdateStatusType
      console.log(data)
      const res = await saveUpdateStatusApi({
        id: query.id,
        datareplyChannel: data.source
      } as UpdateStatusType)
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      if (res) {
        ElMessage.success(res.msg as string)
        emitter.emit('getList', 'confirm')
        // push('/appoint/example-page')
        go(-1)
      }
    }
  })
}

onMounted(() => {
  if (!query?.id) {
    ElMessage.error('no id')
    go(-1)
  }
})

const rules = []
</script>

<template>
  <ContentDetailWrap title="選擇確認預約方式" @back="push('/appoint/appoint/list/index')">
    <Form :rules="rules" @register="register" />

    <template #right>
      <ElButton type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
    </template>
  </ContentDetailWrap>
</template>
