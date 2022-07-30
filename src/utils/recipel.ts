export const renderInputPlan = (id, callback) => {
  // var medicalHistory = yui.get('medicalHistory') || yui.getByName('medicalHistory') || null
  // var slaveSymptom = yui.get('slaveSymptom') || yui.getByName('slaveSymptom') || null
  // var furtherTime = yui.get('furtherTime') || yui.getByName('furtherTime') || null
  // var consFee = yui.get('consFee') || yui.getByName('consFee') || null
  // var freeCons = yui.get('freeCons') || yui.getByName('freeCons') || null
  // var diseaseForm = yui.get('diseaseForm') || yui.getByName('diseaseForm') || null
  // var isNoRecipel = yui.get('isNoRecipel') || yui.getByName('isNoRecipel') || null
  // var conditionRemark = yui.get('conditionRemark') || yui.getByName('conditionRemark') || null
  // var pharmacyId = yui.get('pharmacyId') || yui.getByName('pharmacyId') || null
  // if (id) {
  //   yui.ajax({
  //     url: '/member/visit/record/' + id,
  //     type: 'GET',
  //     data: {},
  //     success: function (result) {
  //       if (result.success) {
  //         var html = []
  //         var data = result.data
  //         if (data && data[0]) {
  //           diseaseForm && diseaseForm.setData(data[0])
  //           medicalHistory && medicalHistory.setValue(data[0].medicalHistory)
  //           slaveSymptom && slaveSymptom.setValue(data[0].slaveSymptom)
  //           isNoRecipel && isNoRecipel.setValue(data[0].isNoRecipel)
  //           conditionRemark && conditionRemark.setValue(data[0].conditionRemark)
  //           if (data[0].pharmacyId && pharmacyId) {
  //             //當醫生當前門店沒有之前處方的藥房的話，不再對藥房設置值，防止pharmacyId丟失
  //             if (
  //               !jQuery.isEmptyObject(
  //                 commonMethod.getOneData(data[0].pharmacyId, 'pharmacyId', pharmacyId.getData())
  //               )
  //             ) {
  //               pharmacyId.setValue(data[0].pharmacyId)
  //             }
  //           }
  //           furtherTime && furtherTime.setValue(data[0].furtherTime)
  //           if (data[0].furtherTime) {
  //             window.hasFurherTime = true
  //             yui.getByName('isFurtherTime').setValue('Y')
  //           } else {
  //             furtherTime.setValue(common.calculateFurtherTime(id))
  //           }
  //           if (data[0]['consfeeStatus'] === 'Y') {
  //             //已經收過診費的不允許再編輯了
  //             consFee && consFee.setReadonly(true)
  //             consFee && consFee.setValue(data[0].consFee)
  //             jQuery('#freeBox') && jQuery('#freeBox').html('（已收費）')
  //           } else {
  //             jQuery('#consFeeBox') && jQuery('#consFeeBox').hide()
  //             if (data[0].freeCons) {
  //               freeCons && freeCons.setValue(data[0].freeCons)
  //             }
  //           }
  //           yui.getByName('remark') && yui.getByName('remark').setValue(data[0].remark)
  //           for (var i = 0; i < data.length; i++) {
  //             var item = data[i]['recpels'] || []
  //             //禁用不需要開方
  //             if (item && item.length > 0) {
  //               isNoRecipel && isNoRecipel.setReadonly(true)
  //             }
  //             html.push(
  //               '<div style="border:1px solid #ddd;padding: 10px 14px;border-radius:2px;margin-bottom:10px;">'
  //             )
  //             for (var index = 0; index < item.length; index++) {
  //               html.push('<div class="item">')
  //               html.push(
  //                 '<div class="detail">方' +
  //                   (index + 1) +
  //                   '-' +
  //                   namespace.tempTypeList[item[index].tempType] +
  //                   ':' +
  //                   item[index].drugs +
  //                   '</div>'
  //               )
  //               html.push(
  //                 '<div style="line-height: 25px;color:#016cdf;text-align: right;">&yen;' +
  //                   item[index].price +
  //                   '</div>'
  //               )
  //               html.push('<div class="clear-fix" style="margin: 8px 0;">')
  //               var status = item[index]['approveStatus']
  //               html.push('<div style="height:17px;">')
  //               if (status === 'BH' || status === 'DJ' || status === 'CH') {
  //                 if (status === 'BH') {
  //                   html.push(
  //                     '<span class="status">已駁回</span><span id="' +
  //                       item[index].id +
  //                       '$reason" class="reason">駁回原因</span>'
  //                   )
  //                 }
  //                 if (status === 'DJ') {
  //                   html.push('<span class="status">待提交</span>')
  //                 }
  //                 if (status === 'CH') {
  //                   html.push('<span class="status">已撤回</span>')
  //                 }
  //                 html.push('<span id="' + item[index].id + '$del" class="del">刪除</span>')
  //                 html.push(
  //                   '<span id="' +
  //                     item[index].id +
  //                     '$edit" class="edit" data-tempType=' +
  //                     item[index].tempType +
  //                     '>編輯</span>'
  //                 )
  //                 //if (!params.auditBtnText) {//現在只有網診處方和拍照開方配置了這個屬性，但是單個提交只有門診才有 所以這裏加判斷
  //                 //    html.push('<span id="' + item[index].id + '$auditOne" class="audit_one">提交</span>');
  //                 //}
  //               }
  //               if (status === 'YSH' || status === 'YSF' || status === 'TJ') {
  //                 if (status === 'TJ') {
  //                   if (window.params.recipelMode !== '人際傳方') {
  //                     html.push('<span class="status">待審核</span>')
  //                   }
  //                   if (window.allowChehui) {
  //                     html.push(
  //                       '<span id="' + item[index].id + '$chehui" class="chehui tj">撤回</span>'
  //                     )
  //                   }
  //                 } else if (status === 'YSH' && item[index]['tempType'] == 'treat') {
  //                   html.push(
  //                     '<span id="' + item[index].id + '$chehui" class="chehui ysh">撤回</span>'
  //                   )
  //                 }
  //                 if (status === 'YSH') {
  //                   html.push('<span class="status" style="color: #80996C;">審核通過</span>')
  //                 } else if (status === 'YSF') {
  //                   html.push('<span class="status" style="color: #80996C;">已收費</span>')
  //                 }
  //                 html.push('<span id="' + item[index].id + '$print" class="print">打印</span>')
  //                 html.push(
  //                   '<span id="' +
  //                     item[index].id +
  //                     '$edit" class="edit" data-tempType=' +
  //                     item[index].tempType +
  //                     '>預覽</span>'
  //                 )
  //               }
  //               html.push('</div>')
  //               if (status === 'BH') {
  //                 html.push(
  //                   '<div id="' +
  //                     item[index].id +
  //                     'slide" class="slide" style="display:none;padding-top: 5px;color: #016cdf;">' +
  //                     (item[index].approvalNotes || '') +
  //                     '</div>'
  //                 )
  //               }
  //               html.push('</div>')
  //               html.push('</div>')
  //             }
  //             html.push('<div style="text-align:center;">')
  //             if (data[i].recipelAuditStatus === 'N') {
  //               html.push('<div class="hjhj">處方合計（預估）：' + data[i].totalPrice + '</div>')
  //             }
  //             if (window.currentAction === 'doctorStudio') {
  //               html.push(
  //                 '<div><div class="yui-flex-box"><div  style="margin: 10px 0;">推薦產品</div><div id="recommend_search" class="yui-blockbox" data-url="/charges/projects" ' +
  //                   'data-text-field="title" data-columns="namespace.rsCol" data-place-holder="輸入名稱" style="height: 30px;"></div></div><div id="recommend_sheet" class="yui-datasheet small" data-url="doctor/product/doctorListByVisitId?visitId=' +
  //                   params.row.id +
  //                   '" data-allow-multi="false" data-allow-resize="true" data-show-index="false" data-allow-pager="false"></div></div>'
  //               )
  //             }
  //             if (window.currentAction === 'doctorStudio') {
  //               html.push(
  //                 '<div id="' +
  //                   data[i].id +
  //                   '$audit" class="audit">' +
  //                   (params.auditBtnText || '全部提交') +
  //                   '</div>'
  //               )
  //             } else {
  //               if (data[i].recipelAuditStatus === 'N' || data[i].isNoRecipel === 'Y') {
  //                 if (
  //                   params.recipelMode === '人際傳方' &&
  //                   params.doctor_studio_flag !== 'doctor' &&
  //                   !params.CUSTOMER_CLINIC
  //                 ) {
  //                   html.push(
  //                     '<div id="' + data[i].id + '$auditCard" class="audit">網診公關卡</div>'
  //                   )
  //                 }
  //                 html.push(
  //                   '<div id="' +
  //                     data[i].id +
  //                     '$audit" class="audit">' +
  //                     (params.auditBtnText || '全部提交') +
  //                     '</div>'
  //                 )
  //               }
  //             }
  //             html.push('</div>')
  //           }
  //           planDetail.html(html.join(''))
  //           if (window.currentAction === 'doctorStudio') {
  //             yui.Destroy('recommend_sheet')
  //             yui.Destroy('recommend_search')
  //             var rs = new yui.DataSheet('recommend_sheet')
  //             var rsSearch = new yui.BlockBox('recommend_search')
  //             rsSearch.bind('change', namespace.onRecommendSearchChange)
  //             rs.setColumns([
  //               {
  //                 title: '產品名稱',
  //                 field: 'productName'
  //               },
  //               {
  //                 title: '單位',
  //                 field: 'unit',
  //                 width: '50px'
  //               },
  //               {
  //                 title: '數量',
  //                 field: 'num',
  //                 width: '50px',
  //                 rerender: function (e) {
  //                   if (e.row.createTime) {
  //                     return e.value
  //                   }
  //                   return (
  //                     '<input type="text" style="width:80%;" value="' +
  //                     e.value +
  //                     '" data-allow="number"/>'
  //                   )
  //                 }
  //               },
  //               {
  //                 title: '狀態',
  //                 field: 'status',
  //                 width: '50px',
  //                 rerender: function (e) {
  //                   if (e.row.createTime) {
  //                     return '已提交'
  //                   }
  //                   return '未提交'
  //                 }
  //               },
  //               {
  //                 title: '操作',
  //                 rerender: function (e) {
  //                   if (!e.row.createTime) {
  //                     return (
  //                       '<span onclick="namespace.delRecommendSheetRow(\'' +
  //                       e.row._uuid +
  //                       '\');" style="cursor:pointer;color:#016cdf;">刪除&nbsp;</span>'
  //                     )
  //                   }
  //                 }
  //               }
  //             ])
  //             yui.Deposit('recommend_sheet', rs)
  //           }
  //         }
  //         if (callback) {
  //           callback(result)
  //         }
  //       } else {
  //         yui.error(result.msg)
  //       }
  //     }
  //   })
  // } else {
  //   console.error('處方id不存在！')
  // }
}
