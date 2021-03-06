import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Label, Button, Input, Select, Textarea, Upload, FormItem, Form, Container, Row, Col, Notification } from 'epm-ui';

import { getDynamicForm } from '../components/commons/dynamicForm';
import { ServiceAddDivider } from '../components/service-register/divider';
import { AttrOperationTable } from '../components/service-register/attr-operation-table';
import { AttributesOperation } from '../components/service-register/attributes-operation';
import { AttrOperationImport } from '../components/service-register/attr-operation-import';

import { getDataSource } from '../utilities/dataSource';
import { popup } from '../utilities/transient';

import context from 'context';

/**
 *@author sshuzhong
 *@mailTo <a href="mailto:songshuzhong@bonc.com.cn">Song ShuZhong</a>
 *@Date 2017/12/18
 *@desc 新增服务
 */
class ServiceRegister extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      extList: '',
      attrTable: [],
      providerId: '',
      modalFormIndex: 0,
      modalFormData: {},
      formIsValid: false,
      svcOnBtn: false,
      svcTemBtn: false,
      formModalVisiable: false,
      importModalVisiable: false
    };

    this.handleAttrOperationGetter = this.handleAttrOperationGetter.bind( this );
    this.handleAttrTableDelete = this.handleAttrTableDelete.bind( this );
    this.handleAttrTableEdit = this.handleAttrTableEdit.bind( this );
    this.handleModalClose = this.handleModalClose.bind( this );
    this.handleModalOpen = this.handleModalOpen.bind( this );
    this.handleImportModalOpen = this.handleImportModalOpen.bind( this );
    this.handleImportModalClose = this.handleImportModalClose.bind( this );
    this.onAsyncSubmit = this.onAsyncSubmit.bind( this );
    this.getProviderId = this.getProviderId.bind( this );
    this.handleFormChange = this.handleFormChange.bind( this );
    this.handleAfterSubmit = this.handleAfterSubmit.bind( this );
    this.handleAttrAndResGetter = this.handleAttrAndResGetter.bind( this );
    this.isSvcCodeAlreadyExists = this.isSvcCodeAlreadyExists.bind( this );
    this.formGetter = this.formGetter.bind( this );
    this.handleSvcTemporary = this.handleSvcTemporary.bind( this );
  }

  componentDidMount() {
    getDataSource( `${ context.contextPath }/v1/svcexts`, ( extList ) => this.setState( { extList } ) );
  }

  handleModalOpen() {
    let { attrTable, modalFormIndex } = this.state;

    modalFormIndex = attrTable.length;

    this.setState( { modalFormIndex, modalFormData: {}, formModalVisiable: true } );
  }

  handleImportModalOpen() {
    this.setState( { importModalVisiable: true } );
  }

  handleImportModalClose() {
    this.setState( { importModalVisiable: false } );
  }

  handleModalClose() {
    this.setState( { modalFormData: {}, formModalVisiable: false } );
  }

  /**
   *
   * @param formData
   *
   * @param formModalVisiable
   * @param onEdit
   */
  handleAttrOperationGetter( formData, formModalVisiable, onEdit ) {
    let { attrTable, modalFormIndex } = this.state;

    if ( onEdit ) {
      attrTable.splice( modalFormIndex, 1, formData );
    } else {
      attrTable.push( formData );
      modalFormIndex += 1;
    }

    this.setState( { attrTable, modalFormIndex, formModalVisiable: formModalVisiable } );
  }

  /**
   *
   * @param attrListChecked
   * @param resListChecked
   */
  handleAttrAndResGetter( attrListChecked, resListChecked ) {
    let { attrTable } = this.state;
    let subAttrTable = attrListChecked.concat( resListChecked );

    subAttrTable.forEach( ( o ) => {
      let temp = {};

      for ( let name in o )
        if ( name !== 'valueId' )
          temp[ `cAttrFormInfoList[${ attrTable.length }].${ name }` ] = o[ name ];

      attrTable.push( temp );
    } );

    this.setState( { attrTable } );
  }

  /**
   *
   * @param modalFormIndex
   */
  handleAttrTableDelete( modalFormIndex ) {
    let { attrTable } = this.state;

    attrTable.splice( modalFormIndex, 1 );

    this.setState( { attrTable } );
  }

  /**
   * @param modalFormIndex
   * @desc edit
   */
  handleAttrTableEdit( modalFormIndex ) {
    let { attrTable } = this.state;

    this.setState( { modalFormIndex, formModalVisiable: true, modalFormData: attrTable[ modalFormIndex ] } );
  }

  /**
   * @param providerId
   * @desc save providerId
   */
  getProviderId( providerId ) {
    this.setState( { providerId }, () => this.isSvcCodeAlreadyExists() );
  }

  /**
   * @param svcCode
   * @desc判断服务编码是否重复注册
   */
  isSvcCodeAlreadyExists( svcCode ) {
    if ( this.svcVersion && this.svcCode && this.state.providerId ) {
      getDataSource( `${ context.contextPath }/v1/services/validate/${ this.state.providerId }/svcCode/${ this.svcCode }/svcVersion/${ this.svcVersion }`,
        ( res ) => popup( <Notification key={ Math.random().toString() } message="通知" type={ res.code == 1? 'success': 'error' } description={ res.message } /> ) );
    }
  }

  formGetter( getter ) {
    this.getValue = getter.value;
  };

  /**
   * @desc 异步暂存提交
   */
  handleSvcTemporary() {
    let formData = this.getValue( true ).value;
    let { attrTable, formIsValid } = this.state;

    if ( !formIsValid ) {
      popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="抱歉，暂存失败，请检查您的输入是否合法！" /> );
      return;
    }

    let form = new FormData();

    for ( let name in formData ) {
      if ( name == 'svcIcon' )
        form.append( name, formData[ name ][ 0 ] );
      if ( name == 'cServiceInfo.svcState')
        form.append( 'cServiceInfo.svcState', '10' );
      else
        form.append( name, formData[ name ] );
    }

    attrTable.forEach( ( attr ) => {
      for ( let name in attr ) {
        form.append( name, attr[ name ] );
      }
    } );

    fetch( `${ context.contextPath }/v1/services/register`, { method: 'post', credentials: 'same-origin', body: form } )
      .then( ( response ) => response.json() )
      .then( ( callback ) => {
        if ( callback.code == 201 )
          popup( <Notification key={ Math.random().toString() } message="通知" type="success" description="恭喜，您暂存成功，即将跳转到列表页面！" onDismiss={ () => this.context.router.history.push( '/console-home/service-manage' ) } /> );
        else
          popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="抱歉，暂存失败，请检查您的输入是否合法！" /> );
      } ).catch( ( err ) => popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="抱歉，暂存失败，请检查您的输入是否合法！" /> ) );
  };

  handleFormChange( formData, isValid ) {
    this.setState( { formIsValid: isValid } );
  }

  /**
   *
   * @param formData
   * @returns {*}
   * @desc 异步提交
   */
  onAsyncSubmit( formData ) {
    let { attrTable } = this.state;

    this.setState( { svcOnBtn: true, svcTemBtn: true } );

    attrTable.forEach( ( attr ) => {
      for ( let name in attr ) {
        formData[ name ] = attr[ name ];
      }
    } );

    return formData;
  }

  handleAfterSubmit( callback ) {
    if ( callback.code == 201 )
      popup( <Notification key={ Math.random().toString() } message="通知" type="success" description="恭喜，您注册成功，即将跳转到列表页面！" onDismiss={ () => this.context.router.history.push( '/console-home/service-manage' ) } /> );
    else
      popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="抱歉，注册失败，请检查您的输入是否合法！" /> );

    this.setState( { svcOnBtn: false, svcTemBtn: false } );
  }

  /**
   * render
   */
  render() {
    let { attrTable, providerId, formModalVisiable, importModalVisiable, modalFormIndex, modalFormData } = this.state;

    return (
      <Container type="fluid">
        <Row>
          <Form
            method="post"
            async={ true }
            type="horizontal"
            enctype="multipart/form-data"
            getter={ this.formGetter }
            onSubmit={ this.onAsyncSubmit }
            onChange={ this.handleFormChange }
            onAfterSubmit={ this.handleAfterSubmit }
            action={ `${ context.contextPath }/v1/services/register` }
          >
            <ServiceAddDivider title="1.服务基本信息" />
            <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
              <FormItem name="cServiceInfo.svcName" required unvalidateMsg="请输入属性名（中文、字母、数字、下划线组合，且不以下划线开头）">
                <Label>服务名称</Label>
                <Input type="text" pattern={ /^(?!_)[a-zA-Z0-9_\u4e00-\u9fa5]+$/ }/>
              </FormItem>
            </Col>
            <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
              <FormItem name="cServiceInfo.svcCategoryInfo.cataId" required unvalidateMsg="请输入属性名（中文、字母、数字、下划线组合，且不以下划线开头）">
                <Label>服务类型</Label>
                <Select key="svccategorys" dataSource={ `${ context.contextPath }/v1/svccategorys/combobox` } placeholder="请选择..." />
              </FormItem>
            </Col>
            <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
              <FormItem name="cServiceInfo.svcDesc" required unvalidateMsg="请输入服务描述（中文、字母、数字 ）">
                <Label>服务描述</Label>
                <Textarea rows={ 4 } pattern={ /^[a-zA-Z0-9\s\u4e00-\u9fa5]+$/ } />
              </FormItem>
            </Col>
            <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } } style={ { position: 'absolute', top: '-1000px' } }>
              <FormItem name="cServiceInfo.svcState" required>
                <Input value={ 20 } />
              </FormItem>
            </Col>
            <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
              <FormItem name="svcIcon" required unvalidateMsg="请选择服务LOGO！">
                <Label>服务LOGO</Label>
                <Upload draggable={ true } />
              </FormItem>
            </Col>
            <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
              <FormItem name="cServiceInfo.svcCode" required unvalidateMsg="请输入服务编码（中文、字母、数字、下划线组合，且不以下划线开头）">
                <Label>服务编码</Label>
                <Input pattern={ /^(?!_)[a-zA-Z0-9_\u4e00-\u9fa5]+$/ } onBlur={ this.isSvcCodeAlreadyExists } onChange={ ( value ) => this.svcCode = value } />
              </FormItem>
            </Col>
            <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
              <FormItem name="cServiceInfo.svcProviderInfo.providerId" required unvalidateMsg="请选择服务提供方！">
                <Label>服务提供方</Label>
                <Select key="svcProviders" dataSource={ `${ context.contextPath }/v1/svcProviders/combobox` } onChange={ this.getProviderId } />
              </FormItem>
            </Col>
            <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
              <FormItem name="cServiceInfo.svcVersion" required unvalidateMsg="请输入服务版本（例：V1）">
                <Label>服务版本</Label>
                <Input pattern={ /^[a-zA-Z0-9\u4e00-\u9fa5]+$/ } onBlur={ this.isSvcCodeAlreadyExists } onChange={ ( value ) => this.svcVersion = value } />
              </FormItem>
            </Col>
            {
              this.state.extList ? getDynamicForm( this.state.extList ) : null
            }
            <ServiceAddDivider title="2.属性配置" />
            <Col size={ { normal: 24, small: 24, medium: 24, large: 24 } } style={ { textAlign: 'center' } }>
              <div style={ { float: 'left' } }>
                <Button onClick={ this.handleModalOpen }>增加属性</Button>
                <Button onClick={ this.handleImportModalOpen }>导入属性</Button>
              </div>
              <AttrOperationTable key="attrTable" dataSource={ attrTable } modalFormIndex={ modalFormIndex } onAttrTableDelete={ this.handleAttrTableDelete } onAttrTableEdit={ this.handleAttrTableEdit } />
              <AttributesOperation key="attrOpera" formModalVisiable={ formModalVisiable } modalFormIndex={ modalFormIndex } modalFormData={ modalFormData } getter={ this.handleAttrOperationGetter } onFormModalClose={ this.handleModalClose } />
              <AttrOperationImport key="attrImport" dataSource={ attrTable } providerId={ providerId } importModalVisiable={ importModalVisiable } onImportModalClose={ this.handleImportModalClose } getter={ this.handleAttrAndResGetter } />
            </Col>
            <Col size={ { normal: 24, small: 24, medium: 24, large: 24 } }>
              <Button disabled={ this.state.svcOnBtn } htmlType="submit">注册</Button>
              <Button disabled={ this.state.svcTemBtn } onClick={ this.handleSvcTemporary }>暂存</Button>
              <Button onClick={ () => this.context.router.history.push( '/console-home/service-manage' ) }>取消</Button>
            </Col>
          </Form>
        </Row>
      </Container>
    );
  }
}

ServiceRegister.contextTypes = {
  router: PropTypes.object.isRequired,
};

export { ServiceRegister };
export default ServiceRegister;