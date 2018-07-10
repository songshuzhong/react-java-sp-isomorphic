import React, { Component } from 'react';

import { Container, Row, Col, Form, FormItem, Input, Label, Modal, ModalHeader, ModalBody, Button, Select, Table, Column, Icon, Pagination, Dialog, Notification, Loading } from 'epm-ui';

import ServiceAttrLibList from '../components/service-expand/service-attrLibList';
import ServiceExpandAttr from '../components/service-expand/service-attrexpand';

import { getDataSource } from '../utilities/dataSource';
import { popup } from '../utilities/transient';
import uuid from '../utilities/uuid';
import context from 'context';

/**
 *@author renxuanwei
 *@mailTo <a href="mailto:renxuanwei@bonc.com.cn">renxuanwei</a>
 *@Date 2017/12/25.
 *@desc
 */
class ServiceExpands extends Component {

  constructor() {
    super();
    this.state = {
      pageNo: 1,
      pageSize: 10,
      keywords: '',
      tableData: '',
      editData: null,
      shouldInit: false,
      shouldEditInit: false,
      isHaveDefaultValue: false,
      attrCodeList: null
    };

    this.fetchTableData = this.fetchTableData.bind( this );
    this.closeAddDataModal = this.closeAddDataModal.bind( this );
    this.closeEditDataModal = this.closeEditDataModal.bind( this );
    this.closeImportDataModal = this.closeImportDataModal.bind( this );
    this.formGetterForAdd = this.formGetterForAdd.bind( this );
    this.onAddSubmit = this.onAddSubmit.bind( this );
    this.handleResetForm = this.handleResetForm.bind( this );
    this.onEditSubmit = this.onEditSubmit.bind( this );
    this.onAfterSubmitEdit = this.onAfterSubmitEdit.bind( this );
    this.handleAttrCodeChange = this.handleAttrCodeChange.bind( this );
    this.handleSearch = this.handleSearch.bind( this );
    this.handleSearchName = this.handleSearchName.bind( this );
    this.handleResetSearchForm = this.handleResetSearchForm.bind( this );
  }

  componentDidMount() {
    this.fetchTableData();
    this.fetchAttrCodeList();
  }

  fetchTableData() {
    const { pageNo, pageSize, keywords } = this.state;

    getDataSource( `${ context.contextPath }/v1/services/ext/page?pageNo=${ pageNo }&pageSize=${ pageSize }&searchName=${ keywords }`, ( tableData ) => {
      this.setState( { tableData } );
    } );
  }

  fetchAttrCodeList() {
    getDataSource( `${ context.contextPath }/v1/services/attrCode/10/list`, ( attrCodeList ) => {
      this.setState( { attrCodeList } );
    } );
  }

  handleClickAdd() {
    this.setState( { addvisible: true } );
  }

  handleClickEdit( value ) {
    getDataSource( `${ context.contextPath }/v1/services/ext/${ value.extId }/detail`, ( editData ) => {

      let attrModule = editData.cSvcExtInfo.cAttrInfo.cAttrMetadataInfo.metadataModule;
      if( attrModule != 10 && attrModule != 50 ) {
        this.setState( { editData, isHaveDefaultValue: true } );
      }else {
        this.setState( { editData, isHaveDefaultValue: false } );
      }
    } );
    this.setState( { editvisible: true } );
  }

  handleClickImport( value ) {
    this.setState( { importvisible: true } );
  }

  closeAddDataModal() {
    this.setState( { addvisible: false, shouldInit: false }, this.reset() );
  }

  closeEditDataModal() {
    this.setState( { editvisible: false, editData: null } );
  }

  closeImportDataModal() {
    this.setState( { importvisible: false } );
  }

  showDeleteDialog( value ) {
    popup( <Dialog
      title="删除确认"
      message="确认删除该属性么？"
      type="confirm"
      icon="danger"
      approveBtnOnClick={ ( after ) => this.handleDelete( after, value.extId ) }
           /> );
  }

  handleDelete( after, extId ) {
    getDataSource( {
      url: `${ context.contextPath }/v1/services/ext/${ extId }`,
      params: { method: 'delete' }
    }, ( callback ) => {
      if ( callback.code === 204 ) {
        this.fetchTableData();
        after( true );
        popup( <Notification message="删除成功" description={ callback.message } type='success' key={ Math.random().toString() } /> );
      } else {
        after( true );
        popup( <Notification message="删除失败" description={ callback.message } type='error' key={ Math.random().toString() } /> );
      }
    } );
  }

  formGetterForAdd( getter ) {
    this.getValueForAdd = getter.value;
  }

  rebuildFormData( formData ) {

    formData[ 'metadataIsValidate' ] = ( formData.validateRole.length > 0 ) ? 1 : 0;
    if ( !this.state.shouldInit ){
      formData[ 'metadataIsInit' ] = false;
      formData[ 'initType' ] = null;
      formData[ 'valueObject' ] = '';
    } else {
      formData[ 'metadataIsInit' ] = this[ 'isAddInit' ];
      formData[ 'initType' ] = this[ 'addInitType' ];
      formData[ 'valueObject' ] = this[ 'addExpandAttr' ];
    }

    return formData;
  }

  onAddSubmit( formData ) {
    if ( !this[ 'codeConfirm' ] ) {
      this.refs.attrCodeConfirm.style.display = 'block';

      return;
    }

    return this.rebuildFormData( formData );
  }

  onEditSubmit( formData ) {
    return this.rebuildEditFormData( formData );
  }

  rebuildEditFormData( formData ) {
    formData[ 'metadataIsValidate' ] = ( formData.validateRole.length > 0 ) ? 1 : 0;
    if ( !this.state.isHaveDefaultValue ){
      formData[ 'metadataIsInit' ] = false;
      formData[ 'initType' ] = null;
      formData[ 'valueObject' ] = '';
    } else {
      formData[ 'metadataIsInit' ] = this[ 'isAddInit' ];
      formData[ 'initType' ] = this[ 'addInitType' ];
      formData[ 'valueObject' ] = this[ 'addExpandAttr' ];
    }

    return formData;
  }

  onAfterSubmitAdd( data ) {
    if( data.code == 201 ) {
      popup( <Notification message="操作成功" type='success' key={ Math.random().toString() } /> );
      this.reset();
      this.fetchTableData();
      this.setState( { addvisible: false, shouldInit: false } );
    } else {
      popup( <Notification message="操作失败" type='error' key={ Math.random().toString() } /> );
      this.reset();
      this.fetchTableData();
      this.setState( { addvisible: false, shouldInit: false } );
    }
  }

  onAfterSubmitEdit( data ) {
    if( data.code == 201 ) {
      popup( <Notification message="操作成功" type='success' key={ Math.random().toString() } /> );
      this.fetchTableData();
      this.setState( { editvisible: false, editData: null } );
    } else {
      popup( <Notification message="操作失败" type='error' key={ Math.random().toString() } /> );
      this.fetchTableData();
      this.setState( { editvisible: false, editData: null } );
    }
  }

  handlePaginationChange( pageNo, pageSize ) {
    this.setState( { pageNo, pageSize }, this.fetchTableData );
  }

  handleSearchName( value ) {
    this[ 'keyWords' ] = value;
    this.setState( { keywords: value } );
  }

  handleResetForm( trigger ) {
    this.reset = trigger.reset;
  }

  hadleShowEditInit( editData ) {
      let initValue = editData.cSvcExtInfo.cAttrInfo.cAttrMetadataInfo.cAttrInitInfo ? editData.cSvcExtInfo.cAttrInfo.cAttrMetadataInfo.cAttrInitInfo.valueObject : '';
      let initType = editData.cSvcExtInfo.cAttrInfo.cAttrMetadataInfo.cAttrInitInfo ? editData.cSvcExtInfo.cAttrInfo.cAttrMetadataInfo.cAttrInitInfo.initType : 10;

      return (
        <ServiceExpandAttr handleGetValue={ this.handleGetValue.bind( this ) } initType={ initType } initValue={ initValue } />
      );
  }

  handleSelectAttr( val ) {
    this[ 'selectAttr' ] = val;
  }

  checkSelectAttr( attrs ) {
    if ( attrs.length <= 0 ) {
      popup( <Notification message="请选择导入属性" type='warning' key={ Math.random().toString() } /> );

      return false;
    }
    let result = [];
    let codeList = this.state.attrCodeList;

    for ( let i = 0; i < attrs.length; i++ ) {
      if ( !this.contains( attrs[ i ].attrCode, codeList ) ) {
        result.push( attrs[ i ].attrId );
      } else {
        popup( <Notification message={ `属性${ attrs[ i ].attrName }重复，请重新选择！` } type='warning' key={ Math.random().toString() } /> );

        return false;
      }
    }
    this[ 'checkAttr' ] = result.join( ',' );

    return true;
  }

  handleImport() {
    if ( this.checkSelectAttr( this[ 'selectAttr' ] ) ) {
      getDataSource( `${ context.contextPath }/v1/services/ext/attrLib?attrIds=${ this[ 'checkAttr' ] }`, ( callback ) => {
        if ( callback.code === 201 ) {
          popup( <Notification message={ '导入属性成功！' } description={ callback.message } type='success' key={ Math.random().toString() } /> );
          this.fetchTableData();
          this.fetchAttrCodeList();
          this.closeImportDataModal();
        } else {
          popup( <Notification message={ '导入属性失败！' } description={ callback.message } type='error' key={ Math.random().toString() } /> );
        }
      } );
    }
  }

  handleGetValue( data, type, isInit ) {
    this[ 'addInitType' ] = type;
    this[ 'addExpandAttr' ] = data;
    this[ 'isAddInit' ] = isInit;
  }

  contains( str, arr ) {
    for ( let i in arr ) {
      if ( arr[ i ] === str ) return true;
    }

    return false;
  }

  handleAttrCodeChange( data ) {
    let codeList = this.state.attrCodeList;

    if ( this.contains( data, codeList ) ) {
      this[ 'codeConfirm' ] = false;
      this.refs.attrCodeConfirm.style.display = 'block';
    } else {
      this[ 'codeConfirm' ] = true;
      this.refs.attrCodeConfirm.style.display = 'none';
    }
  }

  handleSearch() {
    this.setState( { pageNo: 1, keywords: this[ 'keyWords' ] }, this.fetchTableData );
  }

  handleShowAll() {
    this.searchReset();
    this[ 'keyWords' ] = '';
  }

  handleResetSearchForm( trigger ) {
    this.searchReset = trigger.reset;
  }

  handleAddSelectChange( selectValue ) {

    switch ( selectValue ) {
      case '10':
        this.setState( { shouldInit: false } );
        break;
      case '20':
        this.setState( { shouldInit: true } );
        break;
      case '30':
        this.setState( { shouldInit: true } );
        break;
      case '40':
        this.setState( { shouldInit: true } );
        break;
      case '50':
        this.setState( { shouldInit: false } );
        break;
      default:
        return;
    }
  }

  handleEditSelectChange( selectValue ) {

    switch ( selectValue ) {
      case '10':
        this.setState( { isHaveDefaultValue: false } );
        break;
      case '20':
        this.setState( { isHaveDefaultValue: true } );
        break;
      case '30':
        this.setState( { isHaveDefaultValue: true } );
        break;
      case '40':
        this.setState( { isHaveDefaultValue: true } );
        break;
      case '50':
        this.setState( { isHaveDefaultValue: false } );
        break;
      default:
        return;
    }
  }

  render() {
    const { pageNo, pageSize } = this.state;

    let data = this.state.tableData;
    let editData = this.state.editData;

    return (

      <Container type="fluid" style={ { marginTop: '20px' } }>
        <Row>
          <Col size={ 24 }>
            <Form
              type="inline"
              async={ true }
              trigger={ this.handleResetSearchForm }
            >
              <FormItem>
                <Input name="searchName" style={ { width: '400px' } } placeholder="属性名/属性英文名/code码" onChange={ this.handleSearchName } />
              </FormItem>
              <Button shape="default" onClick={ this.handleSearch }>搜索</Button>
              <Button shape="default" onClick={ this.handleShowAll.bind( this ) }>重置</Button>
              <div style={ { float: 'right' } }>
                <Button shape="default" onClick={ this.handleClickAdd.bind( this ) }>新增</Button>
              </div>
              <div style={ { float: 'right' } }>
                <Button shape="default" onClick={ this.handleClickImport.bind( this ) }>导入</Button>
              </div>
            </Form>
          </Col>
        </Row>
        <Row>
          {
            data ?
              <Col size={ 24 }>
                <Table dataSource={ data.data } headMenu={ true } textAlign="center" bgColor={ { head: '#ecf5fe' } } headBolder={ true } striped={ true } complex >
                  <Column title="序号" scaleWidth="5%">
                    { ( value, index ) => <div style={ { padding: '.5rem .5rem .5rem .9rem' } }>{ 1 + parseInt( index ) + ( ( this.state.pageNo - 1 ) * this.state.pageSize ) }</div> }
                  </Column>
                  <Column title="属性名" dataIndex="cAttrInfo" scaleWidth="10%" color={ { head: '#18335d' } } textAlign="left">
                    {
                      ( value ) => {
                        let cname = value.attrName;

                        if ( cname ) {
                          return cname;
                        } else {
                          return '-';
                        }
                      }
                    }
                  </Column>
                  <Column title="属性code" dataIndex="cAttrInfo" scaleWidth="10%" color={ { head: '#18335d' } } textAlign="left">
                    {
                      ( value ) => {
                        let code = value.attrCode;

                        if ( code ) {
                          return code;
                        } else {
                          return '-';
                        }
                      }
                    }
                  </Column>
                  <Column title="属性英文名" dataIndex="cAttrInfo" scaleWidth="10%" color={ { head: '#18335d' } } textAlign="left">
                    {
                      ( value ) => {
                        let ename = value.attrEnname;

                        if ( ename ) {
                          return ename;
                        } else {
                          return '-';
                        }
                      }
                    }
                  </Column>
                  <Column title="控件类型" dataIndex="cAttrInfo" scaleWidth="10%" color={ { head: '#18335d' } } textAlign="left">
                    {
                      ( value ) => {
                        let child = value.cAttrMetadataInfo;

                        if ( child ) {
                          switch ( value.cAttrMetadataInfo.metadataModule ) {
                            case 10 :
                              return '文本框';
                            case 20 :
                              return '下拉框';
                            case 30 :
                              return '单选框';
                            case 40 :
                              return '复选框';
                            case 50 :
                              return 'Slider滑块';
                            case 60 :
                              return '按钮组';
                            default :
                              return '-';
                          }
                        }
                      }
                    }
                  </Column>
                  <Column title="初始值" dataIndex="cAttrInfo" scaleWidth="15%" color={ { head: '#18335d' } } textAlign="left">
                    {
                      ( value ) => {
                        let child = value.cAttrMetadataInfo.cAttrInitInfo;

                        if ( child ) {
                          let inint = child.valueObject;

                          if ( inint ) {
                            return inint;
                          } else {
                            return '-';
                          }
                        } else {
                          return '-';
                        }
                      }
                    }
                  </Column>
                  <Column title="校验规则" dataIndex="cAttrInfo" scaleWidth="10%" color={ { head: '#18335d' } } textAlign="left">
                    {
                      ( value ) => {
                        let child = value.cAttrMetadataInfo.cAttrValidateInfo;

                        if ( child ) {
                          let validate = child.validateRole;

                          if ( validate ) {
                            return validate;
                          } else {
                            return '-';
                          }
                        } else {
                          return '-';
                        }
                      }
                    }
                  </Column>
                  <Column title="属性描述" dataIndex="cAttrInfo" scaleWidth="15%" color={ { head: '#18335d' } } textAlign="left">
                    {
                      ( value ) => {
                        let desc = value.attrDesc;

                        if ( desc ) {
                          return desc;
                        } else {
                          return '-';
                        }
                      }
                    }
                  </Column>
                  <Column title="操作" scaleWidth="15%">
                    {
                      ( value ) => [
                        <Button key={ uuid() } shape="icon" type="link" onClick={ this.handleClickEdit.bind( this, value ) }><Icon icon="edit" /></Button>,
                        <Button key={ uuid() } shape="icon" type="link" onClick={ this.showDeleteDialog.bind( this, value ) }><Icon icon="trash" /></Button>
                      ]
                    }
                  </Column>
                </Table>
              </Col> : <Col style={ { paddingTop: '60px' } }><Loading type="primary" size="large" /></Col>
          }

        </Row>
        <br />
        <Row>
          <Col size={ 24 }>
            <Pagination
              index={ pageNo }
              total={ data.total }
              size={ pageSize }
              align="right"
              showPagiJump={ true }
              showDataSizePicker={ true }
              onChange={ ( pageNo, pageSize ) => this.handlePaginationChange( pageNo, pageSize ) }
            />
          </Col>
        </Row>
        <Modal visible={ this.state.addvisible } onClose={ this.closeAddDataModal } size="large">
          <ModalHeader>
            <div>新增拓展属性</div>
          </ModalHeader>
          <ModalBody>
            <div ref="saveModal">
              <Form
                method="post"
                type="horizontal"
                async={ true }
                getter={ this.formGetterForAdd }
                action={ `${ context.contextPath }/v1/services/ext` }
                onSubmit={ this.onAddSubmit }
                trigger={ this.handleResetForm }
                onAfterSubmit={ ( formData ) => this.onAfterSubmitAdd( formData ) }
              >
                <Row>
                  <Col size={ 12 }>
                    <FormItem required={ true } unvalidateMsg="请输入属性名（中文，字母、数字、下划线组合，且不以下划线开头）">
                      <Label>属性名</Label>
                      <Input name="attrName" type="text" pattern={ /^(?!_)(?!.*?_$)[a-zA-Z0-9\u4e00-\u9fa5_]+$/ } />
                    </FormItem>
                  </Col>
                  <Col size={ 12 }>
                    <FormItem required={ true } unvalidateMsg="请输入属性英文名（字母、数字、下划线组合，且不以下划线开头）">
                      <Label>属性英文名</Label>
                      <Input name="attrEnname" type="text" pattern={ /^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/ } />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col size={ 12 }>
                    <FormItem required={ true } unvalidateMsg="属性数据类型">
                      <Label>属性数据类型</Label>
                      <Select name="metadataDataType" dataSource={ `${ context.contextPath }/v1/dictcategorys/metadata_datatype/dictdetails/combobox` } placeholder="Please select" value="70" />
                    </FormItem>
                  </Col>
                  <Col size={ 12 }>
                    <FormItem required={ true } unvalidateMsg="请输入属性编码（字母、数字、下划线组合，且不以下划线开头）" >
                      <Label>属性编码</Label>
                      <Input name="attrCode" type="text" onChange={ this.handleAttrCodeChange } pattern={ /^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/ } />
                      <div ref="attrCodeConfirm" className="error-text" style={ { display: 'none' } }>属性编码重复</div>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col size={ 12 }>
                    <FormItem>
                      <Label>属性描述</Label>
                      <Input name="attrDesc" type="text" />
                    </FormItem>
                  </Col>
                  <Col size={ 12 }>
                    <FormItem required={ true } unvalidateMsg="请选择控件类型">
                      <Label>控件类型</Label>
                      <Select name="metadataModule" dataSource={ `${ context.contextPath }/v1/dictcategorys/metadata_module/dictdetails/combobox` } value="10" onChange={ this.handleAddSelectChange.bind( this ) } />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col size={ 12 }>
                    <FormItem>
                      <Label>属性填写提示</Label>
                      <Input name="attrTips" type="text" />
                    </FormItem>
                  </Col>
                  <Col size={ 12 }>
                    <FormItem>
                      <Label>校验规则</Label>
                      <Input name="validateRole" type="text" />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col size={ 12 }>
                    <FormItem>
                      <Label>校验提示</Label>
                      <Input name="validateTips" type="text" />
                    </FormItem>
                  </Col>
                  <Col size={ 12 }>
                    <FormItem>
                      <Label>是否必填</Label>
                      <Select name="metadataIsRequired" dataSource={ `${ context.contextPath }/v1/dictcategorys/yes_or_no/dictdetails/combobox` } value="0" />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col size={ 12 }>
                    <FormItem>
                      <Label>属性单位</Label>
                      <Input name="metadataUnit" type="text" />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col size={ 12 }>
                    {
                      this.state.shouldInit ?
                        <FormItem>
                          <Label>初始值</Label>
                          <div className="epm field">
                            <div>
                              <div className="auto-items">
                                <ServiceExpandAttr handleGetValue={ this.handleGetValue.bind( this ) } initValue={ this.state.shouldInit } />
                              </div>
                            </div>
                          </div>
                        </FormItem>
                        : null
                    }
                  </Col>
                </Row>
                <div style={ { textAlign: 'right', marginTop: '15px', marginBottom: '15px' } }>
                  <Button type="primary" onClick={ this.closeAddDataModal }>返回</Button>
                  <Button onClick={ () => { this.reset(); } }>重置</Button>
                  <Button type="primary" htmlType="submit">保存</Button>
                </div>
              </Form>
            </div>
          </ModalBody>
        </Modal>
        <Modal visible={ this.state.editvisible } onClose={ this.closeEditDataModal } size="large">
          <ModalHeader>
            <div>编辑拓展属性</div>
          </ModalHeader>
          <ModalBody>
            <div ref="editModal">
              <Form
                method="PUT"
                type="horizontal"
                async={ true }
                getter={ this.formGetterForAdd }
                action={ `${ context.contextPath }/v1/services/ext/${ editData ? editData.cSvcExtInfo.extId : '' }` }
                onSubmit={ this.onEditSubmit }
                onAfterSubmit={ ( formData ) => this.onAfterSubmitEdit( formData ) }
              >
                <Row>
                  <Col size={ 12 }>
                    <FormItem required={ true } unvalidateMsg="请输入属性名（中文，字母、数字、下划线组合，且不以下划线开头）">
                      <Label>属性名</Label>
                      <Input name="attrName" type="text" value={ editData ? editData.cSvcExtInfo.cAttrInfo.attrName : '' } pattern={ /^(?!_)(?!.*?_$)[a-zA-Z0-9\u4e00-\u9fa5_]+$/ } />
                    </FormItem>
                  </Col>
                  <Col size={ 12 }>
                    <FormItem required={ true } unvalidateMsg="请输入属性英文名（ 字母、数字、下划线组合，且不以下划线开头 ）">
                      <Label>属性英文名</Label>
                      <Input name="attrEnname" type="text" value={ editData ? editData.cSvcExtInfo.cAttrInfo.attrEnname : '' } pattern={ /^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/ } />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col size={ 12 }>
                    <FormItem required={ true } unvalidateMsg="属性数据类型">
                      <Label>属性数据类型</Label>
                      <Select name="metadataDataType" dataSource={ `${ context.contextPath }/v1/dictcategorys/metadata_datatype/dictdetails/combobox` } placeholder="Please select" value={ editData ? `${ editData.cSvcExtInfo.cAttrInfo.cAttrMetadataInfo.metadataDataType }` : '' } />
                    </FormItem>
                  </Col>
                  <Col size={ 12 }>
                    <FormItem required={ true } unvalidateMsg="请输入属性编码（ 字母、数字、下划线组合，且不以下划线开头 ）">
                      <Label>属性编码</Label>
                      <Input name="attrCode" type="text" value={ editData ? editData.cSvcExtInfo.cAttrInfo.attrCode : '' } pattern={ /^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/ } />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col size={ 12 }>
                    <FormItem>
                      <Label>属性描述</Label>
                      <Input name="attrDesc" type="text" value={ editData ? editData.cSvcExtInfo.cAttrInfo.attrDesc : '' } />
                    </FormItem>
                  </Col>
                  <Col size={ 12 }>
                    <FormItem required={ true } unvalidateMsg="请选择控件类型">
                      <Label>控件类型</Label>
                      <Select name="metadataModule" dataSource={ `${ context.contextPath }/v1/dictcategorys/metadata_module/dictdetails/combobox` } value={ editData ? `${ editData.cSvcExtInfo.cAttrInfo.cAttrMetadataInfo.metadataModule }` : '' } onChange={ this.handleEditSelectChange.bind( this ) } />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col size={ 12 }>
                    <FormItem>
                      <Label>属性填写提示</Label>
                      <Input name="attrTips" type="text" value={ editData ? editData.cSvcExtInfo.cAttrInfo.attrTips : '' } />
                    </FormItem>
                  </Col>
                  <Col size={ 12 }>
                    <FormItem>
                      <Label>校验规则</Label>
                      <Input name="validateRole" value={ editData ? ( editData.cSvcExtInfo.cAttrInfo.cAttrMetadataInfo.cAttrValidateInfo ? editData.cSvcExtInfo.cAttrInfo.cAttrMetadataInfo.cAttrValidateInfo.validateRole : '' ) : '' } type="text" />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col size={ 12 }>
                    <FormItem>
                      <Label>校验提示</Label>
                      <Input name="validateTips" value={ editData ? ( editData.cSvcExtInfo.cAttrInfo.cAttrMetadataInfo.cAttrValidateInfo ? editData.cSvcExtInfo.cAttrInfo.cAttrMetadataInfo.cAttrValidateInfo.validateTips : '' ) : '' } type="text" />
                    </FormItem>
                  </Col>
                  <Col size={ 12 }>
                    <FormItem>
                      <Label>是否必填</Label>
                      <Select name="metadataIsRequired" dataSource={ `${ context.contextPath }/v1/dictcategorys/yes_or_no/dictdetails/combobox` } value={ editData ? `${ editData.cSvcExtInfo.cAttrInfo.cAttrMetadataInfo.metadataIsRequired ? '1' : '0' }` : '' } />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col size={ 12 }>
                    <FormItem>
                      <Label>属性单位</Label>
                      <Input name="metadataUnit" type="text" />
                    </FormItem>
                  </Col>
                  <div style={ { display: 'none' } }>
                    <FormItem>
                      <Label>属性Id</Label>
                      <Input name="attrId" type="text" value={ editData ? `${ editData.cSvcExtInfo.cAttrInfo.attrId }` : '' } />
                    </FormItem>
                  </div>
                </Row>
                <Row>
                  <Col size={ 12 }>
                    {
                      editData ? this.state.isHaveDefaultValue ?
                        <FormItem required={ true }>
                          <Label>初始值</Label>
                          <div className="epm field">
                            <div>
                              <div className="auto-items">
                                {
                                  this.hadleShowEditInit( editData )
                                }
                              </div>
                            </div>
                          </div>
                        </FormItem> : null : null
                    }
                  </Col>
                </Row>
                <Button type="primary" onClick={ this.closeEditDataModal }>返回</Button>
                <Button type="primary" htmlType="submit">保存</Button>
              </Form>
            </div>
          </ModalBody>
        </Modal>
        <Modal visible={ this.state.importvisible } onClose={ this.closeImportDataModal } size="large">
          <ModalHeader>
            <div>属性库</div>
          </ModalHeader>
          <ModalBody>
            <div>
              <ServiceAttrLibList handleSelectAttr={ this.handleSelectAttr.bind( this ) } />
              <br />
              <Row>
                <Col>
                  <div style={ { textAlign: 'right', marginTop: '15px', marginBottom: '15px' } }>
                    <Button type="primary" size="large" onClick={ this.handleImport.bind( this ) }>导入</Button>
                    <Button type="primary" size="large" onClick={ this.closeImportDataModal }>返回</Button>
                  </div>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal>
      </Container>
    );
  }
}

export { ServiceExpands };
export default ServiceExpands;
