// export type WorkOrderTableData = {
//   createTime: string
//   createUser: string
//   deptName: string
//   hospitalId: string
//   hospitalName: string
//   id: string
//   isDeleted: string
//   modifyTime: string
//   modifyUser: string
//   parentId: string
//   pharmacyId: string
//   type: string
//   pageNum: number
//   pageSize: number
// }

export type WorkOrderType = {
  acceptTime: string
  comment: string
  contactMobile: string
  contactName: string
  contactUserid: string
  createTime: string
  createUser: string
  detailId: string
  handlerId: string
  handlerName: string
  hospitalId: string
  id: string
  isDeleted: string
  isRemind: string
  latestHandleTime: string
  memberId: string
  mobile: string
  modifyTime: string
  modifyUser: string
  name: string
  nextContactTime: string
  pageNum: number
  pageSize: number
  remindId: string
  serviceMode: string
  status: string
  transferId: string
  transferName: string
  transferType: string
  type: string
  typeName: string
}

export type CommentType = {
  id: string
  handlerName: string | null
  createTime: string | null
  comment: string | null
}
