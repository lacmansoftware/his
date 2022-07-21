import { useAxios } from '@/hooks/web/useAxios'
import type { SMSTemplateData } from './types'

const request = useAxios()

export const getTableListApi = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/sms/templet', params })
  return res && res.data
}

export const saveTableApi = async (data: Partial<SMSTemplateData>): Promise<IResponse> => {
  const res = await request.post({
    url: '/sms/templet',
    headersType: 'application/x-www-form-urlencoded',
    data
  })
  return res && res.data
}

export const getTableDetApi = async (id: string): Promise<IResponse<SMSTemplateData>> => {
  const res = await request.get({ url: '/example/detail', params: { id } })
  return res && res.data
}

export const delTableListApi = async (req: string): Promise<IResponse> => {
  const res = await request.delete({ url: `/sms/templet/${req}` })
  return res && res.data
}
