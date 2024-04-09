import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '日程管理 demo',
  },
  routes: [
    {
      path: '/',
      redirect: '/schedule',
    },
    {
      name: '日程管理',
      path: '/schedule',
      component: './ScheduleManagement',
    },
    // {
    //   name: '首页',
    //   path: '/home',
    //   component: './Home',
    // },
    // {
    //   name: '权限演示',
    //   path: '/access',
    //   component: './Access',
    // },
    // {
    //   name: ' CRUD 示例',
    //   path: '/table',
    //   component: './Table',
    // },
  ],
  npmClient: 'pnpm',
});
