import React, { Component } from 'react';
import { Button, Container, Input, FormItem, Form, Row, Col, Column, Table, Pagination, Notification, Dialog } from 'epm-ui';

import { popup } from '../../utilities/transient';
import { getDataSource } from '../../utilities/dataSource';
import context from 'context';
import { instanceWorkStateConvert, instanceOrderStateConvert } from '../../components/commons/dynamicConvert';

/**
 *@author xumeng
 *@mailTo <a href="mailto:xumeng@bonc.com.cn">xumeng</a>
 *@Date 2018/1/17.
 *@desc 服务实例-回收站（租户管理）
 */

class InstanceDelete extends Component {
  constructor( props ) {
    super( props );
    this.state={
      pageNo: 1,
      pageSize: 10,
      selectKey: '',
      keyWords: '',
      deleteList: null,
      checkData: null,
      flag: true
    };

    this.fetchDeleteList = this.fetchDeleteList.bind( this );
    this.handleSearchValue = this.handleSearchValue.bind( this );
    this.handleClickSearch = this.handleClickSearch.bind( this );
    this.handlePaginationChange = this.handlePaginationChange.bind( this );
    this.handleTableCheck = this.handleTableCheck.bind( this );
  }

  componentDidMount() {
    this.fetchDeleteList();
  }

  // 获取回收站数据
  fetchDeleteList() {
    let { pageNo, pageSize, selectKey } = this.state;
    let svcId = this.props.svcId;
    let isDelete = 1;

    getDataSource( `${ context.contextPath }/v1/svcinstances/page/${ svcId }/${ isDelete }?pageNo=${ pageNo }&pageSize=${ pageSize }&instanceNo=${ selectKey }`, ( deleteList ) => {
      for ( let i = 0; i < deleteList.roles.length; i++ ) {
        let cur = deleteList.roles[i];

        if( cur == 'svc_use' ) {
          this.showFlag = true;

          break;
        }
        this.showFlag = false;
      }

      if( this.showFlag ) {
        this.setState( { deleteList } );
        let count = deleteList.data.length;
        this.props.getDeleteCount( count );
      }
    } );
  }

  handleSearchValue( value ) {
    this.setState( { keyWords: value } );
  }

  handleClickSearch() {
    this.setState( { pageNo: 1, selectKey: this.state.keyWords }, this.fetchDeleteList );
  }

  // 分页
  handlePaginationChange( pageNo, pageSize ) {
    this.setState( { pageNo, pageSize }, this.fetchDeleteList );
  }

  handleTableCheck( data, currentData ) {
    if( data != [] ) {
      if ( data[0] ){
        this.setState( { flag: false } );
      }else {
        this.setState( { flag: true } );
      }
    }

    this.setState( { checkData: data[0] } );
  }

  handleRecoveryService() {
    let { checkData } = this.state;
    let instanceId = checkData.instanceId || '';
    let isDelete = 0;

    getDataSource( {
      url: `${ context.contextPath }/v1/svcinstances/${ instanceId }/${ isDelete }`,
      params: { method: 'put' }
    }, ( data ) => {
      if ( data.code == 200 ) {
        this.fetchDeleteList();
        popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ data.message } /> );
      }else {
        popup( <Notification key={ Math.random().toString() } message="通知" type="error" description={ data.message } /> );
      }
    } );
  }

  showDialog() {
    popup(
      <Dialog
        title="删除确认"
        message="请确认是否彻底删除该服务实例？"
        type="confirm"
        icon="danger"
        approveBtnOnClick={ this.handleThoroughDeleteService.bind( this ) }
      /> );
  }

  handleThoroughDeleteService( after ) {
    let { checkData } = this.state;
    let instanceId = checkData.instanceId || '';

    getDataSource( {
      url: `${ context.contextPath }/v1/svcinstances/${ instanceId }`,
      params: { method: 'delete' }
    }, ( data ) => {
      if ( data.code == 200 ) {
        this.fetchDeleteList();
        after( true );
        popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ data.message } /> );
      }else {
        after( true );
        popup( <Notification key={ Math.random().toString() } message="通知" type="error" description={ data.message } /> );
      }
    } );
  }

  render() {
    let { deleteList, pageNo, pageSize, flag } = this.state;

    return (
      <Container type="fluid" style={ { paddingTop: '20px' } }>
        <Row>
          <Col size={ { small: 24, medium: 24, large: 24 } }>
            <Form
              type="inline"
              async={ true }
            >
              <FormItem type="inline">
                <Input placeholder="请输入关键字" type="search" onChange={ this.handleSearchValue } />
              </FormItem>
              <Button onClick={ this.handleClickSearch }>查询</Button>
              <div style={ { float: 'right' } }>
                <Button type="primary" disabled={ flag } onClick={ this.handleRecoveryService.bind( this ) }>恢复</Button>
                <Button type="primary" disabled={ flag } style={ { marginLeft: '10px' } } onClick={ this.showDialog.bind( this ) }>彻底删除</Button>
              </div>
            </Form>
          </Col>
        </Row>
        <Table
          textAlign="center"
          bgColor={ { head: '#ecf5fe' } }
          headBolder={ true }
          striped={ true }
          headMenu={ true }
          dataSource={ deleteList ? deleteList.data : [] }
          style={ { margin: '10px 0' } }
          onCheck={ this.handleTableCheck }
          checkable
          singleSelection
        >
          <Column title="实例编号" textAlign="center" dataIndex="instanceNo" scaleWidth="20%" />
          <Column title="订购状态" scaleWidth="20%">
            {
              ( value, index ) => {
                return (
                  <span style={ { display: 'inline-block', marginTop:"10px" } }>{ instanceOrderStateConvert( value.instanceOrderState ) }</span>
                );
              }
            }
          </Column>
          <Column title="运行状态" scaleWidth="20%">
            {
              ( value, index ) => {
                return (
                  <span style={ { display: 'inline-block', marginTop:"10px" } }>{ value.instanceOrderState == 10 || value.instanceOrderState == 30 ? '-' : instanceWorkStateConvert( value.instanceWorkState ) }</span>
                );
              }
            }
          </Column>
          <Column title="删除时间" textAlign="center" dataIndex="updateDate" scaleWidth="40%" />
        </Table>
        <Pagination index={ pageNo } total={ deleteList ? deleteList.total : 0 } size={ pageSize } showPagiJump={ true } showDataSizePicker={ true } onChange={ this.handlePaginationChange } align="right" />
      </Container>
    );
  }
}

export { InstanceDelete };
export default InstanceDelete;