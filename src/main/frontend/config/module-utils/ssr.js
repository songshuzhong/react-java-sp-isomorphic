/**
 *@author sshuzhong
 *@mailTo <a href="mailto:songshuzhong@bonc.com.cn">Song ShuZhong</a>
 *@Date 2017/9/25$ 22:00$
 *@desc
 */
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from '../../client/scripts/app';
import Html from './html';

const serverSideRender = ( state, routerCtx ) => (
  '<!DOCTYPE html>' +
  renderToStaticMarkup(
    <Html initialState={ state } routerCtx={ { basename: routerCtx.basename } }>
      {
        renderToString(
          <StaticRouter { ...routerCtx }>
            <App initialState={ state } basename={ routerCtx.basename } />
          </StaticRouter> )
      }
    </Html>
  )
);

export default serverSideRender;
