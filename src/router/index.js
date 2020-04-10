import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在面包屑中显示
    affix: true                  // if set true, the tag will affix in the tags-view
    noCache: true                // if set true, the page will no be cached(default is false)
    activeMenu: '/example/list'  // if set path, the sidebar will highlight the path you set
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: '首页',
        meta: { title: '首页', icon: 'index', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/finance',
    name: '财务管理',
    meta: { title: '财务管理', icon: 'finance' },
    component: Layout,
    children: [
      {
        path: 'account-book',
        name: '帐簿',
        meta: { title: '帐簿', icon: 'accountbook' },
        component: () => import('@/views/finance/account-book/index'),
        children: [
          {
            path: 'ledger',
            name: '总账',
            meta: { title: '总账' },
            component: () => import('@/views/finance/account-book/ledger/index'),
          },
          {
            path: 's-ledger',
            name: '明细账',
            meta: { title: '明细账' },
            component: () => import('@/views/finance/account-book/s-ledger/index'),
          },
          {
            path: 'bank-card',
            name: '银行卡',
            meta: { title: '银行卡' },
            component: () => import('@/views/finance/account-book/bank-card/index'),
          },
          {
            path: 'cash-flow',
            name: '银行流水',
            meta: { title: '银行流水' },
            component: () => import('@/views/finance/account-book/cash-flow/index'),
          }
        ]
      },
      {
        path: 'rform',
        name: '报表',
        meta: { title: '报表', icon: 'rform' },
        children: [
          {
            path: 'cost',
            name: '成本费用表',
            meta: { title: '成本费用表' },
            component: () => import('@/views/finance/rform/cost/index'),
          },
          {
            path: 'property',
            name: '资产负债表',
            meta: { title: '资产负债表' },
            component: () => import('@/views/finance/rform/property/index'),
          },
          {
            path: 'balance',
            name: '科目余额表',
            meta: { title: '科目余额表' },
            component: () => import('@/views/finance/rform/balance/index'),
          },
          {
            path: 'profit',
            name: '利润表',
            meta: { title: '利润表' },
            component: () => import('@/views/finance/rform/profit/index'),
          },
          {
            path: 'cash-flow',
            name: '现金流量表',
            meta: { title: '现金流量表' },
            component: () => import('@/views/finance/rform/cash-flow/index'),
          },
        ]
      },
      {
        path: 'voucher',
        name: '凭证',
        component: () => import('@/views/finance/voucher/index'),
        meta: { title: '凭证', icon: 'voucher' },
        children: [
          {
            path: 'list',
            name: '常用凭证',
            meta: { title: '凭证列表' },
            component: () => import('@/views/finance/voucher/list/index'),
          },
          {
            path: 'detail',
            name: '查看凭证',
            meta: { title: '查看凭证' },
            component: () => import('@/views/finance/voucher/detail/index'),
          },
          {
            path: 'input',
            name: '录入凭证',
            meta: { title: '录入凭证' },
            component: () => import('@/views/finance/voucher/input/index'),
          }
        ]
      },
      {
        path: 'rform-setting',
        name: '报表设置',
        meta: { title: '报表设置', icon: 'r-setting' },
        children: [
          {
            path: 'cash-flow',
            name: '现金流量表',
            meta: { title: '现金流量表' },
            component: () => import('@/views/finance/rform-setting/cash-flow/index'),
          },
          {
            path: 'profit',
            name: '利润表',
            meta: { title: '利润表' },
            component: () => import('@/views/finance/rform-setting/profit/index'),
          },
          {
            path: 'property',
            name: '资产负债表',
            meta: { title: '资产负债表' },
            component: () => import('@/views/finance/rform-setting/property/index'),
          }
        ]
      },
      {
        path: 'setting',
        name: '科目设置',
        component: () => import('@/views/finance/setting/index'),
        meta: { title: '科目设置', icon: 'setting' },
        children: [
          {
            path: 'input',
            name: '期初录入',
            meta: { title: '期初录入' },
            component: () => import('@/views/finance/setting/input/index'),
          },
          {
            path: 'subject',
            name: '科目设置',
            meta: { title: '科目设置' },
            component: () => import('@/views/finance/setting/subject/index'),
          }
        ]
      },
    ]
  },
  {
    path: '/company',
    name: '项目管理',
    meta: { title: '项目管理', icon: 'company' },
    component: Layout,
    alwaysShow: true,
    children: [
      {
        path: 'list',
        component: () => import('@/views/company/list/index'),
        name: '项目列表',
        meta: { title: '项目列表', icon: 'list' }
      }
    ]
  },
  {
    path: '/user-ad',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: '个人中心',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: '字典数据',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})