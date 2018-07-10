import React from 'react';
import { RenderRoutes } from '../../config/router-utils/index';

import routes from './config/routes';

import '../styles/pages/nprogress.less';
import '../styles/theme.less';

/**
 *@author sshuzhong
 *@mailTo <a href="mailto:songshuzhong@bonc.com.cn">Song ShuZhong</a>
 *@Date 2017/08/10
 *@desc 首页
 */
const App = ( { initialState } ) => {
  return (
    <div>
      <RenderRoutes routes={ routes } initialState={ initialState } autoLoadData />
    </div>
  );
};

export { App };
export default App;
