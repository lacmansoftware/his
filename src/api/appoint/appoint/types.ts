export type UpdateStatusType = {
  id: string
  replyChannel: string
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
}

export type AppointHospitalTableData = {
  id: string
  name: string
  children: AppointHospitalType[]
}
