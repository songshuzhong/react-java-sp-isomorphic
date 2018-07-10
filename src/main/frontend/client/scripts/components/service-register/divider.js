import React, { Component } from 'react';

import { Col } from 'epm-ui';

import uuid from '../../utilities/uuid';

/**
 *@author sshuzhong
 *@mailTo <a href="mailto:songshuzhong@bonc.com.cn">Song ShuZhong</a>
 *@Date 2017/12/18
 *@desc 新增服务-分隔符
 */
class ServiceAddDivider extends Component {
  /**
   * render
   */
  render() {

    return (
      <Col key="ServiceAddDivider" size={ { normal: 24, small: 24, medium: 24, large: 24 } }>
        <div style={ { color: '#0070d2', display: 'flex', alignItems: 'center' } }>
          <div style={ { width: '3px', height: '32px', margin: '5px', backgroundColor: '#0070d2' } } />
          <div style={ { fontFamily: 'MicrosoftYaHei', fontWeight: 400, fontStyle: 'normal', fontSize: '16px' } }>{ this.props.title }</div>
        </div>
        <div style={ { width: '100%', height: '2px', marginBottom: '15px', backgroundColor: 'grey' } } />
      </Col>
    );
  }
}

export { ServiceAddDivider };
export default ServiceAddDivider;
