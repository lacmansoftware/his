import { useAxios } from '@/hooks/web/useAxios'

const request = useAxios()

// 获取所有字典
export const getDictApi = async (): Promise<IResponse> => {
  const res = await request.get({ url: '/dict/list' })
  return res && res.data
}

// 模拟获取某个字典
export const getDictOneApi = async (): Promise<IResponse> => {
  const res = await request.get({ url: '/dict/one' })
  return res && res.data
}

export const getApi = async (url: string, params: any = {}): Promise<IResponse> => {
  const res = await request.get({ url: url, params })
  return res && res.data
}

export const postApi = async (url: string, data: any): Promise<IResponse> => {
  const res = await request.post({
    url: url,
    headersType: 'application/x-www-form-urlencoded',
    data
  })
  return res && res.data
}
