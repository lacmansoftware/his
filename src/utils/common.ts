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
    label: item[labelField],
    value: item[valueField]
  }))
}
