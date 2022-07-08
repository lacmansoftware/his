import { useAxios } from '@/hooks/web/useAxios'
// import { AppointDoctorTableData } from './types'

const request = useAxios()

export const getTableListApi = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/doctor/schedule/list', params })
  // if (res && res.data)
  //   res.data.data = res.data.data.map((hospital) => {
  //     hospital.children = hospital.children.map((perDay) => {
  //       perDay.totalLimit = perDay.children.reduce((sum, item) => sum + Number(item.limit), 0)
  //       perDay.totalMeet = perDay.children.reduce((sum, item) => sum + Number(item.meet), 0)
  //       return perDay
  //     })
  //     hospital.totalLimit = hospital.children.reduce(
  //       (sum, item) => sum + Number(item.totalLimit),
  //       0
  //     )
  //     hospital.totalMeet = hospital.children.reduce((sum, item) => sum + Number(item.totalMeet), 0)
  //     return hospital
  //   })
  return res && res.data
}
