import React, { Component } from 'react';

import { Row, Col, Button, Select, Form, Loading, Input, Label, FormItem, Notification } from 'epm-ui';

import CommInitialValue from './props-initial';

import { popup } from '../../utilities/transient';

import { getDataSource } from '../../utilities/dataSource';

import context from 'context';

/**
 *author: wangxiang
 *desc: 属性库管理-编辑modal
 *date:  2017/12/24
 */
class EditModal extends Component {

  constructor( props ) {
    super( props );

    this.state = { editObj: props.editObj, valueObject: '', selectedValue: ( props.editObj && props.editObj.metadataInfo ) ? props.editObj.metadataInfo.metadataModule : '10', submitBtn: false };

    this.handleResetEditForm = this.handleResetEditForm.bind( this );
    this.handleCloseModal = this.handleCloseModal.bind( this );
    this.formGetterForEdit = this.formGetterForEdit.bind( this );
    this.onAsyncEditSubmit = this.onAsyncEditSubmit.bind( this );
    this.onAfterEditSubmit = this.onAfterEditSubmit.bind( this );
    this.handleValue = this.handleValue.bind( this );
    this.handleKvpGetter = this.handleKvpGetter.bind( this );
  }

  componentWillReceiveProps( nextProps ) {

    if ( this.props.editObj !== nextProps.editObj ) {

      this.setState( { editObj: nextProps.editObj, selectedValue: ( nextProps.editObj && nextProps.editObj.metadataInfo ) ? nextProps.editObj.metadataInfo.metadataModule : '10' } );

    }
  }

  handleValue() {
    const data = this.getValueForEdit;
    let str = JSON.stringify( data, null, 2 );

    //console.log( str );
  }

  handleCloseModal() {
    this.props.handleCloseEditModal();
  }

  handleResetEditForm( trigger ) {
    this.editReset = trigger.reset;
  }

  formGetterForEdit( getter ) {
    this.getValueForEdit = getter.value;
  }

  // 编辑 表单提交
  onAsyncEditSubmit( formData ) {

    // console.log( 'onAsyncEditSubmit...........' )
    const validateRole = formData[ 'validateInfo.validateRole' ];

    formData[ 'metadataInfo.metadataIsValidate' ] = validateRole === '' ? '0' : '1';

    if ( this.state.initType ) {
      formData[ 'initInfo.initType' ] = ( this.state.valueObject !== '' && this.state.valueObject !== '[]' ) ? this.state.initType : null;
      formData[ 'initInfo.valueObject' ] = ( this.state.valueObject !== '' && this.state.valueObject !== '[]' ) ? this.state.valueObject : null;
      formData[ 'metadataInfo.metadataIsInit' ] = ( this.state.valueObject !== '' && this.state.valueObject !== '[]' ) ? '1' : '0';
    } else if ( this.state.editObj.initInfo ) {
      formData[ 'initInfo.initType' ] = this.state.editObj.initInfo.initType;
      formData[ 'initInfo.valueObject' ] = this.state.editObj.initInfo.valueObject;
      formData[ 'metadataInfo.metadataIsInit' ] = this.state.editObj.metadataInfo.metadataIsInit;
    } else {
      formData[ 'initInfo.initType' ] = 0;
      formData[ 'initInfo.valueObject' ] = '';
      formData[ 'metadataInfo.metadataIsInit' ] = this.state.editObj.metadataInfo.metadataIsInit;
    }

    const { attrId, createDate, createBy } = this.state.editObj;

    formData[ 'attrId' ] = attrId;
    formData[ 'createDate' ] = createDate;
    formData[ 'createBy' ] = createBy;

    return formData;
  }

  // 编辑 表单提交后重新获取data
  onAfterEditSubmit( formData ) {
    this.props.handleCloseEditModal();

    if ( parseInt( formData.code ) === 201 ) {
      this.props.fetchInitData();
      popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ formData.message } /> );
    } else {
      popup( <Notification key={ Math.random().toString() } message="通知" type="error" description={ formData.message } /> );
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

  // 属性编码唯一性校验
  checkAttrCode( value ) {
    if ( value !== '' ) {
      getDataSource( `${ context.contextPath }/v1/attrLibInfos/${ value }/verify?attrId=${ this.state.editObj.attrId }`, ( callback ) => {

        if ( parseInt( callback.code ) === 0 ) {
          this.setState( { submitBtn: true } );
          popup(
            <Notification
              type="error"
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

  handleSelectChange( selectedValue ) {
    this.setState( { selectedValue } );
  }

  render() {
    return (
      <Form
        method="put"
        type="horizontal"
        async={ true }
        action={ `${ context.contextPath }/v1/attrLibInfos` }
        onSubmit={ this.onAsyncEditSubmit }
        onAfterSubmit={ this.onAfterEditSubmit }
        getter={ this.formGetterForEdit }
        trigger={ this.handleResetEditForm }
      >
        <Row>
          <Col size={ 12 }>
            <FormItem required={ true } unvalidateMsg="请输入属性名（中文、字母、数字、下划线组合，且不以下划线开头）">
              <Label>属性名</Label>
              <Input name="attrName" type="text" value={ this.state.editObj ? this.state.editObj.attrName : '' } pattern={ /^(?!_)[a-zA-Z0-9_\u4e00-\u9fa5]+$/ } />
            </FormItem>
          </Col>
          <Col size={ 12 }>
            <FormItem unvalidateMsg="请输入正确格式的属性英文名（英文字母）">
              <Label>属性英文名</Label>
              <Input name="attrEnname" type="text" value={ this.state.editObj ? this.state.editObj.attrEnname : '' } pattern={ /^$|^[A-Za-z]+$/ } />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 12 }>
            <FormItem required={ true } unvalidateMsg="请输入属性编码（字母、下划线组合，不以下划线开头）" >
              <Label>属性编码</Label>
              <Input name="attrCode" disabled type="text" value={ this.state.editObj ? this.state.editObj.attrCode : '' } onChange={ this.checkAttrCode.bind( this ) } pattern={ /^(?!_)[a-zA-Z_]+$/ } />
            </FormItem>
          </Col>
          <Col size={ 12 }>
            <FormItem unvalidateMsg="请输入标签内容">
              <Label>标签</Label>
              <Input name="label" type="text" value={ this.state.editObj ? this.state.editObj.label : '' } />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 12 }>
            <FormItem required={ true } unvalidateMsg="请选择属性类型">
              <Label>数据类型</Label>
              <Select dataSource={ `${ context.contextPath }/v1/dictcategorys/metadata_datatype/dictdetails/combobox` } showClear={ false } name="metadataInfo.metadataDataType" placeholder="Please select" value={ `${ ( this.state.editObj && this.state.editObj.metadataInfo ) ? this.state.editObj.metadataInfo.metadataDataType : '70' }` } />
            </FormItem>
          </Col>
          <Col size={ 12 }>
            <FormItem required={ true } unvalidateMsg="请选择控件类型">
              <Label>控件类型</Label>
              <Select dataSource={ `${ context.contextPath }/v1/dictcategorys/metadata_module/dictdetails/combobox` } showClear={ false } name="metadataInfo.metadataModule" value={ `${ ( this.state.editObj && this.state.editObj.metadataInfo ) ? this.state.editObj.metadataInfo.metadataModule : '10' }` } onChange={ ( selectedValue ) => this.handleSelectChange( selectedValue ) } />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 12 }>
            <FormItem required={ true } unvalidateMsg="请输入属性单位">
              <Label>属性单位</Label>
              <Input name="metadataInfo.metadatanit" type="text" value={ this.state.editObj ? this.state.editObj.metadataInfo.metadatanit : '' } pattern={ /^[a-zA-Z0-9\u4e00-\u9fa5]+$/ } />
            </FormItem>
          </Col>
          <Col size={ 12 }>
            <FormItem>
              <Label>属性描述</Label>
              <Input name="attrDesc" type="text" value={ this.state.editObj ? this.state.editObj.attrDesc : '' } />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 12 }>
            <FormItem required={ true }>
              <Label>是否必填</Label>
              <Select dataSource={ `${ context.contextPath }/v1/dictcategorys/yes_or_no/dictdetails/combobox` } name="metadataInfo.metadataIsRequired" value={ this.state.editObj ? ( this.state.editObj.metadataInfo.metadataIsRequired ? '1' : '0' ) : '0' } />
            </FormItem>
          </Col>
          <Col size={ 12 }>
            <FormItem>
              <Label>属性填写提示</Label>
              <Input name="attrTips" type="text" value={ this.state.editObj ? this.state.editObj.attrTips : '' } />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col size={ 12 }>
            <FormItem>
              <Label>校验规则</Label>
              <Input name="validateInfo.validateRole" type="text" value={ ( this.state.editObj && this.state.editObj.validateInfo ) ? this.state.editObj.validateInfo.validateRole : '' } />
            </FormItem>
          </Col>
          <Col size={ 12 }>
            <FormItem>
              <Label>校验提示</Label>
              <Input name="validateInfo.validateTips" type="text" value={ ( this.state.editObj && this.state.editObj.validateInfo ) ? this.state.editObj.validateInfo.validateTips : '' } />
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
                <CommInitialValue getter={ this.handleKvpGetter } initInfo={ this.state.editObj ? this.state.editObj.initInfo : null } />
              </Col>
            </Row>
            : null
        }
        <Button type="primary" onClick={ this.handleCloseModal }>返回</Button>
        <Button type="primary" htmlType="submit" disabled={ this.state.submitBtn } >保存</Button>
      </Form>
    );
  }
}

export { EditModal };
export default EditModal;
