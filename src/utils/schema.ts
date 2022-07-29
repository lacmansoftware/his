import { getApi } from '@/api/common'
import { useValidator } from '@/hooks/web/useValidator'
import { ref } from 'vue'

const { required } = useValidator()

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
        colProps: { span: optionObj?.span ?? 6 },
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
          filterable: optionObj?.filterable ?? null
        },
        colProps: { span: optionObj?.span ?? 6 },
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
        colProps: { span: optionObj?.span ?? 6 }
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
        colProps: { span: optionObj?.span ?? 6 },
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
        colProps: { span: optionObj?.span ?? 6 },
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
          triggerOnFocus: optionObj?.triggerOnFocus ?? false,
          fetchSuggestions: async (queryString: string, cb: Fn) => {
            const res = await getApi(`${optionObj!.url}?keyWords=${queryString}`)
            const result = res?.data.map((item) => ({
              ...item,
              value: item[optionObj!.itemValue],
              link: item[optionObj!.itemLink]
            }))
            cb(result)
          },
          onSelect: optionObj?.onSelect ?? null,
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
  if (schemaType === 'radio') {
    return {
      label: labelValue,
      field: fieldValue,
      form: { show: false },
      table: { show: false },
      search: {
        component: 'Radio',
        componentProps: {
          style: 'width: 100%',
          options: optionObj?.options ?? null,
          onChange: optionObj?.onChange ?? null
        },
        colProps: { span: optionObj?.span ?? 6 },
        value: optionObj?.value ?? '',
        show: true
      }
    }
  }
  console.log('Gen SearchSchema: Not expected type ', schemaType)

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

export const genFormSchema = (
  schemaType: string,
  fieldValue = '',
  labelValue = '',
  optionObj: any = {}
) => {
  const ret: any = {
    field: fieldValue,
    label: labelValue,
    componentProps: {
      disabled: optionObj?.readonly ?? null,
      placeholder: optionObj.placeholder ?? null,
      onChange: optionObj?.onChange ?? null,
      onSelect: optionObj?.onSelect ?? null
    },
    formItemProps: {
      labelWidth: optionObj?.labelWidth ?? null,
      rules: optionObj?.required ? [required()] : []
    },
    colProps: { span: optionObj?.span ?? 6 }
  }
  if (schemaType === 'blank') {
    ret.formItemProps.labelWidth = '0'
    return ret
  }
  if (schemaType === 'divider') {
    return {
      field: fieldValue,
      label: labelValue,
      component: 'Divider'
    }
  }
  if (schemaType === 'input') {
    return {
      field: fieldValue,
      label: labelValue,
      component: 'Input',
      componentProps: {
        disabled: optionObj?.readonly ?? null,
        placeholder: optionObj.placeholder ?? null
      },
      formItemProps: {
        labelWidth: optionObj?.labelWidth ?? null,
        rules: optionObj?.required ? [required()] : []
      },
      colProps: { span: optionObj?.span ?? 6 }
    } as any
  }
  if (schemaType === 'textarea') {
    ret.component = 'Input'
    ret.componentProps.type = 'textarea'
    ret.componentProps.rows = optionObj.rows ?? 2
    return ret as any
  }
  if (schemaType === 'hidden') {
    return {
      field: fieldValue,
      label: labelValue,
      component: 'Hidden',
      formItemProps: {
        labelWidth: 0
      },
      colProps: { span: 0 }
    } as any
  }
  if (schemaType === 'date') {
    return {
      field: fieldValue,
      label: labelValue,
      component: 'DatePicker',
      componentProps: {
        disabled: optionObj?.readonly ?? null,
        type: optionObj.type ?? 'date',
        format: optionObj.format ?? 'YYYY-MM-DD HH:mm:ss',
        valueFormat: optionObj.valueFormat ?? 'YYYY-MM-DD HH:mm:ss',
        placeholder: optionObj.placeholder ?? null,
        onChange: optionObj?.onChange ?? null
      },
      formItemProps: {
        labelWidth: optionObj?.labelWidth ?? null,
        rules: optionObj?.required ? [required()] : []
      },
      colProps: { span: optionObj?.span ?? 6 }
    } as any
  }
  if (schemaType === 'autocomplete') {
    return {
      label: labelValue,
      field: fieldValue,
      component: 'Autocomplete',
      componentProps: {
        disabled: optionObj?.readonly ?? null,
        style: 'width: 100%',
        triggerOnFocus: optionObj?.triggerOnFocus ?? false,
        fetchSuggestions: async (queryString: string, cb: Fn) => {
          const res = await getApi(`${optionObj!.url}?keyWords=${queryString}`)
          const result = res?.data.map((item) => ({
            ...item,
            value: item[optionObj!.itemValue],
            link: item[optionObj!.itemLink]
          }))
          cb(result)
        },
        onSelect: optionObj?.onSelect ?? null,
        // onSelect: (item: Recordable) => {
        //   console.log('hello ')
        // },
        slots: {
          default: true
        },
        placeholder: optionObj?.placeholder ?? null
      },
      formItemProps: {
        labelWidth: optionObj?.labelWidth ?? null,
        rules: optionObj?.required ? [required()] : []
      },
      colProps: { span: optionObj?.span ?? 6 }
    }
  }
  if (schemaType === 'sourceSelect') {
    return {
      field: fieldValue,
      label: labelValue,
      component: 'Select',
      componentProps: {
        style: 'width: 100%',
        disabled: optionObj?.readonly ?? null,
        placeholder: optionObj?.placeholder ?? null,
        options: optionObj?.options ?? null
      },
      colProps: { span: optionObj?.span ?? 6 },
      value: optionObj?.value ?? null,
      formItemProps: {
        labelWidth: optionObj?.labelWidth ?? null,
        rules: optionObj?.required ? [required()] : []
      }
    }
  }
  if (schemaType === 'apiSelect') {
    const options = ref([])
    if (optionObj?.api) {
      optionObj?.api().then((res) => {
        options.value = res
      })
    }
    return {
      field: fieldValue,
      label: labelValue,
      component: 'Select',
      componentProps: {
        disabled: optionObj?.readonly ?? null,
        placeholder: optionObj?.placeholder ?? null,
        filterable: optionObj?.filterable ?? null,
        options: options as any
      },
      colProps: { span: optionObj?.span ?? 6 },
      formItemProps: {
        labelWidth: optionObj?.labelWidth ?? null,
        rules: optionObj?.required ? [required()] : []
      }
    }
  }
  if (schemaType === 'datePicker') {
    ret.component = 'DatePicker'
    ret.componentProps.type = optionObj?.type ?? 'date'
    ret.componentProps.format = optionObj?.format ?? 'YYYY-MM-DD'
    ret.componentProps.valueFormat = optionObj?.valueFormat ?? 'YYYY-MM-DD'
    return ret as any
  }
  if (schemaType === 'checkbox') {
    return {
      label: labelValue,
      field: fieldValue,
      component: 'Checkbox',
      componentProps: {
        disabled: optionObj?.readonly ?? null,
        options: optionObj?.options ?? null,
        onChange: optionObj?.onChange ?? null,
        min: optionObj?.min ?? null,
        max: optionObj?.max ?? null
      },
      colProps: { span: optionObj?.span ?? 6 },
      formItemProps: {
        labelWidth: labelValue === '' && !optionObj?.labelWidth ? '0px' : null,
        rules: optionObj?.required ? [required()] : []
      },
      value: optionObj?.value ?? []
    }
  }
  if (schemaType === 'radio') {
    return {
      label: labelValue,
      field: fieldValue,
      component: 'Radio',
      componentProps: {
        disabled: optionObj?.readonly ?? null,
        style: 'width: 100%',
        options: optionObj?.options ?? null,
        onChange: optionObj?.onChange ?? null
      },
      colProps: { span: optionObj?.span ?? 6 },
      value: optionObj?.value ?? '',
      formItemProps: {
        labelWidth: optionObj?.labelWidth ?? null,
        rules: optionObj?.required ? [required()] : []
      }
    }
  }
  console.log('Gen FormSchema: Not expected type ', schemaType)

  return {}
}

export const getSelectText = async (methods, schema, fieldName) => {
  const formData = await methods?.getFormData()
  return (
    schema
      ?.find((item) => item.field === fieldName)
      ?.componentProps?.options?.find((item) => item.value === formData![fieldName])?.label || ''
  )
}

export const getValue = async (methods, fieldName) => {
  const formData = await methods?.getFormData()
  return formData?.hasOwnProperty(fieldName) ? formData[fieldName] : null
}

export const getSchemaItem = (schema, fieldName) => {
  return schema?.find((item) => item.field === fieldName)
}

export const getSchemaOptions = (schema, fieldName) => {
  return schema?.find((item) => item.field === fieldName).componentProps.options
}

export const setDisabled = (methods, fieldName, value) => {
  methods?.setSchema([
    {
      field: fieldName,
      path: 'componentProps.disabled',
      value: value
    }
  ])
}
