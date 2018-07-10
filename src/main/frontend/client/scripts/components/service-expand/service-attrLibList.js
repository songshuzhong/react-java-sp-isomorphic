import React, { Component } from 'react';

import { Row, Col, Form, FormItem, Input, Label, Button, Table, Column, Pagination  } from 'epm-ui';

import { getDataSource } from '../../utilities/dataSource';
import context from 'context';

/**
 *@author renxuanwei
 *@mailTo <a href="mailto:renxuanwei@bonc.com.cn">renxuanwei</a>
 *@Date 2017/12/25.
 *@desc
 */
class ServiceAttrLibList extends Component {

  constructor() {
    super();
    this.state = {
      pageNo: 1,
      pageSize: 10,
      selectKey: '',
      tableData: null
    };

    this.fetchTableData = this.fetchTableData.bind( this );
    this.handleCheck = this.handleCheck.bind( this );
    this.handleSearch = this.handleSearch.bind( this );
    this.handleSearchName = this.handleSearchName.bind( this );
    this.handleResetSearchForm = this.handleResetSearchForm.bind( this );
  }

  componentDidMount() {
    this.fetchTableData();
  }

  fetchTableData() {
    const { pageNo, pageSize, selectKey } = this.state;

    getDataSource( `${ context.contextPath }/v1/attrLibInfos?pageNo=${ pageNo }&pageSize=${ pageSize }&selectKey=${ selectKey }`, ( tableData ) => {
      this.setState( { tableData } );
    } );
  }

  handlePaginationChange( pageNo, pageSize ) {
    this.setState( { pageNo, pageSize }, this.fetchTableData );
  }

  handleCheck( data ) {
    this.props.handleSelectAttr( data );
  }

  handleSearchName( value ) {
    this[ 'keyWords' ] = value;
  }

  handleSearch() {
    this.setState( { pageNo: 1, selectKey: this[ 'keyWords' ] }, this.fetchTableData );
  }

  handleShowAll() {
    this.searchReset();
    this[ 'keyWords' ] = '';
  }

  handleResetSearchForm( trigger ) {
    this.searchReset = trigger.reset;
  }

  render() {
    const { pageSize, pageNo, tableData } = this.state;

    return (
      <div>
        <Row>
          <Col size={ 24 }>
            <Form type="inline"
                  async={ true }
                  trigger={ this.handleResetSearchForm }
            >
              <FormItem>
                <Input name="user" placeholder="模糊查询" onChange={ this.handleSearchName } />
              </FormItem>
              <Button shape="default" onClick={ this.handleSearch }>搜索</Button>
              <Button shape="default" onClick={ this.handleShowAll.bind( this ) }>重置</Button>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table dataSource={ tableData ? tableData.data : null } textAlign="center" checkable onCheck={ this.handleCheck } bgColor={ { head: '#ecf5fe' } } headBolder={ true } striped={ true }>
              <Column title="序号">
                { ( value, index ) => <a>{ 1 + parseInt( index ) + ( ( this.state.pageNo - 1 ) * this.state.pageSize ) }</a> }
              </Column>
              <Column title="属性名" dataIndex="attrName" textAlign="left"/>
              <Column title="属性英文名" dataIndex="attrEnname" textAlign="left"/>
              <Column title="属性类型" dataIndex="metadataInfo" textAlign="left">
                {
                  ( value ) => {
                    switch ( value.metadataDataType ) {
                      case 10 :
                        return 'byte';
                      case 20 :
                        return 'short';
                      case 30 :
                        return 'int';
                      case 40 :
                        return 'long';
                      case 50 :
                        return 'float';
                      case 60 :
                        return 'double';
                      case 70 :
                        return 'char';
                      case 80 :
                        return 'boolean';
                      default :
                        return '-';
                    }
                  }
                }
              </Column>
              <Column title="控件类型" dataIndex="metadataInfo" textAlign="left">
                {
                  ( value ) => {
                    let child = value.metadataModule;

                    if ( child ) {
                      switch ( child ) {
                        case 10 :
                          return '文本框';
                        case 20 :
                          return '下拉框';
                        case 30 :
                          return '单选框';
                        case 40 :
                          return '复选框';
                        case 50 :
                          return 'Slider滑块';
                        case 60 :
                          return '按钮组';
                        default :
                          return '-';
                      }
                    }
                  }
                }
              </Column>
              <Column title="初始值" dataIndex="initInfo" textAlign="left">
                {
                  ( value ) => {
                    if ( value ) {
                      if ( value.valueObject ) {
                        return value.valueObject;
                      }
                    } else {
                      return '-';
                    }
                  }
                }
              </Column>
              <Column title="校验规则" dataIndex="validateInfo" textAlign="left">
                {
                  ( value ) => {
                    if ( value ) {
                      if ( value.validateRole ) {
                        return value.validateRole;
                      }
                    } else {
                      return '-';
                    }
                  }
                }
              </Column>
              <Column title="属性描述" dataIndex="attrDesc" textAlign="left"/>
            </Table>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Pagination
              align="right"
              index={ pageNo }
              total={ tableData ? tableData.total : '' }
              size={ pageSize }
              showPagiJump={ true }
              showDataSizePicker={ true }
              onChange={ ( pageNo, pageSize ) => this.handlePaginationChange( pageNo, pageSize ) }
            />
          </Col>
        </Row>
      </div>
    );
  }

}

export { ServiceAttrLibList };
export default ServiceAttrLibList;
