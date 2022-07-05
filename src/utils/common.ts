import dict from '@/config/dictionary.json'
import { pinyin } from 'pinyin-pro'
import { getApi } from '@/api/common'

export const inDict = (val, data: string) => {
  try {
    const subOptions: string[] = data.split('.')
    let obj: any = dict
    subOptions.forEach((opt: string) => {
      obj = obj[opt]
    })
    return obj.find((item) => item.value === val)?.label
  } catch (error) {
    return ''
  }
}

export const getAgeByBirthday = function (birthday) {
  if (!birthday) {
    return ''
  }
  const yearBirthday = new Date(birthday).getFullYear()
  const monthBirthday = new Date(birthday).getMonth()
  const dayBirthday = new Date(birthday).getDate()

  const yearNow = new Date().getFullYear()
  const monthNow = new Date().getMonth()
  const dayNow = new Date().getDate()

  let age = yearNow - yearBirthday
  let flag = false

  if (monthNow <= monthBirthday) {
    if (monthNow == monthBirthday) {
      if (dayNow < dayBirthday) {
        age--
        flag = true
      }
    } else {
      age--
    }
  }
  if (age < 0) {
    return 0 + '歲'
  }
  let months = Math.floor(monthNow - monthBirthday)
  if (months < 0) {
    months = 12 + months
  }
  if (age == 0) {
    if (months == 0 && flag) {
      months = 11
    } else if (months == 0) {
      months = 1
    }
    return months + '月'
  }
  return age + '歲'
}

export const getPinyinCode = (zhongwen: string) => {
  const py = pinyin(zhongwen, { pattern: 'initial' })
  return py.toUpperCase().replace(/\s/g, '')
}

export const getInOptionFormat = async (url: string, valueField: string, labelField: string) => {
  const res = await getApi(url)
  return res?.data.map((item) => ({
    label: labelField.split('+').reduce((ret, labelFieldItem) => ret + item[labelFieldItem], ''),
    value: valueField.split('+').reduce((ret, valueFieldItem) => ret + item[valueFieldItem], '')
  }))
}

export const formatObject = (data: object[], valueField: string, labelField: string) => {
  return data?.map((item) => ({
    label: item[labelField],
    value: item[valueField]
  }))
}

export const getDateInFormat = (date: Date, style = '/') => {
  return date.toJSON().slice(0, 10).replace(/-/g, style)
}

export const getWeekSEDate = (curDate = '') => {
  const curr = curDate === '' ? new Date() : new Date(curDate)
  const startDate = new Date(curr.setDate(curr.getDate() - curr.getDay()))
  const endDate = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7))
  const range: string[] = []
  curr.setDate(curr.getDate() - curr.getDay() - 7)
  for (let i = 1; i <= 7; i++) {
    curr.setDate(curr.getDate() - curr.getDay() + i)
    range.push(getDateInFormat(curr, '-'))
  }
  return {
    startDate: getDateInFormat(startDate),
    endDate: getDateInFormat(endDate),
    range: range
  }
}

export const returnDateString = (minutue: number) => {
  minutue = minutue || 0
  const _lastDateTime = new Date(new Date().getTime() + minutue * 60 * 1000)
  return (
    _lastDateTime.getFullYear() +
    '-' +
    (_lastDateTime.getMonth() < 9
      ? '0' + (_lastDateTime.getMonth() + 1)
      : _lastDateTime.getMonth() + 1) +
    '-' +
    (_lastDateTime.getDate() < 10 ? '0' + _lastDateTime.getDate() : _lastDateTime.getDate()) +
    ' ' +
    (_lastDateTime.getHours() < 10 ? '0' + _lastDateTime.getHours() : _lastDateTime.getHours()) +
    ':' +
    (_lastDateTime.getMinutes() < 10
      ? '0' + _lastDateTime.getMinutes()
      : _lastDateTime.getMinutes())
  )
}
