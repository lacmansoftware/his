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
      title: '????????????',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'info/index',
        component: () => import('@/views/Member/Info/MemberInfoIndex.vue'),
        name: 'MemberManagement',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'info/add',
        component: () => import('@/views/Member/Info/MemberInfoAdd.vue'),
        name: 'MemberInfoAdd',
        meta: {
          title: '????????????',
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
          title: '????????????'
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
      title: '????????????',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'workorder',
        component: getParentLayout(),
        name: 'WorkOrderSub',
        meta: {
          title: '????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'add',
            component: () => import('@/views/Member/WorkOrder/Add.vue'),
            name: 'WordOrderAdd',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'index',
            component: () => import('@/views/Member/WorkOrder/Index.vue'),
            name: 'WordOrderIndex',
            meta: {
              title: '????????????'
            }
          }
        ]
      },
      {
        path: 'sms',
        component: getParentLayout(),
        name: 'SMS',
        meta: {
          title: '????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'send',
            component: () => import('@/views/Member/SMS/Send/Index.vue'),
            name: 'SMSSendIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'reply',
            component: () => import('@/views/Member/SMS/Reply/Index.vue'),
            name: 'SMSReplyIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'template',
            component: () => import('@/views/Member/SMS/Template/Index.vue'),
            name: 'SMSTemplateIndex',
            meta: {
              title: '????????????'
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
      title: '????????????',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'appoint',
        component: getParentLayout(),
        name: 'AppointManage',
        meta: {
          title: '????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'hospital/index',
            component: () => import('@/views/Appoint/Appoint/Hospital/Index.vue'),
            name: 'AppointManageHospitalIndex',
            meta: {
              title: '????????????(??????)'
            }
          },
          {
            path: 'appoint/index',
            component: () => import('@/views/Appoint/Appoint/Appoint/Index.vue'),
            name: 'AppointManageAppointIndex',
            meta: {
              title: '????????????(??????)'
            }
          },
          {
            path: 'appoint/confirm',
            component: () => import('@/views/Appoint/Appoint/Appoint/Confirm.vue'),
            name: 'AppointManageAppointConfirm',
            meta: {
              title: '????????????(??????)',
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
              title: '????????????',
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
              title: '????????????',
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
              title: '????????????'
            }
          },
          {
            path: 'cancel_list/index',
            component: () => import('@/views/Appoint/Appoint/CancelList/Index.vue'),
            name: 'AppointManageCancelListIndex',
            meta: {
              title: '???????????????'
            }
          },
          {
            path: 'pay_list/index',
            component: () => import('@/views/Appoint/Appoint/PayList/Index.vue'),
            name: 'AppointManagePayListIndex',
            meta: {
              title: '?????????????????????'
            }
          },
          {
            path: 'appoint/special',
            component: () => import('@/views/Appoint/Appoint/Appoint/Special.vue'),
            name: 'AppointManageAppointSpecial',
            meta: {
              title: '????????????(????????????)'
            }
          }
        ]
      },
      {
        path: 'regist',
        component: getParentLayout(),
        name: 'AppointRegist',
        meta: {
          title: '????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'add',
            component: () => import('@/views/Appoint/Regist/Add.vue'),
            name: 'AppointRegistAdd',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'registered/index',
            component: () => import('@/views/Appoint/Regist/Registered/Index.vue'),
            name: 'AppointRegistRegisteredIndex',
            meta: {
              title: '?????????'
            }
          },
          {
            path: 'unregistered/index',
            component: () => import('@/views/Appoint/Regist/Unregistered/Index.vue'),
            name: 'AppointRegistUnregisteredIndex',
            meta: {
              title: '?????????'
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
      title: '????????????',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'offline',
        component: getParentLayout(),
        name: 'RecipelOffline',
        meta: {
          title: '????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'input/index',
            component: () => import('@/views/Recipel/Offline/Input/Index.vue'),
            name: 'RecipelOfflineInputIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'audit/index',
            component: () => import('@/views/Recipel/Offline/Audit/Index.vue'),
            name: 'RecipelOfflineAuditIndex',
            meta: {
              title: '????????????'
            }
          }
        ]
      },
      {
        path: 'online',
        component: getParentLayout(),
        name: 'RecipelOnline',
        meta: {
          title: '????????????',
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
              title: '????????????'
            }
          },
          {
            path: 'unpay/index',
            component: () => import('@/views/Recipel/Online/Unpay/Index.vue'),
            name: 'RecipelOnlineUnpayIndex',
            meta: {
              title: '???????????????'
            }
          }
        ]
      },
      {
        path: 'customer',
        component: getParentLayout(),
        name: 'RecipelCustomer',
        meta: {
          title: '????????????',
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
              title: '????????????',
              noCache: true
            }
          },
          {
            path: 'payed',
            component: () => import('@/views/Recipel/Customer/Payed.vue'),
            name: 'RecipelCustomerPayed',
            meta: {
              title: '?????????'
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
      title: '????????????',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'notcharged/index',
        component: () => import('@/views/Cash/NotCharged/Index.vue'),
        name: 'CashNotChargedIndex',
        meta: {
          title: '?????????'
        }
      },
      {
        path: 'notcharged/add',
        component: () => import('@/views/Cash/NotCharged/Add.vue'),
        name: 'CashNotChargedAdd',
        meta: {
          title: '????????????',
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
          title: '?????????'
        }
      },
      {
        path: 'pending/index',
        component: () => import('@/views/Cash/Pending/Index.vue'),
        name: 'CashPendingIndex',
        meta: {
          title: '??????'
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
      title: '????????????',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'offline',
        component: getParentLayout(),
        name: 'OrderOffline',
        meta: {
          title: '????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'paid/index',
            component: () => import('@/views/Order/Offline/Paid/Index.vue'),
            name: 'OrderOfflinePaidIndex',
            meta: {
              title: '?????????'
            }
          },
          {
            path: 'unpaid/index',
            component: () => import('@/views/Order/Offline/Unpaid/Index.vue'),
            name: 'OrderOfflineUnpaidIndex',
            meta: {
              title: '?????????'
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
      title: '????????????',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'order',
        component: getParentLayout(),
        name: 'ProductOrder',
        meta: {
          title: '????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'index',
            component: () => import('@/views/Product/Order/Index.vue'),
            name: 'ProductOrderIndex',
            meta: {
              title: '????????????'
            }
          }
        ]
      },
      {
        path: 'index',
        component: () => import('@/views/Product/Index.vue'),
        name: 'ProductIndex',
        meta: {
          title: '???????????????'
        }
      },
      {
        path: 'ynzj',
        component: getParentLayout(),
        name: 'ProductYnzj',
        meta: {
          title: '??????????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'make/index',
            component: () => import('@/views/Product/Ynzj/Make/Index.vue'),
            name: 'ProductYnzjMakeIndex',
            meta: {
              title: '?????????'
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
              title: '????????????'
            }
          },
          {
            path: 'stockin/index',
            component: () => import('@/views/Product/Ynzj/Stockin/Index.vue'),
            name: 'ProductYnzjStockinApprove',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'return/index',
            component: () => import('@/views/Product/Ynzj/Return/Index.vue'),
            name: 'ProductYnzjReturnApprove',
            meta: {
              title: '?????????'
            }
          }
        ]
      },
      {
        path: 'request',
        component: getParentLayout(),
        name: 'ProductRequest',
        meta: {
          title: '??????????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'order/index',
            component: () => import('@/views/Product/Request/Order/Index.vue'),
            name: 'ProductRequestOrderIndex',
            meta: {
              title: '?????????'
            }
          },
          {
            path: 'purchase/index',
            component: () => import('@/views/Product/Request/Purchase/Index.vue'),
            name: 'ProductRequestPurchaseIndex',
            meta: {
              title: '?????????'
            }
          },
          {
            path: 'transfer/index',
            component: () => import('@/views/Product/Request/Transfer/Index.vue'),
            name: 'ProductRequestTransferIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'mdreturn/index',
            component: () => import('@/views/Product/Request/MdReturn/Index.vue'),
            name: 'ProductRequestMdReturnIndex',
            meta: {
              title: '????????????'
            }
          }
        ]
      },
      {
        path: 'inventory',
        component: getParentLayout(),
        name: 'ProductInventory',
        meta: {
          title: '????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'index',
            component: () => import('@/views/Product/Inventory/Index.vue'),
            name: 'ProductInventoryIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'price_change_log/list_price_change_log',
            component: () =>
              import('@/views/Product/Inventory/PriceChangeLog/ListPriceChangeLog.vue'),
            name: 'ProductInventoryPriceChangeLogListPriceChangeLog',
            meta: {
              title: '?????????????????????'
            }
          },
          {
            path: 'alert/list_alert',
            component: () => import('@/views/Product/Inventory/Alert/ListAlert.vue'),
            name: 'ProductInventoryAlertListAlert',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'check/index',
            component: () => import('@/views/Product/Inventory/Check/Index.vue'),
            name: 'ProductInventoryCheckIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'loss/index',
            component: () => import('@/views/Product/Inventory/Loss/Index.vue'),
            name: 'ProductInventoryLossIndex',
            meta: {
              title: '????????????'
            }
          }
        ]
      },
      {
        path: 'recommended_product_setting/index',
        component: () => import('@/views/Product/RecommendedProductSetting/Index.vue'),
        name: 'ProductRecommendedProductSettingIndex',
        meta: {
          title: '??????????????????'
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
      title: '????????????',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'tjgl/distribution/index',
        component: () => import('@/views/Pharmacy/Tjgl/Distribution/Index.vue'),
        name: 'PharmacyTjglDistributionIndex',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'tjgl',
        component: getParentLayout(),
        name: 'PharmacyTjgl',
        meta: {
          title: '????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'sendrug/index',
            component: () => import('@/views/Pharmacy/Tjgl/Sendrug/Index.vue'),
            name: 'PharmacyTjglSendrugIndex',
            meta: {
              title: '??????'
            }
          },
          {
            path: 'send_self_product/index',
            component: () => import('@/views/Pharmacy/Tjgl/SendSelfProduction/Index.vue'),
            name: 'PharmacyTjglSendSelfProductionIndex',
            meta: {
              title: '??????-????????????'
            }
          },
          {
            path: 'decoction/index',
            component: () => import('@/views/Pharmacy/Tjgl/Decoction/Index.vue'),
            name: 'PharmacyTjglDecoctionIndex',
            meta: {
              title: '??????'
            }
          },
          {
            path: 'returndrug/index',
            component: () => import('@/views/Pharmacy/Tjgl/Returndrug/Index.vue'),
            name: 'PharmacyTjglReturndrugIndex',
            meta: {
              title: '??????'
            }
          },
          {
            path: 'zxyf/index',
            component: () => import('@/views/Pharmacy/Tjgl/Zxyf/Index.vue'),
            name: 'PharmacyTjglZxyfIndex',
            meta: {
              title: '????????????-??????'
            }
          },
          {
            path: 'zhenrentang/index',
            component: () => import('@/views/Pharmacy/Tjgl/Zhenrentang/Index.vue'),
            name: 'PharmacyTjglZhenrentangIndex',
            meta: {
              title: '????????????-?????????'
            }
          },
          {
            path: 'kmyf/index',
            component: () => import('@/views/Pharmacy/Tjgl/Kmyf/Index.vue'),
            name: 'PharmacyTjglKmyfIndex',
            meta: {
              title: '????????????-??????'
            }
          }
        ]
      },
      {
        path: 'center',
        component: getParentLayout(),
        name: 'PharmacyCenter',
        meta: {
          title: '????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'request_order/index',
            component: () => import('@/views/Pharmacy/Center/RequestOrder/Index.vue'),
            name: 'PharmacyCenterRequestOrderIndex',
            meta: {
              title: '?????????'
            }
          },
          {
            path: 'purchase/index',
            component: () => import('@/views/Pharmacy/Center/Purchase/Index.vue'),
            name: 'PharmacyCenterPurchaseIndex',
            meta: {
              title: '??????????????????'
            }
          },
          {
            path: 'transfer/index',
            component: () => import('@/views/Pharmacy/Center/Transfer/Index.vue'),
            name: 'PharmacyCenterTransferIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'yfreturn/index',
            component: () => import('@/views/Pharmacy/Center/YfReturn/Index.vue'),
            name: 'PharmacyCenterYfReturnIndex',
            meta: {
              title: '????????????'
            }
          }
        ]
      },
      {
        path: 'inventory',
        component: getParentLayout(),
        name: 'PharmacyInventory',
        meta: {
          title: '????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'inventory/index',
            component: () => import('@/views/Pharmacy/Inventory/Inventory/Index.vue'),
            name: 'PharmacyInventoryIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'pharmacy_alert/list_alert',
            component: () => import('@/views/Pharmacy/Inventory/ListAlert/Index.vue'),
            name: 'PharmacyInventoryListAlertIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'check/index',
            component: () => import('@/views/Pharmacy/Inventory/Check/Index.vue'),
            name: 'PharmacyInventoryCheckIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'loss/index',
            component: () => import('@/views/Pharmacy/Inventory/Loss/Index.vue'),
            name: 'PharmacyInventoryLossIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'drug_use/list_drug_use',
            component: () => import('@/views/Pharmacy/Inventory/DrugUse/ListDrugUse.vue'),
            name: 'PharmacyInventoryDrugUseListDrugUse',
            meta: {
              title: '??????????????????'
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
      title: '????????????',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'zlxm/list_zlxm',
        component: () => import('@/views/PharmacyCore/Zlxm/ListZlxm.vue'),
        name: 'PharmacyCoreZlxmListZlxm',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'drug',
        component: getParentLayout(),
        name: 'PharmacyCoreDrug',
        meta: {
          title: '??????-????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'drug/list_drug',
            component: () => import('@/views/PharmacyCore/Drug/Drug/ListDrug.vue'),
            name: 'PharmacyCoreDrugDrugListDrug',
            meta: {
              title: '??????-????????????'
            }
          },
          {
            path: 'drug_three/list_drug',
            component: () => import('@/views/PharmacyCore/Drug/DrugThree/ListDrug.vue'),
            name: 'PharmacyCoreDrugDrugThreeListDrug',
            meta: {
              title: '??????-???????????????'
            }
          }
        ]
      },
      {
        path: 'supplier/index',
        component: () => import('@/views/PharmacyCore/Supplier/Index.vue'),
        name: 'PharmacyCoreSupplieIndex',
        meta: {
          title: '??????-???????????????'
        }
      },
      {
        path: 'store',
        component: getParentLayout(),
        name: 'PharmacyCoreStore',
        meta: {
          title: '??????-????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'request_order/index',
            component: () => import('@/views/PharmacyCore/Store/RequestOrder/Index.vue'),
            name: 'PharmacyCoreStoreRequestOrderIndex',
            meta: {
              title: '?????????'
            }
          },
          {
            path: 'purchase/index',
            component: () => import('@/views/PharmacyCore/Store/Purchase/Index.vue'),
            name: 'PharmacyCoreStorePurchaseIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'stockin/index',
            component: () => import('@/views/PharmacyCore/Store/Stockin/Index.vue'),
            name: 'PharmacyCoreStoreStockinIndex',
            meta: {
              title: '?????????'
            }
          },
          {
            path: 'stockout/index',
            component: () => import('@/views/PharmacyCore/Store/Stockout/Index.vue'),
            name: 'PharmacyCoreStoreStockoutIndex',
            meta: {
              title: '?????????'
            }
          },
          {
            path: 'yfreturn/index',
            component: () => import('@/views/PharmacyCore/Store/Yfreturn/Index.vue'),
            name: 'PharmacyCoreStoreYfreturnIndex',
            meta: {
              title: '???????????????'
            }
          },
          {
            path: 'ykreturn/index',
            component: () => import('@/views/PharmacyCore/Store/Ykreturn/Index.vue'),
            name: 'PharmacyCoreStoreYkreturnIndex',
            meta: {
              title: '???????????????'
            }
          }
        ]
      },
      {
        path: 'inventory',
        component: getParentLayout(),
        name: 'PharmacyCoreInventory',
        meta: {
          title: '??????-????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'inventory/index',
            component: () => import('@/views/PharmacyCore/Inventory/Inventory/Index.vue'),
            name: 'PharmacyCoreInventoryInventoryIndex',
            meta: {
              title: '????????????'
            }
          },

          {
            path: 'alert/list_alert',
            component: () => import('@/views/PharmacyCore/Inventory/Alert/ListAlert.vue'),
            name: 'PharmacyCoreInventoryAlertListAlert',
            meta: {
              title: '????????????'
            }
          },

          {
            path: 'price_change_log/list_price_change_log',
            component: () =>
              import('@/views/PharmacyCore/Inventory/PriceChangeLog/ListPriceChangeLog.vue'),
            name: 'PharmacyCoreInventoryPriceChangeLogListPriceChangeLog',
            meta: {
              title: '?????????????????????'
            }
          },

          {
            path: 'batch_no/index',
            component: () => import('@/views/PharmacyCore/Inventory/BatchNo/Index.vue'),
            name: 'PharmacyCoreInventoryBatchNoIndex',
            meta: {
              title: '??????????????????'
            }
          },

          {
            path: 'drug_conversion_proportion/list',
            component: () =>
              import('@/views/PharmacyCore/Inventory/DrugConversionProportion/List.vue'),
            name: 'PharmacyCoreInventoryDrugConversionProportionList',
            meta: {
              title: '???????????????'
            }
          }
        ]
      },
      {
        path: 'product/index',
        component: () => import('@/views/PharmacyCore/Product/Index.vue'),
        name: 'PharmacyCoreProductIndex',
        meta: {
          title: '??????-????????????'
        }
      },
      {
        path: 'product/supplier/index',
        component: () => import('@/views/Product/Supplier/Index.vue'),
        name: 'PharmacyCoreProductSupplierIndex',
        meta: {
          title: '??????-???????????????'
        }
      },
      {
        path: 'product_core',
        component: getParentLayout(),
        name: 'PharmacyCoreProduct',
        meta: {
          title: '??????-????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'request_order/index',
            component: () => import('@/views/PharmacyCore/ProductCore/RequestOrder/Index.vue'),
            name: 'PharmacyCoreProductCoreRequestOrderIndex',
            meta: {
              title: '?????????'
            }
          },
          {
            path: 'purchase/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Purchase/Index.vue'),
            name: 'PharmacyCoreProductCorePurchaseIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'stockin/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Stockin/Index.vue'),
            name: 'PharmacyCoreProductCoreStockinIndex',
            meta: {
              title: '?????????'
            }
          },
          {
            path: 'stockout/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Stockout/Index.vue'),
            name: 'PharmacyCoreProductCoreStockoutIndex',
            meta: {
              title: '?????????'
            }
          },
          {
            path: 'mdreturn/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Mdreturn/Index.vue'),
            name: 'PharmacyCoreProductCoreMdreturnIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'ykreturn/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Ykreturn/Index.vue'),
            name: 'PharmacyCoreProductCoreYkreturnIndex',
            meta: {
              title: '????????????'
            }
          }
        ]
      },
      {
        path: 'product_core/inventory',
        component: getParentLayout(),
        name: 'PharmacyCoreProductCoreInventory',
        meta: {
          title: '??????-????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'inventory/index',
            component: () =>
              import('@/views/PharmacyCore/ProductCore/Inventory/Inventory/Index.vue'),
            name: 'PharmacyCoreProductCoreRequestOrderIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'alert/list_alert',
            component: () =>
              import('@/views/PharmacyCore/ProductCore/Inventory/Alert/ListAlert.vue'),
            name: 'PharmacyCoreProductCorePurchaseIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'stockin/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Stockin/Index.vue'),
            name: 'PharmacyCoreProductCoreStockinIndex',
            meta: {
              title: '?????????'
            }
          },
          {
            path: 'stockout/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Stockout/Index.vue'),
            name: 'PharmacyCoreProductCoreStockoutIndex',
            meta: {
              title: '?????????'
            }
          },
          {
            path: 'mdreturn/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Mdreturn/Index.vue'),
            name: 'PharmacyCoreProductCoreMdreturnIndex',
            meta: {
              title: '????????????'
            }
          },
          {
            path: 'ykreturn/index',
            component: () => import('@/views/PharmacyCore/ProductCore/Ykreturn/Index.vue'),
            name: 'PharmacyCoreProductCoreYkreturnIndex',
            meta: {
              title: '????????????'
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
      title: '????????????',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'voucher/index',
        component: () => import('@/views/Market/Voucher/Index.vue'),
        name: 'MarketVoucherIndex',
        meta: {
          title: '?????????'
        }
      },
      {
        path: 'specialist/index',
        component: () => import('@/views/Market/Specialist/Index.vue'),
        name: 'MarketSpecialistIndex',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'insur/index',
        component: () => import('@/views/Market/Insur/Index.vue'),
        name: 'MarketInsurIndex',
        meta: {
          title: '??????????????????'
        }
      },
      {
        path: 'package',
        component: getParentLayout(),
        name: 'MarketPackage',
        meta: {
          title: '??????',
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
              title: '????????????'
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
              title: '????????????'
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
              title: '????????????'
            }
          }
        ]
      },
      {
        path: 'doctor/article/index',
        component: () => import('@/views/Market/Doctor/Article/Index.vue'),
        name: 'MarketDoctorArticleIndex',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'product/activity/index',
        component: () => import('@/views/Market/Product/Activity/Index.vue'),
        name: 'MarketProductActivityIndex',
        meta: {
          title: '??????????????????'
        }
      },
      {
        path: 'gift_card/index',
        component: () => import('@/views/Market/GiftCard/Index.vue'),
        name: 'MarketGiftCardIndex',
        meta: {
          title: '?????????'
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
      title: '????????????',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      // {
      //   path: 'doctor/schedule_manage/index',
      //   component: () => import('@/views/Base/Doctor/ScheduleManage/Index.vue'),
      //   name: 'BaseDoctorScheduleManageIndex',
      //   meta: {
      //     title: '????????????'
      //   }
      // }
      {
        path: 'doctor/schedule_statistics/index',
        component: () => import('@/views/Base/Doctor/ScheduleStatistics/Index.vue'),
        name: 'BaseDoctorScheduleStatisticsIndex',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'doctor',
        component: getParentLayout(),
        name: 'MarketPackage',
        meta: {
          title: '????????????',
          alwaysShow: true
        },
        children: [
          {
            path: 'certified/index',
            component: () => import('@/views/Base/Doctor/Certified/Index.vue'),
            name: 'BaseDoctorCertifiedIndex',
            meta: {
              title: '?????????????????????'
            }
          },
          {
            path: 'uncertified/index',
            component: () => import('@/views/Base/Doctor/Uncertified/Index.vue'),
            name: 'BaseDoctorUncertifiedIndex',
            meta: {
              title: '?????????????????????'
            }
          }
        ]
      },
      {
        path: 'doctor/cash',
        component: () => import('@/views/Base/Doctor/Cash.vue'),
        name: 'BaseDoctorCash',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'doctor/comments/index',
        component: () => import('@/views/Base/Doctor/Comments/Index.vue'),
        name: 'BaseDoctorCommentsIndex',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'doctor/medical_record_audit/index',
        component: () => import('@/views/Base/Doctor/MedicalRecordAudit/Index.vue'),
        name: 'BaseDoctorMedicalRecordAuditIndex',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'doctor/medical_record_audit/record_list',
        component: () => import('@/views/Base/Doctor/MedicalRecordAudit/RecordList.vue'),
        name: 'BaseDoctorMedicalRecordAuditRecordList',
        meta: {
          title: '????????????'
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
      title: '????????????',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      // {
      //   path: 'info/index',
      //   component: () => import('@/views/Base/Hospital/Info/Index.vue'),
      //   name: 'BaseHospitalInfoIndex',
      //   meta: {
      //     title: '????????????'
      //   }
      // }
      {
        path: 'dept/index',
        component: () => import('@/views/Base/Hospital/Dept/Index.vue'),
        name: 'BaseHospitalDeptIndex',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'user/index',
        component: () => import('@/views/Base/Hospital/User/Index.vue'),
        name: 'BaseHospitalUserIndex',
        meta: {
          title: '????????????'
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
      title: '????????????',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'hospital/index',
        component: () => import('@/views/Sys/Hospital/Index.vue'),
        name: 'SysHospitalIndex',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'department/index',
        component: () => import('@/views/Sys/Department/Index.vue'),
        name: 'SysDepartmentIndex',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'user/index',
        component: () => import('@/views/Sys/User/Index.vue'),
        name: 'SysUserIndex',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'dict/index',
        component: () => import('@/views/Sys/Dict/Index.vue'),
        name: 'SysDictIndex',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'param/index',
        component: () => import('@/views/Sys/Param/Index.vue'),
        name: 'SysParamIndex',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'member/level/index',
        component: () => import('@/views/Sys/Member/Level/Index.vue'),
        name: 'SysMemberLevelIndex',
        meta: {
          title: '????????????'
        }
      }
      // {
      //   path: 'user/index',
      //   component: () => import('@/views/Sys/Hospital/User/Index.vue'),
      //   name: 'SysHospitalUserIndex',
      //   meta: {
      //     title: '????????????'
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
      title: '???????????????',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'today_clinic/index',
        component: () => import('@/views/DoctorStudio/TodayClinic/Index.vue'),
        name: 'DoctorStudioTodayClinicIndex',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'today_clinic/member_review',
        component: () => import('@/views/DoctorStudio/TodayClinic/MemberReview.vue'),
        name: 'DoctorStudioTodayClinicMemberReview',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'my_customer/index',
        component: () => import('@/views/DoctorStudio/MyCustomer/Index.vue'),
        name: 'DoctorStudioMyCustomerIndex',
        meta: {
          title: '????????????'
        }
      },
      {
        path: 'my_template/index',
        component: () => import('@/views/DoctorStudio/MyTemplate/Index.vue'),
        name: 'DoctorStudioMyTemplateIndex',
        meta: {
          title: '????????????'
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
