import { useAxios } from '@/hooks/web/useAxios'
import type { MemberInfoTableData } from './types'

const request = useAxios()

export const getTableListApi = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/member/info/list', params })
  return res && res.data
}

export const saveTableApi = async (data: Partial<MemberInfoTableData>): Promise<IResponse> => {
  const res = await request.post({ url: '/example/save', data })
  return res && res.data
}

export const getTableDetApi = async (id: string): Promise<IResponse<MemberInfoTableData>> => {
  const res = await request.get({ url: '/example/detail', params: { id } })
  return res && res.data
}

export const delTableListApi = async (ids: string[] | number[]): Promise<IResponse> => {
  const res = await request.post({ url: '/example/delete', data: { ids } })
  return res && res.data
}

export const getApi = async (url: string): Promise<IResponse> => {
  const res = await request.get({ url: url })
  return res && res.data
}
