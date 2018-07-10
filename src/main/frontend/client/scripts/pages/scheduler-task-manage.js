import React, { Component } from 'react';

import { Container, Row, Col, Table, Column, Button, Modal, ModalHeader, ModalBody, Icon, Input, FormItem, Form, Loading, Dialog, Pagination, Notification } from 'epm-ui';

import AddSchedulerTask from '../components/scheduler-task-manage/add-scheduler-task';
import EditSchedulerTask from '../components/scheduler-task-manage/edit-scheduler-task';

import { getDataSource } from '../utilities/dataSource';
import { popup } from '../utilities/transient';
import getUUID from '../utilities/uuid';

import context from 'context';

/**
 *author: wangxiang
 *desc:  定时任务管理页面
 *date:  2018/2/27
 */
class SchedulerTaskManage extends Component {

  /**
   * @param {Object} props 属性.
   */
  constructor( props ) {
    super( props );

    this.state = { data: ''};
    this.fetchInitData = this.fetchInitData.bind( this );
    this.handleClickAddModal = this.handleClickAddModal.bind( this );
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
    getDataSource( `${ context.contextPath }/v1/scheduler/tasks?jobId=${ this.formData.jobId }`, ( data ) => {
      this.setState( { data } );
    } );
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

  // 查询表单提交
  onAsyncSearchSubmit( formData ) {

    return formData;
  }

  // 查询完成后重新获取data
  onAfterSearchSubmit( formData ) {
    this.setState( { data: formData } );
  }

  showDeleteDialog( id ) {
    popup(
      <Dialog
        title="删除确认"
        message="确认删除该定时任务吗？"
        type="confirm"
        icon="danger"
        approveBtnOnClick={ ( after ) => this.handleClickDelete( after, id ) }
      />
    );
  }

  // 删除
  handleClickDelete( after, id ) {

    getDataSource(
      {
        url: `${ context.contextPath }/v1/scheduler/task/${ id }`,
        params: { method: 'delete', body: '' }
      }, ( callback ) => {

        if ( Number( callback.code ) === 201 ) {
          popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ callback.message } /> );
          after( true );
          this.fetchInitData();
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
    const data = this.state.data;

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
              action={ `${ context.contextPath }/v1/scheduler/tasks` }
              onSubmit={ this.onAsyncSearchSubmit }
              onAfterSubmit={ this.onAfterSearchSubmit }
            >
              <FormItem>
                <Input name="jobId" style={ { width: '400px' } } placeholder="任务名称" />
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
                    { ( value, index ) => <div style={ { padding: '.5rem .5rem .5rem .9rem' } }>{ 1 + parseInt( index ) }</div> }
                  </Column>
                  {/*<Column title="任务组名称" dataIndex="groupId" scaleWidth="10%" color={ { head: '#18335d' } } />*/}
                  <Column title="任务名称" dataIndex="jobId" scaleWidth="9%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="任务中文名称" dataIndex="jobName" scaleWidth="11%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="执行任务类" dataIndex="job" scaleWidth="12%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="cron表达式" dataIndex="cron" scaleWidth="10%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="是否启用" dataIndex="enable" scaleWidth="8%" color={ { head: '#18335d' } } >
                    { ( enable ) =>  Number( enable ) === 0 ? '否' : '是' }
                  </Column>
                  <Column title="上次执行时间" dataIndex="preExecuteDate" scaleWidth="15%" color={ { head: '#18335d' } } />
                  <Column title="执行任务日志" dataIndex="logMsg" scaleWidth="15%" textAlign="left" color={ { head: '#18335d' } } />
                  <Column title="操作" scaleWidth="15%" dataIndex="" color={ { head: '#18335d' } } >
                    {
                      ( rowData ) => [
                        <Button key={ getUUID() } shape="icon" type="link" onClick={ this.handleClickEditModal.bind( this, rowData ) }><Icon icon="edit" /></Button>,
                        <Button key={ getUUID() } shape="icon" type="link" onClick={ this.showDeleteDialog.bind( this, rowData.id ) }><Icon icon="trash" /></Button>
                      ]
                    }
                  </Column>
                </Table>
              </Col> : <Col style={ { paddingTop: '60px' } }><Loading type="primary" size="large" /></Col>
          }
        </Row>

        <Modal visible={ this.state.addVisible } onClose={ this.handleCloseAddModal.bind( this ) } >
          <ModalHeader>
            新增定时任务
          </ModalHeader>
          <ModalBody>
            <AddSchedulerTask ref="addModalRef" handleCloseAddModal={ this.handleCloseAddModal.bind( this ) } fetchInitData={ this.fetchInitData } />
          </ModalBody>
        </Modal>

        <Modal visible={ this.state.editVisible } onClose={ this.handleCloseEditModal.bind( this ) } >
          <ModalHeader>
            编辑定时任务
          </ModalHeader>
          <ModalBody>
            <EditSchedulerTask ref="editModalRef" editObj={ this.state.editObj } handleCloseEditModal={ this.handleCloseEditModal.bind( this ) } fetchInitData={ this.fetchInitData } />
          </ModalBody>
        </Modal>
      </Container>
    );
  }
}

export { SchedulerTaskManage };
export default SchedulerTaskManage;