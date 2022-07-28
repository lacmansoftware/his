import { useAxios } from '@/hooks/web/useAxios'
import type { WorkOrderType } from './types'

const request = useAxios()

export const getTableListApi = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/member/workorder/orderList', params })
  return res && res.data
}

export const saveTableApi = async (data: Partial<WorkOrderType>): Promise<IResponse> => {
  const res = await request.post({
    url: '/member/workorder/add',
    headersType: 'application/x-www-form-urlencoded',
    data
  })
  return res && res.data
}

export const getTableDetApi = async (id: string): Promise<IResponse<WorkOrderType>> => {
  const res = await request.get({ url: '/example/detail', params: { id } })
  return res && res.data
}

export const delTableListApi = async (id: string): Promise<IResponse> => {
  const res = await request.delete({ url: `/member/workorder/${id}` })
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
