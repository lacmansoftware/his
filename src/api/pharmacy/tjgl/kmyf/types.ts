export type NotChargedTableData = {
  id: string
  createTime: string
  modifyTime: string
  createUser: string
  modifyUser: string
  isDeleted: string
  memberId: string
  visitType: string
  visitStatus: string
  memberName: string
  memberMobile: string
  doctorName: string
  doctorId: string
  levelName: string
  memberAge: string
  memberSex: string
  memberInsurId: string
  memberInsurName: string
  registerTime: string
  isCache: string
  pageNum: 1
  pageSize: 2147483647
  price: null
  recipelAmount: 0
  registerNum: null
}

export type ProductItemType = {
  amount: number
  businessSubType: string
  currentQty: number
  dataType: string
  dataTypeName: string
  discount: number
  doctorId: string
  drugId: string
  hospitalId: string
  id: string
  isPresell: string
  label: string
  name: string
  originUnitPrice: number
  price: number
  recommendDoctor: string
  staffPrice: number
  title: string
  unit: string
  value: string
  unitPrice: number
  originPrice: number
  _status: string
  activityId: string
  free: string
  referee: string
  refereeName: string
}

export type ChargeItemType = {
  activityId: string
  addressId: string
  amount: number
  businessSubType: string
  couponId: null
  couponMoney: string
  createUser: string
  currentQty: string
  dataType: string
  dataTypeName: string
  deco: string
  discount: number
  doctorId: string
  dosageform: string
  dosageformName: string
  drugTime: string
  drugTime1: string
  drugTime2: string
  expressItems: string
  expressTime: string
  expressType: string
  extInfo: string
  fenjian1: number
  fenjian2: number
  free: string
  hiddenCons: string
  id: string
  insurPay: boolean
  isPresell: string
  isXiwai: string
  makeTimes: number
  makingPotIds: string
  makingPotIds1: string
  makingPotIds2: string
  markReturnFee: string
  originPrice: number
  originUnitPrice: number
  other: number
  otherExpress: string
  paymentFee: string
  pharmacyId: string
  pharmacyName: string
  potRemark: string
  potRemarkText: string
  price: number
  proxy: string
  recipelId: string
  recommendAmount: string
  recommendDoctor: string
  referee: string
  referee2: string
  referee2Name: string
  refereeName: string
  remark: string
  returnAbleAmount: number
  returnAbleFee: string
  returnFee: string
  scheduleStorage: string
  self: number
  serviceFee: string
  serviceFeePercent: string
  staff: string
  tips: string
  title: string
  unit: string
  unitPrice: number
  urgent: string
  warehouseId: string
  weight: string
  wxCouponAmount: string
  _checked: boolean
  _disabled: boolean
  _request: string
}

export type AddressItemType = {
  drugState: string
  totalNum: number
  recipelId: string
  dataType: string
  num: number
  expressNum: number
  onceNum: string
  tempTypeName: string
}

export type settleMemberInfoType = {
  id: String
  hasCard: boolean
  memberAge: string
  memberInsurId: string
  memberName: string
  levelName: string
  staff: string
  memberSex: string
  visitType: string
  oweText: string
  doctorName: string
  memberInsurName: string
  memberMobile: string
  memberId: string
  memberCard: object
  currentOwe: number
  owe: number
}