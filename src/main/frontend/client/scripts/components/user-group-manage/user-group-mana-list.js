import React, { Component } from 'react';

import { Container, Button, Row, Col, Input, Table, Column, FormItem, Form, Modal, ModalHeader, ModalBody, Pagination, Loading, Notification } from 'epm-ui';

import AddUser from './add-user';
import DataCharaSet from './data-character-set';

import context from 'context';
import { getDataSource } from '../../utilities/dataSource';
import { popup } from '../../utilities/transient';

/**
 *author: wangxiang
 *desc:  用户组管理-列表
 *date:  2018/1/30
 */
class UserGroupManageList extends Component {

  constructor( props ) {
    super( props );

    this.state = {
      orderList: {},
      pageNo: 1,
      pageSize: 10,
      addUser: false,
      dataUser: false,
      groupId: props.groupId,
      dataSelect: [],
      loginId: ''
    };

    this.handleResetForm = this.handleResetForm.bind( this );
    this.onFormGetter = this.onFormGetter.bind( this );
    this.handlePagiChange = this.handlePagiChange.bind( this );
    this.onAsyncSubmit = this.onAsyncSubmit.bind( this );
    this.onAfterSubmit = this.onAfterSubmit.bind( this );
    this.fetchOrderList = this.fetchOrderList.bind( this );
    this.handleCloseAddUser = this.handleCloseAddUser.bind( this );
    this.handleCloseDataUser = this.handleCloseDataUser.bind( this );
    this.handleCheck = this.handleCheck.bind( this );
    this.handleRemoveUsers = this.handleRemoveUsers.bind( this );
    this.fetchOrderList = this.fetchOrderList.bind( this );
  }
  componentDidMount() {
    this.formData = this.getValue();

    this.fetchOrderList();
  }


  componentWillReceiveProps( nextProps ) {
    if ( nextProps.groupId !== this.props.groupId ) {
      this.setState( { groupId: nextProps.groupId, pageNo: 1, pageSize: 10 }, this.fetchOrderList );
    }
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
    getDataSource( `${ context.contextPath }/v1/userGroups/${ this.state.groupId }/users?pageNo=${ this.state.pageNo }&pageSize=${ this.state.pageSize }&userName=${ this.formData.userName }`, ( orderList ) => {
      this.setState( { orderList } );
    } );
  }

  onFormGetter( getter ) {
    this.getValue = getter.value;
  }

  handleResetForm( trigger ) {
    this.reset = trigger.reset;
  }

  handleCloseAddUser() {
    this.refs.addUser.addUserReset();
    this.refs.addUser.tranReset();
    this.setState( { addUser: false } );
  }

  handleCloseDataUser() {
    this.setState( { dataUser: false } );
  }

  handleCheck( data ) {
    this.setState( { dataSelect: data.map( ( key ) => key.userId ) } )
  }

  handleRemoveUsers() {
    const dataSelect = this.state.dataSelect;

    if ( dataSelect.length > 0 ) {

      let param = '';

      for ( let v of dataSelect ) {
        param += `userId=${ v }&`;
      }

      getDataSource(
        {
          url: `${ context.contextPath }/v1/userGroups/removeUsers`,
          params: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, method: 'put', body: param.substring( 0, param.length - 1 ) }
        }, ( data ) => {
          if ( Number( data.code ) === 200 ) {
            popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ data.message } /> );
            this.fetchOrderList();
          } else {
            popup( <Notification key={ Math.random().toString() } message="通知" type="error" description={ data.message } /> );
            this.fetchOrderList();
          }
        } );

    } else {
      popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="请选中需要移除的用户！" /> );
    }
  }


  render() {
    const { pageSize, pageNo, orderList: { total, data } } = this.state;

    return (
      <Container className="user_group_manage_list" type="fluid">
        <Row>
          <br />
          <Col>
            <Form
              async={ true }
              type="inline"
              onSubmit={ this.onAsyncSubmit }
              onAfterSubmit={ this.onAfterSubmit }
              getter={ this.onFormGetter }
              trigger={ this.handleResetForm }
              action={ `${ context.contextPath }/v1/userGroups/${ this.state.groupId }/users` }
              onChange={ ( formData ) => this.formData = formData }
            >
              <Col size={ 5 }>
                <FormItem type="inline" name="userName">
                  <Input placeholder="模糊查询" />
                </FormItem>
              </Col>
              <Col size={ 5 }>
                <Button type="default" htmlType="submit">查询</Button>
                <Button type="default" onClick={ () => { this.reset(); } }>重置</Button>
              </Col>
              <Col size={ 8 } offset={ 6 }>
                <Button type="default" style={ { float: 'right' } } onClick={ this.handleRemoveUsers } >移除用户</Button>
                <Button type="default" style={ { float: 'right' } } onClick={ () => { this.setState( { addUser: true } ) } }>添加用户</Button>
              </Col>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            {
              data ?
                <Col>
                  <Table dataSource={ data } bgColor={ { head: '#ecf5fe' } } multiLine={ false } textAlign="center" headBolder={ true } striped={ true } checkable complex onCheck={ this.handleCheck }>
                    <Column title="序号" dataIndex="index" scaleWidth="15%" color={ { head: '#18335d' } }>
                      { ( value, index ) => <div style={ { padding: '.5rem .5rem .5rem 0rem' } }>{ 1 + parseInt( index ) + ( ( this.state.pageNo - 1 ) * this.state.pageSize ) }</div> }
                    </Column>
                    <Column title="姓名" dataIndex="userName" scaleWidth="25%" textAlign="left" color={ { head: '#18335d' } } />
                    <Column title="数据角色" dataIndex="roleNames" scaleWidth="30%" color={ { head: '#18335d' } } />
                    <Column title="操作" scaleWidth="30%" dataIndex="" color={ { head: '#18335d' } } >
                      {
                        ( rowData ) =>
                          <Button style={ { marginLeft: '-1rem' } } type="link" onClick={ () =>  this.setState( { loginId: rowData.loginId, dataUser: true } ) } >数据角色设置</Button>
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
          </Col>
        </Row>
        <Modal visible={ this.state.addUser } size="large" onClose={ this.handleCloseAddUser } >
          <ModalHeader>
            新增用户
          </ModalHeader>
          <ModalBody>
            <AddUser ref="addUser" groupId={ this.state.groupId } fetchOrderList={ this.fetchOrderList } closeModal={ this.handleCloseAddUser } />
          </ModalBody>
        </Modal>
        <Modal visible={ this.state.dataUser } onClose={ this.handleCloseDataUser } >
          <ModalHeader>
            数据角色设置
          </ModalHeader>
          <ModalBody>
            { this.state.loginId !== '' ? <DataCharaSet ref="dataCharaSet" loginId={ this.state.loginId } fetchOrderList={ this.fetchOrderList } closeModal={ this.handleCloseDataUser } /> : null }
          </ModalBody>
        </Modal>
      </Container>
    );
  }
}

export { UserGroupManageList };
export default UserGroupManageList;
