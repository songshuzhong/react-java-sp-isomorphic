import React, { Component } from 'react';

import { Row, Col, Table, Column } from 'epm-ui';
import { getDataSource } from '../../utilities/dataSource';

import context from 'context';

/**
 *author: wangxiang
 *desc:  订单审批-审批页面-历史审批意见
 *date:  2018/1/24
 */
class HistApprovalComments extends Component {

  constructor( props ) {
    super( props );

    this.state = { orderId: props.svcOrderId, data: [] };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps( nextProps ) {
    if ( this.props.svcOrderId !== nextProps.svcOrderId ) {
      this.setState( { orderId: nextProps.svcOrderId }, this.fetchData );
    }
  }

  fetchData() {
    getDataSource( `${ context.contextPath }/v1/order/process/svcOrderId/${ this.state.orderId }`, ( data ) => {
      this.setState( { data } );
    } );
  }

  render() {
    return (
      <div style={ { color: '#556a8c' } }>
        <Row style={ { paddingTop: '30px' } }>
          <Col>
            <span>历史审批意见：</span>
          </Col>
        </Row>
        <Row style={ { paddingTop: '12px' } }>
          <Col>
            <Table dataSource={ this.state.data } bgColor={ { head: '#ecf5fe' } } multiLine={ false } textAlign="center" headBolder={ true } striped={ true } complex >
              <Column title="审批人" dataIndex="createBy" scaleWidth="25%" color={ { head: '#556a8c' } } >

              </Column>
              <Column title="审批结果" dataIndex="agreement" scaleWidth="25%" color={ { head: '#556a8c' } }>
                {
                  ( agreement ) => agreement ? '同意' : '不同意'
                }
              </Column>
              <Column title="审批意见" dataIndex="remark" scaleWidth="25%" color={ { head: '#556a8c' } } />
              <Column title="审批时间" dataIndex="createDate" scaleWidth="25%" color={ { head: '#556a8c' } } />
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export { HistApprovalComments };
export default HistApprovalComments;
