import React, { Component } from 'react';

import PortalCarousel from '../../components/portal/portal-carousel';
import ServicePanel from '../../components/portal/service-panel';

import context from 'context';

/**
 *author: wangxiang
 *desc:  门户首页
 *date:  2018/1/3
 */
class Portal extends Component {

  constructor( props ) {
    super( props );
  }

  /**
   *
   * @returns {XML}
   */
  render() {
    return (
      <div>
        <PortalCarousel />
        <ServicePanel dataSource={ `${ context.contextPath }/v1/svccategorys/services` } />
      </div>
    );
  }
}

export { Portal };
export default Portal;
