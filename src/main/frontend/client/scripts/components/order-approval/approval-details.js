import React, { Component } from 'react';

import { Row, Col, Table, Column, Loading } from 'epm-ui';
import { orderStateConvert, waysTypeConvert } from '../../components/commons/dynamicConvert';
import { getDataSource } from '../../utilities/dataSource';
import getUUID from '../../utilities/uuid';

import context from 'context';

/**
 *author: wangxiang
 *desc:  订单审批-审批页面-详情
 *date:  2018/1/23
 */
class ApprovalDetails extends Component {

  constructor( props ) {
    super( props );

    this.state = { orderId: props.svcOrderId, data: {} };
    this.fetchData = this.fetchData.bind( this );
    this.getArray = this.getArray.bind( this );
    this.getElements = this.getElements.bind( this );
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
    getDataSource( `${ context.contextPath }/v1/svcorders/${ this.state.orderId }`, ( data ) => {
      this.setState( { data }, this.getArray );
    } );
  }

  getElements( list ) {
    let array = [];
    for ( let item of list ) {
      array.push(
        <p key={ getUUID() }>
          <span>{ item.attrName }：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>{ `${ item.valueObject }${ item.metadataUnit != null ? item.metadataUnit : '' }` }</span>
        </p>
      );
    }
    return array;
  }

  getArray() {
    const { svcName, cOrderWaysInfo, detailList, controlList, approvalInfo } = this.state.data;
    const array = [
      {
        svcName,
        detailList,
        waysType : cOrderWaysInfo ? waysTypeConvert( cOrderWaysInfo.waysType ) : '',
        approvalInfo,
        controlList
      }
    ];
    this.setState( { array } );
  }

  render() {
    const { orderNo, createBy, createDate, orderState } = this.state.data;

    return (
      <div style={ { color: '#556a8c' } }>
        {
          orderNo ?
            <div>
              <Row style={ { paddingTop: '8px' } }>
                <Col size={ 5 } >
                  <span>订单编号：{ orderNo }</span>
                </Col>
                <Col size={ 5 } >
                  <span>订单申请人：{ createBy }</span>
                </Col>
                <Col size={ 6 } >
                  <span>订单提交时间：{ createDate }</span>
                </Col>
                <Col size={ 5 } >
                  <span>订单状态：{ orderStateConvert( orderState ) }</span>
                </Col>
              </Row>
              <Row style={ { paddingTop: '12px' } }>
                <Col>
                  <Table dataSource={ this.state.array } bgColor={ { head: '#ecf5fe' } } multiLine textAlign="center" headBolder={ true } striped={ true } complex >
                    <Column title="产品名称" dataIndex="svcName" scaleWidth="15%" color={ { head: '#556a8c' } } />
                    <Column title="基本配置" dataIndex="detailList" scaleWidth="30%" color={ { head: '#556a8c' } } >
                      {
                        ( detailList ) => this.getElements( detailList )
                      }
                    </Column>
                    <Column title="计费方式" dataIndex="waysType" scaleWidth="15%" color={ { head: '#556a8c' } } />
                    <Column title="审批流程" dataIndex="approvalInfo" scaleWidth="20%" color={ { head: '#556a8c' } } >
                      {
                        ( approvalInfo ) =>  approvalInfo ? <div style={ { padding: '0.5rem 0', maxWidth: '90%' } }><a style={ { textDecoration: 'none' } } href={ `${ approvalInfo.monitorProcessUrl }` } target="_blank" >{ approvalInfo.modelName }</a></div> : ''
                      }
                    </Column>
                    <Column title="购买量" dataIndex="controlList" scaleWidth="20%" color={ { head: '#556a8c' } } >
                      {
                        ( controlList ) => this.getElements( controlList )
                      }
                    </Column>
                  </Table>
                </Col>
              </Row>
            </div> : <div style={ { paddingTop: '60px' } }><Loading type="primary" /></div>
        }
      </div>
    );
  }
}

export { ApprovalDetails };
export default ApprovalDetails;
