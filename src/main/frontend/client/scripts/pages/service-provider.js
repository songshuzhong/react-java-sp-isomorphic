import React, { Component } from 'react';
import { Loading, Dialog, Button, Layout, Container, Input, FormItem, Form, Row, Col, Column, Table, Pagination, Icon, Notification, Modal, ModalBody, ModalHeader } from 'epm-ui';

import { popup } from '../utilities/transient';
import { getDataSource } from '../utilities/dataSource';
import context from 'context';
import { basicTypeConvert } from '../components/commons/dynamicConvert';
import getUUID from '../utilities/uuid';

import ServiceProviderAdd from '../components/service-provider/provider-add';
import ServiceProviderEdit from '../components/service-provider/provider-edit';
import ServiceProviderDetails from '../components/service-provider/provider-detail';

/**
 *@author xumeng
 *@mailTo <a href="mailto:xumeng@bonc.com.cn">xumeng</a>
 *@Date 2017/12/20.
 *@desc 服务提供方管理
 */

class ServiceProvider extends Component {
  constructor( props ) {
    super( props );
    this.state = { providerList: {}, pageNo: 1, pageSize: 10, formData: {} };
    
    this.fetchProviderList = this.fetchProviderList.bind( this );
    this.handlePaginationChange = this.handlePaginationChange.bind( this );
    this.fetchProviderDetails = this.fetchProviderDetails.bind( this );
    this.formGetter = this.formGetter.bind( this );
    this.formTirgger = this.formTirgger.bind( this );
    this.onAsyncSubmit = this.onAsyncSubmit.bind( this );
    this.onAfterSubmit = this.onAfterSubmit.bind( this );
  }

  componentDidMount() {
    this.fetchProviderList();
  }

  fetchProviderList() {
    const { pageNo, pageSize } = this.state;
    const formData= this.getValue();

    getDataSource( `${ context.contextPath }/v1/svcProviders?pageNo=${ pageNo }&pageSize=${ pageSize }&selectKey=${ formData.selectKey }`, ( providerList ) => {
      this.setState( { providerList } );
    } );
  }

  formGetter( getter ) {
    this.getValue = getter.value;
  }

  formTirgger( trigger ) {
    this.reset = trigger.reset;
  }

  onAsyncSubmit( formData ) {
    formData.pageNo = this.state.pageNo;
    formData.pageSize = this.state.pageSize;

    return formData;
  }

  onAfterSubmit( data ) {
    this.setState( { providerList: data } );
  }

  handlePaginationChange( pageNo, pageSize ) {
    this.setState( { pageNo, pageSize }, this.fetchProviderList );
  }

  showDialog( value ) {
    let serviceProvider = value.providerName;

    popup(
      <Dialog
        title="删除确认"
        message={ `请确认是否删除服务提供方“${ serviceProvider }”?` }
        type="confirm"
        icon="danger"
        approveBtnOnClick={ this.handleClickDelete.bind( this, value ) }
      /> );
  }

  handleClickDelete( value, after ) {
    const providerId = value.providerId;

    getDataSource( {
      url: `${ context.contextPath }/v1/svcProviders/${ providerId }`,
      params: { method: 'delete' }
    }, ( data ) => {
      if ( data.code === 200 ) {
        this.fetchProviderList();
        after( true );
        popup( <Notification key={ Math.random().toString() } message="通知" type="success" description="删除成功" /> );
      } else if( data.code === 403 ){
        after( true );
        popup( <Notification key={ Math.random().toString() } message={ data.code } type="error" description={ data.message } /> );
      }else {
        after( true );
        popup( <Notification key={ Math.random().toString() } message={ data.code } type="error" description={ data.message } /> );
      }
    } );
  }

  handleClickAddModal() {
    this.setState( { addVisible: true } );
  }

  handleCloseAddModal() {
    this.setState( { addVisible: false } );
  }

  fetchProviderDetails( value ) {
    const providerId = value.providerId;

    getDataSource( `${ context.contextPath }/v1/svcProviders/${ providerId }`, ( detailsData ) => {
      detailsData.attrFormInfos.forEach( ( item ) => {
        item.metadataDataType = basicTypeConvert( item.metadataDataType );
      } );
      this.setState( { detailsData } );
    } );
  }

  handleClickEditModal( value ) {
    this.fetchProviderDetails( value );
    this.setState( { editVisible: true } );
  }

  handleCloseEditModal() {
    this.setState( { editVisible: false, detailsData: null } );
  }

  handleClickDetailModal( value ) {
    this.fetchProviderDetails( value );
    this.setState( { detailVisible: true } );
  }

  handleCloseDetailModal() {
    this.setState( { detailVisible: false, detailsData: null } );
  }

  render() {
    const { pageNo, pageSize, providerList } = this.state;

    return (
      <Container type="fluid" style={ { marginTop: '20px' } }>
        <Row>
          <Col size={ 24 }>
            <Form
              type="inline"
              async={ true }
              getter={ this.formGetter }
              trigger={ this.formTirgger }
              onSubmit={ this.onAsyncSubmit }
              onAfterSubmit={ this.onAfterSubmit }
              action={ `${ context.contextPath }/v1/svcProviders` }
            >
              <FormItem type="inline">
                <Input name="selectKey" placeholder="请输入服务提供方" type="search" />
              </FormItem>
              <Button htmlType="submit">搜索</Button>
              <Button onClick={ () => this.reset() }>重置</Button>
              <Button style={ { float: 'right' } } onClick={ this.handleClickAddModal.bind( this ) }>新增</Button>
            </Form>
          </Col>
        </Row>
        <Row>
          { providerList.data ?
            <Col>
              <Table
                textAlign="center"
                bgColor={ { head: '#ecf5fe' } }
                headBolder={ true }
                striped={ true }
                headMenu={ true }
                dataSource={ providerList ? providerList.data : '' }
                style={ { marginBottom: '20px' } }
              >
                <Column title="服务提供方" textAlign="left" scaleWidth="20%">
                  { ( value ) => <span style={ { color: '#0070d2', paddingTop: '10px', display: 'inline-block', cursor: 'pointer' } } onClick={ this.handleClickDetailModal.bind( this, value ) }>{ value.providerName }</span>}
                </Column>
                <Column title="资源" textAlign="left" dataIndex="quotas" scaleWidth="20%" />
                <Column title="创建人" textAlign="center" dataIndex="createBy" scaleWidth="20%" />
                <Column title="创建时间" textAlign="center" dataIndex="createDate" scaleWidth="25%" />
                <Column title="操作" textAlign="center" scaleWidth="15%">
                  {
                    ( value, index ) => [
                      <Button key={ getUUID() } shape="icon" type="link" onClick={ this.handleClickEditModal.bind( this, value ) }><Icon icon="edit" /></Button>,
                      <Button key={ getUUID() } shape="icon" type="link" onClick={ this.showDialog.bind( this, value ) }><Icon icon="trash" /></Button>
                    ]
                  }
                </Column>
              </Table>
              <Pagination index={ pageNo } total={ providerList ? providerList.total : 0 } size={ pageSize } showPagiJump={ true } showDataSizePicker={ true } onChange={ this.handlePaginationChange } align="right" />
            </Col> : <Col style={ { paddingTop: '60px' } }><Loading type="primary" size="large" /></Col>
          }
        </Row>

        { this.state.addVisible ? <Modal visible={ true } size="large" onClose={ this.handleCloseAddModal.bind( this ) } >
          <ModalHeader>
            新增服务提供方
          </ModalHeader>
          <ModalBody>
            <ServiceProviderAdd handleCloseAddModal={ this.handleCloseAddModal.bind( this ) } fetchProviderList={ this.fetchProviderList } />
          </ModalBody>
        </Modal> : null }

        { this.state.editVisible ? <Modal visible={ true } size="large" onClose={ this.handleCloseEditModal.bind( this ) } >
          <ModalHeader>
            编辑服务提供方
          </ModalHeader>
          <ModalBody>
            <ServiceProviderEdit detailsData={ this.state.detailsData } handleCloseEditModal={ this.handleCloseEditModal.bind( this ) } fetchProviderList={ this.fetchProviderList } />
          </ModalBody>
        </Modal> : null }

        { this.state.detailVisible ? <Modal visible={ true } size="large" onClose={ this.handleCloseDetailModal.bind( this ) } >
          <ModalHeader>
            服务提供方详细信息
          </ModalHeader>
          <ModalBody>
            <ServiceProviderDetails detailsData={ this.state.detailsData } handleCloseDetailModal={ this.handleCloseDetailModal.bind( this ) } />
          </ModalBody>
        </Modal> : null }

      </Container>
    );
  }
}

export { ServiceProvider };
export default ServiceProvider;
