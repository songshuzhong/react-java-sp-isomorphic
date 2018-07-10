import React, { Component } from 'react';
import { Button, Layout, Loading, Container, Input, FormItem, Form, Row, Col, Column, Table, Pagination, Notification, Icon, Modal, ModalBody, ModalHeader } from 'epm-ui';

import { getDataSource } from '../utilities/dataSource';
import context from 'context';
import getUUID from "../utilities/uuid";
import { popup } from '../utilities/transient';

import { AdminInstanceDetail } from '../components/service-instance/admin-instance-detail';
import { instanceWorkStateConvert, instanceOrderStateConvert } from '../components/commons/dynamicConvert';

/**
 *@author xumeng
 *@mailTo <a href="mailto:xumeng@bonc.com.cn">xumeng</a>
 *@Date 2018/1/20.
 *@desc 服务实例管理（系统管理）
 */

class ServiceInstanceManage extends Component {
  constructor( props ) {
    super( props );
    this.state={
      pageNo: 1,
      pageSize: 10,
      selectKey: '',
      keyWords: '',
      instanceList: null,
      checkData: null,
      instanceId: '',
      menuData: [],
      svcId: '',
      cataId: '',
      flag: false,
      instanceNo: '',
      nodeCode: '',
      buttonflag: { runFlag: true, stopFlag: true }
    };

    this.fetchInstanceList = this.fetchInstanceList.bind( this );
    this.fetchMenuData = this.fetchMenuData.bind( this );
    this.handleSearchValue = this.handleSearchValue.bind( this );
    this.handleClickSearch = this.handleClickSearch.bind( this );
    this.handlePaginationChange = this.handlePaginationChange.bind( this );
    this.handleClickService = this.handleClickService.bind( this );
    this.handleClickChildService = this.handleClickChildService.bind( this );
    this.handleTableCheck = this.handleTableCheck.bind( this );
    this.fetchChangeState = this.fetchChangeState.bind( this );
    this.fetchInstanceInfo = this.fetchInstanceInfo.bind( this );
  }

  componentDidMount() {
    this.fetchMenuData();
    let svcId = this.props.match.params.svcId;

    if( svcId != ':svcId') {
      this.fetchInstanceList( svcId );
    }
    setInterval( () => {
      window.location.reload( true );
    }, 60000 );
  }

  fetchMenuData() {
    getDataSource( `${ context.contextPath }/v1/svccategorys/services`, ( menuData ) => {
      this.setState( { menuData } );
    } );
  }

  fetchInstanceList( svcId ) {
    let { pageNo, pageSize, selectKey } = this.state;
    let isDelete = 0;

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

// 获取选中实例更新后的状态
  fetchInstanceInfo() {
    let svcId = this.props.match.params.svcId;
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

  // 点击一级菜单
  handleClickService( cataId ) {
    this.setState( { cataId } );
    if( this.state.flag ) {
      this.setState( { flag: false } );
    }else {
      this.setState( { flag: true } );
    }
  }

  // 点击二级菜单
  handleClickChildService( svcId ) {
    this.setState( { svcId }, () => {
      this.props.history.push(`/console-home/service-instance-manage/${ svcId }`) ;
      this.fetchInstanceList( this.state.svcId );
    } );
  }

  handleSearchValue( value ) {
    this.setState( { keyWords: value } );
  }

  handleClickSearch() {
    let svcId = this.props.match.params.svcId;
    this.setState( { pageNo: 1, selectKey: this.state.keyWords }, () => this.fetchInstanceList( svcId ) );
  }

  // 分页
  handlePaginationChange( pageNo, pageSize ) {
    let svcId = this.props.match.params.svcId;
    this.setState( { pageNo, pageSize }, () => this.fetchInstanceList( svcId ) );
  }

  handleTableCheck( data, currentData  ) {
    if( data != [] ) {
      if ( data[0] ){
        this.setState( { instanceId: data[0].instanceId } );

        if( data[0].rowkey.indexOf( '-' ) == -1 ) {
          if( data[0].instanceOrderState == 10 ) {
            this.setState( { buttonflag: { runFlag: true, stopFlag: true } } );
          }else if( data[0].instanceOrderState == 30 ) {
            this.setState( { buttonflag: { runFlag: true, stopFlag: true } } );
          }else if( data[0].instanceOrderState == 20 ) {
            switch ( data[0].instanceWorkState ) {
              case 10: // 未启动
                this.setState( { buttonflag: { ...this.state.buttonflag, runFlag: false  } } );
                break;
              case 20: // 运行中
                this.setState( { buttonflag: { ...this.state.buttonflag, stopFlag: false  } } );
                break;
              case 30: // 停止
                this.setState( { buttonflag: { ...this.state.buttonflag, runFlag: false } } );
                break;
              case 40: // 失败
                this.setState( { buttonflag: { runFlag: true, stopFlag: true } } );
                break;
              case 50: // 异常
                this.setState( { buttonflag: { runFlag: true, stopFlag: true } } );
                break;
              default:
                this.setState( { buttonflag: { runFlag: true, stopFlag: true } } );
            }
          }
        } else {
          this.setState( { buttonflag: { runFlag: true, stopFlag: true } } );
        }
      }else {
        this.setState( { buttonflag: { runFlag: true, stopFlag: true } } );
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

  handleClickDetailModal( value ) {
    this.setState( { detailVisible: true, instanceDetail: value } );
  }

  handleCloseDetailModal() {
    this.setState( { detailVisible: false, instanceDetail: null } );
  }

  handleClickMonitorModal( value ) {
    this.setState( { monitorVisible: true, instanceNo: value.instanceNo, nodeCode: value.nodeCode } );
  }

  handleCloseMonitorModal() {
    this.setState( { monitorVisible: false, instanceNo: '', nodeCode: '' } );
  }

  render() {
    let { menuData, pageNo, pageSize, instanceList, instanceNo, nodeCode, instanceId } = this.state;
    let { runFlag, stopFlag } = this.state.buttonflag;

    return (
      <Layout>
        <Layout>
          <Row>
            <Col size={ 4 } style={ { marginTop: '20px' } }>
              <Layout.Sider style={ { height: '100%', backgroundColor: '#FBFBFB' } }>
                <div style={ { padding: '40px 0', marginLeft: '45px' } }>
                  { menuData ? menuData.map( ( item, index ) => {
                    return (
                      <ul key={ getUUID() }>
                        <li style={ { padding: '10px 0', cursor: 'pointer', userSelect: 'none' } } onClick={ this.handleClickService.bind( this, item.cataId ) }>
                        <span style={ { paddingRight: '10px' } }>
                          { this.state.cataId == item.cataId ? ( this.state.flag ? <Icon icon="sort-desc"></Icon> : <Icon icon="caret-right"></Icon> ) : <Icon icon="caret-right"></Icon> }
                        </span>
                          { item.cataName }
                        </li>
                        { item.serviceInfoList.map( ( it, i ) => {
                          let svcId = it.svcId;
                          let svcName = it.svcName;
                          return (
                            <div
                              title={ svcName }
                              style={ {
                                fontWeight: this.state.svcId == it.svcId || this.props.match.params.svcId == it.svcId ? 'bold' : 'normal',
                                color: this.state.svcId == it.svcId || this.props.match.params.svcId == it.svcId ? '#0070d2' : '#16325c',
                                display: this.state.cataId == item.cataId ? ( this.state.flag ? 'block' : 'none' ) : 'none',
                                padding: '10px 0 10px 20px',
                                cursor: 'pointer',
                                width: '120px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                userSelect: 'none'
                              } }
                              key={ getUUID() }
                              onClick={ this.handleClickChildService.bind( this, svcId ) }
                            >
                              { it.svcName }
                            </div>
                          )
                        } )
                        }
                      </ul>
                    )
                  } ) : null
                  }
                </div>
              </Layout.Sider>
            </Col>
            <Col size={ 20 }>
              <Layout.Content>
                <Container type="fluid" style={ { margin: '0 35px', paddingTop: '20px' } }>
                  <Row>
                    <Col size={ 24 }>
                      <Form
                        type="inline"
                        async={ true }
                      >
                        <FormItem type="inline">
                          <Input placeholder="请输入实例编号" type="search" onChange={ this.handleSearchValue } />
                        </FormItem>
                        <Button onClick={ this.handleClickSearch }>查询</Button>
                        <div style={ { float: 'right' } }>
                          <Button type="primary" disabled={ runFlag } style={ { marginLeft: '10px' } } onClick={ this.handleRunService.bind( this ) }>启动</Button>
                          <Button type="primary" disabled={ stopFlag } style={ { marginLeft: '10px' } } onClick={ this.handleStopService.bind( this ) }>停止</Button>
                        </div>
                      </Form>
                    </Col>
                  </Row>
                  <Table
                    textAlign="center"
                    bgColor={ { head: '#ecf5fe' } }
                    headBolder={ true }
                    striped={ true }
                    headMenu={ true }
                    dataSource={ instanceList ? instanceList.data : [] }
                    style={ { margin: '10px 0' } }
                    onCheck={ this.handleTableCheck }
                    checkable
                    singleSelection
                  >
                    <Column title="序号" textAlign="center" scaleWidth="10%">
                      {
                        ( value, index ) => {
                          return (
                            index.indexOf( '-' ) == -1 ?
                              <span style={ { display: 'inline-block', marginTop:"10px" } }>{ 1 + parseInt( index ) + ( ( pageNo - 1 ) * pageSize ) }</span> : <span style={ { display: 'none', marginTop:"10px" } }>{ value.nodeCode }</span>
                          );
                        }
                      }
                    </Column>
                    <Column title="实例编号" textAlign="center" dataIndex="instanceNo" scaleWidth="10%" />
                    <Column title="订购状态" textAlign="center" scaleWidth="10%">
                      {
                        ( value, index ) => {
                          return (
                            index.indexOf( '-' ) == -1 ?
                              <span style={ { display: 'inline-block', marginTop:"10px" } }>{ instanceOrderStateConvert( value.instanceOrderState ) }</span> : ''
                          );
                        }
                      }
                    </Column>
                    <Column title="运行状态" textAlign="center" scaleWidth="10%">
                      {
                        ( value, index ) => {
                          let id = value.instanceId;
                          let resultLoad = this[ `loadFlag${ id }` ] ? 'inline-block' : 'none';
                          let resultState = this[ `loadFlag${ id }` ] ? 'none' : 'inline-block';

                          return (
                            <div>
                              <span style={ { display: id == this.state.instanceId ? resultState : 'inline-block', marginTop:"10px" } }>{ instanceWorkStateConvert( value.instanceWorkState ) }</span>
                              <span style={ { display: id == this.state.instanceId ? resultLoad : 'none' } }>
                                <Loading size="small" type="primary" />
                              </span>
                            </div>

                          );
                        }
                      }
                    </Column>
                    <Column title="使用用户" textAlign="center" scaleWidth="10%">
                      {
                        ( value, index ) => {
                          return (
                            index.indexOf( '-' ) == -1 ?
                              <span style={ { display: 'inline-block', marginTop:"10px" } }>{ value.createBy }</span> : ''
                          );
                        }
                      }
                    </Column>
                    <Column title="开通时间" textAlign="center" scaleWidth="15%">
                      {
                        ( value, index ) => {
                          return (
                            index.indexOf( '-' ) == -1 ?
                              <span style={ { display: 'inline-block', marginTop:"10px" } }>{ value.createDate }</span> : ''
                          );
                        }
                      }
                    </Column>
                    <Column title="到期时间" textAlign="center" scaleWidth="15%">
                      {
                        ( value, index ) => {
                          return (
                            index.indexOf( '-' ) == -1 ?
                              <span style={ { display: 'inline-block', marginTop:"10px" } }>{ value.instanceOrderState == 30 ? value.expirDate : '-' }</span> : ''
                          );
                        }
                      }
                    </Column>
                    <Column title="操作" textAlign="center" scaleWidth="20%">
                      {
                        ( value, index ) => {
                          return (
                            <Row>
                              <Col>
                                { index.indexOf( '-' ) == -1 ? <Button onClick={ this.handleClickDetailModal.bind( this, value ) }>查看详情</Button> : '' }
                                { index.indexOf( '-' ) == -1 ? '' : <Button onClick={ this.handleClickMonitorModal.bind( this, value ) }>监控</Button> }
                              </Col>
                            </Row>
                          )
                        }
                      }
                    </Column>
                  </Table>
                  <Pagination index={ pageNo } total={ instanceList ? instanceList.total : 0 } size={ pageSize } showPagiJump={ true } showDataSizePicker={ true } onChange={ this.handlePaginationChange } align="right" />

                  { this.state.detailVisible ? <Modal visible={ true } size="medium" onClose={ this.handleCloseDetailModal.bind( this ) } >
                    <ModalHeader>
                      服务实例详情
                    </ModalHeader>
                    <ModalBody>
                      <AdminInstanceDetail instanceDetail={ this.state.instanceDetail } handleCloseDetailModal={ this.handleCloseDetailModal.bind( this ) } />
                    </ModalBody>
                  </Modal> : null }

                  { this.state.monitorVisible ? <Modal visible={ true } size="large" onClose={ this.handleCloseMonitorModal.bind( this ) }>
                    <ModalHeader>
                      监控
                    </ModalHeader>
                    <ModalBody height={ 800 }>
                      <iframe style={ { height: '100%', width: '100%' } } frameborder="0" src={ `http://bconsole.bonc.pro/moniter/moniter/instance/${ instanceNo }/nodeCode/${ nodeCode }` }></iframe>
                    </ModalBody>
                  </Modal> : null }

                </Container>
              </Layout.Content>
            </Col>
          </Row>
        </Layout>
      </Layout>
    );
  }
}

export { ServiceInstanceManage };
export default ServiceInstanceManage;