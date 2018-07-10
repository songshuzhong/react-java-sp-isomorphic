import React, { Component } from 'react';

import { Row, Col, Button, Select, Form, Loading, Input, Label, FormItem, Notification } from 'epm-ui';

import CommInitialValue from './props-initial';

import { popup } from '../../utilities/transient';
import { getDataSource } from '../../utilities/dataSource';

import context from 'context';

/**
 *author: wangxiang
 *desc: 属性库管理-新增modal
 *date:  2017/12/24
 */
class AddModal extends Component {

  constructor( props ) {
    super( props );

    this.state = { valueObject: '', selectedValue: '10', submitBtn: false  };
    this.formGetterForAdd = this.formGetterForAdd.bind( this );
    this.handleCloseModal = this.handleCloseModal.bind( this );
    this.handleResetAddForm = this.handleResetAddForm.bind( this );
    this.onAsyncSubmit = this.onAsyncSubmit.bind( this );
    this.onAfterSubmit = this.onAfterSubmit.bind( this );
    this.handleKvpGetter = this.handleKvpGetter.bind( this );
  }

  handleCloseModal() {
    this.props.handleCloseAddModal();
  }

  handleResetAddForm( trigger ) {
    this.addReset = trigger.reset;
  }

  formGetterForAdd( getter ) {
    this.getValueForAdd = getter.value;
  }

  // 新增 表单提交
  onAsyncSubmit( formData ) {

    formData[ 'initInfo.initType' ] = ( this.state.valueObject !== '' && this.state.valueObject !== '[]' ) ? this.state.initType : null;
    formData[ 'initInfo.valueObject' ] = ( this.state.valueObject !== '' && this.state.valueObject !== '[]' ) ? this.state.valueObject : null;
    formData[ 'metadataInfo.metadataIsInit' ] = ( this.state.valueObject !== '' && this.state.valueObject !== '[]' ) ? '1' : '0';

    /* formData[ 'initInfo.initType' ] = this.state.initType ? this.state.initType : 0;
    formData[ 'initInfo.valueObject' ] = this.state.valueObject;*/
    const validateRole = formData[ 'validateInfo.validateRole' ];

    // formData[ 'metadataInfo.metadataIsInit' ] = this.state.valueObject !== '' ? '1' : '0';
    formData[ 'metadataInfo.metadataIsValidate' ] = validateRole === '' ? '0' : '1';

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

  // 属性编码唯一性校验
  checkAttrCode( value ) {
    if ( value !== '' ) {
      getDataSource( `${ context.contextPath }/v1/attrLibInfos/${ value }/verify`, ( callback ) => {

        if ( parseInt( callback.code ) === 0 ) {
          this.setState( { submitBtn: true } );
          popup(
            <Notification
              message="属性编码重复"
              description="属性编码重复，请修改编码！"
              key={ Math.random().toString() }
            />
          );
        } else {
          this.setState( { submitBtn: false } );
        }
      } );
    }
  }

  handleKvpGetter( value ) {
    let array = [];

    if ( typeof ( value ) !== 'string' ) {

      for ( let obj of value ) {
        let json = {};

        if ( obj.keyData && obj.keyData.trim() !== '' ) {

          json[ obj.keyData ] = obj.valueData ? obj.valueData : '';

          if ( obj.checkNum && Number( obj.checkNum ) === 10 ) { // 当默认项选中时 json对象放入数组第一个位置
            array.unshift( json );
          }else {
            array.push( json );
          }
        }
      }

      this.setState( { initType: 10, valueObject: JSON.stringify( array ) } );
    } else {
      this.setState( { initType: 20, valueObject: value } );
    }
  }

  handleSelectChange( selectedValue ) {
    this.setState( { selectedValue } );
  }

  handleReset() {
    this.setState( { selectedValue : '10' } );
    this.addReset();
  }

  render() {
    return (
      <Form
        method="post"
        type="horizontal"
        async={ true }
        action={ `${ context.contextPath }/v1/attrLibInfos` }
        onSubmit={ this.onAsyncSubmit }
        onAfterSubmit={ this.onAfterSubmit }
        getter={ this.formGetterForAdd }
        trigger={ this.handleResetAddForm }
      >
        <Row>
          <Col size={ 12 }>
            <FormItem required={ true } unvalidateMsg="请输入属性名（中文、字母、数字、下划线组合，且不以下划线开头）">
              <Label>属性名</Label>
              <Input name="attrName" type="text" pattern={ /^(?!_)[a-zA-Z0-9_\u4e00-\u9fa5]+$/ } />
            </FormItem>
          </Col>
          <Col size={ 12 }>
            <FormItem unvalidateMsg="请输入正确格式的属性英文名（英文字母）">
              <Label>属性英文名</Label>
              <Input name="attrEnname" type="text" pattern={ /^$|^[A-Za-z]+$/ } />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 12 }>
            <FormItem required={ true } unvalidateMsg="请输入属性编码（字母、下划线组合，不以下划线开头）" >
              <Label>属性编码</Label>
              <Input name="attrCode" type="text" onChange={ this.checkAttrCode.bind( this ) } pattern={ /^(?!_)[a-zA-Z_]+$/ } />
            </FormItem>
          </Col>
          <Col size={ 12 }>
            <FormItem unvalidateMsg="请输入标签内容">
              <Label>标签</Label>
              <Input name="label" type="text" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 12 }>
            <FormItem required={ true } unvalidateMsg="请选择属性类型">
              <Label>数据类型</Label>
              <Select dataSource={ `${ context.contextPath }/v1/dictcategorys/metadata_datatype/dictdetails/combobox` } name="metadataInfo.metadataDataType" showClear={ false } placeholder="Please select" value="70" />
            </FormItem>
          </Col>
          <Col size={ 12 }>
            <FormItem required={ true } unvalidateMsg="请选择控件类型">
              <Label>控件类型</Label>
              <Select dataSource={ `${ context.contextPath }/v1/dictcategorys/metadata_module/dictdetails/combobox` } name="metadataInfo.metadataModule" showClear={ false } value="10" onChange={ ( selectedValue ) => this.handleSelectChange( selectedValue ) } />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 12 }>
            <FormItem required={ true } unvalidateMsg="请输入属性单位">
              <Label>属性单位</Label>
              <Input name="metadataInfo.metadatanit" type="text" pattern={ /^[a-zA-Z0-9\u4e00-\u9fa5]+$/ } />
            </FormItem>
          </Col>
          <Col size={ 12 }>
            <FormItem>
              <Label>属性描述</Label>
              <Input name="attrDesc" type="text" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 12 }>
            <FormItem required={ true }>
              <Label>是否必填</Label>
              <Select dataSource={ `${ context.contextPath }/v1/dictcategorys/yes_or_no/dictdetails/combobox` } name="metadataInfo.metadataIsRequired" value="0" />
            </FormItem>
          </Col>
          <Col size={ 12 }>
            <FormItem>
              <Label>属性填写提示</Label>
              <Input name="attrTips" type="text" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 12 }>
            <FormItem>
              <Label>校验规则</Label>
              <Input name="validateInfo.validateRole" type="text" />
            </FormItem>
          </Col>
          <Col size={ 12 }>
            <FormItem>
              <Label>校验提示</Label>
              <Input name="validateInfo.validateTips" type="text" />
            </FormItem>
          </Col>
        </Row>
        {
          Number( this.state.selectedValue ) !== 10 && Number( this.state.selectedValue ) !== 50 ?
            <Row>
              <Col size={ 2 }>
                <Label style={ { width: '100%', textAlign: 'right', marginLeft: '12px' } }>初始值</Label>
              </Col>
              <Col size={ 12 }>
                <CommInitialValue getter={ this.handleKvpGetter } />
              </Col>
            </Row>
            : null
        }
        <Button type="primary" onClick={ this.handleCloseModal }>返回</Button>
        <Button type="primary" onClick={ this.handleReset.bind( this ) }>重置</Button>
        <Button type="primary" htmlType="submit" disabled={ this.state.submitBtn } >保存</Button>
      </Form>
    );
  }
}

export { AddModal };
export default AddModal;
