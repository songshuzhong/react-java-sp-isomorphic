/**
 *@author sshuzhong
 *@mailTo <a href="mailto:songshuzhong@bonc.com.cn">Song ShuZhong</a>
 *@Date 2017/9/25$ 22:00$
 *@desc
 */
import React from 'react';

const contextPathScript = `window.__CONTEXT_PATH__='CONTEXTPATH_SOURCE_PLACEHOLDER';`;
const initScriptTemplate = ( initialState, routerCtx ) => `EPMUIApp.csr(${ initialState }, ${ routerCtx });`;

const Html = ( { initialState, routerCtx, children } ) => {
  return (
    <html lang="zh-cn">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge, chrome=1" />
        <link href="CONTEXTPATH_SOURCE_PLACEHOLDER/static/frame/css/epm-ui.min.css" rel="stylesheet" />
        <link href="STYLESHEET_SOURCE_PLACEHOLDER" rel="stylesheet" />
        <title>{ 'TITLE_SOURCE_PLACEHOLDER' }</title>
      </head>
      <body>
        <div id="react-root" dangerouslySetInnerHTML={ { __html: children } } />
        <script dangerouslySetInnerHTML={ { __html: contextPathScript } } />
        <script src="JAVASCRIPT_SOURCE_PLACEHOLDER" />
        <script dangerouslySetInnerHTML={ { __html: initScriptTemplate( JSON.stringify( initialState ), JSON.stringify( routerCtx ) ) } } />
      </body>
    </html>
  );
};

export { Html };
export default Html;
