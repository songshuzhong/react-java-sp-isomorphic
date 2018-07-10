import asyncComponent from '../config/asyncComponent';

// 服务注册
let service_manage_routes = [
  {
    path: '/console-home/service-manage',
    component: asyncComponent( () => import( '../pages/service-manage' ) )
},
{
  path: '/console-home/service-register',
      component: asyncComponent( () => import( '../pages/service-register' ) )
},
{
  path: '/console-home/service-temporary',
      component: asyncComponent( () => import( '../pages/service-temporary' ) )
},
{
  path: '/console-home/service-details',
      component: asyncComponent( () => import( '../pages/service-details' ) )
},
{
  path: '/console-home/service-config-list',
      component: asyncComponent( () => import( '../pages/service-config-list' ) )
}
];

//服务提供方
let service_provider_routes = [
  {
    path: '/console-home/service-provider',
    component: asyncComponent( () => import( '../pages/service-provider') )
},
{
  path: '/console-home/quota-manage',
      component: asyncComponent( () => import( '../pages/quota-manage' ) )
}
];

// 服务实例
let service_instance_routes = [
  {
    path: '/console-home/service-instance-manage/:svcId',
    component: asyncComponent( () => import( '../pages/service-instance-manage' ) )
},
{
  path: '/console-home/service-instance/:svcId/:svcName',
      component: asyncComponent( () => import( '../pages/service-instance' ) ),
  routes: [
    {
      path: '/console-home/service-instance/:svcId/:svcName/instance-list',
      component: asyncComponent( () => import( '../components/service-instance/instance-list' ) )
},
  {
    path: '/console-home/service-instance/:svcId/:svcName/instance-delete',
        component: asyncComponent( () => import( '../components/service-instance/instance-delete' ) )
  }
]
}
];

//属性库管理
const props_library_routes = [
  {
    path: '/console-home/props-library',
    component: asyncComponent( () => import( '../pages/props-library' ) )
}
];

//服务分类
const service_cata_routes = [
  {
    path: '/console-home/service-category',
    component: asyncComponent( () => import( '../pages/service-category' ) )
}
];

//订单申请
const order_approval_routes = [
  {
    path: '/console-home/order-approval',
    component: asyncComponent( () => import( '../pages/order-approval/order-approval' ) )
}
,
{
  path: '/console-home/order-approval-form/:svcOrderId/:taskId',
      component: asyncComponent( () => import( '../pages/order-approval/order-approval-form' ) )
},
{
  path: '/console-home/order-approval-details/:svcOrderId',
      component: asyncComponent( () => import( '../pages/order-approval/order-approval-details' ) )
}
];

//订单管理
const order_manage_routes = [
  {
    path: '/console-home/tenant/order-manage/:instanceId?',
    component: asyncComponent( () => import( '../pages/order-manage/tenant-order-manage' ) )
},
{
  path: '/console-home/admin/order-manage/:instanceId?',
      component: asyncComponent( () => import( '../pages/order-manage/admin-order-manage' ) )
}
];

//用户组管理
const user_group_routes = [
  {
    path: '/console-home/user-group-manage',
    component: asyncComponent( () => import( '../pages/user-group-manage' ) )
}
];

//定时任务管理
const scheduler_task_routes = [
  {
    path: '/console-home/scheduler-task-manage',
    component: asyncComponent( () => import( '../pages/scheduler-task-manage' ) )
}
];

// 服务套餐路由
let service_package_routes = [
  {
    path: '/console-home/service-package-add/:svcId',
    component: asyncComponent( () => import( '../components/service-package/package-add' ) )
},
{
  path: '/console-home/service-package-edit/:svcId/:pkId',
      component: asyncComponent( () => import( '../components/service-package/package-edit' ) )
},
{
  path: '/console-home/service-package-detail/:svcId',
      component: asyncComponent( () => import( '../components/service-package/package-details' ) )
}
];

// 服务拓展属性路由
let service_expand_routes = [
  {
    path: '/console-home/service-expands',
    component: asyncComponent( () => import( '../pages/service-expands' ) )
}
];

let home_routes = service_manage_routes.concat( service_provider_routes, service_instance_routes, props_library_routes, service_cata_routes, order_approval_routes, order_manage_routes, user_group_routes, scheduler_task_routes, service_package_routes, service_expand_routes );

export default home_routes;