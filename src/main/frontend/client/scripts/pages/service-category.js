import React, { Component } from 'react';

import { Container, Row, Col, Table, Column, Button, Modal, ModalHeader, ModalBody, Icon, Input, FormItem, Form, Loading, Dialog, Pagination, Notification } from 'epm-ui';

import ServiceCateAddModal from '../components/service-category/add-modal';
import ServiceCateEditModal from '../components/service-category/edit-modal';

import { getDataSource } from '../utilities/dataSource';
import { popup } from '../utilities/transient';
import getUUID from '../utilities/uuid';

import context from 'context';

/**
 *author: wangxiang
 *desc:  服务分类
 *date:  2018/1/3
 */
class ServiceCategory extends Component {

  /**
   * @param {Object} props 属性.
   */
  constructor( props ) {
    super( props );

    this.state = { data: '', pageNo: 1, pageSize: 10 };
    this.fetchInitData = this.fetchInitData.bind( this );
    this.handleClickAddModal = this.handleClickAddModal.bind( this );
    this.handleChange = this.handleChange.bind( this );
    this.formGetterForSearch = this.formGetterForSearch.bind( this );
    this.handleResetForm = this.handleResetForm.bind( this );
    this.onAsyncSearchSubmit = this.onAsyncSearchSubmit.bind( this );
    this.onAfterSearchSubmit = this.onAfterSearchSubmit.bind( this );
  }

  componentDidMount() {
    this.formData = this.getValueForSearch();

    this.fetchInitData();
  }

  fetchInitData() {
    let param = '';

    this.formData.pageNo = this.state.pageNo;
    this.formData.pageSize = this.state.pageSize;

    for ( let name in this.formData ) {
      param += `${ name }=${ this.formData[ name ] }&`;
    }

    getDataSource(
      {
        url: `${ context.contextPath }/v1/svccategorys/page`,
        params: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: param.substring( 0, param.length - 1 ) }
      }, ( data ) => this.setState( { data } ) );
  }

  handleClickAddModal() {
    this.setState( { addVisible: true } );
  }

  handleCloseAddModal() {
    this.refs.addModalRef.addReset();
    this.setState( { addVisible: false } );
  }

  handleClickEditModal( rowData ) {
    this.setState( { editVisible: true, editObj: rowData } );
  }

  handleCloseEditModal() {
    this.setState( { editVisible: false, editObj: undefined } );
  }

  formGetterForSearch( getter ) {
    this.getValueForSearch = getter.value;
  }

  handleResetForm( trigger ) {
    this.reset = trigger.reset;
  }

  /**
   * 分页
   * @param {number}  pageNO.
   * @param {number}  pageSize.
   */
  handleChange( pageNo, pageSize ) {
    this.setState( { pageNo, pageSize }, this.fetchInitData );
  }

  // 查询表单提交
  onAsyncSearchSubmit( formData ) {
    formData.pageNo = 1;
    formData.pageSize = 10;

    return formData;
  }

  // 查询完成后重新获取data
  onAfterSearchSubmit( formData ) {
    this.setState( { pageNo: 1, pageSize: 10, data: formData } );
  }

  showDeleteDialog( cataId ) {
    popup(
      <Dialog
        title="删除确认"
        message="确认删除该服务分类吗？"
        type="confirm"
        icon="danger"
        approveBtnOnClick={ ( after ) => this.handleClickDelete( after, cataId ) }
      />
    );
  }

  // 删除
  handleClickDelete( after, cataId ) {

    getDataSource(
      {
        url: `${ context.contextPath }/v1/svccategorys/${ cataId }`,
        params: { method: 'delete', body: '' }
      }, ( callback ) => {

      if ( parseInt( callback.code ) === 200 ) {
        popup( <Notification key={ Math.random().toString() } message="通知" type="success" description="删除成功" /> );
        after( true );
        this.fetchInitData();
      } else if ( parseInt( callback.code ) === 400 ) {
        after( true );
        popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="该服务类别为父元素，不能删除!" /> );
      } else if ( parseInt( callback.code ) === 403 ) {
        after( true );
        popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="该服务类别已被引用，不能删除!" /> );
      } else {
        after( true );
        popup( <Notification key={ Math.random().toString() } message="通知" type="error" description={ callback.message } /> );
      }
    }
    );
  }

  /**
   *
   * @returns {XML}
   */
  render() {
    const { data, total } = this.state.data;

    return (
      <Container type="fluid">
        <Row>
          <br />
          <Col>
            <Form
              type="inline"
              method="post"
              async={ true }
              getter={ this.formGetterForSearch }
              trigger={ this.handleResetForm }
              action={ `${ context.contextPath }/v1/svccategorys/page` }
              onSubmit={ this.onAsyncSearchSubmit }
              onAfterSubmit={ this.onAfterSearchSubmit }
            >
              <FormItem>
                <Input name="entity.cataName" style={ { width: '400px' } } placeholder="分类名称/分类编码" />
              </FormItem>

              <Button shape="default" htmlType="submit" >查询</Button>
              <Button shape="default" onClick={ () => { this.reset(); } }>重置</Button>

              <div style={ { float: 'right', marginRight: '1%' } }>
                <Button type="default" onClick={ this.handleClickAddModal }>新增</Button>
              </div>
            </Form>
          </Col>
        </Row>
        <Row>
          {
            data ?
              <Col>
                <Table dataSource={ data } bgColor={ { head: '#ecf5fe' } } multiLine={ false } textAlign="center" headBolder={ true } striped={ true } complex >
                  <Column title="序号" dataIndex="index" scaleWidth="5%" color={ { head: '#18335d' } }>
                    { ( value, index ) => <div style={ { padding: '.5rem .5rem .5rem .9rem' } }>{ 1 + parseInt( index ) + ( ( this.state.pageNo - 1 ) * this.state.pageSize ) }</div> }
                  </Column>
                  <Column title="分类名称" dataIndex="cataName" scaleWidth="12%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="分类编码" dataIndex="cataCode" scaleWidth="12%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="排序" dataIndex="cataOrder" scaleWidth="6%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="分类描述" dataIndex="cataDesc" scaleWidth="15%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="父元素" dataIndex="parentCataName" scaleWidth="10%" textAlign="left" color={ { head: '#18335d' } } >
                    { ( parentCataName ) => { return parentCataName ? parentCataName : ''; } }
                  </Column>
                  <Column title="更新人" dataIndex="updateBy" scaleWidth="10%" color={ { head: '#18335d' } } >
                  </Column>
                  <Column title="更新日期" dataIndex="updateDate" scaleWidth="15%" color={ { head: '#18335d' } } />
                  <Column title="操作" scaleWidth="15%" dataIndex="" color={ { head: '#18335d' } } >
                    {
                      ( rowData ) => [
                        <Button key={ getUUID() } shape="icon" type="link" onClick={ this.handleClickEditModal.bind( this, rowData ) }><Icon icon="edit" /></Button>,
                        <Button key={ getUUID() } shape="icon" type="link" onClick={ this.showDeleteDialog.bind( this, rowData.cataId ) }><Icon icon="trash" /></Button>
                      ]
                    }
                  </Column>
                </Table>
                <br />
                <Pagination
                  index={ this.state.pageNo }
                  size={ this.state.pageSize }
                  total={ total }
                  align="right"
                  showPagiJump={ true }
                  showDataSizePicker={ true }
                  onChange={ ( pageNo, pageSize ) => this.handleChange( pageNo, pageSize ) }
                />
              </Col> : <Col style={ { paddingTop: '60px' } }><Loading type="primary" size="large" /></Col>
          }
        </Row>

        <Modal visible={ this.state.addVisible } onClose={ this.handleCloseAddModal.bind( this ) } >
          <ModalHeader>
            新增服务分类
          </ModalHeader>
          <ModalBody>
            <ServiceCateAddModal ref="addModalRef" handleCloseAddModal={ this.handleCloseAddModal.bind( this ) } fetchInitData={ this.fetchInitData } />
          </ModalBody>
        </Modal>

        <Modal visible={ this.state.editVisible } onClose={ this.handleCloseEditModal.bind( this ) } >
          <ModalHeader>
            编辑服务分类
          </ModalHeader>
          <ModalBody>
            <ServiceCateEditModal ref="editModalRef" editObj={ this.state.editObj } handleCloseEditModal={ this.handleCloseEditModal.bind( this ) } fetchInitData={ this.fetchInitData } />
          </ModalBody>
        </Modal>
      </Container>
    );
  }
}

export { ServiceCategory };
export default ServiceCategory;
