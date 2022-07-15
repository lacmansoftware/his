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
          options: optionObj.options
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
          type: 'date',
          valueFormat: 'YYYY-MM-DD'
        },
        colProps: { span: 6 },
        show: true
      }
    } as any
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
