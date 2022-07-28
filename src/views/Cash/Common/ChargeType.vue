<script setup lang="ts">
import { Form } from '@/components/Form'
import { onMounted, reactive, ref, unref } from 'vue'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter, useRoute } from 'vue-router'
import { genFormSchema } from '@/utils/schema'
import { diff, getInOptionFormat } from '@/utils/common'
import dict from '@/config/dictionary.json'
import ChargeItem from './ChargeItem.vue'
import ChooseTaRenCard from './ChooseTaRenCard.vue'
import { Dialog } from '@/components/Dialog'

const { push, go } = useRouter()
const { params } = useRoute()
const { t } = useI18n()

const store = {
  doctorId: ref<ComponentOptions[]>([]),
  hospitalId: ref<ComponentOptions[]>([]),
  importantGuest: ref<ComponentOptions[]>([])
}
const allMoney = ref(0)
const chargeTypeRef = ref<any>([])
const chargeItemRefs = ref<Array<InstanceType<typeof ChargeItem>>>([])
const TarenRef = ref<ComponentRef<typeof ChooseTaRenCard>>()
const dialogVisible = ref(false)
const dialogTitle = ref<string>()
const actionType = ref<string>()

onMounted(async () => {})

const handleChargeTypeChange = async (item: string[]) => {
  const lastChangedItem = diff(chargeTypeRef.value, item)
  chargeTypeRef.value = item
  console.log(chargeItemRefs)

  if (lastChangedItem) {
    if (
      item[0] &&
      item.length === 1 &&
      item[0] !== 'ZZBX' &&
      item[0] !== 'YHQ' &&
      item[0] !== 'WX_COUPON'
    ) {
      unref(chargeItemRefs.value[0])?.setAmount(allMoney.value.toFixed(1))
    }
    if (item.length === 2 && item.indexOf('SENDURL') !== -1) {
      //只有預約有推送支付鏈接
      if (item.indexOf('YHQ') === -1) {
        resetChargeType()
        ElMessage.error('推送支付鏈接不能與非優惠券支付方式一起使用！')
        return
      }
    }
    if (!lastChangedItem.checked && lastChangedItem.value === 'YHQ') {
      if (item.join('').indexOf('COUPON') === -1) {
        //不選擇優惠券的時候需要重置優惠券form的信息
        setChargeItem('YHQ', 'reset')
      }
      setChargeItem('YHQ', 'coupon_radio', '0')
    }
    if (lastChangedItem.checked && item.length === 2) {
      // var amountArr = []
      // for (var i = 0; i < item.length; i++) {
      //   var children = yui.get(item[i]).getAllEditors()
      //   for (var index = 0; index < children.length; index++) {
      //     if (children[index].name === 'amount') {
      //       amountitem.push(children[index])
      //     }
      //   }
      // }
      // commonMethod.caclMoney(amountArr, price_amount)
    }

    if (lastChangedItem.value === 'TRDF') {
      if (lastChangedItem.checked) {
        handleDialog('TaRen', true)
      } else {
        handleDialog('TaRen', false)
      }
      // var that = this
      // if (lastChangedItem.checked) {
      //   yui.showDialog({
      //     title: '他人會員卡',
      //     height: '600px',
      //     width: '800px',
      //     url: '/html/cash/common/choose_tr_card.html?memberId=' + memberId.getValue(),
      //     onload: function () {},
      //     onSuccess: function () {
      //       var choose_form = this.yui.get('choose_form')
      //       var data = choose_form.getData()
      //       if (!data.balance) {
      //         ElMessage.error('請選擇支付會員卡！')
      //         return
      //       }
      //       yui.get('TRDF_balance').setValue(data.balance)
      //       yui.get('TRDF_transactionId').setValue(data.transactionId)
      //       yui.get('TRDF_transactionNo').setValue(data.transactionNo)
      //       namespace.calcTrdfAfter()
      //       namespace.queryHykAndInsurPrice()
      //       this.closeWindow()
      //     },
      //     onCancel: function () {
      //       jQuery('.listbox-node:contains("他人會員卡")').click() //手動點擊觸發change
      //     }
      //   })
      // }
    }
    /*if (lastChangedItem.value === 'HYK') {
      if (lastChangedItem.checked) {
        if (!memberId.getValue()) {
          ElMessage.error('請先選擇患者！')
          return
        }
        yui.ajax({
          url: '/payment/method/card/' + memberId.getValue(),
          type: 'get',
          context: this,
          success: function (result) {
            if (result.success) {
              var data = result.data
              yui.get('HYK_balance').setValue(data.balance)
              yui.get('HYK_transactionId').setValue(data.transactionId)
              yui.get('HYK_transactionNo').setValue(data.transactionNo)
              namespace.calcHykAfter()
              namespace.queryHykAndInsurPrice()
            } else {
              ElMessage.error(result.msg)
              jQuery('.listbox-node:contains("會員卡")').eq(0).click() //手動點擊觸發change
            }
          }
        })
      }
    }
    if (lastChangedItem.value === 'GIFT_CARD') {
      if (item.length > 1) {
        yui.warning('體檢卡不能和其他支付方式組合！')
        this._changeSelected([node])
        return
      }
    }
    if (item[0] && item.length === 2 && item[1] === 'GIFT_CARD') {
      yui.warning('體檢卡不能和其他支付方式組合！')
      this._changeSelected([node])
      return
    }
    if (item[0] && item.length === 2 && item[1] === 'USE_PACKAGE') {
      yui.warning('套餐不能和其他支付方式組合！')
      this._changeSelected([node])
      return
    }
    if (item[0] && item.length === 2 && item[1] === 'USE_SPECIALIST') {
      yui.warning('專科不能和其他支付方式組合！')
      this._changeSelected([node])
      return
    }
    if (lastChangedItem.value === 'USE_PACKAGE') {
      if (lastChangedItem.checked) {
        if (item.length > 1) {
          yui.warning('套餐不能和其他支付方式組合！')
          this._changeSelected([node])
          return
        }
        if (!memberId.getValue()) {
          ElMessage.error('請先選擇患者！')
          this._changeSelected([node])
          return
        }
        yui.showDialog({
          title: '套餐選擇',
          url: ctx + 'html/appoint/appoint_manage/appoint/choise_package.html',
          width: '1100px',
          height: '700px',
          params: {
            mId: window.parent.memberId.value,
            mName: window.parent.memberName.value,
            doctorId: window.parent.doctorId.value
          },
          btns: [
            { type: 'success', color: '', text: '確定' },
            { type: 'cancel', color: '', text: '取消' }
          ],
          onSuccess: function () {
            var sheet = this.yui.get('sheet')
            var data = sheet.getSelectedRows()
            var sheet = this.yui.get('sheetAll')
            var dataAll = sheet.getSelectedRows()
            if (0 != data.length) {
              window.parent.packageId.setValue(data[0].id)
              window.parent.packageName.setValue(data[0].packageName)
              window.parent.specialistId.setValue('')
              window.parent.specialistName.setValue('')
              yui.getByName('packageName').setValue(data[0].packageName)
              window.parent.appointmentType = 'package'
            } else if (0 != dataAll) {
              window.parent.packageId.setValue(dataAll[0].id)
              window.parent.specialistId.setValue('')
              yui.getByName('packageName').setValue(dataAll[0].packageName)
              window.parent.appointmentType = 'package'
            } else {
              ElMessage.error('未選擇任何套餐!')
            }
            this.closeWindow()
          }
        })
      }
    } else {
      window.parent.appointmentType = 'normal'
    }

    if (lastChangedItem.value === 'USE_SPECIALIST') {
      if (lastChangedItem.checked) {
        if (!memberId.getValue()) {
          ElMessage.error('請先選擇患者！')
          this._changeSelected([node])
          return
        }
        if (item.length > 1) {
          yui.warning('專科不能和其他支付方式組合！')
          this._changeSelected([node])
          return
        }
        yui.showDialog({
          title: '專科選擇',
          url: ctx + 'html/appoint/appoint_manage/appoint/choise_specialist.html',
          width: '1100px',
          height: '700px',
          params: {
            mId: window.parent.memberId.value,
            mName: window.parent.memberName.value,
            doctorId: window.parent.doctorId.value
          },
          btns: [
            { type: 'success', color: '', text: '確定' },
            { type: 'cancel', color: '', text: '取消' }
          ],
          onSuccess: function () {
            var sheet = this.yui.get('sheet')
            var data = sheet.getSelectedRows()
            var sheet = this.yui.get('sheetAll')
            var dataAll = sheet.getSelectedRows()
            if (0 != data.length) {
              window.parent.specialistId.setValue(data[0].id)
              window.parent.specialistName.setValue(data[0].specialistName)
              window.parent.packageId.setValue('')
              window.parent.packageName.setValue('')
              yui.getByName('specialistName').setValue(data[0].specialistName)
              window.parent.appointmentType = 'specialist'
            } else if (0 != dataAll) {
              window.parent.specialistId.setValue(dataAll[0].id)
              window.parent.packageId.setValue('')
              yui.getByName('specialistName').setValue(dataAll[0].specialistName)
              window.parent.appointmentType = 'specialist'
            } else {
              ElMessage.error('未選擇任何專科!')
            }
            this.closeWindow()
          }
        })
      }
    } else {
      window.parent.appointmentType = 'normal'
    }
    $('.charge-type-item').css('display', 'none')
    item[0] &&
      item.forEach(function (el) {
        $('#' + el).css('display', 'block')
      })
    if (parent.namespace.params && parent.namespace.params.hasCard !== undefined) {
      //初始化的時候只允許getMemberInfo方法來判斷
      if (parent.namespace.params.hasCard) {
        jQuery('.listbox-node:contains("會員卡")')
          .eq(0)
          .append('<span style="color: #016cdf;">(該客人有會員卡)</span>')
      } else {
        jQuery('.listbox-node:contains("會員卡")')
          .eq(0)
          .append('<span style="color: #016cdf;">(該客人無會員卡)</span>')
      }
    }
    if (parent.namespace.params.voucherData && parent.namespace.params.voucherData.length > 0) {
      jQuery('.listbox-node:contains("優惠券")')
        .eq(0)
        .append(
          '<span style="color: #016cdf;">(' +
            parent.namespace.params.voucherData.length +
            '張可用)</span>'
        )
    }
    namespace.queryHykAndInsurPrice(node) */
  }
}

const schema = reactive<FormSchema[]>([
  genFormSchema('divider', '', '選擇特殊福利（如果有）'),
  genFormSchema('input', 'taikangka', '泰康卡號', { placeholder: null, span: 8 }),
  genFormSchema('divider', '', '選擇支付方式'),
  genFormSchema('checkbox', 'chargeType', '', {
    options: dict.chargeType,
    value: [],
    span: 24,
    max: 2,
    onChange: handleChargeTypeChange
  }),
  genFormSchema('divider', '', '收費金額'),
  {
    field: 'ChargeAmount',
    label: '',
    colProps: {
      span: 24
    }
  },
  {
    field: 'ChargeItems',
    label: '',
    colProps: {
      span: 24
    }
  }
])

const { register, methods, elFormRef } = useForm({
  schema
})

const initCharge = () => {
  renderMoney()
}

const renderMoney = async (appointPrice = 0) => {
  // const data = (params.sheet && params.selectedRows) as object[] || []
  const data = []
  if (data.length) {
    allMoney.value = data.reduce((sum, item) => sum + item.price, 0)
  }
  allMoney.value = allMoney.value ? Number(allMoney.value.toFixed(1)) : 0
  if (params.appointAction) {
    //預約頁面直接取後端返回的收銀價格
    allMoney.value = appointPrice
  }

  // var amountArr = []
  // const { chargeType } = await methods?.getFormData
  // var arr = chargeType

  // find all elements with name of 'amount' in selected charge types

  // if (item.length && item[0]) {
  //   for (var i = 0; i < item.length; i++) {
  //     var children = yui.get(item[i]).getAllEditors()
  //     for (var index = 0; index < children.length; index++) {
  //       if (children[index].name === 'amount') {
  //         amountitem.push(children[index])
  //       }
  //     }
  //   }
  //   if (amountitem.length === 2) {
  //     var mm = Number(price_amount.getValue())
  //     var m1 = Number(amountitem[0].getValue())
  //     var m2 = Number(amountitem[1].getValue())
  //     if (m1 && m1 < mm) {
  //       m2 = utils.number.minus(mm, m1) //錢2
  //     } else {
  //       m1 = utils.number.minus(mm, m2)
  //     }
  //     m2 = m2 < 0 ? 0 : m2
  //     m1 = m1 < 0 ? 0 : m1 //防止控件取負數絕對值
  //     amountitem[0].id !== 'couponAmount' &&
  //       amountitem[0].id !== 'gaofangkaAmount' &&
  //       amountitem[0].setValue(m1)
  //     amountitem[1].id !== 'couponAmount' &&
  //       amountitem[1].id !== 'gaofangkaAmount' &&
  //       amountitem[1].setValue(m2)
  //   } else {
  //     amountitem[0].id !== 'couponAmount' &&
  //       amountitem[0].id !== 'gaofangkaAmount' &&
  //       amountitem[0].setValue(price_amount.getValue())
  //   }
  // }
}

const rules = []

const resetChargeType = () => {
  methods.setValues({
    chargeType: []
  })
}

const setChargeItem = (chargeItemValue, fieldName, value = '') => {
  const curChargeItem = chargeItemRefs.value.find(
    (item) => unref(item).props.chargeType === chargeItemValue
  )
  if (fieldName === 'reset') {
    unref(curChargeItem)?.elFormRef?.resetFields()
  } else {
    unref(curChargeItem)?.methods.setValues({
      fieldName: value
    })
  }
}

const isSelected = (ct) => {
  return chargeTypeRef.value.includes(ct.value)
}

const handleDialog = (type, visible) => {
  console.log(type, visible)

  if (type === 'TaRen') {
    dialogTitle.value = '他人會員卡'
  }
  actionType.value = type
  dialogVisible.value = visible
}

const getPayArray = () => {
  return {}
}

defineExpose({
  getPayArray
})
</script>

<template>
  <Form :rules="rules" @register="register">
    <template #ChargeAmount> 費用合計：{{ allMoney }}元 </template>
    <template #ChargeItems>
      <ChargeItem
        v-for="ct in dict.chargeType.filter((item) => isSelected(item))"
        :chargeType="ct"
        :key="ct.value"
        ref="chargeItemRefs"
      />
    </template>
  </Form>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <ChooseTaRenCard v-if="actionType === 'TaRen'" ref="TaRenRef" />

    <template #footer>
      <!-- <ElButton type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton> -->
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
