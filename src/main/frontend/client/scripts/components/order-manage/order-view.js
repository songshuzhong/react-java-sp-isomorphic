import React, { Component } from 'react';

import { Container, Row, Col, Loading } from 'epm-ui';
import { getDataSource } from '../../utilities/dataSource';
import getUUID from '../../utilities/uuid';
import { orderStateConvert, waysTypeConvert } from '../../components/commons/dynamicConvert';

import OrderViewItem from './order-view-item';

import context from 'context';

/**
 *author: wangxiang
 *desc: 租户管理-订单管理-查看
 *date:  2018/1/15
 */
class OrderView extends Component {

  constructor( props ) {
    super( props );

    this.state = { orderId: props.orderId, data: {} };
    this.fetchData = this.fetchData.bind( this );
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps( nextProps ) {
    if ( this.props.orderId !== nextProps.orderId ) {
      this.setState( { data: {} } );
      this.setState( { orderId: nextProps.orderId }, this.fetchData );
    }
  }

  fetchData() {
    getDataSource( `${ context.contextPath }/v1/svcorders/${ this.state.orderId }`, ( data ) => {
      this.setState( { data } );
    } );
  }

  render() {
    const { orderNo, createBy, createDate, svcName, cOrderWaysInfo, orderState, orderPrice, detailList, controlList, approvalInfo } = this.state.data;

    let price = null;

    if ( cOrderWaysInfo ) {

      if ( Number( cOrderWaysInfo.waysType ) === 10 ) { //审批
        price = '';
      } else if ( Number( cOrderWaysInfo.waysType ) === 30 ) { //自动开通（免费）
        price = 0.0;
      }
    }

    return (
      <Container type="fluid" style={ { marginTop: '-6px', marginBottom: '-6px' } }>
        {
          orderNo ?
            <div>
              <OrderViewItem label="订单编号" content={ orderNo } />
              <OrderViewItem label="订单申请人" content={ createBy } />
              <OrderViewItem label="订单提交时间" content={ createDate } />
              <OrderViewItem label="服务名称" content={ svcName } />

              <Row style={ { paddingBottom: '6px' } }>
                <Col size={ 6 } style={ { textAlign: 'right' } }>
                  <span style={ { color: '#556a8c' } }>基本配置：</span>
                </Col>

                <Col size={ 18 } style={ { padding: '0 0' } }>
                  {
                    detailList ? detailList.map( ( item, index ) => {

                      return (
                        <OrderViewItem key={ getUUID() } label={ item.attrName } content={ `${ item.valueObject }${ item.metadataUnit != null ? item.metadataUnit : '' }` } labelSize={ 7 } contentSize={ 17 } labelPadLeft="0" />
                      );
                    } ) : null
                  }
                </Col>
              </Row>
              <Row style={ { paddingBottom: '6px' } }>
                <Col size={ 6 } style={ { textAlign: 'right' } }>
                  <span style={ { color: '#556a8c' } }>购买量：</span>
                </Col>

                <Col size={ 18 } style={ { padding: '0 0' } }>
                  {
                    controlList ? controlList.map( ( item, index ) => {

                      return (
                        <OrderViewItem key={ getUUID() } label={ item.attrName } content={ `${ item.valueObject }${ item.metadataUnit != null ? item.metadataUnit : '' }` } labelSize={ 7 } contentSize={ 17 } labelPadLeft="0" />
                      );
                    } ) : null
                  }
                </Col>
              </Row>
              <OrderViewItem label="计费方式" content={ cOrderWaysInfo ? waysTypeConvert( cOrderWaysInfo.waysType ) : '' } />
              {
                cOrderWaysInfo && Number( cOrderWaysInfo.waysType ) === 10 ? <OrderViewItem label="审批流程" content={ approvalInfo ? approvalInfo.modelName : '' } /> : null
              }
              <OrderViewItem label="总费用" content={ price !== null ? price : orderPrice } />
              <OrderViewItem label="订单状态" content={ orderStateConvert( orderState ) } padBottom="0px" />
            </div> : <div style={ { height: '350px' } }><Loading type="primary" size="large" /></div>
        }
      </Container>
    );
  }
}

export { OrderView };
export default OrderView;
