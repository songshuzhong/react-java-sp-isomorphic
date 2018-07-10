import asyncComponent from './asyncComponent';

import home_routes from './console-routes';
import portal_routes from './portal-routes';

const routes = [
  {
    path: '/home',
    component: asyncComponent( () => import( '../pages/home' ) ),
  },
  {
    path: '/console-home',
    component: asyncComponent( () => import( '../pages/console-home' ) ),
    routes: home_routes
  },
  {
    path: '/',
    component: asyncComponent( () => import( '../components/portal/portal-navigation' ) ),
    routes: portal_routes
  }
];

export default routes;
