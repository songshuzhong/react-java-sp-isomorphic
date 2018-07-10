import React, { Component } from 'react';
import { Button, Label, Container, Input, FormItem, Form, Row, Col, Column, Table } from 'epm-ui';

import { chargeTypeConvert, chargeTimeTypeConvert } from '../commons/dynamicConvert';

/**
 *@author xumeng
 *@mailTo <a href="mailto:xumeng@bonc.com.cn">xumeng</a>
 *@Date 2017/12/20.
 *@desc 服务提供方-详情modal
 */

class ServiceProviderDetails extends Component {
  constructor( props ) {
    super( props );
    this.state = { detailsData: props.detailsData };
  }

  componentWillReceiveProps( nextProps ) {
    this.setState( { detailsData: nextProps.detailsData } );
  }

  render() {
    const { providerCode, providerName, providerDomain, attrFormInfos } = this.state.detailsData || {};
    const data = attrFormInfos || [];

    return (
      <Container type="fluid" style={ { marginTop: '30px' } }>
        <Row>
          <Col size={ 24 }>
            <Form type="horizontal">
              <FormItem style={ { width: '650px' } }>
                <Label>服务提供方名称</Label>
                <Input value={ providerName ? providerName : '' } readonly />
              </FormItem>
              <FormItem style={ { width: '650px' } }>
                <Label>URL</Label>
                <Input value={ providerDomain ? providerDomain : '' } readonly />
              </FormItem>
              <FormItem style={ { width: '650px' } }>
                <Label>服务提供方编码</Label>
                <Input value={ providerCode ? providerCode : '' } readonly />
              </FormItem>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col
            style={ {
              width: '450px',
              margin: '20px 0 0 15px',
              backgroundColor: 'rgba(242, 242, 242, 1)',
              textAlign: 'center'
            } }
          >
            <span>资源属性</span>
          </Col>
        </Row>
        <Table
          textAlign="center"
          bgColor={ { head: '#ecf5fe' } }
          headBolder={ true }
          striped={ true }
          headMenu={ true }
          dataSource={ data }
          style={ { marginTop: '20px' } }
        >
          <Column title="属性编码" textAlign="center" dataIndex="attrCode" scaleWidth="10%" />
          <Column title="属性名" textAlign="center" dataIndex="attrName" scaleWidth="10%" />
          <Column title="属性英文名" textAlign="center" dataIndex="attrEnname" scaleWidth="15%" />
          <Column title="属性类型" textAlign="center" dataIndex="metadataDataType" scaleWidth="10%" />
          <Column title="属性描述" textAlign="center" dataIndex="attrDesc" scaleWidth="15%" />
          <Column title="配额默认值" textAlign="center" scaleWidth="10%">
            {
              ( value, index ) => {
                let title = value.valueObject + value.metadataUnit;
                return (
                  <span title={ title } style={ { display: 'inline-block', marginTop:"10px" } }>{ value.valueObject } { value.metadataUnit }</span>
                );
              }
            }
          </Column>
          <Column title="计费单价" textAlign="center" scaleWidth="10%">
            {
              ( value, index ) => {
                const chargeAttr = value.chargeAttr ? value.chargeAttr : null;
                const chargePrice = chargeAttr ? chargeAttr.chargePrice : null;
                return (
                  <span style={ { display: 'inline-block', marginTop:"10px" } }>{ chargePrice ? `${ chargePrice }元/${ value.metadataUnit }` : '' }</span>
                );
              }
            }
          </Column>
          <Column title="计费类型" textAlign="center" scaleWidth="10%">
            {
              (value, index) => chargeTypeConvert( value.chargeAttr ? value.chargeAttr.chargeType : '100' )
            }
          </Column>
          <Column title="时间单位" textAlign="center" scaleWidth="10%">
            {
              ( value, index ) => chargeTimeTypeConvert( value.chargeAttr ? value.chargeAttr.chargeTimeType : '100' )
            }
          </Column>
        </Table>
        <Button type="primary" style={ { margin: '30px 0 0 45%' } } onClick={ this.props.handleCloseDetailModal }>返回</Button>
      </Container>
    );
  }
}

export { ServiceProviderDetails };
export default ServiceProviderDetails;
