import { useAxios } from '@/hooks/web/useAxios'
import type { SMSSendData } from './types'

const request = useAxios()

export const getTableListApi = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/sms/send', params })
  return res && res.data
}

export const saveTableApi = async (data: Partial<SMSSendData>): Promise<IResponse> => {
  const res = await request.post({
    url: '/sms/send/send',
    headersType: 'application/x-www-form-urlencoded',
    data
  })
  return res && res.data
}

export const getTableDetApi = async (id: string): Promise<IResponse<SMSSendData>> => {
  const res = await request.get({ url: '/example/detail', params: { id } })
  return res && res.data
}

export const delTableListApi = async (req: any): Promise<IResponse> => {
  // sms/send/batchdel
  // deldata: 0673867d3e1a4c108c4f6cf0523b2eb9,02669c75df454772b035ae773aeebd0f
  const res = await request.post({
    url: '/sms/send/batchdel',
    headersType: 'application/x-www-form-urlencoded',
    data: {
      deldata: req
    }
  })
  return res && res.data
}

export const saveMergeApi = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/member/info/infoMerge', params })
  return res && res.data
}

export const updateTableApi = async (data: any): Promise<IResponse> => {
  const res = await request.post({
    url: '/member/workorder/update',
    headersType: 'application/x-www-form-urlencoded',
    data
  })
  return res && res.data
}
