import { useAxios } from '@/hooks/web/useAxios'
import type { SMSSendData } from './types'

const request = useAxios()

export const getTableListApi = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/sms/send', params })
  return res && res.data
}

export const saveTableApi = async (data: Partial<SMSSendData>): Promise<IResponse> => {
  // sms/send/send
  //   file:
  // moblist: qwgwgweg
  // type: HCD
  // templet: 00aafe9232b64731b35f5cf7d3a73c2a
  // content: 【正安中醫】番禺店地址：廣州市番禺區番禺大道北海印又一城B座總統大酒店首層（正安中醫）。
  // 地鐵：7號線南村萬博站A出口，直走沿指引到番禺大道後，左轉行走約700米，途經過加油站，行走至總統大酒店首層正安中醫。
  // 公交：可選擇搭乘【129路-302路-303路-310路-987路-番143路-番145路-番146路-番163路-番186路-番190路-番70路-公交地鐵接駁專線9路】到達【華南碧桂園站】，行走至海印又一城B座總統大酒店首層正安中醫。
  // 自駕車：導航搜索海印又一城，入口後停於地面空曠處，也可從入口後左轉停於地下停車場B2層，搭乘電梯至海印又一城B座一樓，按指引行走至B座總統大酒店首層。
  // md5: c7d33f8c38c132c86a6490f33e4662b1
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
