export type WorkTimeType = {
  startTime: string
  endTime: string
}

export type AppointDoctorType = {
  id: string
  createTime: string
  modifyTime: string
  createUser: string
  modifyUser: string
  isDeleted: string
  pageNum: number
  pageSize: number
  doctorId: string
  doctorName: string
  hospitalId: string
  hospitalName: string
  date: string
  enWeek: string
  startTime: string
  endTime: string
  status: string
  type: string
  startDate: number
  endDate: number
  start: string
  end: string
  title: string
  name: string
  cycle: string
  addLimit: string
  limit: string
  cycle_new: string
  valid_time: string
  workTimes: WorkTimeType[]
  children: any
}

export type AppointDoctorTableData = {
  id: string
  name: string
  maxPlus: string
  marketActivity: string
  children: AppointDoctorType[]
}
