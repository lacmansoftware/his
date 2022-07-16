import { getApi } from '@/api/common'

export const genSearchSchema = (
  schemaType: string,
  fieldValue: string,
  labelValue: string,
  optionObj: any = {}
) => {
  if (schemaType === 'sourceSelect') {
    return {
      field: fieldValue,
      label: labelValue,
      form: { show: false },
      table: { show: false },
      search: {
        component: 'Select',
        componentProps: {
          placeholder: optionObj?.placeholder ?? null,
          options: optionObj?.options ?? null
        },
        colProps: { span: 6 },
        show: true
      }
    }
  }
  if (schemaType === 'apiSelect') {
    return {
      field: fieldValue,
      label: labelValue,
      form: { show: false },
      table: { show: false },
      search: {
        component: 'Select',
        componentProps: {
          placeholder: optionObj?.placeholder ?? null,
          filterable: optionObj?.filterable ?? false
        },
        colProps: { span: 6 },
        api: optionObj.api,
        show: true
      }
    }
  }
  if (schemaType === 'input') {
    const res = {
      field: fieldValue,
      label: labelValue,
      form: { show: false },
      table: { show: false },
      search: {
        show: true,
        component: 'Input',
        componentProps: {},
        colProps: { span: 6 }
      }
    } as any
    if (optionObj?.placeholder) res.search.componentProps.placeholder = optionObj.placeholder
    return res
  }
  if (schemaType === 'datePicker') {
    return {
      label: labelValue,
      field: fieldValue,
      form: { show: false },
      table: { show: false },
      search: {
        component: 'DatePicker',
        componentProps: {
          placeholder: optionObj?.placeholder ?? null,
          type: 'date',
          valueFormat: 'YYYY-MM-DD'
        },
        colProps: { span: 6 },
        show: true
      }
    } as any
  }
  if (schemaType === 'checkbox') {
    return {
      label: labelValue,
      field: fieldValue,
      form: { show: false },
      table: { show: false },
      search: {
        show: true,
        component: 'Checkbox',
        componentProps: {
          options: optionObj?.options ?? null
        },
        colProps: { span: 6 },
        formItemProps: {
          labelWidth: labelValue === '' && !optionObj?.labelWidth ? '0px' : null
        },
        value: optionObj?.value ?? []
      }
    }
  }
  if (schemaType === 'autocomplete') {
    return {
      label: labelValue,
      field: fieldValue,
      form: { show: false },
      table: { show: false },
      search: {
        component: 'Autocomplete',
        componentProps: {
          style: 'width: 100%',
          triggerOnFocus: false,
          fetchSuggestions: async (queryString: string, cb: Fn) => {
            const res = await getApi(`${optionObj!.url}?keyWords=${queryString}`)
            const result = res?.data.map((item) => ({
              ...item,
              value: item[optionObj!.itemValue],
              link: item[optionObj!.itemLink]
            }))
            cb(result)
          },
          onSelect: (item: Recordable) => {},
          slots: {
            default: true
          },
          placeholder: optionObj?.placeholder ?? null
        },
        colProps: { span: optionObj?.span ?? 6 },
        show: true
      }
    }
  }

  return {}
}

export const genTableSchema = (
  fieldValue: string,
  labelValue: string,
  widthValue: any = '',
  formatter: any = null
) => {
  if (typeof widthValue !== 'string') {
    formatter = widthValue
    widthValue = ''
  }
  return {
    label: labelValue,
    field: fieldValue,
    width: widthValue,
    formatter: formatter
  }
}
