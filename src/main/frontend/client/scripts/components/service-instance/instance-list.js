import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Label, Loading, Textarea, Container, Input, FormItem, Form, Row, Col, Column, Table, Pagination, Icon, Notification, Modal, ModalBody, ModalHeader } from 'epm-ui';

import { popup } from '../../utilities/transient';
import { getDataSource } from '../../utilities/dataSource';
import context from 'context';
import getUUID from '../../utilities/uuid';
import { instanceWorkStateConvert, instanceOrderStateConvert } from '../../components/commons/dynamicConvert';

import set from '../../../images/img_set.png';
import download from '../../../images/img_download.png';

/**
 *@author xumeng
 *@mailTo <a href="mailto:xumeng@bonc.com.cn">xumeng</a>
 *@Date 2018/1/15.
 *@desc 服务实例-实例列表页面（租户管理）
 */

class InstanceList extends Component {
  constructor( props ) {
    super( props );
    this.state={
      pageNo: 1,
      pageSize: 10,
      selectKey: '',
      keyWords: '',
      checkData: null,
      instanceId: '',
      instanceList: {},
      flag: { runFlag: true, stopFlag: true, deleteFlag: true, monitorFlag: true },
      submitProblem: null,
      attrColumn: null,
      contactId: '',
      showFlag: false
    };

    this.fetchInstanceList = this.fetchInstanceList.bind( this );
    this.fetchInstanceInfo = this.fetchInstanceInfo.bind( this );
    this.fetchAttrColumn = this.fetchAttrColumn.bind( this );
    this.fetchChangeState = this.fetchChangeState.bind( this );
    this.handleSearchValue = this.handleSearchValue.bind( this );
    this.handleClickSearch = this.handleClickSearch.bind( this );
    this.handlePaginationChange = this.handlePaginationChange.bind( this );
    this.handleTableCheck = this.handleTableCheck.bind( this );
  }

  componentDidMount() {
    this.fetchAttrColumn();
    this.fetchInstanceList();
    setInterval( () => {
      window.location.reload( true );
    }, 60000 );
  }

  // 获取实例列表数据
  fetchInstanceList() {
    let { pageNo, pageSize, selectKey } = this.state;
    let svcId = this.props.svcId;
    let isDelete = 0;//0为实例列表页面，1为回收站

    getDataSource( `${ context.contextPath }/v1/svcinstances/page/${ svcId }/${ isDelete }?pageNo=${ pageNo }&pageSize=${ pageSize }&instanceNo=${ selectKey }`, ( instanceList ) => {

      if( instanceList.data ) {
        instanceList.data.forEach( ( item, index ) => {
          if( item.nodeInfos.length !== 0 ) {
            item.children = [];
            item.nodeInfos.forEach( ( it, i ) => {
              let childObj = {};
              childObj.instanceWorkState = item.nodeInfos[ i ].nodeState;
              childObj.nodeCode = item.nodeInfos[ i ].nodeCode;
              childObj.instanceNo = item.instanceNo;
              childObj.instanceId = item.instanceId;
              item.children.push( childObj );
            } );
          }

          if( item.instanceWorkState == 3010 || item.instanceWorkState == 1010 ) {
            this.setState( { instanceId: item.instanceId }, () => {
              this[ `loadFlag${ item.instanceId }` ] = true;
              this.fetchInstanceInfo();
            } )
          }
        } );
      }

      if( instanceList.roles ) {
        for ( let i = 0; i < instanceList.roles.length; i++ ) {
          let cur = instanceList.roles[i];

          if( cur == 'svc_use' ) {
            this.setState( { showFlag: true } );
            this.props.getShowInfo( true );
            break;
          }
          this.setState( { showFlag: false } );
          this.props.getShowInfo( false );
        }
      }

      this.setState( { instanceList }, () => {
        this.state.instanceList.data.forEach( ( item, index ) => {
          if( item.instanceWorkState == 3010 || item.instanceWorkState == 1010 ) {
            this.setState( { instanceId: item.instanceId }, () => {
              this[ `loadFlag${ item.instanceId }` ] = true;
              this.fetchInstanceInfo();
            } )
          }
        } );
      } );
    } );
  }

  // 获取动态属性列
  fetchAttrColumn() {
    let svcId = this.props.svcId;

    getDataSource( `${ context.contextPath }/v1/services/${ svcId }/displayexts`, ( attrColumn ) => {
      this.setState( { attrColumn } );
    } );
  }

  // 获取选中实例更新后的状态
  fetchInstanceInfo() {
    let svcId = this.props.svcId;
    let { instanceId, instanceList } = this.state;

    getDataSource( `${ context.contextPath }/v1/svcinstances/svc/${ svcId }/instanceId/${ instanceId }`, ( data ) => {

      if( data.nodeInfos.length !== 0 ) {
        let children = [];
        data.nodeInfos.forEach( ( it, i ) => {
          let childObj = {};
          childObj.instanceWorkState = it.nodeState;
          childObj.nodeCode = it.nodeCode;
          childObj.instanceNo = data.instanceNo;
          childObj.instanceId = instanceId;
          children.push( childObj );
        } );
        data.children = children;
      }

      instanceList.data ? instanceList.data.forEach( ( item, index ) => {
        if( item.instanceId == data.instanceId ) {
          instanceList.data[ index ] = data;
        }
      } ) : null;

      this.setState( { instanceList } );

      if( data.instanceWorkState == 1010 || data.instanceWorkState == 3010 ) {
        this[ `loadFlag${ instanceId }` ] = true;
        setTimeout( () => {
          this.fetchInstanceInfo();
        }, 5000 );
      }else {
        this[ `loadFlag${ instanceId }` ] = false;
      }
    } );
  }

  // 更新服务实例运行状态（启动、停止）
  fetchChangeState( operationState ) {
    let { instanceId } = this.state;

    getDataSource( {
      url: `${ context.contextPath }/v1/svcinstances/${ instanceId }/state/${ operationState }`,
      params: { method: 'put' }
    }, ( data ) => {
      if ( data.code == 200 ) {
        popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ data.message } /> );
        this.fetchInstanceInfo();
      }else {
        this[ `loadFlag${ instanceId }` ] = false;
        popup( <Notification key={ Math.random().toString() } message="通知" type="error" description={ data.message } /> );
      }
    } );
  }

  handleSearchValue( value ) {
    this.setState( { keyWords: value } );
  }
  
  handleClickSearch() {
    this.setState( { pageNo: 1, selectKey: this.state.keyWords }, this.fetchInstanceList );
  }

  // 分页
  handlePaginationChange( pageNo, pageSize ) {
    this.setState( { pageNo, pageSize }, this.fetchInstanceList );
  }
  
  handleTableCheck( data, currentData  ) {
    if( data != [] ) {
      if ( data[0] ){
        this.setState( { instanceId: data[0].instanceId } );

        if( data[0].rowkey.indexOf( '-' ) == -1 ) {
          if( data[0].instanceOrderState == 10 ) {
            this.setState( { flag: { runFlag: true, stopFlag: true, deleteFlag: true, monitorFlag: true } } );
          }else if( data[0].instanceOrderState == 30 ) {
            this.setState( { flag: { runFlag: true, stopFlag: true, deleteFlag: false, monitorFlag: true } } );
          }else if( data[0].instanceOrderState == 20 ) {
            switch ( data[0].instanceWorkState ) {
              case 10: // 未启动
                this.setState( { flag: { ...this.state.flag, runFlag: false, monitorFlag: true } } );
                break;
              case 20: // 运行中
                this.setState( { flag: { ...this.state.flag, stopFlag: false, monitorFlag: true } } );
                break;
              case 30: // 停止
                this.setState( { flag: { ...this.state.flag, runFlag: false, deleteFlag: false, monitorFlag: true } } );
                break;
              case 40: // 失败
                this.setState( { flag: { runFlag: true, stopFlag: true, deleteFlag: true, monitorFlag: true } } );
                break;
              case 50: // 异常
                this.setState( { flag: { runFlag: true, stopFlag: true, deleteFlag: true, monitorFlag: true } } );
                break;
              default:
                this.setState( { flag: { runFlag: true, stopFlag: true, deleteFlag: true, monitorFlag: true } } );
            }
          }
        } else {
          this.setState( { flag: { runFlag: true, stopFlag: true, deleteFlag: true, monitorFlag: false } } );
        }
      }else {
        this.setState( { flag: { runFlag: true, stopFlag: true, deleteFlag: true, monitorFlag: true } } );
      }
    }

    this.setState( { checkData: data[0] } );
  }
  
  handleRunService() {
    let operationState = 20;//启动
    let { checkData } = this.state;
    let instanceId = checkData.instanceId || '';

    this[ `loadFlag${ instanceId }` ] = true;
    this.fetchChangeState( operationState );
  }

  handleStopService() {
    let operationState = 30;//停止
    let { checkData } = this.state;
    let instanceId = checkData.instanceId || '';

    this[ `loadFlag${ instanceId }` ] = true;
    this.fetchChangeState( operationState );
  }

  handleDeleteService() {
    let { checkData } = this.state;
    let instanceId = checkData.instanceId || '';
    let isDelete = 1;

    getDataSource( {
      url: `${ context.contextPath }/v1/svcinstances/${ instanceId }/${ isDelete }`,
      params: { method: 'put' }
    }, ( data ) => {
      if ( data.code == 200 ) {
        this.fetchInstanceList();
        popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ data.message } /> );
      }else {
        popup( <Notification key={ Math.random().toString() } message="通知" type="error" description={ data.message } /> );
      }
    } );
  }

  handleClickMonitorModal() {
    this.setState( { monitorVisible: true } );
  }

  handleCloseMonitorModal() {
    this.setState( { monitorVisible: false } );
  }

  handleClickContactModal( value ) {
    this.setState( { contactVisible: true, contactId: value.instanceId } );
  }

  handleCloseContactModal() {
    this.setState( { contactVisible: false, contactId: '' } );
  }

  handleChangeProblem( value ) {
    this.setState( { submitProblem: value } );
  }

  // 提交给管理员的信息
  handleSubmitProblem() {
    let instanceId = this.state.contactId;
    let { submitProblem } = this.state;
    let obj = {};
    obj.fbContent = submitProblem;

    getDataSource( {
      url: `${ context.contextPath }/v1/svcinstances/${ instanceId }/feedback`,
      params: { body: JSON.stringify( obj ) }
    }, ( data ) => {
      if ( data.code == 201 ) {
        popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ data.message } /> );
        this.handleCloseContactModal();
      }else {
        popup( <Notification key={ Math.random().toString() } message="通知" type="error" description={ data.message } /> );
      }
    } );
  }

  render() {
    let { attrColumn, instanceList, instanceId, pageNo, pageSize, checkData } = this.state;
    let { runFlag, stopFlag, deleteFlag, monitorFlag } = this.state.flag;

    return (
      <Container type="fluid" style={ { paddingTop: '20px' } }>
        <Row>
          <Col size={ { small: 24, medium: 24, large: 24 } }>
            <Form
              type="inline"
              async={ true }
            >
              <FormItem type="inline">
                <Input style={ { width: '200px' } } placeholder="实例编号、服务名称查询" type="search" onChange={ this.handleSearchValue } />
              </FormItem>
              <Button onClick={ this.handleClickSearch }>查询</Button>
              <div style={ { float: 'right' } }>
                <Button type="primary" disabled={ monitorFlag } onClick={ this.handleClickMonitorModal.bind( this ) }>监控</Button>
                { this.state.showFlag ?
                  <div style={ { display: 'inline-block' } }>
                    <Button type="primary" disabled={ runFlag } style={ { marginLeft: '10px' } } onClick={ this.handleRunService.bind( this ) }>启动</Button>
                    <Button type="primary" disabled={ stopFlag } style={ { marginLeft: '10px' } } onClick={ this.handleStopService.bind( this ) }>停止</Button>
                    <Button type="primary" disabled={ deleteFlag } style={ { marginLeft: '10px' } } onClick={ this.handleDeleteService.bind( this ) }>删除</Button>
                  </div> : null
                }
                <span style={ { margin: '0 20px' } }>
                  <Icon img={ set }></Icon>
                </span>
                <span>
                  <Icon img={ download }></Icon>
                </span>
              </div>
            </Form>
          </Col>
        </Row>
        {
          attrColumn ? <Table
            bgColor={ { head: '#ecf5fe' } }
            headBolder={ true }
            striped={ true }
            headMenu={ true }
            dataSource={ instanceList ? instanceList.data : [] }
            style={ { margin: '20px 0' } }
            onCheck={ this.handleTableCheck }
            checkable
            singleSelection
          >
            <Column title="实例编号" dataIndex="instanceNo" width="120px" />
            <Column title="订购状态" width="120px">
              {
                ( value, index ) => {
                  return (
                    index.indexOf( '-' ) == -1 ?
                    <span style={ { display: 'inline-block', marginTop:"10px" } }>{ instanceOrderStateConvert( value.instanceOrderState ) }</span> : ''
                  );
                }
              }
            </Column>
            <Column title="运行状态" width="120px" textAlign={ { head: 'center', body: 'center' } }>
              {
                ( value, index ) => {
                  let id = value.instanceId;
                  let resultLoad = this[ `loadFlag${ id }` ] ? 'inline-block' : 'none';
                  let resultState = this[ `loadFlag${ id }` ] ? 'none' : 'inline-block';

                  return (
                    <div>
                      <span style={ { display: id == this.state.instanceId ? resultState : 'inline-block', margin:"10px 0 0" } }>{ value.instanceOrderState == 10 || value.instanceOrderState == 30 ? '-' : instanceWorkStateConvert( value.instanceWorkState ) }</span>
                      <span style={ { display: id == this.state.instanceId ? resultLoad : 'none' } }>
                        <Loading size="small" type="primary" />
                      </span>
                    </div>
                  );
                }
              }
            </Column>
            { attrColumn ? attrColumn.map( ( item, index ) => {
              let attrName = item.attrName;
              return (
                <Column key={ getUUID() } title={ attrName } width="120px">
                  { ( value, index ) => {
                    return ( index.indexOf( '-' ) == -1 ? <span style={ { display: 'inline-block', marginTop:"10px" } }>{ item.attrCode in value.extInfos ? value.extInfos[item.attrCode].valueObject : '' }</span> : '' )
                    }
                  }
                </Column>
              )
            } ) : void 0
            }
            <Column title="操作" width="240px">
              {
                ( value, index ) => {
                  return (
                    index.indexOf( '-' ) == -1 ?
                    <Row>
                      <Col>
                        <Link to={ `/console-home/tenant/order-manage/${ value.instanceId }` }>
                          <Button>查看订单</Button>
                        </Link>
                        { value.instanceWorkState == 40 || value.instanceWorkState == 50 ? <Button type="primary" onClick={ this.handleClickContactModal.bind( this, value ) }>联系管理员</Button> : <span style={ { display: 'inline-block', width: '108px' } }></span> }
                      </Col>
                    </Row> : ''
                  )
                }
              }
            </Column>
          </Table> : null
        }
        <Pagination index={ pageNo } total={ instanceList ? instanceList.total : 0 } size={ pageSize } showPagiJump={ true } showDataSizePicker={ true } onChange={ this.handlePaginationChange } align="right" />

        { this.state.contactVisible ? <Modal visible={ true } size="medium" onClose={ this.handleCloseContactModal.bind( this ) }>
          <ModalBody>
            <Form
              type="inline"
              async={ true }
            >
              <FormItem type="inline">
                <Label>问题反馈：</Label>
                <Textarea name="fbContent" rows={ 3 } placeholder="请填写您遇到的问题详情" onChange={ this.handleChangeProblem.bind( this ) }/>
              </FormItem>
              <Row style={ { marginTop: '10px' } }>
                <Col>
                  <Button onClick={ this.handleSubmitProblem.bind( this ) }>提交</Button>
                  <Button style={ { marginLeft: "15px" } } onClick={ this.handleCloseContactModal.bind( this ) }>关闭</Button>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal> : null }

        { this.state.monitorVisible ? <Modal visible={ true } size="large" onClose={ this.handleCloseMonitorModal.bind( this ) }>
          <ModalHeader>
            监控
          </ModalHeader>
          <ModalBody height={ 800 }>
            <iframe style={ { height: '100%', width: '100%' } } frameborder="0" src={ `http://bconsole.bonc.pro/moniter/moniter/instance/${ checkData.instanceNo }/nodeCode/${ checkData.nodeCode }` }></iframe>
          </ModalBody>
        </Modal> : null }

      </Container>
    );
  }
}

export { InstanceList };
export default InstanceList;