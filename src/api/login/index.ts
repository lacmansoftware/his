import { useAxios } from '@/hooks/web/useAxios'
import type { UserLoginType, UserType } from './types'

interface RoleParams {
  roleName: string
}

const request = useAxios()

export const loginApi = async (data: UserLoginType): Promise<IResponse> => {
  const res = await request.post({ url: '/index/login/system', data })
  // const res = await request.post({ url: '/user/login', data })
  return res && res.data
}

export const loginOutApi = async (): Promise<IResponse> => {
  const res = await request.get({ url: '/user/loginOut' })
  return res && res.data
}

export const getUserInfoApi = async (): Promise<IResponse<UserType>> => {
  const res = await request.get({ url: '/index/userinfo' })
  return res && res.data
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    total: number
    list: UserType[]
  }>({ url: '/user/list', params })
}

export const getAdminRoleApi = async (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  const res = await request.get({ url: '/index/menus', params })
  return res && res.data
}

export const getTestRoleApi = async (params: RoleParams): Promise<IResponse<string[]>> => {
  const res = await request.get({ url: '/index/menus', params })
  console.log(res)
  return res && res.data
}
