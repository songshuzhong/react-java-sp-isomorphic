import React, { Component } from 'react';

import { Container, Tabs, Tab, Row, Col } from 'epm-ui';

import ApprovedOrder from "../../components/order-approval/approved-order";
import UnapprovedOrder from "../../components/order-approval/unapprove-order";


/**
 *author: wangxiang
 *desc:  订单审批
 *date:  2018/1/22
 */
class OrderApproval extends Component {

  constructor( props ) {
    super( props );

    this.state = {};
  }

  render() {
    return (
      <Container type="fluid">
        <br />
        <Row>
          <Col>
            <Tabs>
              <Tab title="待审批"><UnapprovedOrder /></Tab>
              <Tab title="已审批"><ApprovedOrder /></Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    );
  }
}

export { OrderApproval };
export default OrderApproval;
