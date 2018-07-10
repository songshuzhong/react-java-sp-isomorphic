import React, { Component } from 'react';

import { Row, Col, Container } from 'epm-ui';

import ApprovalDetails from '../../components/order-approval/approval-details';
import HistApprovalComments from '../../components/order-approval/hist-approval-comments';
import ApprovalResultsComments from '../../components/order-approval/approval-results-comments';

/**
 *author: wangxiang
 *desc:  订单审批-审批页面
 *date:  2018/1/23
 */
class OrderApprovalForm extends Component {

  constructor( props ) {
    super( props );

    this.state = { svcOrderId: props.match.params.svcOrderId, taskId: props.match.params.taskId };
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.match.params.svcOrderId !== this.props.match.params.svcOrderId && nextProps.match.params.taskId !== this.props.match.params.taskId ) {
      this.setState( { svcOrderId: nextProps.match.params.svcOrderId, taskId: nextProps.match.params.taskId } );
    }

  }

  render() {
    return (
      <Container type="fluid">
        <br />
        <Row>
          <Col>
            <div style={ {  width: '100%', height: '30px', borderLeft: '3px solid #0170D3', paddingTop: '3px' } }>
              <span style={ {  fontSize: '16px', color: '#0070D2', margin: '0 28px 0 10px' } }>订单审批</span>
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
        <ApprovalResultsComments svcOrderId={ this.state.svcOrderId } taskId={ this.state.taskId } />
      </Container>
    );
  }
}

export { OrderApprovalForm };
export default OrderApprovalForm;
