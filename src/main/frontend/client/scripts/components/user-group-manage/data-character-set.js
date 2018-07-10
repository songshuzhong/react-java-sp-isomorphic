import React, { Component } from 'react';

import { Button, Row, Col, RadioGroup, Radio, FormItem, Form, Notification } from 'epm-ui';

import { popup } from '../../utilities/transient';

import context from 'context';
import {getDataSource} from "../../utilities/dataSource";

/**
 *author: wangxiang
 *desc:  用户组管理-数据角色设置
 *date:  2018/2/1
 */
class DataCharaSet extends Component {

  constructor( props ) {
    super( props );

    this.state = { groupName: '', loginId: props.loginId, userId: '', roleCode: '' };

    this.onAfterSubmit = this.onAfterSubmit.bind( this );
    this.onAsyncSubmit = this.onAsyncSubmit.bind( this );
    this.onFormGetter = this.onFormGetter.bind( this );
    this.handleResetForm = this.handleResetForm.bind( this );
    this.fetchInitData = this.fetchInitData.bind( this );
    this.handleChange = this.handleChange.bind( this );
  }

  componentDidMount() {
    this.fetchInitData();
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.loginId !== this.props.loginId ) {
      this.setState( { loginId: nextProps.loginId }, this.fetchInitData );
    }
  }

  fetchInitData() {

    getDataSource( `${ context.contextPath }/v1/users/${ this.state.loginId }`, ( data ) => {

      this.setState( { userId: data.userId } );

      if ( data.roleInfoList !== null ) {

        for ( let v of data.roleInfoList ) {

          if ( v.roleCode === 'user' || v.roleCode === 'admin_group' ) {

            this.setState( { roleCode: v.roleCode } );
          }
        }
      }

    } );
  }

  onAsyncSubmit( formData ) {
    return formData;
  }

  onAfterSubmit( data ) {
    if ( Number( data.code ) === 200 ) {
      popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ data.message } /> );
      this.props.fetchOrderList();
    } else {
      popup( <Notification key={ Math.random().toString() } message="通知" type="error" description={ data.message } /> );
    }

    this.props.closeModal();
  }

  onFormGetter( getter ) {
    this.getValue = getter.value;
  }

  handleResetForm( trigger ) {
    this.groupReset = trigger.reset;
  }

  handleChange( value ) {
    this.setState( { roleCode: value } );
  }

  render() {

    return (
      <Form
        type="horizontal"
        method="put"
        async={ true }
        getter={ this.onFormGetter }
        trigger={ this.handleResetForm }
        action={ `${ context.contextPath }/v1/role/${ this.state.userId }/${ this.state.roleCode }` }
        onSubmit={ this.onAsyncSubmit }
        onAfterSubmit={ this.onAfterSubmit }
      >
        <Row>
          <Col size={ 22 } offset={ 1 }>
            <FormItem>
              <RadioGroup value={ `${ this.state.roleCode }` } name="roleCode" type="inline" style={ { paddingTop: '20px' } } onChange={ this.handleChange }>
                <Radio value="user" style={ { paddingRight: '20%' } }>普通用户</Radio>
                <Radio value="admin_group">组管理员</Radio>
              </RadioGroup>
            </FormItem>
            <Button type="primary" onClick={ () => { this.props.closeModal() } }>返回</Button>
            <Button type="primary" htmlType="submit">保存</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export { DataCharaSet };
export default DataCharaSet;
