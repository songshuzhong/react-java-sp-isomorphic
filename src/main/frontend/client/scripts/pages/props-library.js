import React, { Component } from 'react';

import { Container, Row, Col, Table, Column, Button, Modal, ModalHeader, ModalBody, Icon, Input, FormItem, Form, Loading, Dialog, Pagination, Notification } from 'epm-ui';

import EditModal from '../components/props-library/edit-modal';
import AddModal from '../components/props-library/add-modal';
import { basicTypeConvert, formItemConvert } from '../components/commons/dynamicConvert';

import { getDataSource } from '../utilities/dataSource';
import { popup } from '../utilities/transient';
import getUUID from '../utilities/uuid';
import context from 'context';

/**
 *author: wangxiang
 *desc: 属性库管理
 *date:  2017/12/20
 */
class PropsLibrary extends Component {

  /**
   * @param {Object} props 属性.
   */
  constructor( props ) {
    super( props );

    this.state = { data: '', pageNo: 1, pageSize: 10 };
    this.fetchInitData = this.fetchInitData.bind( this );
    this.handleClickAddModal = this.handleClickAddModal.bind( this );
    this.handleChange = this.handleChange.bind( this );
    this.handleValue = this.handleValue.bind( this );
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
    getDataSource( `${ context.contextPath }/v1/attrLibInfos?pageNo=${ this.state.pageNo }&pageSize=${ this.state.pageSize }&selectKey=${ this.formData.selectKey }`, ( data ) => {
      this.setState( { data } );
    } );
  }

  handleClickAddModal() {
    this.setState( { addVisible: true } );
  }

  handleCloseAddModal() {
    this.refs.addModalRef.setState( { selectedValue: '10' });
    this.refs.addModalRef.addReset();
    this.setState( { addVisible: false } );
  }

  handleClickEditModal( rowData ) {
    this.setState( { editVisible: true, editObj: rowData } );
  }

  handleCloseEditModal() {
    this.refs.editModalRef.setState( { valueObject: this.state.editObj.initInfo ? this.state.editObj.initInfo.valueObject : '' } );
    this.setState( { editVisible: false, editObj: undefined } );
  }

  formGetterForSearch( getter ) {
    this.getValueForSearch = getter.value;
  }

  handleResetForm( trigger ) {
    this.reset = trigger.reset;
  }

  handleValue() {
    const data = this.getValueForAdd;
    let str = JSON.stringify( data, null, 2 );

    //console.log( str );
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

  showDeleteDialog( attrId, attrCode ) {

    getDataSource( `${ context.contextPath }/v1/attrLibInfos/${ attrCode }/isappoint`, ( data ) => {
      if ( Number( data.code ) === 0 ){
        popup(
          <Dialog
            title="删除确认"
            message="确认删除该属性么？"
            type="confirm"
            icon="danger"
            approveBtnOnClick={ ( after ) => this.handleClickDeleteAttr( after, attrId ) }
          />
        );
      }else if ( Number( data.code ) === 1 ){
        popup(
          <Notification
            message="该属性被服务提供方引用"
            type="warning"
            description="该属性被服务提供方引用，不可删除！"
            key={ Math.random().toString() }
          />
        );
      }
    } );
  }

  // 删除 属性
  handleClickDeleteAttr( after, attrId ) {

    getDataSource(
      {
        url: `${ context.contextPath }/v1/attrLibInfos/${ attrId }`,
        params: { method: 'delete', body: '' }
      }, ( callback ) => {

      if ( parseInt( callback.code ) === 200 ) {
        popup( <Notification key={ Math.random().toString() } message="通知" type="success" description="删除成功" /> );
        after( true );
        this.fetchInitData();
      } else {
        after( true );
        popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="删除失败" /> );
      }
    }
    );
  }

  render() {
    const { data, total } = this.state.data;

    return (
      <Container type="fluid">
        <Row>
          <br />
          <Col>
            <Form
              type="inline"
              async={ true }
              getter={ this.formGetterForSearch }
              trigger={ this.handleResetForm }
              action={ `${ context.contextPath }/v1/attrLibInfos` }
              onSubmit={ this.onAsyncSearchSubmit }
              onAfterSubmit={ this.onAfterSearchSubmit }
            >
              <FormItem>
                <Input name="selectKey" style={ { width: '400px' } } placeholder="属性名/属性英文名/标签" />
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
                  <Column title="属性名" dataIndex="attrName" scaleWidth="8%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="属性英文名" dataIndex="attrEnname" scaleWidth="10%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="属性类型" dataIndex="metadataInfo" scaleWidth="10%" color={ { head: '#18335d' } } >
                    {
                      ( metadataInfo ) => {

                        return basicTypeConvert( metadataInfo.metadataDataType );
                      }
                    }
                  </Column>
                  <Column title="控件类型" dataIndex="metadataInfo" scaleWidth="10%" color={ { head: '#18335d' } } >
                    {
                      ( metadataInfo ) => {

                        return formItemConvert( metadataInfo.metadataModule );
                      }
                    }
                  </Column>
                  <Column title="初始值" dataIndex="initInfo" scaleWidth="9%" textAlign="left" color={ { head: '#18335d' } } >
                    { ( initInfo ) => { return initInfo ? initInfo.valueObject : ''; } }
                  </Column>
                  <Column title="校验规则" dataIndex="validateInfo" scaleWidth="10%" textAlign="left" color={ { head: '#18335d' } } >
                    { ( validateInfo ) => { return validateInfo ? validateInfo.validateRole : ''; } }
                  </Column>
                  <Column title="属性描述" dataIndex="attrDesc" scaleWidth="13%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="标签" dataIndex="label" scaleWidth="10%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="操作" scaleWidth="15%" dataIndex="" color={ { head: '#18335d' } } >
                    {
                      ( rowData ) => [
                        <Button key={ getUUID() } shape="icon" type="link" onClick={ this.handleClickEditModal.bind( this, rowData ) }><Icon icon="edit" /></Button>,
                        <Button key={ getUUID() } shape="icon" type="link" onClick={ this.showDeleteDialog.bind( this, rowData.attrId, rowData.attrCode ) }><Icon icon="trash" /></Button>
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
        <Modal visible={ this.state.addVisible } size="large" onClose={ this.handleCloseAddModal.bind( this ) } >
          <ModalHeader>
            新增属性
          </ModalHeader>
          <ModalBody>
            <AddModal ref="addModalRef" handleCloseAddModal={ this.handleCloseAddModal.bind( this ) } fetchInitData={ this.fetchInitData } />
          </ModalBody>
        </Modal>

        <Modal visible={ this.state.editVisible } size="large" onClose={ this.handleCloseEditModal.bind( this ) } >
          <ModalHeader>
            编辑属性
          </ModalHeader>
          <ModalBody>
            <EditModal ref="editModalRef" editObj={ this.state.editObj } handleCloseEditModal={ this.handleCloseEditModal.bind( this ) } fetchInitData={ this.fetchInitData } />
          </ModalBody>
        </Modal>
      </Container>
    );

  }
}

export { PropsLibrary };
export default PropsLibrary;
