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
    redirect: '/workorder/workorder/add',
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
            path: 'list/index',
            component: () => import('@/views/Appoint/Appoint/List/Index.vue'),
            name: 'AppointManageListIndex',
            meta: {
              title: '預約列表'
            }
          }
        ]
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
