import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Container, Row, Col, Column, Table, Loading, Button, ButtonGroup, Notification } from 'epm-ui';

import { basicTypeConvert, formItemConvert, attrCustomConvert } from '../components/commons/dynamicConvert';
import { getDynamicForm } from '../components/commons/dynamicForm';
import { getDataSource } from '../utilities/dataSource';
import { popup } from '../utilities/transient';

import context from 'context';

/**
 *@author sshuzhong
 *@mailTo <a href="mailto:songshuzhong@bonc.com.cn">Song ShuZhong</a>
 *@Date 2017/12/21.
 *@desc
 */
class ServiceDetails extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      svcInfo: '',
      query: props.location.query
    };

    this.directToSvcManage = this.directToSvcManage.bind( this );
    this.directToSvcTemporary = this.directToSvcTemporary.bind( this );
  }

  componentWillMount() {
    let { query } = this.state;

    if ( !query ) {
      this.context.router.history.push( '/console-home/service-manage' );
    }
  }

  componentDidMount() {
    let { query } = this.state;

    if ( query )
      getDataSource( `${ context.contextPath }/v1/services/${ query.svcId }`, ( svcInfo ) => this.setState( { svcInfo } ) );
  }

  directToSvcManage() {
    this.context.router.history.push( '/console-home/service-manage' );
  }

  directToSvcTemporary() {
    let { svcState } = this.state.query;

    if ( svcState == 10  )
      this.context.router.history.push( { pathname: `/console-home/service-temporary`, query: { svcId: this.state.query.svcId } } );
    else
      popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="抱歉，该服务不是暂存状态，不能进行编辑！" /> );
  }

  render() {
    let { svcInfo } = this.state;
    let inline = { display: 'inline-block' };
    let inlineMargin = { width: '70px', textAline: 'center', display: 'inline-block', margin: '7px 30px' };

    return (
      <Container type="fluid">
        <Row>
          <Col size={ { normal: 24, small: 24, medium: 24, large: 24 } } style={ { paddingTop: '7px' } }>
            <div style={ { width: '25%', height: '28px', marginBottom: '14px', display: 'inline-block', color: '#FFFFFF', backgroundColor: '#0178D7' } }>当前位置：MySQL服务信息</div>
            <ButtonGroup style={ { float: 'right' } }>
              { svcInfo? svcInfo.cServiceInfo.svcState == '10'? <Button onClick={ this.directToSvcTemporary }>编辑</Button>: null: null }
              <Button onClick={ this.directToSvcManage }>返回</Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col size={ { normal: 24, small: 24, medium: 24, large: 24 } }>
            <div style={ { width: '100%', height: '20px', backgroundColor: '#F2F2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' } }>服务基本信息</div>
          </Col>
          <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
            <p style={ inlineMargin }>服务名称</p>
            <p style={ inline }>{ svcInfo ? svcInfo.cServiceInfo.svcName : '-' }</p>
          </Col>
          <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
            <p style={ inlineMargin }>服务类型</p>
            <p style={ inline }>{ svcInfo ? svcInfo.cServiceInfo.svcCategoryInfo.cataName : '-' }</p>
          </Col>
          <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
            <p style={ inlineMargin }>服务编码</p>
            <p style={ inline }>{ svcInfo ? svcInfo.cServiceInfo.svcCode : '-' }</p>
          </Col>
          <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
            <p style={ inlineMargin }>服务描述</p>
            <p style={ inline }>{ svcInfo ? svcInfo.cServiceInfo.svcDesc : '-' }</p>
          </Col>
          <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
            <p style={ inlineMargin }>服务LOGO</p>
            { svcInfo ? <img key="icon" style={ { width: '116px', height: '56px' } } src={ `data:image/jpg;base64,${ svcInfo.cServiceInfo.svcIcon }` } alt="pic" /> : null }
          </Col>
          <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
            <p style={ inlineMargin }>服务ID</p>
            <p style={ inline }>{ svcInfo ? svcInfo.cServiceInfo.svcId : '-' }</p>
          </Col>
          <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
            <p style={ inlineMargin }>服务提供方</p>
            <p style={ inline }>{ svcInfo ? svcInfo.cServiceInfo.svcProviderInfo.providerName : '-' }</p>
          </Col>
          <Col size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
            <p style={ inlineMargin }>服务版本</p>
            <p style={ inline }>{ svcInfo ? svcInfo.cServiceInfo.svcVersion : '-' }</p>
          </Col>
          {
            this.state.svcInfo ? getDynamicForm( svcInfo.cSvcExtInfos, false ) : null
          }
        </Row>
        <Row>
          <Col size={ { normal: 24, small: 24, medium: 24, large: 24 } }>
            <div style={ { width: '100%', height: '20px', backgroundColor: '#F2F2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' } }>属性</div>
          </Col>
          {
            svcInfo ?
              <Col size={ { normal: 24, small: 24, medium: 24, large: 24 } }>
                <Table key="attrTable" dataSource={ svcInfo.cAttrInfos } headMenu={ true } textAlign="center" bgColor={ { head: '#ecf5fe' } } headBolder={ true } striped={ true }>
                  <Column title="序号" scaleWidth="5%">
                    {
                      ( rowData, index ) => { return Number( index ) + 1; }
                    }
                  </Column>
                  <Column title="属性名" dataIndex="attrName" scaleWidth="10%" textAlign="left"/>
                  <Column title="属性英文名" dataIndex="attrEnname" scaleWidth="10%" textAlign="left"/>
                  <Column title="属性类型" scaleWidth="10%">
                    {
                      ( rowData ) => {
                        return basicTypeConvert( rowData.attrType );
                      }
                    }
                  </Column>
                  <Column title="控件类型" scaleWidth="10%">
                    {
                      ( rowData ) => {
                        return formItemConvert( rowData.cAttrMetadataInfo.metadataModule );
                      }
                    }
                  </Column>
                  <Column title="初始值" scaleWidth="10%">
                    {
                      ( rowData ) => {
                        return rowData.cAttrMetadataInfo.metadataIsInit ? rowData.cAttrMetadataInfo.cAttrInitInfo.valueObject : '-';
                      }
                    }
                  </Column>
                  <Column title="校验规则" scaleWidth="15%">
                    {
                      ( rowData ) => {
                        return rowData.cAttrMetadataInfo.metadataIsValidate ? rowData.cAttrMetadataInfo.cAttrValidateInfo.validateRole : '-';
                      }
                    }
                  </Column>
                  <Column title="属性描述" dataIndex="attrDesc" scaleWidth="15%" />
                  <Column title="属性标签" scaleWidth="15%">
                    {
                      ( rowData, key ) => {
                        return attrCustomConvert( rowData.customAttrType );
                      }
                    }
                  </Column>
                </Table>
              </Col>
              : <Loading type="primary" size="large" />
          }
        </Row>
      </Container>
    );
  }
}

ServiceDetails.contextTypes = { router: PropTypes.object.isRequired };

export { ServiceDetails };
export default ServiceDetails;
