import { useAxios } from '@/hooks/web/useAxios'

const request = useAxios()

export const getTableListApi = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/sms/reply', params })
  return res && res.data
}
