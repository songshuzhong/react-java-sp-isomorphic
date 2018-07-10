import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Button, Row, Col, FormItem, Form, Label, Icon, Loading, Pagination, Table, Column, Input, DateTimePicker } from 'epm-ui';
/*import Button from 'epm-ui/dist/commonjs/components/elements/button/button';
import Row from 'epm-ui/dist/commonjs/components/layouts/grid/row/row';
import Col from 'epm-ui/dist/commonjs/components/layouts/grid/col/col';
import FormItem from 'epm-ui/dist/commonjs/components/data-entry/form-item/form-item';
import Form from 'epm-ui/dist/commonjs/components/data-entry/form/form';
import Label from 'epm-ui/dist/commonjs/components/data-entry/label/label';
import Icon from 'epm-ui/dist/commonjs/components/elements/icon/icon';
import Loading from 'epm-ui/dist/commonjs/components/elements/loading/loading';
import Pagination from 'epm-ui/dist/commonjs/components/guidance/pagination/pagination';
import Table from 'epm-ui/dist/commonjs/components/data-display/table/table';
import Column from 'epm-ui/dist/commonjs/components/data-display/table/column/column';
import Input from 'epm-ui/dist/commonjs/components/data-entry/input/input';
import DateTimePicker from 'epm-ui/dist/commonjs/components/data-entry/datetime-picker/datetime-picker';*/

import { getDataSource } from '../../utilities/dataSource';
import getUUID from '../../utilities/uuid';

import context from 'context';

/**
 *author: wangxiang
 *desc:  订单审批-已审批
 *date:  2018/1/22
 */
class ApprovedOrder extends Component {

  constructor( props ) {
    super( props );

    this.state = {
      startDate: null,
      endDate: null,
      orderList: {},
      formData: {},
      pageNo: 1,
      pageSize: 10,
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
    getDataSource( `${ context.contextPath }/v1/order/process/page/finish?pageNo=${ this.state.pageNo }&pageSize=${ this.state.pageSize }&searchData=${ this.formData.searchData }&startDate=${ this.formData.startDate }&endDate=${ this.formData.endDate }`, ( orderList ) => {
      this.setState( { orderList } );
    } );
  }

  onFormGetter( getter ) {
    this.getValue = getter.value;
  }

  handleResetForm( trigger ) {
    this.reset = trigger.reset;
  }

  render() {
    const { pageSize, pageNo, orderList: { total, orderProcessList } } = this.state;

    return (
      <div>
        <Row>
          <Col>
            <Form
              method="get"
              async={ true }
              type="inline"
              onSubmit={ this.onAsyncSubmit }
              onAfterSubmit={ this.onAfterSubmit }
              getter={ this.onFormGetter }
              trigger={ this.handleResetForm }
              action={ `${ context.contextPath }/v1/order/process/page/finish` }
              onChange={ ( formData ) => this.formData = formData }
            >
              <Col size={ { small: 12, medium: 9, large: 7 } } style={ { padding: 0 } }>
                <FormItem name="startDate">
                  <Label>审批时间：</Label>
                    <DateTimePicker showIcon format={ 'YYYY-MM-DD HH:mm:ss' } disabledDate={ this.disabledStartDate } onChange={ this.onStartChange } placeholder="起始时间" />
                </FormItem>
              </Col>
              <Col size={ { small: 12, medium: 7, large: 5 } } style={ { padding: 0 } }>
                <FormItem name="endDate">
                  <DateTimePicker showIcon format={ 'YYYY-MM-DD HH:mm:ss' } disabledDate={ this.disabledEndDate } onChange={ this.onEndChange } placeholder="结束时间" />
                </FormItem>
              </Col>
              <Col size={ { small: 12, medium: 7, large: 5 } } style={ { padding: 0 } }>
                <FormItem type="inline" name="searchData">
                  <Input placeholder="模糊查询" />
                </FormItem>
              </Col>
              <Col size={ { small: 12, medium: 7, large: 4 } } style={ { padding: 0 } }>
                <Button type="default" htmlType="submit">查询</Button>
                <Button type="default" onClick={ () => { this.reset(); } }>重置</Button>
              </Col>
            </Form>
          </Col>
        </Row>
        <Row>
          {
            orderProcessList ?
              <Col>
                <Table dataSource={ orderProcessList } bgColor={ { head: '#ecf5fe' } } multiLine={ false } textAlign="center" headBolder={ true } striped={ true } complex >
                  <Column title="序号" dataIndex="index" scaleWidth="10%" color={ { head: '#18335d' } }>
                    { ( value, index ) => <div style={ { padding: '.5rem .5rem .5rem .9rem' } }>{ 1 + parseInt( index ) + ( ( this.state.pageNo - 1 ) * this.state.pageSize ) }</div> }
                  </Column>
                  <Column title="订单编号" dataIndex="orderNo" scaleWidth="15%" color={ { head: '#18335d' } } />
                  <Column title="服务名称" dataIndex="serviceName" scaleWidth="10%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="订单申请人" dataIndex="applyUserName" scaleWidth="10%" color={ { head: '#18335d' } } />
                  <Column title="订单提交时间" dataIndex="orderStartDate" scaleWidth="20%" color={ { head: '#18335d' } } />
                  <Column title="审批时间" dataIndex="approvalDate" scaleWidth="20%" color={ { head: '#18335d' } } />
                  <Column title="操作" scaleWidth="15%" dataIndex="" color={ { head: '#18335d' } } >
                    {
                      ( rowData ) => [
                        <Link to={ `/console-home/order-approval-details/${ rowData.serviceOrderId }` } key={ getUUID() } ><Button key={ getUUID() } shape="icon" type="link" title="查看" ><Icon icon="eye" /></Button></Link>,
                        <a href={ `${ rowData.monitorProcessUrl }` } target="_blank" key={ getUUID() } ><Button key={ getUUID() } shape="icon" type="link" title="跟踪" ><Icon type="crosshairs" /></Button></a>
                      ]
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

export { ApprovedOrder };
export default ApprovedOrder;
