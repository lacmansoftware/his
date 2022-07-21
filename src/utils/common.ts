import dict from '@/config/dictionary.json'
import { pinyin } from 'pinyin-pro'
import { getApi } from '@/api/common'
import moment from 'moment'
import { CurWeekType } from '@/api/appoint/appoint/hospital/types'

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

export const getInOptionFormat = async (
  url: string,
  valueField: string,
  labelField: string,
  type = 'default'
): Promise<any> => {
  const res = await getApi(url)
  return res?.data.map((item) => {
    const ret =
      type === 'filter'
        ? {
            ...item
          }
        : {}
    ret.label = labelField
      .split('+')
      .reduce((ret, labelFieldItem) => ret + item[labelFieldItem], '')
    ret.value = valueField
      .split('+')
      .reduce((ret, valueFieldItem) => ret + item[valueFieldItem], '')
    return ret
  })
}

export const formatObject = (data: object[], valueField: string, labelField: string) => {
  return data?.map((item) => ({
    label: item[labelField],
    value: item[valueField]
  }))
}

export const getDateInFormat = (date: Date, style = '/') => {
  const nDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return nDate.toISOString().slice(0, 10).replace(/-/g, style)
}

export const getWeekSEDate = (curDate = ''): CurWeekType => {
  const curr = curDate === '' ? new Date() : new Date(curDate)
  const startDate = new Date(curr.setDate(curr.getDate() - curr.getDay()))
  const endDate = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7))
  const range: string[] = []
  curr.setDate(curr.getDate() - curr.getDay() - 7)
  for (let i = 0; i < 7; i++) {
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

export const timelineLabels = (desiredStartTime, desiredEndTime, interval, period) => {
  const startTimeMoment = moment(desiredStartTime, 'HH:mm')
  const endTimeMoment = moment(desiredEndTime, 'HH:mm')
  const totalPeriod = moment.duration(endTimeMoment.diff(startTimeMoment)).as(period)

  const timeLabels = []
  for (let i = 0; i <= totalPeriod; i += Number(interval)) {
    startTimeMoment.add(i === 0 ? 0 : interval, period)
    timeLabels.push(startTimeMoment.format('HH:mm') as never)
  }

  return timeLabels
}

export const isValidTime = (dateString: string, timeString: string) => {
  if (moment() <= moment(`${dateString} ${timeString}`, 'YYYY-MM-DD HH:mm')) return true
  return false
}
