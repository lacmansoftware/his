export type NotChargedTableData = {
  id: string
  member: string
  doctor: string
  registerTimeStart: string
  registerTimeEnd: string
  createTimeStart: string
  createTimeEnd: string
  registerNum: string
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
}

export type ChargeItemType = {
  id: string
}

export type CartItemType = {
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
