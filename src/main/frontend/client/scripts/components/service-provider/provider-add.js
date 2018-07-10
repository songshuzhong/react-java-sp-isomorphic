import React, { Component } from 'react';
import { Button, Label, Select, Option, Dialog, Container, Input, FormItem, Form, Row, Col, Column, Table, Pagination, Icon, Notification, Modal, ModalBody, ModalHeader } from 'epm-ui';

import { popup } from '../../utilities/transient';
import { getDataSource } from '../../utilities/dataSource';
import context from 'context';
import { basicTypeConvert } from '../../components/commons/dynamicConvert';

/**
 *@author xumeng
 *@mailTo <a href="mailto:xumeng@bonc.com.cn">xumeng</a>
 *@Date 2017/12/20.
 *@desc 服务提供方-新增modal
 */

class ServiceProviderAdd extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      attrFormInfos: [
        { 'attrId': '', 'attrCode': '', 'attrName': '', 'attrEnname': '', 'metadataDataType': '', 'attrDesc': '', 'valueObject': '' , 'chargePrice': '',  'chargeType': '', 'chargeTimeType': '', 'metadataUnit': '' },
        { 'attrId': '', 'attrCode': '', 'attrName': '', 'attrEnname': '', 'metadataDataType': '', 'attrDesc': '', 'valueObject': '' , 'chargePrice': '',  'chargeType': '', 'chargeTimeType': '', 'metadataUnit': '' },
        { 'attrId': '', 'attrCode': '', 'attrName': '', 'attrEnname': '', 'metadataDataType': '', 'attrDesc': '', 'valueObject': '' , 'chargePrice': '',  'chargeType': '', 'chargeTimeType': '', 'metadataUnit': '' }
      ],
      flag: false,
      nameFlag: false,
      nameFocus: false,
      urlFlag: false,
      urlFocus: false,
      codeFlag: false,
      codeFocus: false,
      quotaFlag: true,
      requiredFlag: false,
      focusCount: 0,
      blurCount: 0,
      chargePriceFlag: false
    };

    this.formGetter = this.formGetter.bind( this );
    this.formTirgger = this.formTirgger.bind( this );
    this.handleAddRow = this.handleAddRow.bind( this );
    this.handleTableGetter = this.handleTableGetter.bind( this );
    this.handleCloseModal = this.handleCloseModal.bind( this );
  }

  // 服务提供方编码唯一性校验
  handleCheck( value ) {
    getDataSource( `${ context.contextPath }/v1/svcProviders/${ value }/verify`, ( data ) => {
      if ( data.code === 1 ) {
        this.setState( { flag: false } );
      } else if ( data.code === 0 ) {
        this.setState( { flag: true } );
      }
    } );
  }

  formGetter( getter ) {
    this.getValue = getter.value;
  }

  formTirgger( trigger ) {
    this.reset = trigger.reset;
  }

  handleAddRow() {
    let { attrFormInfos } = this.state;

    attrFormInfos.push( { 'attrId': '', 'attrCode': '', 'attrName': '', 'attrEnname': '', 'metadataDataType': '', 'attrDesc': '', 'valueObject': '', 'chargePrice': '',  'chargeType': '', 'chargeTimeType': '', 'metadataUnit': ''  } );

    this.setState( { attrFormInfos } );
  }

  handleTableGetter( getter ) {
    this.getData = getter.data;
  }

  handleSelectData( index, attrCode ) {
    let { attrFormInfos } = this.state;

    getDataSource( `${ context.contextPath }/v1/attrLibInfos/${ attrCode }/detail`, ( tableDetail ) => {
      attrFormInfos.forEach( ( item, i ) => {
        if ( i != index ) {
          if ( attrCode == item.attrCode ) {
            popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="属性编码重复，请重新选择" /> );
          }
        } else {
          attrFormInfos[ index ] = tableDetail;
          attrFormInfos[ index ].metadataDataType = basicTypeConvert( tableDetail.metadataDataType );
          attrFormInfos[ index ].chargePrice = '';
          attrFormInfos[ index ].chargeType = '10';
          attrFormInfos[ index ].chargeTimeType = '10';
          this[ `chargeTimeType${ index }` ].style.display = 'block';
          this.setState( { attrFormInfos, chargePriceFlag: false } );
        }
      } );
    } );
  }

  handleSelectChargeTypeData( index, value ) {
    const attrFormInfos = this.state.attrFormInfos;
    const dom =  this[ `chargeTimeType${ index }` ];

    if ( value === '20' ) { //按资源
      dom.style.display = 'none';
      attrFormInfos[ index ].chargeTimeType = '';
    }else {
      dom.style.display = 'block';
      attrFormInfos[ index ].chargeTimeType = '10';
    }
    attrFormInfos[ index ].chargeType = value;
    this.setState( { attrFormInfos } );
  }

  handleSelectChargeTimeTypeData( index, value ) {
    const attrFormInfos = this.state.attrFormInfos;

    attrFormInfos[ index ].chargeTimeType = value;
    this.setState( { attrFormInfos } );
  }
  showDialog( index ) {
    popup(
      <Dialog
        title="删除确认"
        message="请确认是否删除该属性?"
        type="confirm"
        icon="danger"
        approveBtnOnClick={ this.handleClickDelete.bind( this, index ) }
      /> );
  }

  handleClickDelete( i, after ) {
    let tableData = this.getData();
    let tableData1 = tableData.filter( ( item, index ) => index != i );

    this.setState( { attrFormInfos: tableData1 } );
    after( true );
  }

  // 获取配额默认值并校验
  handleBlurInputData( index, value ) {
    this.state.blurCount += 1;

    let { attrFormInfos } = this.state;
    let reg = /^[0-9]*$/;

    if( value == '' ) {
      this.setState( { requiredFlag: false, quotaFlag: true } );
      popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="请设置配额默认值" /> );
    }else if ( value !== '' ) {
      this.setState( { requiredFlag: true } );
      if( reg.test( value ) == false ) {
        this.setState( { quotaFlag: false } );
        popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="配额默认值必须是数字" /> );
      }else if( reg.test( value ) == true ) {
        this.setState( { quotaFlag: true } );
        attrFormInfos[ index ].valueObject = value;

        this.setState( { attrFormInfos } );
      }
    }
  }

  // 获取计费单价并校验
  handleBlurChargeInputData( index, value ) {

    let { attrFormInfos } = this.state;
    let reg = /^[0-9]*$/;

    if( value == '' ) {
      popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="请设置计费单价" /> );
      this.setState( { chargePriceFlag: false } );
    }else if ( value !== '' ) {
      if( reg.test( value ) == false ) {
        popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="计费单价必须是数字" /> );
        this.setState( { chargePriceFlag: false } );
      }else if( reg.test( value ) == true ) {
        attrFormInfos[ index ].chargePrice = value;
        this.setState( { attrFormInfos, chargePriceFlag: true } );
      }
    }
  }

  // 提交表单数据
  handleAdd() {
    let { attrFormInfos, quotaFlag, chargePriceFlag } = this.state;
    let formData = this.getValue();

    if( this.state.nameFocus == false ) {
      let reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9\u4e00-\u9fa5_]+$/;

      if( formData.providerName == '' || reg.test( formData.providerName ) == false ) {
        this.setState( { nameFlag: true } );
      }
    }
    if( this.state.urlFocus == false ) {
      let reg = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;

      if( formData.providerDomain == '' || reg.test( formData.providerDomain ) == false ) {
        this.setState( { urlFlag: true } );
      }
    }
    if( this.state.codeFocus == false ) {
      let reg = /^(?!_)(?!.*?_$)[a-zA-Z_]+$/;

      if( formData.providerCode == '' || reg.test( formData.providerCode ) == false ) {
        this.setState( { codeFlag: true } );
      }
    }

    let s = new Set();

    attrFormInfos = attrFormInfos.filter( ( item ) => item.attrCode !== '' || item.attrName !== '' || item.attrEnname !== '' || item.metadataDataType !== '' || item.attrDesc !== '' || item.valueObject !== '' || item.attrId !== '' || item.chargePrice !== '' || item.chargeType !== '');
    attrFormInfos.forEach( ( i ) => s.add( i.attrCode ) );

    if( attrFormInfos ) {
      for ( let i = 0; i < attrFormInfos.length; i++ ) {
        let cur = attrFormInfos[i];

        if( cur.valueObject == null || !cur.chargePrice) {
          this.required = false;
          break;
        }
        this.required = true;
      }
    }

    if ( attrFormInfos.length !== s.size ) {
      return popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="属性编码重复，请重新选择" /> );
    } else if ( formData.providerName == '' || formData.providerCode == '' || formData.providerDomain == '' ) {
      return;
    } else if ( /^(?!_)(?!.*?_$)[a-zA-Z0-9\u4e00-\u9fa5_]+$/.test( formData.providerName ) == false || /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test( formData.providerDomain ) == false || /^(?!_)(?!.*?_$)[a-zA-Z_]+$/.test( formData.providerCode ) == false ) {
      return;
    } else if ( this.required == false ) {

      if( quotaFlag == true ) {
        if( this.state.focusCount == 0 ) {
          if( s.size > 0 ) {
            return popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="请设置配额默认值" /> );
          }
        }else if( this.state.focusCount !== 0 ) {
          if( this.state.blurCount < this.state.focusCount ) {
            return popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="请设置配额默认值" /> );
          }
        }
      }else if( quotaFlag == false ) {
        if( this.state.blurCount < this.state.focusCount ) {
          return popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="配额默认值必须是数字" /> );
        }
      }

      if ( !chargePriceFlag ){
        return popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="请输入正确的计费单价！" /> );
      }

    } else if( this.required == true || s.size == 0 ) {
      attrFormInfos.forEach( ( item, index ) => {
        switch ( item.metadataDataType ) {
          case 'byte':
            item.metadataDataType = 10;
            break;
          case 'short':
            item.metadataDataType = 20;
            break;
          case 'int':
            item.metadataDataType = 30;
            break;
          case 'long':
            item.metadataDataType = 40;
            break;
          case 'float':
            item.metadataDataType = 50;
            break;
          case 'double':
            item.metadataDataType = 60;
            break;
          case 'char':
            item.metadataDataType = 70;
            break;
          case 'boolean':
            item.metadataDataType = 80;
            break;
        }
        formData[ `attrFormInfos[${ index }].attrCode` ] = item.attrCode;
        formData[ `attrFormInfos[${ index }].attrName` ] = item.attrName;
        formData[ `attrFormInfos[${ index }].attrEnname` ] = item.attrEnname;
        formData[ `attrFormInfos[${ index }].metadataDataType` ] = item.metadataDataType;
        formData[ `attrFormInfos[${ index }].metadataModule` ] = item.metadataModule;
        formData[ `attrFormInfos[${ index }].attrDesc` ] = item.attrDesc;
        formData[ `attrFormInfos[${ index }].valueObject` ] = item.valueObject;
        formData[ `attrFormInfos[${ index }].metadataUnit` ] = item.metadataUnit;
        formData[ `attrFormInfos[${ index }].chargeAttr.attrId` ] = item.attrId;
        formData[ `attrFormInfos[${ index }].chargeAttr.metadataUnit` ] = item.metadataUnit;
        formData[ `attrFormInfos[${ index }].chargeAttr.chargeType` ] = item.chargeType && item.chargeType !== '' ? Number( item.chargeType ) : 10;
        formData[ `attrFormInfos[${ index }].chargeAttr.chargePrice` ] = Number( item.chargePrice );
        item.chargeTimeType && item.chargeTimeType !== '' ? formData[ `attrFormInfos[${ index }].chargeAttr.chargeTimeType` ] = Number( item.chargeTimeType ) : null;
      } );

      let p = '';

      for ( let key in formData ) {
        p += `${ key }=${ formData[ key ] }&`;
      }
      getDataSource( {
        url: `${ context.contextPath }/v1/svcProviders`,
        params: { body: p.substring( 0, p.length - 1 ), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      }, ( data ) => {
        if ( data.code === 201 ) {
          popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ data.message } /> );
          this.props.fetchProviderList();
          this.props.handleCloseAddModal();
          this.reset();
          this.setState( { attrFormInfos: [] }, () => {
            this.setState( {
              attrFormInfos: [
                { 'attrId': '', 'attrCode': '', 'attrName': '', 'attrEnname': '', 'metadataDataType': '', 'attrDesc': '', 'valueObject': '' , 'chargePrice': '',  'chargeType': '', 'chargeTimeType': '', 'metadataUnit': '' },
                { 'attrId': '', 'attrCode': '', 'attrName': '', 'attrEnname': '', 'metadataDataType': '', 'attrDesc': '', 'valueObject': '' , 'chargePrice': '',  'chargeType': '', 'chargeTimeType': '', 'metadataUnit': '' },
                { 'attrId': '', 'attrCode': '', 'attrName': '', 'attrEnname': '', 'metadataDataType': '', 'attrDesc': '', 'valueObject': '' , 'chargePrice': '',  'chargeType': '', 'chargeTimeType': '', 'metadataUnit': ''  }
              ]
            } );
          } );
        }else {
          popup( <Notification key={ Math.random().toString() } message="通知" type="error" description={ data.message } /> );
        }
      } );
    }
  }

  handleFocusNameInput() {
    this.setState( { nameFlag: false, nameFocus: true } );
  }

  handleFocusUrlInput() {
    this.setState( { urlFlag: false, urlFocus: true } );
  }

  handleFocusCodeInput() {
    this.setState( { codeFlag: false, codeFocus: true } );
  }

  handleCloseModal() {
    this.reset();
    this.setState( { attrFormInfos: [] }, () => {
      this.setState( {
        attrFormInfos: [
          { 'attrId': '', 'attrCode': '', 'attrName': '', 'attrEnname': '', 'metadataDataType': '', 'attrDesc': '', 'valueObject': '' , 'chargePrice': '',  'chargeType': '', 'chargeTimeType': '', 'metadataUnit': '' },
          { 'attrId': '', 'attrCode': '', 'attrName': '', 'attrEnname': '', 'metadataDataType': '', 'attrDesc': '', 'valueObject': '' , 'chargePrice': '',  'chargeType': '', 'chargeTimeType': '', 'metadataUnit': '' },
          { 'attrId': '', 'attrCode': '', 'attrName': '', 'attrEnname': '', 'metadataDataType': '', 'attrDesc': '', 'valueObject': '' , 'chargePrice': '',  'chargeType': '', 'chargeTimeType': '', 'metadataUnit': ''}
        ]
      } );
    } );
    this.props.handleCloseAddModal();
  }

  render() {
    const { attrFormInfos } = this.state;

    return (
      <Container className="provider-container" type="fluid" style={ { marginTop: '30px' } }>
        <Row>
          <Col size={ 24 }>
            <Form
              type="horizontal"
              getter={ this.formGetter }
              trigger={ this.formTirgger }
            >
              <FormItem unvalidateMsg="请输入服务提供方名称（以中文,字母,数字,下划线命名，且不以下划线开头）" required style={ { width: '750px' } }>
                <Label>服务提供方名称</Label>
                <Input style={ { border: this.state.nameFlag ? '2px solid #c23934' : '', borderRadius: '6px' } } name="providerName" type="text" pattern={ /^(?!_)(?!.*?_$)[a-zA-Z0-9\u4e00-\u9fa5_]+$/ } onFocus={ this.handleFocusNameInput.bind( this ) } />
                <div style={ { display: this.state.nameFlag ? 'block' : 'none', marginTop: '5px', color: '#c23934', fontSize: '12px' } }>
                  请输入服务提供方名称（以中文,字母,数字,下划线命名，且不以下划线开头）
                </div>
              </FormItem>
              <FormItem unvalidateMsg="请输入正确的url" required style={ { width: '750px' } }>
                <Label>URL</Label>
                <Input style={ { border: this.state.urlFlag ? '2px solid #c23934' : '', borderRadius: '6px' } } name="providerDomain" type="url" pattern={ /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/ } onFocus={ this.handleFocusUrlInput.bind( this ) } />
                <div style={ { display: this.state.urlFlag ? 'block' : 'none', marginTop: '5px', color: '#c23934', fontSize: '12px' } }>
                  请输入正确的url
                </div>
              </FormItem>
              <FormItem unvalidateMsg="请输入服务提供方编码（以字母,下划线命名，且不以下划线开头）" required style={ { width: '750px' } }>
                <Label>服务提供方编码</Label>
                <Input style={ { border: this.state.codeFlag ? '2px solid #c23934' : '', borderRadius: '6px' } } name="providerCode" type="text" onChange={ this.handleCheck.bind( this ) } pattern={ /^(?!_)(?!.*?_$)[a-zA-Z_]+$/ } onFocus={ this.handleFocusCodeInput.bind( this ) } />
                <div style={ { display: this.state.codeFlag ? 'block' : 'none', marginTop: '5px', color: '#c23934', fontSize: '12px' } }>
                  请输入服务提供方编码（以字母,下划线命名，且不以下划线开头）
                </div>
                <div style={ { display: this.state.flag ? 'block' : 'none', marginTop: '5px', color: '#c23934', fontSize: '12px' } }>
                  服务提供方编码重复
                </div>
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
        <Row>
          <Col>
            <Table
              textAlign="center"
              bgColor={ { head: '#ecf5fe' } }
              headBolder={ true }
              striped={ true }
              headMenu={ true }
              complex
              style={ { marginTop: '20px' } }
              dataSource={ attrFormInfos }
              getter={ this.handleTableGetter }
            >
              <Column title="属性编码" textAlign="center" dataIndex="attrCode" scaleWidth="10%" />
              <Column title="属性名" textAlign="center" dataIndex="attrName" scaleWidth="15%">
                {
                  ( value, index ) => {
                    return (
                      <Select
                        dataSource={ `${ context.contextPath }/v1/attrLibInfos/attrNames` }
                        defaultValue=""
                        value=""
                        name="attrName"
                        showClear={ false }
                        search={ true }
                        onChange={ this.handleSelectData.bind( this, index ) }
                      />
                    );
                  }
                }
              </Column>
              <Column title="属性英文名" textAlign="center" dataIndex="attrEnname" scaleWidth="10%" />
              <Column title="属性类型" textAlign="center" dataIndex="metadataDataType" scaleWidth="10%" />
             {/* <Column title="属性描述" textAlign="center" dataIndex="attrDesc" scaleWidth="7%" />*/}
              <Column title="配额默认值" textAlign="center" scaleWidth="15%">
                {
                  ( value, index ) => {
                    return (
                      <Row>
                        <Col className='change-input'>
                          <Input name='valueObject' showClear={ false } required style={ { float: 'left' } } placeholder="请输入数字，必填" pattern={ /^[0-9]*$/ } onBlur={ this.handleBlurInputData.bind( this, index ) } onFocus={ () => this.state.focusCount += 1 } />
                          <span title={ value.metadataUnit } style={ { display: 'inline-block', marginTop: '10px' } }>{ value.metadataUnit }</span>
                        </Col>
                      </Row>
                    );
                  }
                }
              </Column>
              <Column title="计费单价" textAlign="center" scaleWidth="15%">
                {
                  ( value, index ) => {

                    return (
                      <Row>
                        <Col className='change-input'>
                          <Input name='chargePrice' showClear={ false } required style={ { float: 'left' } } placeholder="请输入数字" pattern={ /^[0-9]*$/ } onBlur={ this.handleBlurChargeInputData.bind( this, index ) } />
                          <span title={ value.metadataUnit ? `元/${value.metadataUnit}`: null } style={ { display: 'inline-block', marginTop: '10px' } }>{ value.metadataUnit ? `元/${value.metadataUnit}`: null }</span>
                        </Col>
                      </Row>
                    );
                  }
                }
              </Column>
              <Column title="计费类型" textAlign="center" scaleWidth="12%">
                {
                  ( value, index ) => {
                    return (
                      <Row>
                        <Col>
                          <Select name="chargeType" required value="10" showClear={ false } onChange={ this.handleSelectChargeTypeData.bind( this, index ) }>
                            <Option value="10">按时间</Option>
                            <Option value="20">按资源</Option>
                            <Option value="30">时间+资源</Option>
                          </Select>
                        </Col>
                      </Row>
                    );
                  }
                }
              </Column>
              <Column title="时间单位" textAlign="center" scaleWidth="8%">
                {
                  ( value, index ) => {
                    return (
                      <Row>
                        <Col>
                          <div ref={ ( node ) =>  this[ `chargeTimeType${ index }` ] = node } >
                            <Select name="chargeTimeType" value="10" required showClear={ false } onChange={ this.handleSelectChargeTimeTypeData.bind( this, index ) }>
                              <Option value="30">年</Option>
                              <Option value="20">月</Option>
                              <Option value="10">日</Option>
                            </Select>
                          </div>
                        </Col>
                      </Row>
                    );
                  }
                }
              </Column>
              <Column title="操作" textAlign="center" scaleWidth="5%">
                {
                  ( value, index ) => {
                    return (
                      <span onClick={ this.showDialog.bind( this, index ) }>
                          <Icon icon="trash" style={ { color: '#B22222', padding: '10px 4px 0 0', fontSize: '18px' } } />
                        </span>
                    );
                  }
                }
              </Column>
            </Table>
          </Col>
        </Row>
        <Button type="primary" onClick={ this.handleAddRow } style={ { margin: '20px 0 30px 45.6%' } }>新增</Button>
        <Row>
          <Col>
            <Button type="primary" htmlType="submit" style={ { marginLeft: '40%' } } onClick={ this.handleAdd.bind( this ) }>确定</Button>
            <Button type="primary" style={ { marginLeft: '4%' } } onClick={ this.handleCloseModal }>取消</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export { ServiceProviderAdd };
export default ServiceProviderAdd;
