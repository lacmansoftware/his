const searchConfig = [
  {
    field: 'name',
    label: '姓名',
    component: 'Input'
  },
  {
    field: 'mobile',
    label: '手機號',
    component: 'Input'
  },
  {
    field: 'identityType',
    label: '證件類型',
    component: 'Select'
  },
  {
    field: 'identityCode',
    label: '證件號碼',
    component: 'Input'
  },
  {
    field: 'archivesNo',
    label: '檔案號',
    component: 'Input'
  },
  {
    field: 'memberLevel',
    label: '會員級別',
    component: 'Select'
  },
  {
    field: 'cardStatus',
    label: '會員卡狀態',
    component: 'Select'
  },
  {
    field: 'memberCardNum',
    label: '會員卡號',
    component: 'Input'
  },
  {
    field: 'profileLocation',
    label: '門店',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: 'abc',
          value: '1'
        }
      ]
    }
  },
  {
    field: 'firstDisease',
    label: '病種',
    component: 'Select'
  }
]

const crudConfig = [
  {
    label: '操作',
    field: 'action',
    width: '120px'
  },
  {
    label: '姓名',
    field: 'memberName',
    placeholder: '請填寫'
  },
  {
    label: '手機號碼',
    field: 'mobile',
    width: '135px',
    placeholder: '請填寫'
  },
  {
    label: '性別',
    field: 'gender',
    width: '60px'
  },
  {
    label: '年齡',
    field: 'age',
    width: '60px'
  },
  {
    label: '生日',
    field: 'birthday',
    width: '100px'
  },
  {
    label: '檔案號',
    field: 'archivesNo',
    width: '100px',
    placeholder: '請填寫'
  },
  {
    label: '檔案存放地',
    field: 'profileLocationName',
    width: '125px',
    placeholder: '請選擇'
  },
  {
    label: '證件類型',
    field: 'identityTypeName',
    width: '60px',
    placeholder: '請選擇'
  },
  {
    label: '證件號碼',
    field: 'identityCode',
    width: '100px',
    placeholder: '請填寫'
  },
  {
    label: '會員級別',
    field: 'levelName',
    width: '100px',
    placeholder: '請選擇'
  },
  {
    label: '會員卡狀態',
    field: 'cardStatus',
    width: '100px',
    placeholder: '請選擇'
  },
  {
    label: '會員卡號',
    field: 'cardNum',
    width: '100px',
    placeholder: '請填寫會員卡號'
  },
  {
    label: '卡內餘額',
    field: 'balance',
    width: '100px'
  },
  {
    label: '辦卡時間',
    field: 'cardCreateTime',
    width: '100px'
  },
  {
    label: '創建人',
    field: 'createUser',
    width: '100px'
  },
  {
    label: '創建門店',
    field: 'createHospital',
    width: '100px'
  }
]

const writeConfig = [
  {
    field: 'name',
    label: '姓名',
    component: 'Input'
  },
  {
    field: 'pinyinCode',
    label: '姓名拼音碼',
    component: 'Input'
  },
  {
    field: 'gender',
    label: '性別',
    component: 'Select'
  },
  {
    field: 'mobile',
    label: '手機號',
    component: 'Input'
  },
  {
    field: 'birthday',
    label: '生日（陽曆）',
    component: 'DatePicker'
  },
  {
    field: 'birthdayLunar',
    label: '生辰（農曆）',
    component: 'Input'
  },
  {
    field: 'identityType',
    label: '證件類型',
    component: 'Select'
  },
  {
    field: 'identityCode',
    label: '證件號碼',
    component: 'Input'
  },
  {
    field: 'country',
    label: '國家',
    component: 'Select'
  },
  {
    field: 'nativePlace',
    label: '籍貫',
    component: 'Select'
  },
  {
    field: 'nationality',
    label: '民族',
    component: 'Select'
  },
  {
    field: 'occupation',
    label: '職業',
    component: 'Input'
  },
  {
    field: 'education',
    label: '文化程度',
    component: 'Select'
  },
  {
    field: 'isMarried',
    label: '婚姻狀況',
    component: 'Select'
  },
  {
    field: 'hasChild',
    label: '生育情況',
    component: 'Select'
  },
  {
    field: 'height',
    label: '身高（厘米）',
    component: 'Input'
  },
  {
    field: 'weight',
    label: '體重（公斤）',
    component: 'Input'
  },
  {
    field: 'memberSource',
    label: '客戶來源',
    component: 'Select'
  },
  {
    field: 'recommender',
    label: '來源詳情',
    component: 'Input'
  },
  {
    field: 'createHospitalId',
    label: '初登門店',
    component: 'Input'
  },
  {
    field: 'archivesNo',
    label: '檔案號',
    component: 'Input'
  },
  {
    field: 'otherPhone',
    label: '其他電話',
    component: 'Input'
  },
  {
    field: 'memberType',
    label: 'iv',
    component: 'Input'
  },
  {
    field: 'profileLocation',
    label: '檔案所在門店',
    component: 'Select'
  },
  {
    field: 'contactPreference',
    label: '預約聯繫方式',
    component: 'Radio'
  },
  {
    field: 'memberLevel',
    label: '會員等級',
    component: 'Select'
  },
  {
    field: 'email',
    label: '郵箱',
    component: 'Input'
  },
  {
    field: 'weibo',
    label: '微博',
    component: 'Input'
  },
  {
    field: 'wechat',
    label: '微信',
    component: 'Input'
  },
  {
    field: 'urgentContact',
    label: '緊急聯繫人',
    component: 'Input'
  },
  {
    field: 'urgentContactTel',
    label: '緊急聯繫人電話',
    component: 'Input'
  },
  {
    field: 'urgentContactRel',
    label: '緊急聯繫人關係',
    component: 'Input'
  },
  {
    field: 'certificatesUrlFace',
    label: '上傳身份證正面照片',
    component: 'Input'
  },
  {
    field: 'certificatesUrlBack',
    label: '上傳身份證反面照片',
    component: 'Input'
  },
  {
    field: 'appointRemark',
    label: '預約備註',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 2
    }
  },
  {
    field: 'comment',
    label: '備註',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 2
    }
  }
]

export { searchConfig, crudConfig, writeConfig }

// {
//   field: 'birthdayHour',
//   label: '',
//   component: 'Input'
// },

// {
//   field: 'boyNum',
//   label: '',
//   component: 'Input'
// },
// {
//   field: 'girlNum',
//   label: '',
//   component: 'Input'
// },
