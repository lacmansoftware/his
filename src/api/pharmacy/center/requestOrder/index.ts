import { useAxios } from '@/hooks/web/useAxios'
import type { AddressItemType, ChargeItemType, NotChargedTableData } from './types'

const request = useAxios()

export const getTableListApi = async (params: any): Promise<IResponse> => {
  params.isCore = 'N'
  const res = await request.get({ url: '/pharmacy/purchasereq', params })
  return res && res.data
}

export const getSettlementMemberApi = async (params: any): Promise<IResponse> => {
  const res = await request.get({
    url: `/settlement/member/${params.memberId}?virsitRecordId=${params.id}`
  })
  return res && res.data
}

export const getAddressTableListApi = async (params: any): Promise<IResponse> => {
  // const res = await request.get({ url: `member/address/member/${params.memberId}`, params })
  const res = await request.get({
    url: `member/address/member/76ce4156ae804227a12ec23a2c07edec`,
    params
  })
  return res && res.data
}

export const saveTableApi = async (data: Partial<NotChargedTableData>): Promise<IResponse> => {
  const res = await request.post({
    url: '/sms/templet',
    headersType: 'application/x-www-form-urlencoded',
    data
  })
  return res && res.data
}

export const getTableDetApi = async (id: string): Promise<IResponse<NotChargedTableData>> => {
  const res = await request.get({ url: '/example/detail', params: { id } })
  return res && res.data
}

export const delTableListApi = async (req: any): Promise<IResponse> => {
  // sms/send/batchdel
  // deldata: 0673867d3e1a4c108c4f6cf0523b2eb9,02669c75df454772b035ae773aeebd0f
  if (req?.multiple) {
    const res = await request.post({
      url: '/sms/templet/batchdel',
      headersType: 'application/x-www-form-urlencoded',
      data: {
        deldata: req.data
      }
    })
    return res && res.data
  } else {
    const res = await request.delete({ url: `/sms/templet/${req.data}` })
    return res && res.data
  }
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

export const postAddressItemsApi = async (data: Partial<ChargeItemType>): Promise<IResponse> => {
  const res = await request.post({
    url: '/order/address/items',
    headersType: 'multipart/form-data;',
    data
  })
  return res && res.data
}

export const postProductPriceApi = async (data: any): Promise<IResponse> => {
  const res = await request.post({
    url: '/product/price',
    headersType: 'multipart/form-data;',
    data
  })
  return res && res.data
}
