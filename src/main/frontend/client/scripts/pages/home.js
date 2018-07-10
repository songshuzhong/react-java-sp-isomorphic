import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import context from 'context';

/**
 * Home
 */
class Home extends Component {

  /**
   *
   * @returns {XML}
   */
  render() {
    return (
      <div className="bc-hm-content">
        <ul>
          <li><Link to={ '/app' }>app</Link></li>
          <li><a href={ `${ context.contextPath }/v1/page/addModule/1` }>redirect to addModule.</a></li>
          <li><a href={ `${ context.contextPath }/v1/page/moduleClassify` }>redirect to moduleClassify.</a></li>
          <li><a href={ `${ context.contextPath }/v1/page/moduleShow` }>redirect to moduleShow.</a></li>
          <li><a href={ `${ context.contextPath }/v1/pageType/pageTypes` }>redirect to pageTypes.</a></li>
          <li><a href={ `${ context.contextPath }/v1/page/pageModules` }>redirect to pageModules.</a></li>
          <li><a href={ `${ context.contextPath }/v1/page/pageVisualize` }>redirect to pageVisualize.</a></li>
          <li><a href={ `${ context.contextPath }/v1/pageModel/pageTemplate/2c90bf116348142b0163482334d40001` }>redirect to pageTemplate.</a></li>
          { this.props.children }
        </ul>
        <img src={ `${ context.contextPath }/static/img/nodejs.png` } />
      </div>
    );
  }
}

export { Home };
export default Home;
