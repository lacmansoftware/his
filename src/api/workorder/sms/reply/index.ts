import { useAxios } from '@/hooks/web/useAxios'
import type { SMSReplyData } from './types'

const request = useAxios()

export const getTableListApi = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/sms/reply', params })
  return res && res.data
}

export const saveTableApi = async (data: Partial<SMSReplyData>): Promise<IResponse> => {
  const res = await request.post({
    url: '/sms/send/send',
    headersType: 'application/x-www-form-urlencoded',
    data
  })
  return res && res.data
}

export const getTableDetApi = async (id: string): Promise<IResponse<SMSReplyData>> => {
  const res = await request.get({ url: '/example/detail', params: { id } })
  return res && res.data
}

export const delTableListApi = async (req: any): Promise<IResponse> => {
  // sms/send/batchdel
  // deldata: 0673867d3e1a4c108c4f6cf0523b2eb9,02669c75df454772b035ae773aeebd0f
  if (req?.multiple) {
    const res = await request.post({
      url: '/sms/send/batchdel',
      headersType: 'application/x-www-form-urlencoded',
      data: {
        deldata: req.data
      }
    })
    return res && res.data
  } else {
    const res = await request.delete({ url: `/sms/send/${req.data}` })
    return res && res.data
  }
}
