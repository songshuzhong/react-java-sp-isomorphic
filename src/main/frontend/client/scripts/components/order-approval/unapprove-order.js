import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Button, Row, Col, Icon, Loading, Pagination, Table, Column, Notification } from 'epm-ui';
import { getDataSource } from '../../utilities/dataSource';
import { popup } from '../../utilities/transient';
import getUUID from '../../utilities/uuid';

import context from 'context';

/**
 *author: wangxiang
 *desc:  订单审批-待审批
 *date:  2018/1/22
 */
class UnapprovedOrder extends Component {

  constructor( props ) {
    super( props );

    this.state = {
      orderList: {},
      data: [],
      pageNo: 1,
      pageSize: 10,
    };

    this.handlePagiChange = this.handlePagiChange.bind( this );
    this.fetchData = this.fetchData.bind( this );
    this.handlePagination = this.handlePagination.bind( this );
  }

  componentDidMount() {
    this.fetchData();
  }

  handlePagiChange( pageNo, pageSize ) {
    this.setState( { pageNo, pageSize }, this.handlePagination );
  }

  fetchData() {
    getDataSource( `${ context.contextPath }/v1/order/process/pending`, ( data ) => {
      this.setState( { data }, this.handlePagination );
    } );
  }

  handlePagination() {
    const modal_data = this.state.data;
    const pageNo = this.state.pageNo;
    const pageSize = this.state.pageSize;
    let len = pageNo * pageSize;
    let data = [];

    if ( pageNo * pageSize > modal_data.length ) {
      len = modal_data.length;
    }

    for ( let i = ( pageNo - 1 ) * pageSize; i < len; i++ ) {
      data.push( modal_data[ i ] );
    }

    this.setState( { orderList: { total: modal_data.length, data: data } } );
  }

  //订单签收和反签收
  claimTask( rowData ) {

      getDataSource( `${ context.contextPath }/v1/order/process/svcOrderId/${ rowData.serviceOrderId }/claimType/${ Number( rowData.assignee ) === 20 ? 10 : 20 }/${ rowData.taskId }`, ( data ) => {

        if ( Number( data.code ) === 201 ) {
          popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ `${ Number( rowData.assignee ) === 20 ? '订单签收成功！' : '订单反签收成功！' }` }/> );
          this.fetchData();
        } else {
          popup( <Notification key={ Math.random().toString() } message="通知" type="error" description={ `${ Number( rowData.assignee ) === 20 ? '订单签收失败！' : '订单反签收失败！' }` } /> );
        }

      } );
  }

  checkButton( rowData ) {
    let array = [];

    // 已签收
    if ( Number( rowData.assignee ) === 10 ) {
      array = [
        <Button key={ getUUID() } shape="icon" type="link" title="签收" disabled ><Icon icon="calendar-check-o" /></Button>,
        <Button key={ getUUID() } shape="icon" type="link" title="反签收" onClick={ this.claimTask.bind( this, rowData ) } ><Icon icon="calendar-times-o" /></Button>,
        <Link to={ `/console-home/order-approval-form/${ rowData.serviceOrderId }/${ rowData.taskId }` } key={ getUUID() } ><Button key={ getUUID() } shape="icon" type="link" title="办理"><Icon icon="check" /></Button></Link>,
        <a href={ `${ rowData.monitorProcessUrl }` } target="_blank" key={ getUUID() } ><Button key={ getUUID() } shape="icon" type="link" title="跟踪" ><Icon type="crosshairs" /></Button></a>
      ];
      
      //默认签收
    } else if ( Number( rowData.assignee ) === 30 ) {
      array = [
        <Button key={ getUUID() } shape="icon" type="link" title="签收" disabled ><Icon icon="calendar-check-o" /></Button>,
        <Button key={ getUUID() } shape="icon" type="link" title="反签收" disabled ><Icon icon="calendar-times-o" /></Button>,
        <Link to={ `/console-home/order-approval-form/${ rowData.serviceOrderId }/${ rowData.taskId }` } key={ getUUID() } ><Button key={ getUUID() } shape="icon" type="link" title="办理"><Icon icon="check" /></Button></Link>,
        <a href={ `${ rowData.monitorProcessUrl }` } target="_blank" key={ getUUID() } ><Button key={ getUUID() } shape="icon" type="link" title="跟踪" ><Icon type="crosshairs" /></Button></a>
      ];
    } else {
      array = [
        <Button key={ getUUID() } shape="icon" type="link" title="签收" onClick={ this.claimTask.bind( this, rowData ) } ><Icon icon="calendar-check-o" /></Button>,
        <Button key={ getUUID() } shape="icon" type="link" title="反签收" disabled ><Icon icon="calendar-times-o" /></Button>,
        <Button key={ getUUID() } shape="icon" type="link" title="办理" disabled ><Icon icon="check" /></Button>,
        <a href={ `${ rowData.monitorProcessUrl }` } target="_blank" key={ getUUID() } ><Button key={ getUUID() } shape="icon" type="link" title="跟踪" ><Icon type="crosshairs" /></Button></a>
      ];
    }
    return array;
  }

  render() {
    const { pageSize, pageNo, orderList: { total, data } } = this.state;

    return (
      <div>
        <Row>
          {
            data ?
              <Col>
                <Table dataSource={ data } bgColor={ { head: '#ecf5fe' } } multiLine={ false } textAlign="center" headBolder={ true } striped={ true } complex >
                  <Column title="序号" dataIndex="index" scaleWidth="15%" color={ { head: '#18335d' } }>
                    { ( value, index ) => <div style={ { padding: '.5rem .5rem .5rem .9rem' } }>{ 1 + parseInt( index ) + ( ( this.state.pageNo - 1 ) * this.state.pageSize ) }</div> }
                  </Column>
                  <Column title="订单编号" dataIndex="orderNo" scaleWidth="15%" color={ { head: '#18335d' } } />
                  <Column title="服务名称" dataIndex="serviceName" scaleWidth="15%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="订单申请人" dataIndex="applyUserName" scaleWidth="15%" color={ { head: '#18335d' } } />
                  <Column title="订单提交时间" dataIndex="orderStartDate" scaleWidth="20%" color={ { head: '#18335d' } } />
                  <Column title="操作" scaleWidth="20%" dataIndex="" color={ { head: '#18335d' } } >
                    {
                      ( rowData ) => this.checkButton( rowData )
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
      </div>
    );
  }
}

export { UnapprovedOrder };
export default UnapprovedOrder;
