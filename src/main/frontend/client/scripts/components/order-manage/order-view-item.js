import React, { Component } from 'react';

import { Row, Col, Numeric } from 'epm-ui';

/**
 *author: wangxiang
 *desc:  租户管理-订单管理-查看-item
 *date:  2018/1/17
 */
class OrderViewItem extends Component {

  constructor( props ) {
    super( props );
  }

  render() {
    const { label, content, padBottom, padTop, labelSize, contentSize, labelPadLeft } = this.props;

    return (
      <Row style={ { paddingBottom: padBottom ? padBottom : '6px', paddingTop: padTop } }>
        <Col size={ labelSize ? labelSize : 6 } style={ { textAlign: 'right', paddingLeft: labelPadLeft ? labelPadLeft : '' } }>
          <span style={ { color: labelSize ? '#18335b' :'#556a8c' } }>{ label }：</span>
        </Col>
        <Col size={ contentSize ? contentSize : 18 }>
          <span style={ { color: '#18335b' } }>
            {
              label === '总费用' && content !== '' ?
                <Numeric isThousand={ true } textAlign="left" color="red" suffix="&nbsp;元">{ content }</Numeric> : content
            }
            </span>
        </Col>
      </Row>
    );
  }
}

export { OrderViewItem };
export default OrderViewItem;
