import asyncComponent from '../config/asyncComponent';

const portal_routes = [

  //门户 首页
  {
    path: '/portal/index',
    component: asyncComponent( () => import( '../pages/portal/portal' ) )
  },
  //服务介绍
  {
    path: '/portal/service-introduction/:svcCode',
    component: asyncComponent( () => import( '../pages/portal/service-introduction' ) )
  },

  //服务申请
  {
    path: '/portal/order-result/:waysType/:orderId',
    component: asyncComponent( () => import( '../components/service-package/order-result' ) )
  },
  {
    path: '/portal/service-apply/:svcId/:pkId',
    component: asyncComponent( () => import( '../components/service-apply/service-apply' ) )
  },

  //门户 第一次加载（访问 http://localhost:8082/bconsole/）
  {
    path: '/',
    component: asyncComponent( () => import( '../pages/portal/portal' ) )
  }
];

export default portal_routes;
