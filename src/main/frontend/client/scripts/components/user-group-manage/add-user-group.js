import React, { Component } from 'react';

import { Button, Row, Col, Input, FormItem, Form, Label, Notification } from 'epm-ui';

import { popup } from '../../utilities/transient';

import context from 'context';

/**
 *author: wangxiang
 *desc:  用户组管理-新增用户组
 *date:  2018/1/30
 */
class AddUserGroup extends Component {

  constructor( props ) {
    super( props );

    this.state = { groupName: '' };

    this.onAfterSubmit = this.onAfterSubmit.bind( this );
    this.onAsyncSubmit = this.onAsyncSubmit.bind( this );
    this.onFormGetter = this.onFormGetter.bind( this );
    this.handleResetForm = this.handleResetForm.bind( this );
    this.handleChange = this.handleChange.bind( this );
  }

  onAsyncSubmit( formData ) {

    return formData;
  }

  onAfterSubmit( data ) {
    if ( Number( data.code ) === 201 ) {
      popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ data.message } /> );
      this.props.getUserGroup();
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

  handleChange( data ) {
    this.setState( { groupName: data  } );
  }

  render() {
    return (
      <Form
        type="horizontal"
        method="post"
        async={ true }
        getter={ this.onFormGetter }
        trigger={ this.handleResetForm }
        action={ `${ context.contextPath }/v1/userGroups/${ this.state.groupName }` }
        onSubmit={ this.onAsyncSubmit }
        onAfterSubmit={ this.onAfterSubmit }
      >
        <Row>
          <Col size={ 22 } offset={ 1 }>
            <FormItem>
              <Label>用户组名称</Label>
              <Input name="groupName" type="text" onChange={ this.handleChange } />
            </FormItem>
            <Button type="primary" onClick={ () => { this.props.closeModal() } }>返回</Button>
            <Button type="primary" htmlType="submit">保存</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export { AddUserGroup };
export default AddUserGroup;
