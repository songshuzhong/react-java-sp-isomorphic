import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Container, Row, Col, Button, Icon } from 'epm-ui';

import { getDataSource } from '../../utilities/dataSource';
import context from 'context';

/**
 *author: wangxiang
 *desc:  服务申请-订单结果
 *date:  2018/1/22
 */
class OrderResult extends Component {

  constructor( props ) {
    super( props );

    this.state = {
      waysType: props.match.params.waysType,
      orderId: props.match.params.orderId,
      orderLists: null
    };
  }

  componentDidMount() {
    let orderId = this.state.orderId;
    if( orderId ) {
      getDataSource( `${ context.contextPath }/v1/svcorders/apply/payinvoke/${ orderId }`, ( orderLists ) => {
        this.setState( { orderLists } );
      } );
    }
  }

  handlePay() {
    this.refs.pay.submit();
  }

  render() {
    let orderLists = this.state.orderLists;

    return (
      <Container type="fluid" style={ { padding: '100px 1% 0 1%' } }>
        <Row style={ { margin: 0 } }>
          <Col>
            <div style={ {  width: '100%', height: '30px', borderLeft: '3px solid #0170D3', paddingTop: '3px' } }>
              <span style={ {  fontSize: '16px', color: '#0070D2', margin: '0 28px 0 10px' } }>订单结果</span>
            </div>
            <hr style={ { margin: '10px 0 14px 0', borderTop: '2px solid #f5f5f5' } } />
          </Col>
        </Row>
        <Row style={ { margin: 0 } }>
          <Col>
            {
              Number( this.state.waysType ) === 10 ?
                <div style={ { textAlign: 'center' } }>
                  <p><Icon icon="check" style={ { color: '#0070D2', fontSize: '16px' } } />&nbsp;订单提交成功，正在审批中，您可以在&nbsp;<a style={ { textDecoration: 'none' } } href={ `${ context.casPath }/portal/pageView?pageId=index&url=${ context.casPath }/bconsole/console-home/tenant/order-manage` } >订单管理</a>&nbsp;中查看订单</p>
                </div> :
                Number( this.state.waysType ) === 20 ?
                  <div style={ { textAlign: 'center' } }>
                    <p><Icon icon="check" style={ { color: '#0070D2', fontSize: '16px' } } />&nbsp;订单提交成功，请您及时支付，您也可以在&nbsp;<a style={ { textDecoration: 'none' } } href={ `${ context.casPath }/portal/pageView?pageId=index&url=${ context.casPath }/bconsole/console-home/tenant/order-manage` } >订单管理</a>&nbsp;中查看订单</p>
                    <Button type="primary" onClick={ this.handlePay.bind( this ) }>去支付</Button>
                  </div> :
                  Number( this.state.waysType ) === 30 ?
                    <div style={ { textAlign: 'center' } }>
                      <p><Icon icon="check" style={ { color: '#0070D2', fontSize: '16px' } } />&nbsp;订单提交成功，服务开通中，您可以在&nbsp;<a style={ { textDecoration: 'none' } } href={ `${ context.casPath }/portal/pageView?pageId=index&url=${ context.casPath }/bconsole/console-home/tenant/order-manage` } >订单管理</a>&nbsp;中查看订单</p>
                    </div> : null
            }
          </Col>
        </Row>
        <div style={ { display: 'none' } }>
          <form action={ orderLists ? orderLists.url : null }  acceptCharset="GBK" ref="pay" method="get" >
            <input type="hidden" name="appid"   value={  orderLists ? orderLists.appid : ''  }/>
            <input type="hidden" name="orderno" value={  orderLists ? orderLists.orderno : ''  }/>
            <input type="hidden" name="amount"  value={  orderLists ? orderLists.amount : ''  }/>
            <input type="hidden" name="orderdesc" value={  orderLists ? orderLists.orderdesc : ''  }/>
            <input type="hidden" name="pageNotifyURL" value={  orderLists ? orderLists.pageNotifyURL : ''  }/>
            <input type="hidden" name="bgNotifyURL" value={  orderLists ? orderLists.bgNotifyURL : ''  }/>
            <input type="hidden" name="methodMeri" value={  orderLists ? orderLists.methodMeri : ''  }/>
            <input type="hidden" name="accessType" value={  orderLists ? orderLists.accessType : ''  }/>
            <input type="hidden" name="sign" value={  orderLists ? orderLists.sign : ''  }/>
            <input type="hidden" name="version" value={  orderLists ? orderLists.version : ''  }/>
            <input type="hidden" name="encoding" value={  orderLists ? orderLists.encoding : ''  }/>
          </form>
        </div>
      </Container>
    );
  }
}

export { OrderResult };
export default OrderResult;
