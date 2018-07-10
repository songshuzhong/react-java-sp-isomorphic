import React, { Component } from 'react';
import { Button, Row, Col, Column, Table, Container, Checkbox } from 'epm-ui';

import { getDataSource } from '../utilities/dataSource';
import context from 'context';
import { basicTypeConvert, formItemConvert } from '../components/commons/dynamicConvert';

/**
 *@author xumeng
 *@mailTo <a href="mailto:xumeng@bonc.com.cn">xumeng</a>
 *@Date 2018/1/15.
 *@desc 配置列表
 */

class ServiceConfigList extends Component {
  constructor( props ) {
    super( props );
    this.state={ configList: [] };

    this.fetchConfigList = this.fetchConfigList.bind( this );
    this.handleTableGetter = this.handleTableGetter.bind( this );
    this.handleSave = this.handleSave.bind( this );
  }

  componentDidMount() {
    this.fetchConfigList();
  }
  
  fetchConfigList() {
    if( this.props.location.query ) {
      const svcId = this.props.location.query.svcId;
      const customType = this.props.location.query.customType;

      getDataSource( `${ context.contextPath }/v1/services/${ svcId }/customattrs/${ customType }`, ( configList ) => {
        this.setState( { configList } );
      } );
    }
  }

  handleTableGetter( getter ) {
    this.getData = getter.data;
  }

  handleCheck( value, dataString, isValid, checked ) {
    value.checked = checked;
  }

  handleSave() {
    let tableData = this.getData();

    let obj={};

    tableData.forEach( ( item, index ) => {
      obj[ item.attrId ] = item.checked;
    } );

    if( this.props.location.query ) {
      const svcId = this.props.location.query.svcId;

      getDataSource( {
        url: `${ context.contextPath }/v1/services/${svcId}/svcdisplayexts`,
        params: { body: JSON.stringify( obj ) }
      }, ( data ) => {
        if ( data.code === 201 ) {
          this.props.history.goBack();
        }
      } );
    }
  }

  render() {
    const { configList }= this.state;

    return (
      <Container type="fluid" style={ { marginTop: '20px' } }>
        <Row>
          <Col>
            <span>服务名称：{ this.props.location.query.svcName }</span>
            <span style={ { marginLeft: '60px' } }>服务版本：{ this.props.location.query.svcVersion }</span>
          </Col>
        </Row>
        <Table
          textAlign="center"
          bgColor={ { head: '#ecf5fe' } }
          headBolder={ true }
          striped={ true }
          headMenu={ true }
          dataSource={ configList ? configList : [] }
          style={ { margin: '20px 0' } }
          getter={ this.handleTableGetter }
        >
          <Column title="是否显示" textAlign="center" scaleWidth="10%">
            {
              ( value, index ) => {
                return (
                  <Checkbox name="checked" checked={ value.checked } style={ { margin: '7px 0 0 25px' } } onChange={ this.handleCheck.bind( this, value ) }/>
                );
              }
            }
          </Column>
          <Column title="属性编码" textAlign="left" dataIndex="attrCode" scaleWidth="10%" />
          <Column title="属性名" textAlign="left" dataIndex="attrName" scaleWidth="10%" />
          <Column title="属性英文名" textAlign="left" dataIndex="attrEnname" scaleWidth="10%" />
          <Column title="属性类型" textAlign="center" scaleWidth="10%">
            {
              ( value, index ) => { return basicTypeConvert( value.cAttrMetadataInfo.metadataDataType ) }
            }
          </Column>
          <Column title="控件类型" textAlign="center" scaleWidth="10%">
            {
              ( value, index ) => { return formItemConvert( value.cAttrMetadataInfo.metadataModule ) }
            }
          </Column>
          <Column title="初始值" textAlign="center" scaleWidth="10%">
            {
              ( value, index ) => { return value.cAttrMetadataInfo.metadataIsInit ? value.cAttrMetadataInfo.cAttrInitInfo.valueObject : '' }
            }
          </Column>
          <Column title="校验规则" textAlign="center" scaleWidth="10%">
            {
              ( value, index ) => { return value.cAttrMetadataInfo.metadataIsValidate ? value.cAttrMetadataInfo.cAttrValidateInfo.validateRole : '' }
            }
          </Column>
          <Column title="属性描述" textAlign="center" dataIndex="attrDesc" scaleWidth="20%" />
        </Table>
        <Row>
          <Col>
            <Button type="primary" htmlType="submit" style={ { marginLeft: '40%' } } onClick={ this.handleSave }>保存</Button>
            <Button type="primary" style={ { marginLeft: '4%' } } onClick={ () => { this.props.history.goBack() } }>返回</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export { ServiceConfigList };
export default ServiceConfigList;
