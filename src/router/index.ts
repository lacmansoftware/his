import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout, getParentLayout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Dashboard',
    meta: {
      title: t('router.dashboard'),
      icon: 'ant-design:dashboard-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'analysis',
        component: () => import('@/views/Dashboard/Analysis.vue'),
        name: 'Analysis',
        meta: {
          title: t('router.analysis'),
          noCache: true,
          affix: true
        }
      },
      {
        path: 'workplace',
        component: () => import('@/views/Dashboard/Workplace.vue'),
        name: 'Workplace',
        meta: {
          title: t('router.workplace'),
          noCache: true
        }
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    redirect: '/member/info/index',
    name: 'MemberInfoIndex',
    meta: {
      title: '會員管理',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'info/index',
        component: () => import('@/views/Member/Info/MemberInfoIndex.vue'),
        name: 'MemberManagement',
        meta: {
          title: '客人管理'
        }
      },
      {
        path: 'info/add',
        component: () => import('@/views/Member/Info/MemberInfoAdd.vue'),
        name: 'MemberInfoAdd',
        meta: {
          title: '新增客人',
          noTagsView: true,
          noCache: true,
          hidden: true,
          showMainRoute: true,
          activeMenu: '/member/info-index'
        }
      },
      {
        path: 'protocol/index',
        component: () => import('@/views/Member/Protocol/MemberProtocolIndex.vue'),
        name: 'MemberProtocolManagement',
        meta: {
          title: '會員協議'
        }
      }
    ]
  },
  {
    path: '/workorder',
    component: Layout,
    redirect: '/workorder/workorder/add',
    name: 'WorkOrder',
    meta: {
      title: '工單管理',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'workorder',
        component: getParentLayout(),
        name: 'WorkOrderSub',
        meta: {
          title: '工單管理',
          alwaysShow: true
        },
        children: [
          {
            path: 'add',
            component: () => import('@/views/Member/WorkOrder/Add.vue'),
            name: 'WordOrderAdd',
            meta: {
              title: '新建工單'
            }
          },
          {
            path: 'index',
            component: () => import('@/views/Member/WorkOrder/Index.vue'),
            name: 'WordOrderIndex',
            meta: {
              title: '工單列表'
            }
          }
        ]
      },
      {
        path: 'sms',
        component: getParentLayout(),
        name: 'SMS',
        meta: {
          title: '短信管理',
          alwaysShow: true
        },
        children: [
          {
            path: 'send',
            component: () => import('@/views/Member/SMS/Send/Index.vue'),
            name: 'SMSSendIndex',
            meta: {
              title: '發送列表'
            }
          },
          {
            path: 'reply',
            component: () => import('@/views/Member/SMS/Reply/Index.vue'),
            name: 'SMSReplyIndex',
            meta: {
              title: '回復列表'
            }
          },
          {
            path: 'template',
            component: () => import('@/views/Member/SMS/Template/Index.vue'),
            name: 'SMSTemplateIndex',
            meta: {
              title: '模板管理'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/appoint',
    component: Layout,
    redirect: '/appoint/appoint/hospital/index',
    name: 'Appoint',
    meta: {
      title: '預約掛號',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'appoint',
        component: getParentLayout(),
        name: 'AppointManage',
        meta: {
          title: '預約管理',
          alwaysShow: true
        },
        children: [
          {
            path: 'hospital/index',
            component: () => import('@/views/Appoint/Appoint/Hospital/Index.vue'),
            name: 'AppointManageHospitalIndex',
            meta: {
              title: '新建預約(醫館)'
            }
          },
          {
            path: 'appoint/index',
            component: () => import('@/views/Appoint/Appoint/Appoint/Index.vue'),
            name: 'AppointManageAppointIndex',
            meta: {
              title: '新建預約(醫生)'
            }
          },
          {
            path: 'appoint/confirm',
            component: () => import('@/views/Appoint/Appoint/Appoint/Confirm.vue'),
            name: 'AppointManageAppointConfirm',
            meta: {
              title: '新建預約(醫館)',
              noTagsView: false,
              noCache: true,
              hidden: true,
              showMainRoute: true,
              activeMenu: '/appoint/appoint/appoint/index'
            }
          },
          {
            path: 'appoint/add',
            component: () => import('@/views/Appoint/Appoint/Appoint/Add.vue'),
            name: 'AppointManageAppointAdd',
            props: (route) => ({
              currentRow: route?.params?.currentRow
                ? JSON.parse(route?.params?.currentRow as string)
                : {}
            }),
            meta: {
              title: '新建預約',
              noTagsView: false,
              noCache: true,
              hidden: true,
              showMainRoute: true,
              activeMenu: '/appoint/appoint/appoint/index'
            }
          },
          {
            path: 'appoint/edit',
            component: () => import('@/views/Appoint/Appoint/Appoint/Add.vue'),
            name: 'AppointManageAppointEdit',
            meta: {
              title: '修改預約',
              noTagsView: false,
              noCache: true,
              hidden: true,
              showMainRoute: true,
              activeMenu: '/appoint/appoint/appoint/index'
            }
          },
          {
            path: 'list/index',
            component: () => import('@/views/Appoint/Appoint/List/Index.vue'),
            name: 'AppointManageListIndex',
            meta: {
              title: '預約列表'
            }
          },
          {
            path: 'cancel_list/index',
            component: () => import('@/views/Appoint/Appoint/CancelList/Index.vue'),
            name: 'AppointManageCancelListIndex',
            meta: {
              title: '待取消列表'
            }
          },
          {
            path: 'pay_list/index',
            component: () => import('@/views/Appoint/Appoint/PayList/Index.vue'),
            name: 'AppointManagePayListIndex',
            meta: {
              title: '預約待支付統計'
            }
          },
          {
            path: 'appoint/special',
            component: () => import('@/views/Appoint/Appoint/Appoint/Special.vue'),
            name: 'AppointManageAppointSpecial',
            meta: {
              title: '新建預約(九江醫館)'
            }
          }
        ]
      },
      {
        path: 'regist',
        component: getParentLayout(),
        name: 'AppointRegist',
        meta: {
          title: '掛號管理',
          alwaysShow: true
        },
        children: [
          {
            path: 'add',
            component: () => import('@/views/Appoint/Regist/Add.vue'),
            name: 'AppointRegistAdd',
            meta: {
              title: '新建掛號'
            }
          },
          {
            path: 'registered/index',
            component: () => import('@/views/Appoint/Regist/Registered/Index.vue'),
            name: 'AppointRegistRegisteredIndex',
            meta: {
              title: '已掛號'
            }
          },
          {
            path: 'unregistered/index',
            component: () => import('@/views/Appoint/Regist/Unregistered/Index.vue'),
            name: 'AppointRegistUnregisteredIndex',
            meta: {
              title: '未掛號'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/recipel',
    component: Layout,
    redirect: '/recipel/offline/input/index',
    name: 'Recipel',
    meta: {
      title: '錄方審方',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'offline',
        component: getParentLayout(),
        name: 'RecipelOffline',
        meta: {
          title: '門診處方',
          alwaysShow: true
        },
        children: [
          {
            path: 'input/index',
            component: () => import('@/views/Recipel/Offline/Input/Index.vue'),
            name: 'RecipelOfflineInputIndex',
            meta: {
              title: '處方錄入'
            }
          },
          {
            path: 'audit/index',
            component: () => import('@/views/Recipel/Offline/Audit/Index.vue'),
            name: 'RecipelOfflineAuditIndex',
            meta: {
              title: '處方審核'
            }
          }
        ]
      },
      {
        path: 'online',
        component: getParentLayout(),
        name: 'RecipelOnline',
        meta: {
          title: '網診處方',
          alwaysShow: true
        },
        children: [
          {
            path: 'input/index',
            component: () => import('@/views/Recipel/Online/Input/Index.vue'),
            name: 'RecipelOnlineInputIndex',
            props: {
              pageType: 'online-input-index'
            },
            meta: {
              title: '處方錄入'
            }
          },
          {
            path: 'unpay/index',
            component: () => import('@/views/Recipel/Online/Unpay/Index.vue'),
            name: 'RecipelOnlineUnpayIndex',
            meta: {
              title: '未付款處方'
            }
          }
        ]
      },
      {
        path: 'customer',
        component: getParentLayout(),
        name: 'RecipelCustomer',
        meta: {
          title: '醫生專屬',
          alwaysShow: true
        },
        children: [
          {
            path: 'index',
            component: () => import('@/views/Recipel/Online/Input/Index.vue'),
            name: 'RecipelCustomerIndex',
            props: {
              pageType: 'customer-index'
            },
            meta: {
              title: '慈祿門診',
              noCache: true
            }
          },
          {
            path: 'payed',
            component: () => import('@/views/Recipel/Customer/Payed.vue'),
            name: 'RecipelCustomerPayed',
            meta: {
              title: '已收費'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/cash',
    component: Layout,
    redirect: '/cash/notcharged/index',
    name: 'Cash',
    meta: {
      title: '收銀管理',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'notcharged/index',
        component: () => import('@/views/Cash/NotCharged/Index.vue'),
        name: 'CashNotChargedIndex',
        meta: {
          title: '待收費'
        }
      },
      {
        path: 'notcharged/add',
        component: () => import('@/views/Cash/NotCharged/Add.vue'),
        name: 'CashNotChargedAdd',
        meta: {
          title: '收銀結算',
          noTagsView: true,
          noCache: true,
          hidden: true,
          showMainRoute: true,
          activeMenu: '/cash/notcharged/index'
        }
      },
      {
        path: 'charged/index',
        component: () => import('@/views/Cash/Charged/Index.vue'),
        name: 'CashChargedIndex',
        meta: {
          title: '已收費'
        }
      },
      {
        path: 'pending/index',
        component: () => import('@/views/Cash/Pending/Index.vue'),
        name: 'CashPendingIndex',
        meta: {
          title: '欠費'
        }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/offline/paid/index',
    name: 'Order',
    meta: {
      title: '訂單管理',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'offline',
        component: getParentLayout(),
        name: 'OrderOffline',
        meta: {
          title: '門診訂單',
          alwaysShow: true
        },
        children: [
          {
            path: 'paid/index',
            component: () => import('@/views/Order/Offline/Paid/Index.vue'),
            name: 'OrderOfflinePaidIndex',
            meta: {
              title: '已付款'
            }
          },
          {
            path: 'unpaid/index',
            component: () => import('@/views/Order/Offline/Unpaid/Index.vue'),
            name: 'OrderOfflineUnpaidIndex',
            meta: {
              title: '未付款'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/index',
    name: 'Product',
    meta: {
      title: '產品管理',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'order',
        component: getParentLayout(),
        name: 'ProductOrder',
        meta: {
          title: '銷售管理',
          alwaysShow: true
        },
        children: [
          {
            path: 'index',
            component: () => import('@/views/Product/Order/Index.vue'),
            name: 'ProductOrderIndex',
            meta: {
              title: '銷售訂單'
            }
          }
        ]
      },
      {
        path: 'index',
        component: () => import('@/views/Product/Index.vue'),
        name: 'ProductIndex',
        meta: {
          title: '產品字典庫'
        }
      },
      {
        path: 'ynzj',
        component: getParentLayout(),
        name: 'ProductYnzj',
        meta: {
          title: '自有產品管理',
          alwaysShow: true
        },
        children: [
          {
            path: 'make/index',
            component: () => import('@/views/Product/Ynzj/Make/Index.vue'),
            name: 'ProductYnzjMakeIndex',
            meta: {
              title: '製作單'
            }
          },
          {
            path: 'make/approve',
            component: () => import('@/views/Product/Ynzj/Make/Index.vue'),
            name: 'ProductYnzjMakeApprove',
            props: {
              pageType: 'approve'
            },
            meta: {
              title: '製作審核'
            }
          },
          {
            path: 'stockin/index',
            component: () => import('@/views/Product/Ynzj/Stockin/Index.vue'),
            name: 'ProductYnzjStockinApprove',
            meta: {
              title: '成品入庫'
            }
          },
          {
            path: 'return/index',
            component: () => import('@/views/Product/Ynzj/Return/Index.vue'),
            name: 'ProductYnzjReturnApprove',
            meta: {
              title: '退成品'
            }
          }
        ]
      },
      {
        path: 'request',
        component: getParentLayout(),
        name: 'ProductRequest',
        meta: {
          title: '商品請貨管理',
          alwaysShow: true
        },
        children: [
          {
            path: 'order/index',
            component: () => import('@/views/Product/Request/Order/Index.vue'),
            name: 'ProductRequestOrderIndex',
            meta: {
              title: '請貨單'
            }
          },
          {
            path: 'purchase/index',
            component: () => import('@/views/Product/Request/Purchase/Index.vue'),
            name: 'ProductRequestPurchaseIndex',
            meta: {
              title: '採購單'
            }
          },
          {
            path: 'transfer/index',
            component: () => import('@/views/Product/Request/Transfer/Index.vue'),
            name: 'ProductRequestTransferIndex',
            meta: {
              title: '調撥確認'
            }
          },
          {
            path: 'mdreturn/index',
            component: () => import('@/views/Product/Request/MdReturn/Index.vue'),
            name: 'ProductRequestMdReturnIndex',
            meta: {
              title: '門店退貨'
            }
          }
        ]
      },
      {
        path: 'inventory',
        component: getParentLayout(),
        name: 'ProductInventory',
        meta: {
          title: '庫存管理',
          alwaysShow: true
        },
        children: [
          {
            path: 'index',
            component: () => import('@/views/Product/Inventory/Index.vue'),
            name: 'ProductInventoryIndex',
            meta: {
              title: '庫存查詢'
            }
          },
          {
            path: 'price_change_log/list_price_change_log',
            component: () =>
              import('@/views/Product/Inventory/PriceChangeLog/ListPriceChangeLog.vue'),
            name: 'ProductInventoryPriceChangeLogListPriceChangeLog',
            meta: {
              title: '零售價調整記錄'
            }
          },
          {
            path: 'alert/list_alert',
            component: () => import('@/views/Product/Inventory/Alert/ListAlert.vue'),
            name: 'ProductInventoryAlertListAlert',
            meta: {
              title: '預警管理'
            }
          },
          {
            path: 'check/index',
            component: () => import('@/views/Product/Inventory/Check/Index.vue'),
            name: 'ProductInventoryCheckIndex',
            meta: {
              title: '產品盤庫'
            }
          },
          {
            path: 'loss/index',
            component: () => import('@/views/Product/Inventory/Loss/Index.vue'),
            name: 'ProductInventoryLossIndex',
            meta: {
              title: '產品報損'
            }
          }
        ]
      },
      {
        path: 'recommended_product_setting/index',
        component: () => import('@/views/Product/RecommendedProductSetting/Index.vue'),
        name: 'ProductRecommendedProductSettingIndex',
        meta: {
          title: '推薦產品設置'
        }
      }
    ]
  },
  {
    path: '/pharmacy',
    component: Layout,
    redirect: '/pharmacy/tjgl/distribution/index',
    name: 'Pharmacy',
    meta: {
      title: '配送管理',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'tjgl/distribution/index',
        component: () => import('@/views/Pharmacy/Tjgl/Distribution/Index.vue'),
        name: 'PharmacyTjglDistributionIndex',
        meta: {
          title: '配送管理'
        }
      },
      {
        path: 'tjgl',
        component: getParentLayout(),
        name: 'PharmacyTjgl',
        meta: {
          title: '調劑管理',
          alwaysShow: true
        },
        children: [
          {
            path: 'sendrug/index',
            component: () => import('@/views/Pharmacy/Tjgl/Sendrug/Index.vue'),
            name: 'PharmacyTjglSendrugIndex',
            meta: {
              title: '發藥'
            }
          },
          {
            path: 'send_self_product/index',
            component: () => import('@/views/Pharmacy/Tjgl/SendSelfProduction/Index.vue'),
            name: 'PharmacyTjglSendSelfProductionIndex',
            meta: {
              title: '發藥-自有產品'
            }
          },
          {
            path: 'decoction/index',
            component: () => import('@/views/Pharmacy/Tjgl/Decoction/Index.vue'),
            name: 'PharmacyTjglDecoctionIndex',
            meta: {
              title: '代煎'
            }
          },
          {
            path: 'returndrug/index',
            component: () => import('@/views/Pharmacy/Tjgl/Returndrug/Index.vue'),
            name: 'PharmacyTjglReturndrugIndex',
            meta: {
              title: '退藥'
            }
          },
          {
            path: 'zxyf/index',
            component: () => import('@/views/Pharmacy/Tjgl/Zxyf/Index.vue'),
            name: 'PharmacyTjglZxyfIndex',
            meta: {
              title: '調劑管理-至信'
            }
          },
          {
            path: 'zhenrentang/index',
            component: () => import('@/views/Pharmacy/Tjgl/Zhenrentang/Index.vue'),
            name: 'PharmacyTjglZhenrentangIndex',
            meta: {
              title: '調劑管理-真仁堂'
            }
          },
          {
            path: 'kmyf/index',
            component: () => import('@/views/Pharmacy/Tjgl/Kmyf/Index.vue'),
            name: 'PharmacyTjglKmyfIndex',
            meta: {
              title: '調劑管理-康美'
            }
          }
        ]
      },
      {
        path: 'center',
        component: getParentLayout(),
        name: 'PharmacyCenter',
        meta: {
          title: '請貨中心',
          alwaysShow: true
        },
        children: [
          {
            path: 'request_order/index',
            component: () => import('@/views/Pharmacy/Center/RequestOrder/Index.vue'),
            name: 'PharmacyCenterRequestOrderIndex',
            meta: {
              title: '請貨單'
            }
          },
          {
            path: 'purchase/index',
            component: () => import('@/views/Pharmacy/Center/Purchase/Index.vue'),
            name: 'PharmacyCenterPurchaseIndex',
            meta: {
              title: '採購計劃管理'
            }
          },
          {
            path: 'transfer/index',
            component: () => import('@/views/Pharmacy/Center/Transfer/Index.vue'),
            name: 'PharmacyCenterTransferIndex',
            meta: {
              title: '調撥確認'
            }
          },
          {
            path: 'yfreturn/index',
            component: () => import('@/views/Pharmacy/Center/YfReturn/Index.vue'),
            name: 'PharmacyCenterYfReturnIndex',
            meta: {
              title: '藥房退藥'
            }
          }
        ]
      },
      {
        path: 'inventory',
        component: getParentLayout(),
        name: 'PharmacyInventory',
        meta: {
          title: '庫存查看',
          alwaysShow: true
        },
        children: [
          {
            path: 'inventory/index',
            component: () => import('@/views/Pharmacy/Inventory/Inventory/Index.vue'),
            name: 'PharmacyInventoryIndex',
            meta: {
              title: '庫存查看'
            }
          },
          {
            path: 'pharmacy_alert/list_alert',
            component: () => import('@/views/Pharmacy/Inventory/ListAlert/Index.vue'),
            name: 'PharmacyInventoryListAlertIndex',
            meta: {
              title: '庫存預警'
            }
          },
          {
            path: 'check/index',
            component: () => import('@/views/Pharmacy/Inventory/Check/Index.vue'),
            name: 'PharmacyInventoryCheckIndex',
            meta: {
              title: '藥房盤點'
            }
          },
          {
            path: 'loss/index',
            component: () => import('@/views/Pharmacy/Inventory/Loss/Index.vue'),
            name: 'PharmacyInventoryLossIndex',
            meta: {
              title: '藥品報損'
            }
          },
          {
            path: 'drug_use/list_drug_use',
            component: () => import('@/views/Pharmacy/Inventory/DrugUse/ListDrugUse.vue'),
            name: 'PharmacyInventoryDrugUseListDrugUse',
            meta: {
              title: '藥品使用情況'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/pharmacy_core',
    component: Layout,
    redirect: '/pharmacy_core/zlxm/list_zlxm',
    name: 'PharmacyCore',
    meta: {
      title: '總部藥房',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'zlxm/list_zlxm',
        component: () => import('@/views/PharmacyCore/Zlxm/ListZlxm.vue'),
        name: 'PharmacyCoreZlxmListZlxm',
        meta: {
          title: '治療項目'
        }
      },
      {
        path: 'drug',
        component: getParentLayout(),
        name: 'PharmacyCoreDrug',
        meta: {
          title: '飲片-藥典管理',
          alwaysShow: true
        },
        children: [
          {
            path: 'drug/list_drug',
            component: () => import('@/views/PharmacyCore/Drug/Drug/ListDrug.vue'),
            name: 'PharmacyCoreDrugDrugListDrug',
            meta: {
              title: '飲片-藥典管理'
            }
          },
          {
            path: 'drug_three/list_drug',
            component: () => import('@/views/PharmacyCore/Drug/DrugThree/ListDrug.vue'),
            name: 'PharmacyCoreDrugDrugThreeListDrug',
            meta: {
              title: '飲片-第三方藥典'
            }
          }
        ]
      },
      {
        path: 'supplier/index',
        component: () => import('@/views/PharmacyCore/Supplier/Index.vue'),
        name: 'PharmacyCoreSupplieIndex',
        meta: {
          title: '飲片-供應商管理'
        }
      },
      {
        path: 'store',
        component: getParentLayout(),
        name: 'PharmacyCoreStore',
        meta: {
          title: '飲片-門店請貨',
          alwaysShow: true
        },
        children: [
          {
            path: 'request_order/index',
            component: () => import('@/views/PharmacyCore/Store/RequestOrder/Index.vue'),
            name: 'PharmacyCoreStoreRequestOrderIndex',
            meta: {
              title: '請貨單'
            }
          },
          {
            path: 'purchase/index',
            component: () => import('@/views/PharmacyCore/Store/Purchase/Index.vue'),
            name: 'PharmacyCoreStorePurchaseIndex',
            meta: {
              title: '採購計劃'
            }
          },
          {
            path: 'stockin/index',
            component: () => import('@/views/PharmacyCore/Store/Stockin/Index.vue'),
            name: 'PharmacyCoreStoreStockinIndex',
            meta: {
              title: '入庫單'
            }
          },
          {
            path: 'stockout/index',
            component: () => import('@/views/PharmacyCore/Store/Stockout/Index.vue'),
            name: 'PharmacyCoreStoreStockoutIndex',
            meta: {
              title: '出庫單'
            }
          },
          {
            path: 'yfreturn/index',
            component: () => import('@/views/PharmacyCore/Store/Yfreturn/Index.vue'),
            name: 'PharmacyCoreStoreYfreturnIndex',
            meta: {
              title: '藥房退藥單'
            }
          },
          {
            path: 'ykreturn/index',
            component: () => import('@/views/PharmacyCore/Store/Ykreturn/Index.vue'),
            name: 'PharmacyCoreStoreYkreturnIndex',
            meta: {
              title: '藥庫退藥單'
            }
          }
        ]
      },
      {
        path: 'inventory',
        component: getParentLayout(),
        name: 'PharmacyCoreInventory',
        meta: {
          title: '飲片-庫存管理',
          alwaysShow: true
        },
        children: [
          {
            path: 'inventory/index',
            component: () => import('@/views/PharmacyCore/Inventory/Inventory/Index.vue'),
            name: 'PharmacyCoreInventoryInventoryIndex',
            meta: {
              title: '藥房庫存'
            }
          },

          {
            path: 'alert/list_alert',
            component: () => import('@/views/PharmacyCore/Inventory/Alert/ListAlert.vue'),
            name: 'PharmacyCoreInventoryAlertListAlert',
            meta: {
              title: '藥房預警'
            }
          },

          {
            path: 'price_change_log/list_price_change_log',
            component: () =>
              import('@/views/PharmacyCore/Inventory/PriceChangeLog/ListPriceChangeLog.vue'),
            name: 'PharmacyCoreInventoryPriceChangeLogListPriceChangeLog',
            meta: {
              title: '零售價調整記錄'
            }
          },

          {
            path: 'batch_no/index',
            component: () => import('@/views/PharmacyCore/Inventory/BatchNo/Index.vue'),
            name: 'PharmacyCoreInventoryBatchNoIndex',
            meta: {
              title: '生產批號管理'
            }
          },

          {
            path: 'drug_conversion_proportion/list',
            component: () =>
              import('@/views/PharmacyCore/Inventory/DrugConversionProportion/List.vue'),
            name: 'PharmacyCoreInventoryDrugConversionProportionList',
            meta: {
              title: '藥品濃度比'
            }
          }
        ]
      },
      {
        path: 'product/index',
        component: () => import('@/views/PharmacyCore/Product/Index.vue'),
        name: 'PharmacyCoreProductIndex',
        meta: {
          title: '產品-字典管理'
        }
      },
      {
        path: 'product/supplier/index',
        component: () => import('@/views/Product/Supplier/Index.vue'),
        name: 'PharmacyCoreProductSupplierIndex',
        meta: {
          title: '產品-供應商管理'
        }
      },
      {
        path: 'product_core',
        component: getParentLayout(),
        name: 'PharmacyCoreProduct',
        meta: {
          title: '產品-商品請貨',
          alwaysShow: true
        },
        children: [
          {
            path: 'request_order/index',
            component: () => import('@/views/PharmacyCore/ProductCore/RequestOrder/Index.vue'),
            name: 'PharmacyCoreProductCoreRequestOrderIndex',
            meta: {
              title: '請貨單'
            }
          },
          {
            path: 'purchase/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Purchase/Index.vue'),
            name: 'PharmacyCoreProductCorePurchaseIndex',
            meta: {
              title: '採購計劃'
            }
          },
          {
            path: 'stockin/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Stockin/Index.vue'),
            name: 'PharmacyCoreProductCoreStockinIndex',
            meta: {
              title: '入庫單'
            }
          },
          {
            path: 'stockout/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Stockout/Index.vue'),
            name: 'PharmacyCoreProductCoreStockoutIndex',
            meta: {
              title: '出庫單'
            }
          },
          {
            path: 'mdreturn/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Mdreturn/Index.vue'),
            name: 'PharmacyCoreProductCoreMdreturnIndex',
            meta: {
              title: '門店退貨'
            }
          },
          {
            path: 'ykreturn/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Ykreturn/Index.vue'),
            name: 'PharmacyCoreProductCoreYkreturnIndex',
            meta: {
              title: '藥庫退貨'
            }
          }
        ]
      },
      {
        path: 'product_core/inventory',
        component: getParentLayout(),
        name: 'PharmacyCoreProductCoreInventory',
        meta: {
          title: '產品-庫存管理',
          alwaysShow: true
        },
        children: [
          {
            path: 'inventory/index',
            component: () =>
              import('@/views/PharmacyCore/ProductCore/Inventory/Inventory/Index.vue'),
            name: 'PharmacyCoreProductCoreRequestOrderIndex',
            meta: {
              title: '庫存查詢'
            }
          },
          {
            path: 'alert/list_alert',
            component: () =>
              import('@/views/PharmacyCore/ProductCore/Inventory/Alert/ListAlert.vue'),
            name: 'PharmacyCoreProductCorePurchaseIndex',
            meta: {
              title: '預警管理'
            }
          },
          {
            path: 'stockin/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Stockin/Index.vue'),
            name: 'PharmacyCoreProductCoreStockinIndex',
            meta: {
              title: '入庫單'
            }
          },
          {
            path: 'stockout/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Stockout/Index.vue'),
            name: 'PharmacyCoreProductCoreStockoutIndex',
            meta: {
              title: '出庫單'
            }
          },
          {
            path: 'mdreturn/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Mdreturn/Index.vue'),
            name: 'PharmacyCoreProductCoreMdreturnIndex',
            meta: {
              title: '門店退貨'
            }
          },
          {
            path: 'ykreturn/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Ykreturn/Index.vue'),
            name: 'PharmacyCoreProductCoreYkreturnIndex',
            meta: {
              title: '藥庫退貨'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/market',
    component: Layout,
    redirect: '/market/voucher/index',
    name: 'Market',
    meta: {
      title: '營銷管理',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'voucher/index',
        component: () => import('@/views/Market/Voucher/Index.vue'),
        name: 'MarketVoucherIndex',
        meta: {
          title: '優惠券'
        }
      },
      {
        path: 'specialist/index',
        component: () => import('@/views/Market/Specialist/Index.vue'),
        name: 'MarketSpecialistIndex',
        meta: {
          title: '門診專科'
        }
      },
      {
        path: 'insur/index',
        component: () => import('@/views/Market/Insur/Index.vue'),
        name: 'MarketInsurIndex',
        meta: {
          title: '保險公司管理'
        }
      },
      {
        path: 'package',
        component: getParentLayout(),
        name: 'MarketPackage',
        meta: {
          title: '套餐',
          alwaysShow: true
        },
        children: [
          {
            path: 'offline/index',
            component: () => import('@/views/Market/Package/Index.vue'),
            props: {
              pageType: 'offline',
              pageName: '%e9%97%a8%e8%af%8a'
            },
            name: 'MarketPackageOffline',
            meta: {
              title: '門診套餐'
            }
          },
          {
            path: 'online/index',
            component: () => import('@/views/Market/Package/Index.vue'),
            props: {
              pageType: 'online',
              pageName: '%e7%bd%91%e8%af%8a'
            },
            name: 'MarketPackageOnline',
            meta: {
              title: '門診套餐'
            }
          },
          {
            path: 'combo/index',
            component: () => import('@/views/Market/Package/Index.vue'),
            props: {
              pageType: 'combo',
              pageName: '%e7%bb%84%e5%90%88'
            },
            name: 'MarketPackageCombo',
            meta: {
              title: '門診套餐'
            }
          }
        ]
      },
      {
        path: 'doctor/article/index',
        component: () => import('@/views/Market/Doctor/Article/Index.vue'),
        name: 'MarketDoctorArticleIndex',
        meta: {
          title: '文章管理'
        }
      },
      {
        path: 'product/activity/index',
        component: () => import('@/views/Market/Product/Activity/Index.vue'),
        name: 'MarketProductActivityIndex',
        meta: {
          title: '產品促銷活動'
        }
      },
      {
        path: 'gift_card/index',
        component: () => import('@/views/Market/GiftCard/Index.vue'),
        name: 'MarketGiftCardIndex',
        meta: {
          title: '線下卡'
        }
      }
    ]
  },
  {
    path: '/base',
    component: Layout,
    redirect: '/base/voucher/index',
    name: 'Base',
    meta: {
      title: '醫師管理',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      // {
      //   path: 'doctor/schedule_manage/index',
      //   component: () => import('@/views/Base/Doctor/ScheduleManage/Index.vue'),
      //   name: 'BaseDoctorScheduleManageIndex',
      //   meta: {
      //     title: '排班管理'
      //   }
      // }
      {
        path: 'doctor/schedule_statistics/index',
        component: () => import('@/views/Base/Doctor/ScheduleStatistics/Index.vue'),
        name: 'BaseDoctorScheduleStatisticsIndex',
        meta: {
          title: '停診統計'
        }
      },
      {
        path: 'doctor',
        component: getParentLayout(),
        name: 'MarketPackage',
        meta: {
          title: '醫師列表',
          alwaysShow: true
        },
        children: [
          {
            path: 'certified/index',
            component: () => import('@/views/Base/Doctor/Certified/Index.vue'),
            name: 'BaseDoctorCertifiedIndex',
            meta: {
              title: '已認證大夫列表'
            }
          },
          {
            path: 'uncertified/index',
            component: () => import('@/views/Base/Doctor/Uncertified/Index.vue'),
            name: 'BaseDoctorUncertifiedIndex',
            meta: {
              title: '未認證大夫列表'
            }
          }
        ]
      },
      {
        path: 'doctor/cash',
        component: () => import('@/views/Base/Doctor/Cash.vue'),
        name: 'BaseDoctorCash',
        meta: {
          title: '提現審核'
        }
      },
      {
        path: 'doctor/comments/index',
        component: () => import('@/views/Base/Doctor/Comments/Index.vue'),
        name: 'BaseDoctorCommentsIndex',
        meta: {
          title: '大夫評價'
        }
      },
      {
        path: 'doctor/medical_record_audit/index',
        component: () => import('@/views/Base/Doctor/MedicalRecordAudit/Index.vue'),
        name: 'BaseDoctorMedicalRecordAuditIndex',
        meta: {
          title: '病歷補錄'
        }
      },
      {
        path: 'doctor/medical_record_audit/record_list',
        component: () => import('@/views/Base/Doctor/MedicalRecordAudit/RecordList.vue'),
        name: 'BaseDoctorMedicalRecordAuditRecordList',
        meta: {
          title: '病歷質檢'
        }
      }
    ]
  },
  {
    path: '/base/hospital',
    component: Layout,
    redirect: '/base/dept/index',
    name: 'BaseHospital',
    meta: {
      title: '診所管理',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      // {
      //   path: 'info/index',
      //   component: () => import('@/views/Base/Hospital/Info/Index.vue'),
      //   name: 'BaseHospitalInfoIndex',
      //   meta: {
      //     title: '門店信息'
      //   }
      // }
      {
        path: 'dept/index',
        component: () => import('@/views/Base/Hospital/Dept/Index.vue'),
        name: 'BaseHospitalDeptIndex',
        meta: {
          title: '部門信息'
        }
      },
      {
        path: 'user/index',
        component: () => import('@/views/Base/Hospital/User/Index.vue'),
        name: 'BaseHospitalUserIndex',
        meta: {
          title: '人員信息'
        }
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/hospital/index',
    name: 'SysHospital',
    meta: {
      title: '基礎信息',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'hospital/index',
        component: () => import('@/views/Sys/Hospital/Index.vue'),
        name: 'SysHospitalIndex',
        meta: {
          title: '診所入駐'
        }
      },
      {
        path: 'department/index',
        component: () => import('@/views/Sys/Department/Index.vue'),
        name: 'SysDepartmentIndex',
        meta: {
          title: '部門管理'
        }
      },
      {
        path: 'user/index',
        component: () => import('@/views/Sys/User/Index.vue'),
        name: 'SysUserIndex',
        meta: {
          title: '員工管理'
        }
      },
      {
        path: 'dict/index',
        component: () => import('@/views/Sys/Dict/Index.vue'),
        name: 'SysDictIndex',
        meta: {
          title: '字典管理'
        }
      },
      {
        path: 'param/index',
        component: () => import('@/views/Sys/Param/Index.vue'),
        name: 'SysParamIndex',
        meta: {
          title: '參數管理'
        }
      },
      {
        path: 'member/level/index',
        component: () => import('@/views/Sys/Member/Level/Index.vue'),
        name: 'SysMemberLevelIndex',
        meta: {
          title: '客人級別'
        }
      }
      // {
      //   path: 'user/index',
      //   component: () => import('@/views/Sys/Hospital/User/Index.vue'),
      //   name: 'SysHospitalUserIndex',
      //   meta: {
      //     title: '人員信息'
      //   }
      // }
    ]
  },
  {
    path: '/doctor_studio',
    component: Layout,
    redirect: '/doctor_studio/today_clinic/index',
    name: 'DoctorStudio',
    meta: {
      title: '醫生工作站',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'today_clinic/index',
        component: () => import('@/views/DoctorStudio/TodayClinic/Index.vue'),
        name: 'DoctorStudioTodayClinicIndex',
        meta: {
          title: '就診管理'
        }
      },
      {
        path: 'today_clinic/member_review',
        component: () => import('@/views/DoctorStudio/TodayClinic/MemberReview.vue'),
        name: 'DoctorStudioTodayClinicMemberReview',
        meta: {
          title: '門診回顧'
        }
      },
      {
        path: 'my_customer/index',
        component: () => import('@/views/DoctorStudio/MyCustomer/Index.vue'),
        name: 'DoctorStudioMyCustomerIndex',
        meta: {
          title: '我的患者'
        }
      },
      {
        path: 'my_template/index',
        component: () => import('@/views/DoctorStudio/MyTemplate/Index.vue'),
        name: 'DoctorStudioMyTemplateIndex',
        meta: {
          title: '處方模板'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
