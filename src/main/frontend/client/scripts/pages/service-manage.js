import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Button, Input, Select, FormItem, Form, Row, Col, Column, Table, Pagination, Container, Loading, Notification } from 'epm-ui';

import { svcStateConvert } from '../components/commons/dynamicConvert';
import { RefButton } from '../components/commons/comm-refButton';
import { getDataSource } from '../utilities/dataSource';
import { popup } from '../utilities/transient';

import context from 'context';

/**
 *@author sshuzhong
 *@mailTo <a href="mailto:songshuzhong@bonc.com.cn">Song ShuZhong</a>
 *@Date 2017/12/19.
 *@desc
 */
class ServiceRegisterManage extends Component {
  constructor( props ) {
    super( props );
    this.state = { svcList: {}, pageNo: 1, pageSize: 10, formData: {} };

    this.handleResetForm = this.handleResetForm.bind( this );
    this.onFormGetter = this.onFormGetter.bind( this );
    this.handlePagiChange = this.handlePagiChange.bind( this );
    this.onAsyncSubmit = this.onAsyncSubmit.bind( this );
    this.onAfterSubmit = this.onAfterSubmit.bind( this );
    this.fetchSvcList = this.fetchSvcList.bind( this );
    this.directToSvcRegister = this.directToSvcRegister.bind( this );
  }

  componentDidMount() {
    this.formData = this.getValue();

    this.fetchSvcList();
  }

  onAsyncSubmit( formData ) {
    formData.pageNo = this.state.pageNo;
    formData.pageSize = this.state.pageSize;

    return formData;
  }

  onAfterSubmit( svcList ) {
    this.setState( { svcList } );
  }

  handlePagiChange( pageNo, pageSize ) {
    this.setState( { pageNo, pageSize }, this.fetchSvcList );
  }

  /**
   * 获取服务列表
   */
  fetchSvcList() {
    let param = '';

    this.formData.pageNo = this.state.pageNo;
    this.formData.pageSize = this.state.pageSize;

    for ( let name in this.formData ) {
      param += `${ name }=${ this.formData[ name ] }&`;
    }

    getDataSource(
      {
        url: `${ context.contextPath }/v1/services/page`,
        params: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: param.substring( 0, param.length - 1 ) }
      }, ( svcList ) => this.setState( { svcList } ) );
  }

  handleSvcMenu( rowData ) {
    let serviceId = rowData.svcId;

    getDataSource( `${ context.contextPath }/v1/services/${ serviceId }/package`, ( packages ) => {
      if ( packages.length > 0 ) {

        this.context.router.history.push( {
          pathname: `/console-home/service-package-detail/${ serviceId }`
        } );

      } else {

        this.context.router.history.push( {
          pathname: `/console-home/service-package-add/${ serviceId }`
        } );

      }
    } );
  }

  /**
   * 服务上线
   * @param rowData
   * @param index
   */
  handleSvcOnLine( rowData, index ) {
    getDataSource(
      {
        url: `${ context.contextPath }/v1/services/${ rowData.svcId }/state/30`,
        params: { method: 'put', body: '' }
      },
      ( callback ) => {
        if ( callback.message ) {
          this[ `onBtn${ index }` ].disabled = true;
          this[ `offBtn${ index }` ].disabled = false;
          this.fetchSvcList();
          popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ `${ rowData.svcName }服务成功上线！` } /> );
        } else {
          popup( <Notification key={ Math.random().toString() } message={ callback.code } type="error" description={ callback.message } /> );
        }
      }
    );
  }

  /**
   * 服务下线
   * @param rowData
   * @param index
   */
  handleSvcOffLine( rowData, index ) {
    getDataSource(
      {
        url: `${ context.contextPath }/v1/services/${ rowData.svcId }/state/40`,
        params: { method: 'put', body: '' }
      },
      ( callback ) => {
        if ( callback.message ) {
          this[ `onBtn${ index }` ].disabled = false;
          this[ `offBtn${ index }` ].disabled = true;
          this.fetchSvcList();
          popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ `${ rowData.svcName }服务成功下线！` } /> );
        } else {
          popup( <Notification key={ Math.random().toString() } message={ callback.code } type="error" description={ callback.message } /> );
        }
      }
    );
  }

  directToSvcRegister() {
    this.context.router.history.push( '/console-home/service-register' );
  }

  handleSvcOnSettings( rowData ) {
    this.context.router.history.push( {
      pathname: `/console-home/service-config-list`,
      query: { svcId: rowData.svcId, customType: 30, svcName: rowData.svcName, svcVersion: rowData.svcVersion }
    } );
  }

  /**
   * 获取表单数据
   * @param getter
   */
  onFormGetter( getter ) {
    this.getValue = getter.value;
  }

  /**
   * 重置表单
   * @param trigger
   */
  handleResetForm( trigger ) {
    this.reset = trigger.reset;
  }

  /**
   * 置灰上线按钮
   * @param state
   * @returns {boolean}
   */
  handleOnLineBtn( state ) {
    if ( state == 20 || state == 40 ) {
      return false;
    }

    return true;
  }

  /**
   * 置灰下线按钮
   * @param state
   * @returns {boolean}
   */
  handleOffLineBtn( state ) {
    if ( state == 30 ) {
      return false;
    }

    return true;
  }

  /**
   *
   * @returns {XML}
   */
  render() {
    const { pageSize, pageNo, svcList: { total, data } } = this.state;
    const linkStyle = { padding: '8px 0px', display: 'inline-block' };

    return (
      <Container type="fluid" style={ { marginTop: '20px' } }>
        <Row>
          <Col size={ { normal: 24, small: 24, medium: 24, large: 24 } }>
            <Form
              method="post"
              async={ true }
              type="inline"
              onSubmit={ this.onAsyncSubmit }
              onAfterSubmit={ this.onAfterSubmit }
              getter={ this.onFormGetter }
              trigger={ this.handleResetForm }
              action={ `${ context.contextPath }/v1/services/page` }
              onChange={ ( formData ) => this.formData = formData }
            >
              <FormItem type="inline" name="entity.svcState">
                <Select dataSource={ `${ context.contextPath }/v1/dictcategorys/svc_state/dictdetails/combobox` } placeholder="服务状态" />
              </FormItem>
              <FormItem type="inline" name="entity.svcCategoryInfo.cataId">
                <Select dataSource={ `${ context.contextPath }/v1/svccategorys/combobox` } placeholder="服务类型" />
              </FormItem>
              <FormItem type="inline" name="entity.svcName">
                <Input placeholder="模糊查询" />
              </FormItem>
              <Button htmlType="submit">查询</Button>
              <Button onClick={ () => { this.reset(); } }>重置</Button>
              <Button style={ { float: 'right' } } onClick={ this.directToSvcRegister }>注册服务</Button>
            </Form>
          </Col>
          {
            data ?
              <Col size={ { normal: 24, small: 24, medium: 24, large: 24 } }>
                <Table dataSource={ data } headMenu={ true } textAlign="center" bgColor={ { head: '#ecf5fe' } } headBolder={ true } striped={ true }>
                  <Column title="服务名称" textAlign="left" scaleWidth="10%">
                    { ( rowData ) =>
                      <Link title={ rowData.svcName } to={ { pathname: '/console-home/service-details', query: { svcId: rowData.svcId, svcState: rowData.svcState } } } style={ { padding: '8px 3px', display: 'inline-block', textDecorationLine: 'none' } }>
                        { rowData.svcName }
                      </Link>
                    }
                  </Column>
                  <Column title="服务编码" textAlign="left" dataIndex="svcCode" scaleWidth="10%" />
                  <Column title="版本号" dataIndex="svcVersion" scaleWidth="8%" />
                  <Column title="服务状态" dataIndex="svcState" scaleWidth="10%">
                    {
                      ( value ) => { return svcStateConvert( value ); }
                    }
                  </Column>
                  <Column title="服务类型" dataIndex="svcCategoryInfo" scaleWidth="10%">
                    { ( svcCategoryInfo ) => svcCategoryInfo.cataName }
                  </Column>
                  <Column title="服务提供方" dataIndex="svcProviderInfo" scaleWidth="10%">
                    { ( svcProviderInfo ) => svcProviderInfo.providerName }
                  </Column>
                  <Column title="创建人" dataIndex="createBy" scaleWidth="10%" />
                  <Column title="创建时间" dataIndex="updateDate" scaleWidth="12%" />
                  <Column title="操作" dataIndex="" scaleWidth="20%">
                    { ( rowData, index ) =>
                      [
                        <RefButton type="link" key={ index + 1 } style={ linkStyle } onClick={ this.handleSvcMenu.bind( this, rowData ) }>套餐</RefButton>,
                        <RefButton type="link" key={ index + 2 } style={ linkStyle } btnRef={ ( onBtn ) => this[ `onBtn${ index }` ] = onBtn } disabled={ this.handleOnLineBtn( rowData.svcState ) } onClick={ this.handleSvcOnLine.bind( this, rowData, index ) }>上线</RefButton>,
                        <RefButton type="link" key={ index + 3 } style={ linkStyle } btnRef={ ( offBtn ) => this[ `offBtn${ index }` ] = offBtn } disabled={ this.handleOffLineBtn( rowData.svcState ) } onClick={ this.handleSvcOffLine.bind( this, rowData, index ) }>下线</RefButton>,
                        <RefButton type="link" key={ index + 4 } style={ linkStyle } onClick={ this.handleSvcOnSettings.bind( this, rowData ) }>配置列表</RefButton>
                      ]
                    }
                  </Column>
                </Table>
                <br />
                <Pagination index={ pageNo } total={ total } size={ pageSize } showPagiJump={ true } showDataSizePicker={ true } align="right" onChange={ this.handlePagiChange } />
              </Col> : <Col style={ { paddingTop: '60px' } }><Loading type="primary" size="large" /></Col>
          }
        </Row>
      </Container>
    );
  }

}

ServiceRegisterManage.contextTypes = { router: PropTypes.object.isRequired };

export { ServiceRegisterManage };
export default ServiceRegisterManage;
