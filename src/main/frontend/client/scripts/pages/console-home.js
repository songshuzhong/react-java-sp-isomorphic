import React, { Component } from 'react';
import { Container } from 'epm-ui';

import { RenderRoutes } from '../../../config/router-utils/index';

/**
 *@author xumeng
 *@mailTo <a href="mailto:xumeng@bonc.com.cn">xumeng</a>
 *@Date 2018/1/10.
 *@desc 控制台界面
 */

class ConsoleHome extends Component {
  constructor( props ) {
    super( props );
    this.state={};
  }

  render() {

    return (
      <Container type="fluid">
        <RenderRoutes routes={ this.props.routes } />
      </Container>
    )
  }
}

export { ConsoleHome };
export default ConsoleHome;
