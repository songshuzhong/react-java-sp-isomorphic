/**
 * Created by Steven Song on 2017/11/23.
 */
module.exports = {
  js: 'main',
  cs: 'main',
  title: 'bconsole',
  contextPath: '/bconsole',
  moniterPath: 'http://localhost',
  //casPath: 'http://localhost:8082',
  casPath: 'http://bconsole.bonc.pro',
  static: true,
  extLibs: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'prop-types': 'PropTypes',
    'react-dom/server': 'ReactDOMServer',
    'react-router': 'ReactRouter',
    'react-router-dom': 'ReactRouterDOM',
    'react-router/server': 'ReactRouterServer',
    'epm-ui': 'EPMUI',
    'moment': 'Moment'
  }
};
