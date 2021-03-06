export default [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    locale: 'menu.dashboard',
    children: [
      {
        path: '/dashboard/analysis',
        name: '分析页',
        exact: true,
        locale: 'menu.dashboard.analysis',
      },
      {
        path: '/dashboard/monitor',
        name: '监控页',
        exact: true,
        locale: 'menu.dashboard.monitor',
      },
      {
        path: '/dashboard/workplace',
        name: '工作台',
        exact: true,
        locale: 'menu.dashboard.workplace',
      },
    ],
  },
  {
    path: '/form',
    icon: 'form',
    name: '表单页',
    locale: 'menu.form',
    children: [
      {
        path: '/form/basic-form',
        name: '基础表单',
        exact: true,
        locale: 'menu.form.basicform',
      },
      {
        path: '/form/step-form',
        name: '分步表单',
        hideChildrenInMenu: true,
        locale: 'menu.form.stepform',
        children: [
          {
            path: '/form/step-form/info',
            name: '分步表单（填写转账信息）',
            exact: true,
            locale: 'menu.form.stepform.info',
          },
          {
            path: '/form/step-form/confirm',
            name: '分步表单（确认转账信息）',
            exact: true,
            locale: 'menu.form.stepform.confirm',
          },
          {
            path: '/form/step-form/result',
            name: '分步表单（完成）',
            exact: true,
            locale: 'menu.form.stepform.result',
          },
        ],
      },
      {
        path: '/form/advanced-form',
        name: '高级表单',
        authority: ['admin'],
        exact: true,
        locale: 'menu.form.advancedform',
      },
    ],
  },
  {
    path: '/list',
    icon: 'table',
    name: '列表页',
    locale: 'menu.list',
    children: [
      {
        path: '/list/table-list',
        name: '查询表格',
        exact: true,
        locale: 'menu.list.searchtable',
      },
      {
        path: '/list/basic-list',
        name: '标准列表',
        exact: true,
        locale: 'menu.list.basiclist',
      },
      {
        path: '/list/card-list',
        name: '卡片列表',
        exact: true,
        locale: 'menu.list.cardlist',
      },
      {
        path: '/list/search',
        name: '搜索列表',
        locale: 'menu.list.searchlist',
        children: [
          {
            path: '/list/search/articles',
            name: '搜索列表（文章）',
            exact: true,
            locale: 'menu.list.searchlist.articles',
          },
          {
            path: '/list/search/projects',
            name: '搜索列表（项目）',
            exact: true,
            locale: 'menu.list.searchlist.projects',
          },
          {
            path: '/list/search/applications',
            name: '搜索列表（应用）',
            exact: true,
            locale: 'menu.list.searchlist.applications',
          },
        ],
      },
    ],
  },
  {
    path: '/profile',
    name: '详情页',
    icon: 'profile',
    locale: 'menu.profile',
    children: [
      {
        path: '/profile/basic',
        name: '基础详情页',
        exact: true,
        locale: 'menu.profile.basic',
      },
      {
        path: '/profile/advanced',
        name: '高级详情页',
        authority: ['admin'],
        exact: true,
        locale: 'menu.profile.advanced',
      },
    ],
  },
  {
    name: '结果页',
    icon: 'check-circle-o',
    path: '/result',
    locale: 'menu.result',
    children: [
      {
        path: '/result/success',
        name: '成功页',
        exact: true,
        locale: 'menu.result.success',
      },
      {
        path: '/result/fail',
        name: '失败页',
        exact: true,
        locale: 'menu.result.fail',
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: '/exception',
    locale: 'menu.exception',
    children: [
      {
        path: '/exception/403',
        name: '403',
        exact: true,
        locale: 'menu.exception.not-permission',
      },
      {
        path: '/exception/404',
        name: '404',
        exact: true,
        locale: 'menu.exception.not-find',
      },
      {
        path: '/exception/500',
        name: '500',
        exact: true,
        locale: 'menu.exception.server-error',
      },
      {
        path: '/exception/trigger',
        name: '触发错误',
        hideInMenu: true,
        exact: true,
        locale: 'menu.exception.trigger',
      },
    ],
  },
  {
    name: '个人页',
    icon: 'user',
    path: '/account',
    locale: 'menu.account',
    children: [
      {
        path: '/account/center',
        name: '个人中心',
        locale: 'menu.account.center',
        children: [],
      },
      {
        path: '/account/settings',
        name: '个人设置',
        locale: 'menu.account.settings',
        children: [],
      },
    ],
  },
];

// // 路由的格式
// {
//     "path": "/form/advanced-form",  // 路由路径
//     "name": "高级表单",                // 路由名称
//     "icon": "",                         // 路由图标
//     "authority": ["admin"],             // 哪些角色可以看到该路由
//     "exact": true,                      // 路由的exact属性
//     "children": [],                     // 子路由
//   }
// locale选项不需要
