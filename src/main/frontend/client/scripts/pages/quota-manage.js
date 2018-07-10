import React, { Component } from 'react';
import { Button, Layout, Container, Input, FormItem, Form, Row, Col, Column, Table, Pagination, Icon, Notification, Modal, ModalBody, ModalHeader, Tree } from 'epm-ui';

import { popup } from '../utilities/transient';
import { getDataSource } from '../utilities/dataSource';
import context from 'context';

/**
 *@author xumeng
 *@mailTo <a href="mailto:xumeng@bonc.com.cn">xumeng</a>
 *@Date 2018/1/29.
 *@desc 配额管理
 */

class QuotaManage extends Component {
  constructor( props ) {
    super( props );
    this.state={
      pageNo: 1,
      pageSize: 10,
      selectKey: '',
      keyWords: '',
      userForSearch: '',
      quoatList: null,
      tenantId: '',
      treeData: [],
      quoatDetail: null,
      providerName: '',
      providerId: '',
      quotaFlag: true,
      requiredFlag: true,
      focusCount: 0,
      blurCount: 0
    };

    this.fetchQuoatList = this.fetchQuoatList.bind( this );
    this.fetchQuoatDetails = this.fetchQuoatDetails.bind( this );
    this.fetchMenuData = this.fetchMenuData.bind( this );
    this.handleSearchValue = this.handleSearchValue.bind( this );
    this.handleClickSearch = this.handleClickSearch.bind( this );
    this.handlePaginationChange = this.handlePaginationChange.bind( this );
    this.handleSearchMenuValue = this.handleSearchMenuValue.bind( this );
    this.handleClickSearchUser = this.handleClickSearchUser.bind( this );
  }

  componentDidMount() {
    this.fetchMenuData();
    this.fetchQuoatList();
  }

  fetchMenuData() {
    getDataSource( `${ context.contextPath }/v1/userGroups`, ( menuData ) => {

      let arr = [];

      menuData.forEach( ( item, index ) => {
        let treeObj = {};
        treeObj['name'] = item.tenantName;
        treeObj['data'] = {};
        treeObj['data']['tid'] = item.tenantId;
        arr.push( treeObj );
      } );

      this.setState( { treeData: arr } );
    } );
  }

  fetchQuoatList() {
    let { pageNo, pageSize, selectKey } = this.state;
    getDataSource( `${ context.contextPath }/v1/svcProviders?pageNo=${ pageNo }&pageSize=${ pageSize }&selectKey=${ selectKey }`, ( quoatList ) => {
      this.setState( { quoatList } );
    } );
  }

  fetchQuoatDetails( value ) {
    let { tenantId } = this.state;
    let providerId = value.providerId;

    getDataSource( `${ context.contextPath }/v1/quotas/provider/${ providerId }/group/${ tenantId }`, ( quoatDetail ) => {
      this.setState( { quoatDetail } );
    } );
  }

  // 获取选中的租户id
  handleSelect( node, isSelected, selectedNodes ) {
    isSelected ? this.setState( { tenantId: node.data.tid } ) : this.setState( { tenantId: '' } );
  }

  handleSearchMenuValue( value ) {
    this.setState( { userForSearch: value.trim() } );
  }

  // 菜单栏查询用户组
  handleClickSearchUser() {
    this.search( this.state.userForSearch );
  }

  handleSearchValue( value ) {
    this.setState( { keyWords: value } );
  }

  // 列表查询服务提供方
  handleClickSearch() {
    this.setState( { pageNo: 1, selectKey: this.state.keyWords }, this.fetchQuoatList );
  }

  // 分页
  handlePaginationChange( pageNo, pageSize ) {
    this.setState( { pageNo, pageSize }, this.fetchQuoatList );
  }

  handleClickQuoatDetailModal( value ) {
    let { tenantId } = this.state;

    if( tenantId != '' ) {
      this.fetchQuoatDetails( value );
      this.setState( { detailVisible: true, providerName: value.providerName } );
    }else {
      popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="请选择用户组" /> );
    }
  }

  handleCloseQuoatDetailModal() {
    this.setState( { detailVisible: false, quoatDetail: null, providerName: '' } );
  }

  handleClickQuoatSetModal( value ) {
    let { tenantId } = this.state;

    if( tenantId != '' ) {
      this.fetchQuoatDetails( value );
      this.setState( { setVisible: true, providerName: value.providerName, providerId: value.providerId } );
    }else {
      popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="请选择用户组" /> );
    }
  }

  handleCloseQuoatSetModal() {
    this.setState( { setVisible: false, quoatDetail: null, providerName: '', providerId: '' } );
  }

  // 获取配额并校验
  handleBlurInputData( index, value ) {
    this.state.blurCount += 1;

    let { quoatDetail } = this.state;

    let reg = /^[0-9]*$/;
    if( reg.test( value ) == false ) {
      this.setState( { quotaFlag: false } );
      popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="配额必须是数字" /> );
    }else if( value == '' ) {
      quoatDetail[ index ].configureValueObject = value;
      this.setState( { requiredFlag: false, quoatDetail } );
      popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="请设置配额默认值" /> );
    }else {
      quoatDetail[ index ].configureValueObject = value;
      this.setState( { quotaFlag: true, requiredFlag: true, quoatDetail } );
    }
  }

  handleTableGetter( getter ) {
    this.getData = getter.data;
  }

  handleClickSave() {
    let { tenantId, providerId, quotaFlag, requiredFlag, blurCount, focusCount } = this.state;
    let tableData = this.getData();

    if( tableData ) {
      for ( let i = 0; i < tableData.length; i++ ) {
        let cur = tableData[i];

        if( cur.configureValueObject == '' ) {
          this.required = false;
          break;
        }
        this.required = true;
      }
    }

    if( this.required && ( quotaFlag && requiredFlag ) ) {
      let submitData = [];

      tableData.forEach( ( item, index ) =>{
        let submitObj = {};
        submitObj.valueId = item.valueId;
        submitObj.configureValueObject = item.configureValueObject;
        submitData.push( submitObj );
      } );

      getDataSource( {
        url: `${ context.contextPath }/v1/quotas/provider/${ providerId }/group/${ tenantId }`,
        params: { body: JSON.stringify( submitData ) }
      }, ( data ) => {
        if ( data.code === 201 ) {
          popup( <Notification key={ Math.random().toString() } message={ data.code } type="success" description={ data.message } /> );
          this.handleCloseQuoatSetModal();
        } else if( data.code === 500 ) {
          popup( <Notification key={ Math.random().toString() } message={ data.code } type="error" description={ data.message } /> );
        } else {
          popup( <Notification key={ Math.random().toString() } message={ data.code } type="error" description={ data.message } /> );
        }
      } );
    }else {
      if( quotaFlag == false ) {
        if( blurCount < focusCount ) {
          return popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="配额默认值必须是数字" /> );
        }
      } else if( requiredFlag == false && this.required == false ) {
        if( blurCount < focusCount ) {
          return popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="请设置配额默认值" /> );
        }
      }
    }
  }

  render() {
    let { treeData, pageNo, pageSize, quoatList, quoatDetail, providerName } = this.state;

    return (
      <Layout>
        <Layout>
          <Row>
            <Col size={ 4 } style={ { marginTop: '20px' } }>
              <Layout.Sider style={ { height: '100%', backgroundColor: '#FBFBFB' } }>
                <Row>
                  <Col style={ { margin: '30px 0 20px 15px' } }>
                    <Input style={ { width: '132px' } } type="search" placeholder="快速查找用户组" onChange={ this.handleSearchMenuValue } >
                      <Input.Right>
                        <Button shape="icon" type="primary" onClick={ this.handleClickSearchUser }>
                          <Icon icon="search" />
                        </Button>
                      </Input.Right>
                    </Input>
                  </Col>
                </Row>
                <Tree
                  dataSource={ treeData }
                  onSelect = { this.handleSelect.bind( this ) }
                  trigger={ ( trigger ) => { this.search = trigger.search; } }
                />
              </Layout.Sider>
            </Col>
            <Col size={ 20 }>
              <Layout.Content>
                <Container type="fluid" style={ { marginLeft: '20px', paddingTop: '20px' } }>
                  <Row>
                    <Col>
                      <Form
                        type="inline"
                        async={ true }
                      >
                        <FormItem type="inline">
                          <Input style={ { width: '200px' } } placeholder="请输入服务提供方或资源" type="search" onChange={ this.handleSearchValue } />
                        </FormItem>
                        <Button onClick={ this.handleClickSearch }>查询</Button>
                      </Form>
                    </Col>
                  </Row>
                  <Table
                    textAlign="center"
                    bgColor={ { head: '#ecf5fe' } }
                    headBolder={ true }
                    striped={ true }
                    headMenu={ true }
                    dataSource={ quoatList ? quoatList.data : [] }
                    style={ { marginBottom: '20px' } }
                  >
                    <Column title="服务提供方" textAlign="left" dataIndex="providerName" scaleWidth="20%" />
                    <Column title="资源" textAlign="left" dataIndex="quotas" scaleWidth="40%" />
                    <Column title="操作" textAlign="center" scaleWidth="40%">
                      {
                        ( value, index ) => {
                          return (
                            <Row>
                              <Col>
                                <Button onClick={ this.handleClickQuoatDetailModal.bind( this, value ) }>查看配额</Button>
                                <Button onClick={ this.handleClickQuoatSetModal.bind( this, value ) }>配额设置</Button>
                              </Col>
                            </Row>
                          )
                        }
                      }
                    </Column>
                  </Table>
                  <Pagination index={ pageNo } total={ quoatList ? quoatList.total : 0 } size={ pageSize } showPagiJump={ true } showDataSizePicker={ true } onChange={ this.handlePaginationChange } align="right" />

                  { this.state.detailVisible ? <Modal visible={ true } size="medium" onClose={ this.handleCloseQuoatDetailModal.bind( this ) } >
                    <ModalHeader>
                      查看配额
                    </ModalHeader>
                    <ModalBody>
                      <div>
                        <span>服务提供方：{ providerName }</span>
                        <Table
                          textAlign="center"
                          bgColor={ { head: '#ecf5fe' } }
                          headBolder={ true }
                          striped={ true }
                          headMenu={ true }
                          dataSource={ quoatDetail ? quoatDetail: [] }
                          style={ { marginTop: '10px' } }
                        >
                          <Column title="属性名" textAlign="left" dataIndex="attrName" scaleWidth="30%" />
                          <Column title="资源使用量" textAlign="left" scaleWidth="40%">
                            {
                              ( value, index ) => {
                                let title = value.usedValueObject + value.metadataUnit;
                                return (
                                  <span title={ title } style={ { display: 'inline-block', marginTop: '10px' } }>{ value.usedValueObject } { value.metadataUnit }</span>
                                );
                              }
                            }
                          </Column>
                          <Column title="配额" textAlign="left" scaleWidth="30%">
                            {
                              ( value, index ) => {
                                let title = value.configureValueObject + value.metadataUnit;
                                return (
                                  <span title={ title } style={ { display: 'inline-block', marginTop: '10px' } }>{ value.configureValueObject } { value.metadataUnit }</span>
                                );
                              }
                            }
                          </Column>
                        </Table>
                        <Button type="primary" style={ { margin: '20px 0 0 43%' } } onClick={ this.handleCloseQuoatDetailModal.bind( this ) }>返回</Button>
                      </div>
                    </ModalBody>
                  </Modal> : null }

                  { this.state.setVisible ? <Modal visible={ true } size="medium" onClose={ this.handleCloseQuoatSetModal.bind( this ) } >
                    <ModalHeader>
                      配额设置
                    </ModalHeader>
                    <ModalBody>
                      <div>
                        <span>服务提供方：{ providerName }</span>
                        <Table
                          textAlign="center"
                          bgColor={ { head: '#ecf5fe' } }
                          headBolder={ true }
                          striped={ true }
                          headMenu={ true }
                          dataSource={ quoatDetail ? quoatDetail: [] }
                          getter={ this.handleTableGetter.bind( this ) }
                          style={ { marginTop: '10px' } }
                        >
                          <Column title="属性名" textAlign="left" dataIndex="attrName" scaleWidth="30%" />
                          <Column title="资源使用量" textAlign="left" scaleWidth="26%">
                            {
                              ( value, index ) => {
                                let title = value.usedValueObject + value.metadataUnit;
                                return (
                                  <span title={ title } style={ { display: 'inline-block', marginTop: '10px' } }>{ value.usedValueObject } { value.metadataUnit }</span>
                                );
                              }
                            }
                          </Column>
                          <Column title="配额" textAlign="left" scaleWidth="44%">
                            {
                              ( value, index ) => {
                                let configureValueObject = value.configureValueObject;
                                return (
                                  <Row>
                                    <Col>
                                      <Input name='configureValueObject' showClear={ false } style={ { float: 'left' } } value={ configureValueObject } placeholder="请输入数字，必填" pattern={ /^[0-9]*$/ } onBlur={ this.handleBlurInputData.bind( this, index ) } onFocus={ () => this.state.focusCount += 1 } />
                                      <span title={ value.metadataUnit } style={ { display: 'inline-block', marginTop: '10px' } }>{ value.metadataUnit }</span>
                                    </Col>
                                  </Row>
                                );
                              }
                            }
                          </Column>
                        </Table>
                        <Button type="primary" style={ { margin: '20px 0 0 31%' } } onClick={ this.handleClickSave.bind( this ) }>保存</Button>
                        <Button type="primary" style={ { margin: '20px 0 0 14%' } } onClick={ this.handleCloseQuoatSetModal.bind( this ) }>取消</Button>
                      </div>
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

export { QuotaManage };
export default QuotaManage;