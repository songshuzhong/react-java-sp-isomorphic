import React, { Component } from 'react';

import { Container, Button, Row, Col, Input, Table, Column, FormItem, Form, Modal, ModalHeader, ModalBody, Pagination, Loading, Select, DateTimePicker, Icon } from 'epm-ui';

import OrderView from '../../components/order-manage/order-view';
import { orderStateConvert, waysTypeConvert } from '../../components/commons/dynamicConvert';

import { getDataSource } from '../../utilities/dataSource';
import getUUID from '../../utilities/uuid';

import context from 'context';

/**
 *author: wangxiang
 *desc:  租户管理-订单管理
 *date:  2018/1/15
 */
class TenantOrderManage extends Component {

  constructor( props ) {
    super( props );

    this.state = {
      startDate: null,
      endDate: null,
      orderList: {},
      formData: {},
      showView: false,
      pageNo: 1,
      pageSize: 10,
      instanceId: props.match.params.instanceId
    };

    this.disabledStartDate = this.disabledStartDate.bind( this );
    this.disabledEndDate = this.disabledEndDate.bind( this );
    this.onStartChange = this.onStartChange.bind( this );
    this.onEndChange = this.onEndChange.bind( this );
    this.handleResetForm = this.handleResetForm.bind( this );
    this.onFormGetter = this.onFormGetter.bind( this );
    this.handlePagiChange = this.handlePagiChange.bind( this );
    this.onAsyncSubmit = this.onAsyncSubmit.bind( this );
    this.onAfterSubmit = this.onAfterSubmit.bind( this );
    this.fetchOrderList = this.fetchOrderList.bind( this );
  }

  componentDidMount() {
    this.formData = this.getValue();

    this.fetchOrderList();
  }

  // 时间组件相关方法
  disabledStartDate( startDate ) {
    const endDateString = this.state.endDate;

    if ( !endDateString ) {
      return null;
    }

    const endDate = new Date(endDateString);

    return startDate.valueOf() > endDate.valueOf();
  }

  disabledEndDate( endDate ) {
    const startDateString = this.state.startDate;

    if ( !startDateString ) {
      return null;
    }

    const startDate = new Date(startDateString).valueOf();

    return endDate.valueOf() <= startDate;
  }

  onStartChange( startDateString ) {
    this.setState( { startDate: startDateString } );
  }

  onEndChange( endDateString ) {
    this.setState( { endDate: endDateString } );
  }

  handleCloseModal() {
    this.setState( { showView: false } );
  }

  onAsyncSubmit( formData ) {
    formData.pageNo = 1;
    formData.pageSize = 10;

    return formData;
  }

  onAfterSubmit( orderList ) {
    this.setState( { pageNo: 1, pageSize: 10, orderList } );
  }

  handlePagiChange( pageNo, pageSize ) {
    this.setState( { pageNo, pageSize }, this.fetchOrderList );
  }

  fetchOrderList() {
    let param = '';

    this.formData.pageNo = this.state.pageNo;
    this.formData.pageSize = this.state.pageSize;

    if ( this.state.instanceId ) {
      this.formData[ `entity.instanceId` ] = this.state.instanceId;
    }

    for ( let name in this.formData ) {
      param += `${ name }=${ this.formData[ name ] }&`;
    }

    getDataSource(
      {
        url: `${ context.contextPath }/v1/svcorders/page`,
        params: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: param.substring( 0, param.length - 1 ) }
      }, ( orderList ) => this.setState( { orderList } ) );
  }

  onFormGetter( getter ) {
    this.getValue = getter.value;
  }

  handleResetForm( trigger ) {
    this.reset = trigger.reset;
  }

  // 判断订单状态，返回不同的操作按钮
  checkOrderStatus( rowData ) {
    let array = [ <Button key={ getUUID() } shape="icon" type="link" title="查看" onClick={ this.handleViewOrder.bind( this, rowData.orderId ) } ><Icon icon="eye" /></Button> ];

    // 判断 计费方式 是否为审批
    if ( Number( rowData.waysType ) === 10 && rowData.approvalInfo !== null ) {
      array.push( <a href={ `${ rowData.approvalInfo.monitorProcessUrl }` } target="_blank" ><Button key={ getUUID() } shape="icon" type="link" title="跟踪" ><Icon type="crosshairs" /></Button></a> );
    } else {
      array.push( <Button key={ getUUID() } shape="icon" type="link" title="跟踪" disabled ><Icon type="crosshairs" /></Button> );
    }

    // 订单状态为 待支付
    if ( Number( rowData.orderState ) === 10 ) {
      array.push( <Button key={ getUUID() } shape="icon" type="link" title="支付" onClick={ this.payInvoke.bind( this, rowData.orderId ) } ><Icon type="credit-card" /></Button> );
    } else {
      array.push( <Button key={ getUUID() } shape="icon" type="link" title="支付" disabled ><Icon type="credit-card" /></Button> );
    }

    return array;
  }

  payInvoke( orderId ) {
    getDataSource( `${ context.contextPath }/v1/svcorders/apply/payinvoke/${ orderId }`, ( data ) => {
      //console.log(data)
      this.setState( { orderLists: data }, () => { this.refs.pay.submit(); } );
    } );
  }

  handleViewOrder( orderId ) {
    this.setState( { showView: true, orderId: orderId } );
  }
  render() {
    const { pageSize, pageNo, orderList: { total, data } } = this.state;
    let orderLists = this.state.orderLists;

    return (
      <Container type="fluid">
       <Row>
         <br />
         <Col>
           <Row>
             <Form
               method="post"
               async={ true }
               type="inline"
               onSubmit={ this.onAsyncSubmit }
               onAfterSubmit={ this.onAfterSubmit }
               getter={ this.onFormGetter }
               trigger={ this.handleResetForm }
               action={ `${ context.contextPath }/v1/svcorders/page` }
               onChange={ ( formData ) => this.formData = formData }
             >
               <Col size={ 4 }>
                 <FormItem type="inline" name="entity.orderState">
                   <Select dataSource={ `${ context.contextPath }/v1/dictcategorys/order_state/dictdetails/combobox` } placeholder="订单类型" />
                 </FormItem>
               </Col>
               <Col size={ 4 }>
                 <FormItem type="inline" name="entity.waysType">
                   <Select dataSource={ `${ context.contextPath }/v1/dictcategorys/ways_type/dictdetails/combobox` } placeholder="计费方式" />
                 </FormItem>
               </Col>
               <Col size={ 4 }>
                 <FormItem name="entity.startDate">
                   <DateTimePicker showIcon format={ 'YYYY-MM-DD HH:mm:ss' } disabledDate={ this.disabledStartDate } onChange={ this.onStartChange } placeholder="起始时间" />
                 </FormItem>
               </Col>
               <Col size={ 4 }>
                 <FormItem name="entity.endDate">
                   <DateTimePicker showIcon format={ 'YYYY-MM-DD HH:mm:ss' } disabledDate={ this.disabledEndDate } onChange={ this.onEndChange } placeholder="结束时间" />
                 </FormItem>
               </Col>
               <Col size={ 4 }>
                 <FormItem type="inline" name="entity.svcName">
                   <Input placeholder="模糊查询" />
                 </FormItem>
               </Col>
               <Col size={ 4 }>
                 <Button type="default" htmlType="submit">查询</Button>
                 <Button type="default" onClick={ () => { this.reset(); } }>重置</Button>
               </Col>
             </Form>
           </Row>
         </Col>
       </Row>
        <Row>
          {
            data ?
              <Col>
                <Table dataSource={ data } bgColor={ { head: '#ecf5fe' } } multiLine={ false } textAlign="center" headBolder={ true } striped={ true } complex >
                  <Column title="序号" dataIndex="index" scaleWidth="5%" color={ { head: '#18335d' } }>
                    { ( value, index ) => <div style={ { padding: '.5rem .5rem .5rem .9rem' } }>{ 1 + parseInt( index ) + ( ( this.state.pageNo - 1 ) * this.state.pageSize ) }</div> }
                  </Column>
                  <Column title="订单编号" dataIndex="orderNo" scaleWidth="15%" color={ { head: '#18335d' } } />
                  <Column title="服务名称" dataIndex="svcName" scaleWidth="15%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="订单状态" dataIndex="orderState" scaleWidth="10%" color={ { head: '#18335d' } } >
                    {
                      ( orderState ) => {

                          return orderStateConvert( orderState );
                      }
                    }
                  </Column>
                  <Column title="计费方式" dataIndex="waysType" scaleWidth="15%" color={ { head: '#18335d' } } >
                    {
                      ( waysType ) => {

                        return waysTypeConvert( waysType );
                      }
                    }
                  </Column>
                  <Column title="总费用" dataIndex="orderPrice" scaleWidth="10%" color={ { head: '#18335d' } } />
                  <Column title="提交时间" dataIndex="createDate" scaleWidth="15%" color={ { head: '#18335d' } } />
                  <Column title="操作" scaleWidth="15%" dataIndex="" color={ { head: '#18335d' } } >
                    {
                      ( rowData ) => this.checkOrderStatus( rowData )
                    }
                  </Column>
                </Table>
                <br />
               <Pagination
                  index={ pageNo }
                  size={ pageSize }
                  total={ total }
                  align="right"
                  showPagiJump={ true }
                  showDataSizePicker={ true }
                  onChange={ ( pageNo, pageSize ) => this.handlePagiChange( pageNo, pageSize ) }
                />
              </Col> : <Col style={ { paddingTop: '60px' } }><Loading type="primary" size="large" /></Col>
          }
        </Row>
        <Modal visible={ this.state.showView } onClose={ this.handleCloseModal.bind( this ) } >
          <ModalHeader>
            <span style={ { fontSize: '16px' } }>订单详情</span>
          </ModalHeader>
          <ModalBody>
            { this.state.orderId ? <OrderView orderId={ this.state.orderId } /> : null }
          </ModalBody>
        </Modal>

        <div style={ { display: 'none' } }>
          <form action={ orderLists ? orderLists.url : null }  acceptCharset= "GBK" ref="pay" method="get" >
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

export { TenantOrderManage };
export default TenantOrderManage;