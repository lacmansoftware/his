export type MemberInfoTableData = {
  id: string
  memberName: string
  mobile: string
  gender: string
  birthday: string
  archivesNo: string
  profileLocation: string
  profileLocationName: string
  identityTypeName: string
  identityCode: string
  levelName: string
  cardStatus: string
  cardNum: string
  balance: string
  cardCreateTime: string
  createUser: string
  createHospital: string
  pageviews: number
}

export type CommentType = {
  id: string
  handlerName: string | null
  createTime: string | null
  comment: string | null
}
