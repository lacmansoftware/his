export type UpdateStatusType = {
  id: string
  replyChannel: string
  source: string
  datareplyChannel: string
}

export type AppointDoctorType = {
  id: string
  name: string
  limit: number
  meet: number
  add: number
}

export type AppointHospitalType = {
  title: string
  start: string
  children: AppointDoctorType[]
  totalMeet: number
  totalLimit: number
}

export type AppointHospitalTableData = {
  id: string
  name: string
  children: AppointHospitalType[]
}

export type CurWeekType = {
  startDate: string
  endDate: string
  range: string[]
}
