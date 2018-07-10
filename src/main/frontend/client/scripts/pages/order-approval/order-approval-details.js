import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Button, Row, Col, Container } from 'epm-ui';

import ApprovalDetails from '../../components/order-approval/approval-details';
import HistApprovalComments from '../../components/order-approval/hist-approval-comments';

/**
 *author: wangxiang
 *desc:  订单审批-订单详情
 *date:  2018/1/23
 */
class OrderApprovalDetails extends Component {

  constructor( props ) {
    super( props );

    this.state = { svcOrderId: props.match.params.svcOrderId };
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.match.params.svcOrderId !== this.props.match.params.svcOrderId ) {
      this.setState( { svcOrderId: nextProps.match.params.svcOrderId } );
    }
  }

  render() {
    return (
      <Container type="fluid">
        <br />
        <Row>
          <Col>
            <div style={ {  width: '100%', height: '30px', borderLeft: '3px solid #0170D3', paddingTop: '3px' } }>
              <span style={ {  fontSize: '16px', color: '#0070D2', margin: '0 28px 0 10px' } }>订单详情</span>
            </div>
            <hr style={ { margin: '10px 0 14px 0', borderTop: '2px solid #f5f5f5' } } />
          </Col>
        </Row>
        <Row>
          <Col>
            <ApprovalDetails svcOrderId={ this.state.svcOrderId } />
          </Col>
        </Row>
        <Row>
          <Col>
            <HistApprovalComments svcOrderId={ this.state.svcOrderId } />
          </Col>
        </Row>
        <Row style={ { textAlign: 'right',  paddingTop: '30px', paddingBottom: '30px' } }>
          <Col>
            <Link to={ `/console-home/order-approval` } ><Button type="default">返回</Button></Link>
          </Col>
        </Row>
      </Container>
    );
  }
}

export { OrderApprovalDetails };
export default OrderApprovalDetails;
