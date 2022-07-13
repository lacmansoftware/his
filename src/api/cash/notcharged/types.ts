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
