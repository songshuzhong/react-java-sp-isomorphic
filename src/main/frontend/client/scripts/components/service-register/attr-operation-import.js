import React, { Component } from 'react';

import { Icon, Button, Input, Checkbox, CheckboxGroup, FormItem, Form, Modal, ModalBody, Column, Table, Pagination } from 'epm-ui';

import RefButton from '../commons/comm-refButton';

import { getDataSource } from '../../utilities/dataSource';
import { basicTypeConvert, formItemConvert } from '../commons/dynamicConvert';
import { unique } from '../../utilities/object';

import context from 'context';

/**
 *@author sshuzhong
 *@mailTo <a href="mailto:songshuzhong@bonc.com.cn">Song ShuZhong</a>
 *@Date 2018/1/3.
 *@desc
 */
class AttrOperationImport extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      pageNo: 1,
      pageSize: 10,
      selectKey: '',
      option: 'attr',
      dataSource: props.dataSource,
      providerId: props.providerId,
      attrListChecked: [],
      resListChecked: [],
      importModalVisiable: props.importModalVisiable
    };

    this.onAsyncSubmit = this.onAsyncSubmit.bind( this );
    this.handleResetForm = this.handleResetForm.bind( this );
    this.handleModalClose = this.handleModalClose.bind( this );
    this.handleGetterAttrTable = this.handleGetterAttrTable.bind( this );
    this.handleGetterResTable = this.handleGetterResTable.bind( this );
    this.handleImportAttrAndRes = this.handleImportAttrAndRes.bind( this );
    this.handleSelectKeyChange = this.handleSelectKeyChange.bind( this );
  }

  componentWillReceiveProps( nextProps ) {
    this.setState( { importModalVisiable: nextProps.importModalVisiable, providerId: nextProps.providerId } );
  }

  handleSelectKeyChange( selectKey ) {
    this.setState( { selectKey } );
  }

  handleModalClose() {
    this.setState( { attrListChecked: [], resListChecked: [], importModalVisiable: false }, () => this.props.onImportModalClose() );
  }

  handleResetForm( trigger ) {
    this.reset = trigger.reset;
  }

  handleOptionChange( option ) {
    this.setState( { option } );
  }

  onAsyncSubmit( formData ) {
    this.setState( { selectKey: formData.selectKey } );

    return false;
  }

  handleGetterAttrTable( attrListChecked ) {
    this.setState( { attrListChecked } );
  }

  handleGetterResTable( resListChecked ) {
    this.setState( { resListChecked } );
  }

  handleImportAttrAndRes() {
    let { attrListChecked, resListChecked } = this.state;

    this.props.getter( attrListChecked, resListChecked );

    this.setState( { attrListChecked: [], resListChecked: [], importModalVisiable: false }, () => this.props.onImportModalClose() );
  }

  render() {
    let { importModalVisiable, selectKey, dataSource, providerId, option, attrListChecked, resListChecked } = this.state;

    return (
      <div>
        {
          importModalVisiable ?
            <Modal size="large">
              <ModalBody>
                <div style={ { height: '35px', display: 'flex', justifyContent: 'space-between' } }>
                  <div>
                    <RefButton type="link" style={ option == 'attr'? { backgroundColor: '#ecf5fe' }: {} } onClick={ this.handleOptionChange.bind( this, 'attr' ) }>属性库</RefButton>
                    <RefButton type="link" style={ option == 'res'? { backgroundColor: '#ecf5fe' }: {} } onClick={ this.handleOptionChange.bind( this, 'res' ) }>资源属性库</RefButton>
                  </div>
                  <Button style={ { float: 'right' } } shape="icon" type="link" onClick={ this.handleModalClose }><Icon icon="close" /></Button>
                </div>
                <div style={ { height: '45px', display: 'flex', alignItems: 'center', backgroundColor: '#F2F2F2' } }>
                  <Form
                    method="post"
                    async={ true }
                    type="inline"
                    onSubmit={ this.onAsyncSubmit }
                    trigger={ this.handleResetForm }
                    style={ { display: 'flex' } }
                  >
                    <Input name="selectKey" value={ selectKey } onChange={ this.handleSelectKeyChange } />
                    <Button htmlType="submit">提交</Button>
                    <Button onClick={ () => { this.reset(); } }>重置</Button>
                    <Button onClick={ this.handleImportAttrAndRes }>导入</Button>
                  </Form>
                </div>
                {
                  option === 'attr' ?
                    <ImportAttrTable importModalVisiable selectKey={ selectKey } dataSource={ dataSource } attrListChecked={ attrListChecked } getterAttrTable={ this.handleGetterAttrTable } />
                    :
                    <ImportResTable importModalVisiable selectKey={ selectKey } providerId={ providerId } dataSource={ dataSource } resListChecked={ resListChecked } getterResTableChecked={ this.handleGetterResTable } /> }
              </ModalBody>
            </Modal>
            :
            null
        }
      </div>
    );
  }
}

class ImportAttrTable extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      pageNo: 1,
      pageSize: 10,
      attrList: {},
      attrListChecked: props.attrListChecked,
      dataSource: props.dataSource,
      selectKey: props.selectKey
    };

    this.fetchAttrList = this.fetchAttrList.bind( this );
    this.handlePagiChange = this.handlePagiChange.bind( this );
  }

  componentDidMount() {
    this.fetchAttrList();
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.importModalVisiable ) {
      this.setState( { selectKey: nextProps.selectKey, dataSource: nextProps.dataSource }, this.fetchAttrList() );
    }
  }

  fetchAttrList() {
    let { pageNo, pageSize, selectKey, dataSource } = this.state;
    let url = `${ context.contextPath }/v1/attrLibInfos/format?pageNo=${ pageNo }&pageSize=${ pageSize }&selectKey=${ selectKey }`;

    dataSource.forEach( ( data, index ) => {
      url += `&attrCodes=${ data[ `cAttrFormInfoList[${ index }].attrCode` ] }`;
    } );

    getDataSource( url, ( attrList ) => { this.setState( { attrList } ); } );
  }

  handlePagiChange( pageNo, pageSize ) {
    this.setState( { pageNo, pageSize }, () => this.fetchAttrList() );
  }

  handleAttributeChange( index, value ) {
    let flag = true;
    let target = 0;
    let { attrList: { data }, attrListChecked } = this.state;
    for ( let i = 0; i < attrListChecked.length; i++ )
      if ( attrListChecked[ i ].attrCode == data[ index ].attrCode ) {
        target = i;
        flag = false;
        break;
      }

    if ( !flag ) {
      attrListChecked[ target ].customAttrType = unique( attrListChecked[ target ].customAttrType, value );
    } else {
      data[ index ].chargeAttr = "";
      data[ index ].customAttrType = value;
      attrListChecked.push( data[ index ] );
    }
    this.setState( { attrListChecked }, () => this.props.getterAttrTable( attrListChecked ) );
  }

  getterAttrCheckbox( rowData, index ) {
    let { attrListChecked } = this.state;
    let customAttrType = "";

    for ( let i = 0; i < attrListChecked.length; i++ )
      if ( attrListChecked[ i ].attrCode == rowData.attrCode ) {
        customAttrType = attrListChecked[ i ].customAttrType;
      }

    return (
      <div style={ { display: 'inline-flex' } }>
        <Checkbox checked={ customAttrType.indexOf( '10' ) != -1 } value="10" onChange={ ( value ) => this.handleAttributeChange( index, '10' ) }>申请</Checkbox>
        <Checkbox checked={ customAttrType.indexOf( '30' ) != -1 } value="30" onChange={ ( value ) => this.handleAttributeChange( index, '30' ) }>访问</Checkbox>
      </div>
    );
  }

  render() {
    const { pageNo, pageSize, attrList: { total, data } } = this.state;

    return (
      [
        <Table key="attrTable" dataSource={ data } headMenu={ true } textAlign="center" bgColor={ { head: '#ecf5fe' } } headBolder={ true } striped={ true }>
          <Column title="属性名" dataIndex="attrName" scaleWidth="15%" />
          <Column title="英文名" dataIndex="attrEnname" scaleWidth="10%" />
          <Column title="属性类型" scaleWidth="10%">
            {
              ( rowData ) => {
                return basicTypeConvert( rowData.metadataDataType );
              }
            }
          </Column>
          <Column title="控件类型" scaleWidth="10%">
            {
              ( rowData ) => {
                return formItemConvert( rowData.metadataModule );
              }
            }
          </Column>
          <Column title="初始值" scaleWidth="10%">
            {
              ( rowData ) => {
                return rowData.metadataIsInit ? rowData.valueObject : '-';
              }
            }
          </Column>
          <Column title="校验规则" scaleWidth="15%">
            {
              ( rowData ) => {
                return rowData.metadataIsValidate ? rowData.validateRole : '-';
              }
            }
          </Column>
          <Column title="属性描述" dataIndex="attrDesc" scaleWidth="15%" />
          <Column title="属性标签" scaleWidth="15%" key="attrLabel">
            {
              ( rowData, index ) => {
                return this.getterAttrCheckbox( rowData, index );
              }
            }
          </Column>
        </Table>,
        <Pagination key="attrPagi" index={ pageNo } total={ total } size={ pageSize } showPagiJump={ true } showDataSizePicker={ true } align="center" onChange={ this.handlePagiChange } />
      ]
    );
  }
}

class ImportResTable extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      pageNo: 1,
      pageSize: 10,
      resList: {},
      resListChecked: props.resListChecked,
      dataSource: props.dataSource,
      selectKey: props.selectKey,
      providerId: props.providerId,
      isProviderId: true
    };

    this.fetchResList = this.fetchResList.bind( this );
    this.handlePagiChange = this.handlePagiChange.bind( this );
  }

  componentDidMount() {
    let { providerId } = this.state;

    if ( providerId )
      this.fetchResList();
    else
      this.setState( { isProviderId: false } );
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.providerId )
      this.setState( { selectKey: nextProps.selectKey, providerId: nextProps.providerId, dataSource: nextProps.dataSource }, () => this.fetchResList() );
    else
      this.setState( { isProviderId: false } );
  }

  fetchResList() {
    let { pageNo, pageSize, providerId, selectKey, dataSource } = this.state;
    let url = `${ context.contextPath }/v1/svcProviders/${ providerId }/qutaAttrs?pageNo=${ pageNo }&pageSize=${ pageSize }&selectKey=${ selectKey }`;

    dataSource.forEach( ( data, index ) => {
      url += `&attrCodes=${ data[ `cAttrFormInfoList[${ index }].attrCode` ] }`;
    } );

    getDataSource( url, ( resList ) => this.setState( { resList } ) );
  }

  handlePagiChange( pageNo, pageSize ) {
    this.setState( { pageNo, pageSize }, () => this.fetchResList() );
  }

  handleResTableChecked( index, rowData ) {
    let flag = true;
    let target = 0;
    let { resListChecked } = this.state;

    for ( let i = 0; i < resListChecked.length; i++ )
      if ( resListChecked[ i ].attrCode == rowData.attrCode ) {
        target = i;
        flag = false;
      }

    if ( flag ) {
      rowData.chargeAttr = "";
      resListChecked.push( rowData );
    } else
      resListChecked.splice( target, 1 );

    this.props.getterResTableChecked( resListChecked );
  }

  getterResCheckbox( rowData, index ) {
    let checkable = false;
    let { resListChecked } = this.state;

    for ( let i = 0; i < resListChecked.length; i++ )
      if ( resListChecked[ i ].attrCode == rowData.attrCode )
        checkable = true;

    return (
      <Checkbox checked={ checkable } onChange={ this.handleResTableChecked.bind( this, index, rowData ) } />
    );
  }

  render() {
    const { pageNo, pageSize, resList: { total, data }, isProviderId } = this.state;

    return (
      <div key="importResTable">
        {
          isProviderId ?
            [
              <Table key="resTable" dataSource={ data } headMenu={ true } textAlign="center" bgColor={ { head: '#ecf5fe' } } headBolder={ true } striped={ true }>
                <Column>
                  {
                    ( rowData, index ) => { return this.getterResCheckbox( rowData, index ); }
                  }
                </Column>
                <Column title="序号">
                  {
                    ( rowData, index ) => { return Number( index ) + 1; }
                  }
                </Column>
                <Column title="属性名" dataIndex="attrName" />
                <Column title="属性英文名" dataIndex="attrEnname" />
                <Column title="属性类型">
                  {
                    ( rowData ) => {
                      return basicTypeConvert( rowData.metadataDataType );
                    }
                  }
                </Column>
                <Column title="属性描述" dataIndex="attrDesc" />
              </Table>,
              <Pagination key="resPagi" index={ pageNo } total={ total } size={ pageSize } showPagiJump={ true } showDataSizePicker={ true } align="center" onChange={ this.handlePagiChange } />
            ]
            :
            <div>请选勾选服务提供方！</div>
        }
      </div>

    );
  }
}

export { AttrOperationImport };
export default AttrOperationImport;
