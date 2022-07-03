import { useAxios } from '@/hooks/web/useAxios'

const request = useAxios()

export const getTableListApi = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/member/protocol/list', params })
  return res && res.data
}

export const getPrintApi = async (id: string): Promise<IResponse> => {
  const res = await request.get({ url: `/member/protocol/print/${id}` })
  return res && res.data
}
