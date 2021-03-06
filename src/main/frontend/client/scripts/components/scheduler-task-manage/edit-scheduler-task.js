import React, { Component } from 'react';

import { Row, Col, Button, Form, FormItem, Input, Label, Select, Textarea, Notification, Option } from 'epm-ui';

import { popup } from '../../utilities/transient';
import { getDataSource } from '../../utilities/dataSource';

import context from 'context';

/**
 *author: wangxiang
 *desc:  编辑定时任务
 *date:  2018/2/28
 */
class EditSchedulerTask extends Component {

  /**
   * @param {Object} props 属性.
   */
  constructor( props ) {
    super( props );

    this.state = { editObj: props.editObj, submitBtn: false };
    this.formGetter = this.formGetter.bind( this );
    this.handleCloseModal = this.handleCloseModal.bind( this );
    this.handleResetForm = this.handleResetForm.bind( this );
    this.onAsyncSubmit = this.onAsyncSubmit.bind( this );
    this.onAfterSubmit = this.onAfterSubmit.bind( this );
  }

  componentWillReceiveProps( nextProps ) {
    if ( this.props.editObj !== nextProps.editObj ) {

      this.setState( { editObj: nextProps.editObj } );

    }
  }

  handleCloseModal() {
    this.props.handleCloseEditModal();
  }

  handleResetForm( trigger ) {
    this.editReset = trigger.reset;
  }

  formGetter( getter ) {
    this.getValue = getter.value;
  }

  // 编辑 表单提交
  onAsyncSubmit( formData ) {
    formData.id = this.state.editObj.id;

    return formData;
  }

  // 编辑 表单提交后重新获取data
  onAfterSubmit( formData ) {
    if ( parseInt( formData.code ) === 201 ) {
      this.props.fetchInitData();
      popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ formData.message } /> );
    } else {
      popup( <Notification key={ Math.random().toString() } message="通知" type="error" description={ formData.message } /> );
    }

    this.editReset();
    this.props.handleCloseEditModal();
  }

  // 编码唯一性校验
  checkCataCode( value ) {
    if ( value !== '' ) {
      getDataSource( `${ context.contextPath }/v1/scheduler/task/validate/${ value }`, ( callback ) => {

        if ( Number( callback.code ) !== 200 ) {
          this.setState( { submitBtn: true } );
          popup(
            <Notification
              type="error"
              message="分类编码重复"
              description="分类编码重复，请修改编码！"
              key={ Math.random().toString() }
            />
          );
        } else {
          this.setState( { submitBtn: false } );
        }
      } );
    }
  }

  /**
   *
   * @returns {XML}
   */
  render() {
    return (
      <Form
        method="post"
        type="horizontal"
        async={ true }
        action={ `${ context.contextPath }/v1/scheduler/task/${ this.state.editObj ? this.state.editObj.id : '' }` }
        onSubmit={ this.onAsyncSubmit }
        onAfterSubmit={ this.onAfterSubmit }
        getter={ this.formGetter }
        trigger={ this.handleResetForm }
      >
        <Row>
          <Col size={ 24 }>
            <FormItem required={ true } unvalidateMsg="请输入任务组名称">
              <Label>任务组名称</Label>
              <Input name="groupId" type="text" value={ this.state.editObj ? this.state.editObj.groupId : '' } disabled />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 24 }>
            <FormItem required={ true } unvalidateMsg="请输入任务名称" >
              <Label>任务名称</Label>
              <Input name="jobId" type="text" value={ this.state.editObj ? this.state.editObj.jobId : '' } onChange={ this.checkCataCode.bind( this ) } disabled />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 24 }>
            <FormItem required={ true } unvalidateMsg="请输入任务中文名称（中文）" >
              <Label>任务中文名称</Label>
              <Input name="jobName" value={ this.state.editObj ? this.state.editObj.jobName : '' } type="text" pattern={ /^$|^[\u4e00-\u9fa5]+$/ }  />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 24 }>
            <FormItem required={ true } >
              <Label>cron表达式</Label>
              <Input name="cron" value={ this.state.editObj ? this.state.editObj.cron : '' } type="text" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 24 }>
            <FormItem required={ true } >
              <Label>执行任务类</Label>
              <Input name="job" type="text" value={ this.state.editObj ? this.state.editObj.job : '' } disabled />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 24 }>
            <FormItem required={ true }>
              <Label>是否启用</Label>
              <Select name="enable" value={ `${ this.state.editObj ? this.state.editObj.enable : '' }` }>
                <Option value="1" >是</Option>
                <Option value="0" >否</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Button type="primary" onClick={ this.handleCloseModal }>返回</Button>
        <Button type="primary" onClick={ () => { this.editReset(); } }>重置</Button>
        <Button type="primary" htmlType="submit" disabled={ this.state.submitBtn } >保存</Button>
      </Form>
    );
  }
}

export { EditSchedulerTask };
export default EditSchedulerTask;