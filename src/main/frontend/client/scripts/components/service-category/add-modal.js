import React, { Component } from 'react';

import { Row, Col, Button, Form, FormItem, Input, Label, Select, Textarea, Notification } from 'epm-ui';

import { popup } from '../../utilities/transient';
import { getDataSource } from '../../utilities/dataSource';

import context from 'context';

/**
 *author: wangxiang
 *desc:  服务分类-新增
 *date:  2018/1/3
 */
class ServiceCateAddModal extends Component {

  /**
   * @param {Object} props 属性.
   */
  constructor( props ) {
    super( props );

    this.state = { submitBtn: false };
    this.formGetter = this.formGetter.bind( this );
    this.handleCloseModal = this.handleCloseModal.bind( this );
    this.handleResetForm = this.handleResetForm.bind( this );
    this.onAsyncSubmit = this.onAsyncSubmit.bind( this );
    this.onAfterSubmit = this.onAfterSubmit.bind( this );
  }

  handleCloseModal() {
    this.props.handleCloseAddModal();
  }

  handleResetForm( trigger ) {
    this.addReset = trigger.reset;
  }

  formGetter( getter ) {
    this.getValue = getter.value;
  }

  // 新增 表单提交
  onAsyncSubmit( formData ) {

      return formData;
  }

  // 新增 表单提交后重新获取data
  onAfterSubmit( formData ) {
    if ( parseInt( formData.code ) === 201 ) {
      this.props.fetchInitData();
    }

    this.addReset();
    this.props.handleCloseAddModal();
  }

  // 编码唯一性校验
  checkCataCode( value ) {
    if ( value !== '' ) {
      getDataSource( `${ context.contextPath }/v1/svccategorys/${ value }/verify`, ( callback ) => {

        if ( parseInt( callback.code ) === 0 ) {
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
        action={ `${ context.contextPath }/v1/svccategorys` }
        onSubmit={ this.onAsyncSubmit }
        onAfterSubmit={ this.onAfterSubmit }
        getter={ this.formGetter }
        trigger={ this.handleResetForm }
      >
        <Row>
          <Col size={ 24 }>
            <FormItem required={ true } unvalidateMsg="请输入分类名称（中文、字母、数字、下划线组合，且不以下划线开头）">
              <Label>分类名称</Label>
              <Input name="cataName" type="text" pattern={ /^(?!_)[a-zA-Z0-9\u4e00-\u9fa5_]+$/ } />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 24 }>
            <FormItem required={ true } unvalidateMsg="请输入分类编码（字母、下划线组合，不以下划线开头）" >
              <Label>分类编码</Label>
              <Input name="cataCode" type="text" onChange={ this.checkCataCode.bind( this ) } pattern={ /^(?!_)[a-zA-Z_]+$/ } />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 24 }>
            <FormItem required={ true } unvalidateMsg="请输入分类排序数字（阿拉伯数字）" >
              <Label>分类排序</Label>
              <Input name="cataOrder" type="text" pattern={ /^[0-9]\d*$/ } />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 24 }>
            <FormItem>
              <Label>父元素</Label>
              <Select name="cataParentId" dataSource={ `${ context.contextPath }/v1/svccategorys/combobox` } />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 24 }>
            <FormItem>
              <Label>分类描述</Label>
              <Textarea name="cataDesc" rows={ 3 } placeholder="请输入分类描述..." />
            </FormItem>
          </Col>
        </Row>
        <Button type="primary" onClick={ this.handleCloseModal }>返回</Button>
        <Button type="primary" onClick={ () => { this.addReset(); } }>重置</Button>
        <Button type="primary" htmlType="submit" disabled={ this.state.submitBtn } >保存</Button>
      </Form>
    );
  }
}

export { ServiceCateAddModal };
export default ServiceCateAddModal;
