import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Form, FormItem, Input, Label, Textarea, Checkbox, CheckboxGroup, RadioGroup, Radio, Option, Button, Select, Icon, Notification } from 'epm-ui';


import { getInitArray } from '../commons/getInitArray';
import { PackageSlider } from './packageSlider';
import { getDataSource } from '../../utilities/dataSource';
import { popup } from '../../utilities/transient';
import context from 'context';

class ServicePackageAdd extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      svcId: props.match.params.svcId,
      applicationAttributesData: null,
      sourceAttributesData: null,
      serviceDetails: null,
      waysTypes: null
    };

    this.handleControlTypeChange = this.handleControlTypeChange.bind( this );
    this.onFormGetter = this.onFormGetter.bind( this );
    this.formGetterForAdd = this.formGetterForAdd.bind( this );
    this.handleNameBlur = this.handleNameBlur.bind(  this );
    this.handleNameChange = this.handleNameChange.bind( this );
    this.formChange = this.formChange.bind( this );
    this.formGetter = this.formGetter.bind( this );
  }

  componentDidMount() {
    this.fetchServiceDetails();
    this.fetchApplicationAttributes();
    this.fetchSourceAttributes();
    this.fetchWaysType();
    this.AForm = {};
  }

  // 获取服务详细信息
  fetchServiceDetails() {
    getDataSource( `${ context.contextPath }/v1/services/${ this.state.svcId }`, ( serviceDetails ) => {
      this.setState( { serviceDetails } );
    } );
  }

  // 获取申请属性
  fetchApplicationAttributes() {
    getDataSource( `${ context.contextPath }/v1/services/attr/${ this.state.svcId }/10`, ( applicationAttributesData ) => {
      this.setState( { applicationAttributesData } );
    } );
  }

  // 获取资源属性
  fetchSourceAttributes() {
    getDataSource( `${ context.contextPath }/v1/services/attr/${ this.state.svcId }/20`, ( sourceAttributesData ) => {
      this.setState( { sourceAttributesData } );
    } );
  }

  // 获取订购方式
  fetchWaysType() {
    getDataSource( `${ context.contextPath }/v1/dictcategorys/ways_type/dictdetails/combobox`, ( waysTypes ) => {
      this.setState( { waysTypes } );
    } );
  }

  contains( str, arr ) {
    for ( let i in arr ) {
      if ( arr[ i ] === str ) return true;
    }

    return false;
  }

  handleControlTypeChange( value ) {
    if ( this.contains( '20', value ) ) {
      this.refs.attrIds.style.display = 'block';
    } else {
      this.refs.attrIds.style.display = 'none';
    }
  }

  onFormGetter( getter ) {
    this.getValue = getter.value;
  }

  isHaveBasicOption( formData, applicationAttributesLength ) {
    for ( let i = 0; i < applicationAttributesLength; i++ ) {
      if ( formData[ `cSvcAttrValueInfoList[${ i }].detailFixed` ] === 1 ) {

        return true;
      }
    }

    return false;
  }

  svcSubmit( saveOrPublish ) {
    let formData = this.getFormValue();
    let sliderData = this.AForm;
    let applicationAttributesData = this.state.applicationAttributesData;
    let applicationAttributesLength = applicationAttributesData.length;
    let sourceAttributesData = this.state.sourceAttributesData;
    let resultFormData = {};

    if ( formData[ 'cSvcPackageInfo.packageName' ] === '' ) {
      popup( <Notification message="套餐名称不能为空！" type='error' key={ Math.random().toString() } /> );

      return;
    }

    if( this['isNameRepeat'] ) {
      popup( <Notification message="套餐名称不能重复！" type='error' key={ Math.random().toString() } /> );

      return;
    }

    if ( formData[ 'cSvcPackageInfo.packageDesc' ] === '' ) {
      popup( <Notification message="套餐描述不能为空！" type='error' key={ Math.random().toString() } /> );

      return;
    }
    if ( formData[ 'waysTypes' ] === undefined || formData[ 'waysTypes' ].length === 0 ) {
      popup( <Notification message="至少选择一种订购方式！" type='error' key={ Math.random().toString() } /> );

      return;
    }else {

      //if waysTypes include pay
      if ( this.contains( '20', formData[ 'waysTypes' ] ) ) {

        //if modelTypes not include resource
        if ( !( formData[ 'modelTypes' ] === undefined || formData[ 'modelTypes' ].length === 0 ) && !this.contains( '20', formData[ 'modelTypes' ] ) ) {
          popup( <Notification message="当订购方式选择“付费”时，控制方式必须包括“按资源”！" type='error' key={ Math.random().toString() } /> );

          return;
        }
      }
    }
    
    if ( formData[ 'modelTypes' ] === undefined || formData[ 'modelTypes' ].length === 0 ) {
      popup( <Notification message="至少选择一种控制方式！" type='error' key={ Math.random().toString() } /> );

      return;
    }
    if ( this[ 'isValid' ] === undefined || this[ 'isValid' ] === false ) {
      popup( <Notification message="基本配置信息输入有误！" type='error' key={ Math.random().toString() } /> );

      return;
    }

    if ( this.contains( '20', formData[ 'modelTypes' ] ) ) {
      if( sourceAttributesData.length > 0 ) {
        if( formData[ 'attrIds' ].length === 0 ) {
          popup( <Notification message="操作有误" description="选择按资源控制，至少选择一个资源属性" type='error' key={ Math.random().toString() } /> );

          return;
        }
      }
    }

    for( let key in sliderData ) {
      formData[ key ] = sliderData[ key ];
    }

    for ( let i = 0; i < applicationAttributesLength; i++ ) {
      if ( formData[ `cSvcAttrValueInfoList[${ i }].detailFixed` ] === undefined || formData[ `cSvcAttrValueInfoList[${ i }].detailFixed` ] === '' ) {
        formData[ `cSvcAttrValueInfoList[${ i }].detailFixed` ] = 0;
      }

      if( formData[ `cSvcAttrValueInfoList[${ i }].isRequired` ] === true && formData[ `cSvcAttrValueInfoList[${ i }].detailFixed` ] === 1 && formData[ `cSvcAttrValueInfoList[${ i }].valueObject` ] === '' ) {
        popup( <Notification message="操作有误" description="必填项设为固定值则必须输入固定值" type='error' key={ Math.random().toString() } /> );

        return;
      }
    }

    for( let key in formData ) {
      if( key.indexOf( 'isRequired' ) <= -1 ) {
        resultFormData[ key ] = formData[ key ];
      }
    }

    resultFormData[ 'svcId' ] = this.state.svcId;
    resultFormData[ 'cSvcPackageInfo.packageState' ] = saveOrPublish;

    if ( !this.contains( '20', formData[ 'modelTypes' ] ) ) {
      resultFormData[ 'attrIds' ] = [];
    }

    let param = '';

    for ( let name in resultFormData ) {
      param += `${ name }=${ resultFormData[ name ] }&`;
    }

    getDataSource(
      {
        url: `${ context.contextPath }/v1/services/${ this.state.svcId }/package`,
        params: { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: param.substring( 0, param.length - 1 ) }
      }, ( result ) => {
        if ( result.code == 201 ) {
          popup( <Notification message="添加套餐成功！" type='success' key={ Math.random().toString() } /> );
          this.context.router.history.push( {
            pathname: `/console-home/service-package-detail/${ this.state.svcId }`
          } );
        }
      } );
  }

  formGetterForAdd( getter ) {
    this.getFormValue = getter.value;
  }

  handleNameBlur() {
    if ( this[ 'packageName' ] === '' || this[ 'packageName' ] === undefined ) {
      this.refs.nameNullError.style.display = "block";
    } else {
      getDataSource( `${ context.contextPath }/v1/services/validate/${ this.state.svcId }/packageName/${ this[ 'packageName' ].trim() }`, ( result ) => {
        if ( result.code === 1 ) {
          this.refs.nameRepeatError.style.display = "none";
          this['isNameRepeat'] = false;
        } else {
          this.refs.nameRepeatError.style.display = "block";
          this['isNameRepeat'] = true;
        }
      } );
    }
  }

  handleNameChange( value ) {
    this[ 'packageName' ] = value;
    if( this[ 'packageName' ] === '' ) {
      this.refs.nameNullError.style.display = "block";
    } else {
      this.refs.nameNullError.style.display = "none";
    }
  }

  goBack() {
    this.context.router.history.go( -1 );
  }

  formChange( data, isValid) {
    this[ 'isValid' ] = isValid;
  }

  handleGetSliderVal( sliderData ) {
    for ( let key in sliderData ) {
        this.AForm[ key ] = sliderData[ key ];
    }
  }

  formGetter( getter ) {
    this.getValue = getter.value;
  }

  handleChangeWaysTypes( selectedItems ){
    console.log(selectedItems)
    console.log('--------------')
    if ( this.contains( '20', selectedItems )) { //计费
      if ( !this.contains( '20', this.getValue() ) ) {
        this.setState( { modelTypesValue: [ ...this.getValue(), '20' ] });
        this.refs.attrIds.style.display = 'block';
      }
    } else {

    }
  }

  render() {
    let applicationAttributesData = this.state.applicationAttributesData;
    let sourceAttributesData = this.state.sourceAttributesData;
    let serviceDetails = this.state.serviceDetails;
    let waysTypes = this.state.waysTypes;

    return (
      <div>
        <Form
          type="horizontal"
          getter={ this.formGetterForAdd }
          onChange = { this.formChange }
        >
          <div>
            <div style={ { padding: '2% 2% 0' } }>
              <Row>
                <Col>
                  <div className="package-title" style={ { textAlign: 'left' } }>
                    <span className="blue-bar" />
                    <span className="title">新增套餐</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div style={ { padding: '20px 0' } }>
                    <div style={ { width: '80%' } }>
                      <Row>
                        <Col size={ 12 }>
                          <span className="my-label">服务名称：</span>
                          <span className="my-text">{ serviceDetails ? serviceDetails.cServiceInfo.svcName : '' }</span>
                        </Col>
                        <Col size={ 12 }>
                          <span className="my-label">服务版本：</span>
                          <span className="my-text">{ serviceDetails ? serviceDetails.cServiceInfo.svcVersion : '' }</span>
                        </Col>
                      </Row>
                      <Row>
                        <Col size={ 12 } style={ { marginBottom: '15px', marginTop: '15px' } }>
                          <span className="my-label">服务描述：</span>
                          <span className="my-text">{ serviceDetails ? serviceDetails.cServiceInfo.svcDesc : '' }</span>
                        </Col>
                      </Row>
                        <Row>
                          <Col size={ 12 }>
                            <FormItem required>
                              <Label>套餐名称</Label>
                              <Input name="cSvcPackageInfo.packageName" onBlur={ this.handleNameBlur } onChange={ this.handleNameChange } />
                              <div className="error-text" style={ { display: 'none' } } ref="nameRepeatError">套餐名称重复</div>
                              <div className="error-text" style={ { display: 'none' } } ref="nameNullError">套餐名称不能为空</div>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>
                          <Col size={ 12 }>
                            <FormItem required>
                              <Label>套餐说明</Label>
                              <Textarea cols={ 140 } rows={ 3 } name="cSvcPackageInfo.packageDesc" />
                            </FormItem>
                          </Col>
                        </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <span className="line-bar">套餐内容</span>
            </Row>
            <div style={ { padding: '2% 2% 0' } }>
              <Row>
                <Col>
                  <h3><abbr className="required" title="required">*</abbr>基本配置</h3>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div style={ { width: '80%', padding: '2% 2% 0' } }>
                    <Row>
                      <Col>
                        <span className="service-tig">勾选以确认是否为固定值</span>
                      </Col>
                    </Row>
                    {
                      applicationAttributesData ? this.getForms( applicationAttributesData ) : null
                    }
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h3><abbr className="required" title="required">*</abbr>订购方式</h3>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div style={ { width: '80%', padding: '2% 2% 0', textAlign: 'left' } }>
                    <Row>
                      <Col>
                        <CheckboxGroup name="waysTypes" type="inline" onChange={ this.handleChangeWaysTypes.bind( this) } >
                          {
                            waysTypes ? waysTypes.map( ( item, index ) => {
                              return (
                                <Checkbox value={ item.value } key={ index } >{ item.text }</Checkbox>
                              )
                            } ) : null
                          }
                        </CheckboxGroup>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h3><abbr className="required" title="required">*</abbr>控制方式</h3>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div style={ { width: '80%', padding: '2% 2% 0', textAlign: 'left' } }>
                    <Row>
                      <Col>
                        <CheckboxGroup name="modelTypes" getter={ this.formGetter } value={this.state.modelTypesValue} onChange={ this.handleControlTypeChange }>
                          <Checkbox value="10">按时间</Checkbox>
                          <Checkbox value="20">按资源</Checkbox>
                        </CheckboxGroup>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <div>
                    <Row>
                      <Col size={ 10 }>
                        {
                          sourceAttributesData ? sourceAttributesData.length > 0 ?
                            <div className="help-container" ref="attrIds" style={ { display: 'none', textAlign: 'left' } }>
                              <Row>
                                <Col>
                                  <CheckboxGroup name="attrIds" type="inline">
                                    {
                                      sourceAttributesData ? sourceAttributesData.map( ( item, index ) => {
                                        return (
                                          <Checkbox key={ index } value={ item.attrId }>{ item.attrName }</Checkbox>
                                        );
                                      } ) : null
                                    }
                                  </CheckboxGroup>
                                </Col>
                              </Row>
                            </div> :
                              <Row>
                                <Col size={ 10 }>
                                  <div className="help-container" ref="attrIds" style={ { display: 'none', textAlign: 'left' } }>
                                    <span>无资源属性。</span>
                                    <div style={ { display: 'none' } }>
                                      <FormItem>
                                        <Input name="attrIds" value={ [] } />
                                      </FormItem>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            : null
                        }
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div style={ { marginTop: '50px', marginBottom: '50px', textAlign: 'center' } }>
                    <Button style={ { width: '140px' } } type="primary" onClick={ this.svcSubmit.bind( this, 10 ) }>保存</Button>
                    <Button style={ { width: '140px' } } type="primary" onClick={ this.svcSubmit.bind( this, 20 ) }>发布</Button>
                    <Button style={ { width: '140px' } } type="primary" onClick={ this.goBack.bind( this ) }>取消</Button>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Form>
      </div>
    );
  }

  // 获取表单 重复代码
  getInput ( item, index ) {
    return (
      <Row key={ index }>
        <Col size={ 1 }>
          <FormItem>
            <Checkbox style={ { float: 'left' } } name={ `cSvcAttrValueInfoList[${ index }].detailFixed` } value={ 1 } />
          </FormItem>
        </Col>
        <Col size={ 16 } style={ { paddingLeft: '0' } }>
          <FormItem style={ { backgroundColor: '#eee' } }>
            {
              item.cAttrMetadataInfo.metadataIsRequired ?
                <Label style={ { width: '25%', wordBreakWrap: 'break-word' } }>
                  <abbr className="required" title="required">*</abbr>{ item.attrName }
                </Label> :
                <Label style={ { width: '25%', wordBreakWrap: 'break-word' } }>
                  { item.attrName }
                </Label>
            }
            <Input style={ { width: '73%' } } name={ `cSvcAttrValueInfoList[${ index }].valueObject` } placeholder={ item.attrTips } pattern={ item.cAttrMetadataInfo.metadataIsValidate ? item.cAttrMetadataInfo.cAttrValidateInfo.validateRole : '' } />
          </FormItem>
          <div style={ { display: 'none' } }>
            <FormItem>
              <Input name={ `cSvcAttrValueInfoList[${ index }].attrId` } value={ item.attrId } />
            </FormItem>
            <FormItem>
              <Input name={ `cSvcAttrValueInfoList[${ index }].isRequired` } value={ item.cAttrMetadataInfo.metadataIsRequired } />
            </FormItem>
          </div>
        </Col>
      </Row>
    );
  };

  getSelect( item, index ) {
    return (
      <Row key={ index }>
        <Col size={ 1 }>
          <FormItem>
            <Checkbox style={ { float: 'left' } } name={ `cSvcAttrValueInfoList[${ index }].detailFixed` } value={ 1 } />
          </FormItem>
        </Col>
        <Col size={ 16 } style={ { paddingLeft: '0' } }>
          <FormItem style={ { backgroundColor: '#eee' } }>
            {
              item.cAttrMetadataInfo.metadataIsRequired ?
                <Label style={ { width: '25%', wordBreakWrap: 'break-word' } }>
                  <abbr className="required" title="required">*</abbr>{ item.attrName }
                </Label> :
                <Label style={ { width: '25%', wordBreakWrap: 'break-word' } }>
                  { item.attrName }
                </Label>
            }
            {
              item.cAttrMetadataInfo.metadataIsInit ?
                ( item.cAttrMetadataInfo.cAttrInitInfo.initType === 10 || item.cAttrMetadataInfo.cAttrInitInfo.initType === '10' ) ?
                  <Select style={ { width: '73%' } } name={ `cSvcAttrValueInfoList[${ index }].valueObject` } placeholder={ item.attrTips } search={ true }>
                    {
                      getInitArray( item.cAttrMetadataInfo.cAttrInitInfo.valueObject ).map( ( item, index ) => {
                        return <Option key={ index } value={ item.value }>{ item.text }</Option>;
                      } )
                    }
                  </Select>
                  :
                  <Select style={ { width: '73%' } } name={ `cSvcAttrValueInfoList[${ index }].valueObject` } dataSource={ item.cAttrMetadataInfo.cAttrInitInfo.valueObject } placeholder={ item.attrTips } search={ true } />
                :
                <Select style={ { width: '73%' } } name={ `cSvcAttrValueInfoList[${ index }].valueObject` } placeholder={ item.attrTips } search={ true } />
            }
          </FormItem>
          <div style={ { display: 'none' } }>
            <FormItem>
              <Input name={ `cSvcAttrValueInfoList[${ index }].attrId` } value={ item.attrId } />
            </FormItem>
            <FormItem>
              <Input name={ `cSvcAttrValueInfoList[${ index }].isRequired` } value={ item.cAttrMetadataInfo.metadataIsRequired } />
            </FormItem>
          </div>
        </Col>
      </Row>
    );
  };

  getRadio ( item, index ) {
    return (
      <Row key={ index }>
        <Col size={ 1 }>
          <FormItem>
            <Checkbox style={ { float: 'left' } } name={ `cSvcAttrValueInfoList[${ index }].detailFixed` } value={ 1 } />
          </FormItem>
        </Col>
        <Col size={ 16 } style={ { paddingLeft: '0' } }>
          <FormItem type="inline" style={ { backgroundColor: '#eee' } }>
            {
              item.cAttrMetadataInfo.metadataIsRequired ?
                <Label style={ { width: '25%', wordBreakWrap: 'break-word' } }>
                  <abbr className="required" title="required">*</abbr>{ item.attrName }
                </Label> :
                <Label style={ { width: '25%', wordBreakWrap: 'break-word' } }>
                  { item.attrName }
                </Label>
            }
            {
              item.cAttrMetadataInfo.metadataIsInit ?
                ( item.cAttrMetadataInfo.cAttrInitInfo.initType === 10 || item.cAttrMetadataInfo.cAttrInitInfo.initType === '10' ) ?
                  <RadioGroup style={ { width: '73%' } } name={ `cSvcAttrValueInfoList[${ index }].valueObject` } type="inline">
                    {
                      getInitArray( item.cAttrMetadataInfo.cAttrInitInfo.valueObject ).map( ( item, index ) => {
                        return <Radio key={ index } value={ item.value }>{ item.text }</Radio>;
                      } )
                    }
                  </RadioGroup>
                  : null
                : null
            }
          </FormItem>
          <div style={ { display: 'none' } }>
            <FormItem>
              <Input name={ `cSvcAttrValueInfoList[${ index }].attrId` } value={ item.attrId } />
            </FormItem>
            <FormItem>
              <Input name={ `cSvcAttrValueInfoList[${ index }].isRequired` } value={ item.cAttrMetadataInfo.metadataIsRequired } />
            </FormItem>
          </div>
        </Col>
      </Row>
    );
  };

  getCheckbox( item, index ) {
    return (
      <Row key={ index }>
        <Col size={ 1 }>
          <FormItem>
            <Checkbox style={ { float: 'left' } } name={ `cSvcAttrValueInfoList[${ index }].detailFixed` } value={ 1 } />
          </FormItem>
        </Col>
        <Col size={ 16 } style={ { paddingLeft: '0' } }>
          <FormItem type="inline" style={ { backgroundColor: '#eee' } }>
            {
              item.cAttrMetadataInfo.metadataIsRequired ?
                <Label style={ { width: '25%', wordBreakWrap: 'break-word' } }>
                  <abbr className="required" title="required">*</abbr>{ item.attrName }
                </Label> :
                <Label style={ { width: '25%', wordBreakWrap: 'break-word' } }>
                  { item.attrName }
                </Label>
            }
            {
              item.cAttrMetadataInfo.metadataIsInit ?
                ( item.cAttrMetadataInfo.cAttrInitInfo.initType === 10 || item.cAttrMetadataInfo.cAttrInitInfo.initType === '10' ) ?
                  <CheckboxGroup style={ { width: '73%' } } name={ `cSvcAttrValueInfoList[${ index }].valueObject` } type="inline">
                    {
                      getInitArray( item.cAttrMetadataInfo.cAttrInitInfo.valueObject ).map( ( item, index ) => {
                        return <Checkbox key={ index } value={ item.value }>{ item.text }</Checkbox>;
                      } )
                    }
                  </CheckboxGroup>
                  : null
                : null
            }
          </FormItem>
          <div style={ { display: 'none' } }>
            <FormItem>
              <Input name={ `cSvcAttrValueInfoList[${ index }].attrId` } value={ item.attrId } />
            </FormItem>
            <FormItem>
              <Input name={ `cSvcAttrValueInfoList[${ index }].isRequired` } value={ item.cAttrMetadataInfo.metadataIsRequired } />
            </FormItem>
          </div>
        </Col>
      </Row>
    );
  };

  getSlider( item, index )  {
    return (
      <PackageSlider dataSource={ item } index={ index } packageData={ null }  handleGetSliderVal={ this.handleGetSliderVal.bind( this ) } />
    );
  };

  getForms  ( formItems )  {
    const result = [];

    formItems.forEach( ( item, index ) => {
      let o = null;

      switch ( item.cAttrMetadataInfo.metadataModule ) {
        case 10:
          o = this.getInput( item, index );
          break;
        case 20:
          o = this.getSelect( item, index );
          break;
        case 30:
          o = this.getRadio( item, index );
          break;
        case 40:
          o = this.getCheckbox( item, index );
          break;
        case 50:
          o = this.getSlider( item, index );
          break;
      }
      result.push( o );
    } );

    return result;
  };
}

ServicePackageAdd.contextTypes = { router: PropTypes.object.isRequired };

export { ServicePackageAdd };
export default ServicePackageAdd;
