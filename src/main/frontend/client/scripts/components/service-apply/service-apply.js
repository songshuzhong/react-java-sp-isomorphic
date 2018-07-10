import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Container, Row, Col, Form, FormItem, Input, Label, Textarea, Checkbox, CheckboxGroup, RadioGroup, Radio, Option, Button, Select, Icon, Notification } from 'epm-ui';

import { getInitArray } from '../commons/getInitArray';
import { AngleSlider } from '../service-package/angleSlider';
import { MonthSlider } from './monthSlider';
import { QualitySlider } from './qualitySlider';
import { getDataSource } from '../../utilities/dataSource';
import { popup } from '../../utilities/transient';
import context from 'context';

import png1 from '../../../images/img_serviceapply1.png';
import png2 from '../../../images/img_serviceapply2.png';
import png3 from '../../../images/img_serviceapply3.png';

class ServiceApply extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      slData: -1 ,
      svcId: props.match.params.svcId,
      packageId: props.match.params.pkId,
      applicationAttributesData: null,
      sourceAttributesData: null,
      waysTypes: null,
      packageDetails: null,
      serviceDetails: null,
      monthForm: null,
      sourceForm: null,
      svcFormData: null,
      process: null
    };

    this.formGetter = this.formGetter.bind( this );
    this.formChange = this.formChange.bind( this );
    this.getTimeAndRes = this.getTimeAndRes.bind( this );
    this.handleUnitToMouth = this.handleUnitToMouth.bind( this );
    this.handleSetSliderItemPrice = this.handleSetSliderItemPrice.bind( this );
  }

  componentDidMount() {
    this.fetchApplicationAttributes();
    this.fetchSourceAttributes();
    this.fetchPackageDetails();
    this.fetchServiceDetails();
    this.fetchProcess();
    this.AForm = {};
    this.MForm = {};
    this.QForm = {};
  }

  contains( str, arr ) {
    for ( let i in arr ) {
      if ( arr[ i ] === str ) return true;
    }

    return false;
  }

  // 获取服务详细信息
  fetchServiceDetails() {
    getDataSource( `${ context.contextPath }/v1/services/${ this.state.svcId }`, ( serviceDetails ) => {
      this.setState( { serviceDetails } );
    } );
  }

  // 获取申请属性services/{svcId}/customattrs/{customType}
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

  // 获取套餐详情
  fetchPackageDetails() {
    getDataSource( `${ context.contextPath }/v1/services/${ this.state.svcId }/package/${ this.state.packageId }`, ( packageDetails ) => {
      let moduleTypes = packageDetails.cSvcPackageInfo.modelTypes;
      console.log('packageDetails.............');
      console.log(packageDetails);
      if( this.contains( 10, moduleTypes ) ) {
        this.fetchMonthForm();
      }
      if( this.contains( 20, moduleTypes ) ) {
        this.fetchSourceForm();
      }
      this.setState( { packageDetails } );
    } );
  }

  // 获取按月输入框
  fetchMonthForm() {
    getDataSource( `${ context.contextPath }/v1/svcorders/apply/${ this.state.svcId }/${ this.state.packageId }/modelType/10`, ( monthForm ) => {
      console.log('monthForm.............')
      console.log(monthForm);

      this.setState( { monthForm } );
    } );
  }

  // 获取资源输入框
  fetchSourceForm() {
    getDataSource( `${ context.contextPath }/v1/svcorders/apply/${ this.state.svcId }/${ this.state.packageId }/modelType/20`, ( sourceForm ) => {
      console.log('sourceForm.............')
      console.log(sourceForm)
      this[ 'modelId' ] = sourceForm.modelId;
      let monthForm = null;

      if ( sourceForm.cAttrInfoList && !this.state.monthForm ) {
        //console.log('11111111111111111111')
        for ( let v of sourceForm.cAttrInfoList ) {
          if ( v.cChargeAttrValueInfo.chargeType !== 20 ) {
            monthForm = {"modelId":1, "cAttrInfoList":[{"tenantId":"tenant_system","createDate":"2018-03-15 17:33:11","createBy":"admin","updateDate":"2018-03-15 17:33:11","updateBy":"admin","attrId":1,"attrName":"model_time","attrEnname":"model_time","attrCode":"model_time","attrDesc":"按时间","attrTips":"请添加使用时间","attrType":30,"cAttrMetadataInfo":{"tenantId":"tenant_system","createDate":"2018-03-15 17:33:11","createBy":"admin","updateDate":"2018-03-15 17:33:11","updateBy":"admin","metadataId":1,"attrId":1,"metadataDataType":30,"metadataIsRequired":true,"metadataIsValidate":false,"metadataModule":50,"metadataUnit":"月","metadataIsInit":false,"cAttrInitInfo":null,"cAttrValidateInfo":null},"customAttrType":null,"checked":null,"cChargeAttrValueInfo":null}]};
            this.setState( { monthForm } );
            break
          }
        }
      }
      this.setState( { sourceForm } );
    } );
  }

  // 获取审批流程
  fetchProcess() {
    getDataSource( `${ context.contextPath }/v1/svcorders/apply/waysType/10`, ( process ) => {
      this.setState( { process } );
    } );
  }

  // 订购方式变更
  handleChangeWay( value, event ) {
    let setups = event.target.parentNode.querySelectorAll('.range-title');
    setups.forEach(function (setup) {
      setup.className = "range-title";
    });
    event.target.className = "range-title actived";
    if ( value === 10 ) {
      this[ 'waysType' ] = 10;
      this.refs.process.style.display = 'block';
    } else if ( value === 20 ) {
      getDataSource( `${ context.contextPath }/v1/svcorders/apply/waysType/20`, ( wayType ) => {
        this[ 'waysId' ] = wayType[ 0 ].waysId;
        this[ 'waysType' ] = wayType[ 0 ].waysType;
        this.refs.process.style.display = 'none';
      } );
    } else if ( value === 30 ) {
      getDataSource( `${ context.contextPath }/v1/svcorders/apply/waysType/30`, ( wayType ) => {
        this[ 'waysId' ] = wayType[ 0 ].waysId;
        this[ 'waysType' ] = wayType[ 0 ].waysType;
        this.refs.process.style.display = 'none';
      } );
    }
  }

  // 控制模式变更
  handleChangeModule( value, event ) {
    let monthForm = this.state.monthForm;
    let sourceForm = this.state.sourceForm;
    let setups = event.target.parentNode.querySelectorAll('.range-title');
    setups.forEach(function (setup) {
      setup.className = "range-title";
    });
    event.target.className = "range-title actived";
    let resultFormData = this[ 'resultFormData' ];
    for( let key in resultFormData ) {
      if( key.indexOf( 'cSvcModelAttrValueInfoList' ) > -1 ) {
        delete resultFormData[ key ];
      }
    }
    if ( value === 10 ) {
      this[ 'moduleType' ] = 10;
      this[ 'modelId' ] = monthForm.modelId;
      this.refs.moduleForms.style.display = 'block';
      this.refs.sourceForms.style.display = 'none';
    } else if ( value === 20 ) {
      this[ 'moduleType' ] = 20;
      this[ 'modelId' ] = sourceForm.modelId;
      this.refs.sourceForms.style.display = 'block';
      this.refs.moduleForms.style.display = 'none';
    }
  }

  // 基本配置Slider
  handleGetSliderVal( popName, formData ) {
    for ( let key in formData ) {
      if ( key.indexOf( 'cSvcApplyAttrValueInfoList' ) > -1 ) {
        this.AForm[ key ] = formData[ key ];
      }
    }
  }

  // 按量Slider
  handleQuantitySilder( popName, formData, index ) {
    for ( let key in formData ) {
      if ( key.indexOf( 'cSvcModelAttrValueInfoList' ) > -1 ) {
        this.QForm[ key ] = formData[ key ];
      }
    }
    //console.log('handleQuantitySlider-------------------')
    //console.log(this.QForm)
    if ( popName === 'cSvcModelAttrValueInfoList') {
      this.handleSetSliderItemPrice( index );
    }

  }

  /**
   * 计算资源属性组件为slider滑块的总价，并更新总价对应的dom元素
   * @param index
   */
  handleSetSliderItemPrice( index ) {
    let value = 0;

    for( let key in this.QForm ) {
      if ( key.indexOf( `cSvcModelAttrValueInfoList[ ${ index } ]` ) > -1 && key.indexOf( 'valueObject' ) > -1 ) {
        value = this.QForm[ key ];
      }
    }
    const chargePrice = this.QForm[ `cSvcModelAttrValueInfoList[${ index }].formItemChargePrice` ];
    const chargeType = this.QForm[ `cSvcModelAttrValueInfoList[${ index }].formItemChargeType` ];
    const chargeTimeType = this.QForm[ `cSvcModelAttrValueInfoList[${ index }].formItemChargeTimeType` ];
    document.getElementById(`totalItemPrice${ index }`).innerHTML = this.handleGetTotalItemPrice( chargePrice, chargeType, chargeTimeType, value );
  }

  // 包月Slider
  handleMonthSilder( popName, formData ) {
   // console.log(`handleGetSliderVal........`);
    //console.log(formData)
    for ( let key in formData ) {

      if ( key.indexOf( 'cSvcModelAttrValueInfoList' ) > -1 ) {
        this.MForm[ key ] = formData[ key ];
      }
    }

    const doms = document.getElementsByClassName('totalItemPrice');
    //console.log('get dom by className')

    if ( doms.length > 0 ) {
      for ( let dom of doms ) {
        const index = ( dom.id ).substring( 14 );

        if ( typeof this[ `formItemValue${ index }` ] === 'undefined') {
          //console.log('slider time item-------------------');
          this.handleSetSliderItemPrice( index );
        } else {
          let value = this[ `formItemValue${ index }` ].valueGetter;

          if ( typeof value === 'object') {
            value = this.handleFormatArrayValue( value );
          } else if ( typeof value === 'string' ) {
            value = Number( value );
          }

          const chargePrice = this[ `formItemChargePrice${ index }` ].valueGetter;
          const chargeType = this[ `formItemChargeType${ index }` ].valueGetter;
          const chargeTimeType = this[ `formItemChargeTimeType${ index }` ].valueGetter;
          //console.log(this.handleGetTotalItemPrice( chargePrice, chargeType, chargeTimeType, value ));
          dom.innerHTML = this.handleGetTotalItemPrice( chargePrice, chargeType, chargeTimeType, value );
        }
      }
    }
  }

  /**
   * 计算的得总价（所有资源属性的价格相加）
   * @returns {number}
   */
  handleGetOrderPrice() {
    const doms = document.getElementsByClassName('totalItemPrice');
    let orderPrice = 0.00;

    if ( doms.length > 0 ) {
      for ( let dom of doms ) {
        orderPrice += Number( dom.innerHTML );
      }
    }

    return orderPrice;
  }

  svcSubmit() {
    let formData = this.getFormValue();
    let basicFormData = this.AForm;
    let monthFormData = this.MForm;
    let qualityFormData = this.QForm;

    if( this[ 'waysType' ] === undefined ) {
      popup( <Notification message="需选择计费方式" description="审批方式，需选择审批流程！" type='error' key={ Math.random().toString() } /> );
      return;
    }

    if( this[ 'waysType' ] === 10 && this[ 'isSelectProcess' ] === undefined ) {
      popup( <Notification message="计费方式信息有误" description="审批方式，需选择审批流程！" type='error' key={ Math.random().toString() } /> );
      return;
    }

    formData.monthFormData = monthFormData;
    formData.qualityFormData = qualityFormData;

    for( let key in basicFormData ) {
      formData[ key ] = basicFormData[ key ];
    }
    formData[ 'cSvcOrderInfo.cServiceInfo.svcId' ] = this.state.svcId;
    formData[ 'cSvcOrderInfo.cOrderWaysInfo.waysId' ] = this[ 'waysId' ];
    formData[ 'cSvcOrderInfo.waysType' ] = this[ 'waysType' ];
    formData[ 'cSvcOrderInfo.modelId' ] = typeof this[ 'modelId' ] !== 'undefined' ? this['modelId'] : ( this.state.monthForm ? this.state.monthForm.modelId : 1 );
    formData[ 'cSvcOrderInfo.orderType' ] = 10;
    if( formData[ 'cSvcOrderInfo.waysType' ] == 10 ) {
      formData[ 'cSvcOrderInfo.orderPrice' ] = 0.00;
    }else {
      formData[ 'cSvcOrderInfo.orderPrice' ] = this.handleGetOrderPrice();
    }

    this.setState( { svcFormData: formData } );
console.log(formData)
    this.refs.svcForm.style.display = 'none';
    this.refs.resvcForm.style.display = 'block';
  }

  formGetter( getter ) {
    this.getFormValue = getter.value;
  }

  formChange( formData, isValid ) {
    this[ 'resultFormData' ] = formData;
   // console.log(isValid);
  }

  // 控制模式变更
  handleProcessChange( value ) {
    this[ 'isSelectProcess' ] = true;
    this[ 'waysId' ] = value;
  }

  /**
   * 绘制资源输入框和月输入框
   * @returns {Array}
   */
  getTimeAndRes() {
    //console.log('getRes......................')
    const packageDetails = this.state.packageDetails;
    const monthForm = this.state.monthForm;
    const sourceForm = this.state.sourceForm;
    let array = [];

    if ( packageDetails ) {

      if ( monthForm ) {
        array.push( monthForm ? this.getForms( monthForm.cAttrInfoList, null, 'cSvcModelAttrValueInfoList', 10 ) : null );
      }
      array.push( sourceForm ? this.getForms( sourceForm.cAttrInfoList, null, 'cSvcModelAttrValueInfoList', 20 ) : null );
      /*for ( let v of packageDetails.cSvcPackageInfo.modelTypes ) {
        if ( v === 10 ) {
          array.push( monthForm ? this.getForms( monthForm.cAttrInfoList, null, 'cSvcModelAttrValueInfoList', 10 ) : null );
        } else if ( v === 20 ) {
          array.push( sourceForm ? this.getForms( sourceForm.cAttrInfoList, null, 'cSvcModelAttrValueInfoList', 20 ) : null );
        }
      }*/
    }
    
    return array;
  }

  /**
   *某个资源属性数据发生改变时，计算改属性总价并显示
   * @param index
   * @param chargeStr
   * @param popName
   * @param value
   */
  handleChangeFormItem( index, chargeStr, popName, value ) {

    if ( popName === 'cSvcModelAttrValueInfoList' ) {
      //console.log('handleChangeFormItem.............1s')
      const chargeObj = eval('(' + chargeStr + ')');
      const { chargePrice, chargeType, chargeTimeType } = chargeObj;
      //console.log(chargeObj);

      if ( typeof value === 'object') {
        value = this.handleFormatArrayValue( value );
      } else if ( typeof value === 'string' ) {
        value = Number( value );
      }

      document.getElementById(`totalItemPrice${ index }`).innerHTML = this.handleGetTotalItemPrice( chargePrice, chargeType, chargeTimeType, value );
    }
  }

  /**
   * 当资源组件的value为数组时，数组值相加得出总数
   * @param array
   * @returns {number}
   */
  handleFormatArrayValue( array ) {
    let value = 0;

    for ( let v of array ) {
      value += Number( v );
    }

    return value;
  }

  /**
   *获取某个资源属性的总价
   * @param chargePrice 计费单价
   * @param chargeType  计费类型
   * @param chargeTimeType  计费时间单位
   * @param value 资源数量
   * @returns {string}
   */
  handleGetTotalItemPrice( chargePrice, chargeType, chargeTimeType, value ) {
   // console.log('handleGetTotalItemPrice..................')
    let totalItemPrice = 0;

    //配置套餐 选择的控制方式 包含时间 || 资源属性包含按时间计费的资源
    if ( this.state.monthForm ) {
      //modelTime 单位是  月
      let modelTime =  this.MForm ? this.MForm[ `cSvcModelAttrValueInfoList[0].valueObjectmodel_time` ] : 0;
      let chargePrice_1 = chargePrice ? chargePrice : 0;

      //服务提供方 配置资源属性  计费类型 -》 按时间
      if ( chargeType === 10 ) {
        chargePrice_1 = this.handleUnitToMouth( chargeTimeType, chargePrice_1 );
        totalItemPrice = modelTime * chargePrice_1; //时间 * 单价
        return totalItemPrice.toFixed( 2 );

        //计费类型 -》 按资源
      }else if ( chargeType === 20 ) {
        totalItemPrice = chargePrice_1 * value;//数量 * 单价
        return totalItemPrice.toFixed( 2 );

        //计费类型 -》 时间+资源
      }else if ( chargeType === 30 ) {
        chargePrice_1 = this.handleUnitToMouth( chargeTimeType, chargePrice_1 );
        totalItemPrice = modelTime * chargePrice_1 * value;//时间 * 数量 * 单价
        return totalItemPrice.toFixed( 2 );
      }

      //资源属性不包含按时间计费的资源（都是按资源计费）
    }else {
      totalItemPrice = chargePrice * value;//数量 * 单价
      return totalItemPrice.toFixed( 2 );
    }
  }

  /**
   * 属性单价 时间单位统一转换为 月
   * @param chargeTimeType 计费时间单位
   * @param value 时间（默认单位是月）
   * @returns {*}
   */
  handleUnitToMouth( chargeTimeType, value ) {
    value = Number( value );

    if ( chargeTimeType === 10) { //日
      return value * 30;
    }else if ( chargeTimeType === 20 ) { //月
      return value;
    }else if ( chargeTimeType === 30 ) { //年
      return value / 12;
    }
  }

  render() {
    let applicationAttributesData = this.state.applicationAttributesData;
    let serviceDetails = this.state.serviceDetails;
    let packageDetails = this.state.packageDetails;
    let process = this.state.process;

    return (
      <div>
        <Container type="fluid">
          <div ref="svcForm">
            <Form
              type="horizontal"
              getter={ this.formGetter }
              onChange = { this.formChange }
            >
              <div>
                <div style={ { padding: '100px 1% 0 1%' } }>
                  <Row>
                    <Col>
                      <div className="package-title" style={ { textAlign: 'left' } }>
                        <span className="blue-bar" style={ { height: '30px', borderLeftWidth: '3px' } } />
                        <span className="title" style={ { height: '30px', lineHeight: '30px', fontSize: '16px' } }>{ serviceDetails ? serviceDetails.cServiceInfo.svcName : '' }</span>
                      </div>
                      <hr style={ { margin: '10px 0 14px 0', borderTop: '2px solid #f5f5f5' } } />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="config-items">
                        <div className="config-item">
                          <Row>
                            <Col size={ 5 }>
                              <div className="left-title">
                                <img src={ png1 } style={ { marginRight: '10px' } } />
                                <span>计费方式</span>
                              </div>
                            </Col>
                            <Col size={ 19 } >
                              <div className="right-content" style={ { textAlign: 'left' } }>
                                {
                                  packageDetails ? packageDetails.cSvcPackageInfo.waysTypes.map( ( item, index ) => {
                                    switch ( item ) {
                                      case 10:
                                        return ( <span key={ index } className="range-title" onClick={ this.handleChangeWay.bind( this, item ) }>审批</span> );
                                      case 20:
                                        return ( <span key={ index } className="range-title" onClick={ this.handleChangeWay.bind( this, item ) }>付费</span> );
                                      case 30:
                                        return ( <span key={ index } className="range-title" onClick={ this.handleChangeWay.bind( this, item ) }>自动开通</span> );
                                      default:
                                        return '';
                                    }
                                  } ) : null
                                }
                                <div  ref="process" style={ { paddingTop: '20px', display: 'none' } }>
                                  {
                                    packageDetails ? packageDetails.cSvcPackageInfo.waysTypes.map( ( item, index ) => {
                                      if( item === 10 ) {
                                        return (
                                          <RadioGroup key={ index } value="pear" name="rGroup" type="inline" onChange={ this.handleProcessChange.bind( this ) }>
                                            {
                                              process ? process.map( ( item, index ) => {
                                                return <Radio key={ index } value={ item.waysId }>{ item.waysName }</Radio>
                                              } ) : null
                                            }
                                          </RadioGroup>
                                        )
                                      }
                                    } ) : null
                                  }
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                        <div className="config-item">
                          <Row>
                            <Col size={ 5 }>
                              <div className="left-title">
                                <img src={ png2 } style={ { marginRight: '10px' } } />
                                <span>基本配置</span>
                              </div>
                            </Col>
                            <Col size={ 19 } >
                              <div className="right-content">
                                {
                                  applicationAttributesData ? packageDetails ? this.getForms( applicationAttributesData, packageDetails, 'cSvcApplyAttrValueInfoList' ) : null : null
                                }
                              </div>
                            </Col>
                          </Row>
                        </div>
                        <div className="config-item">
                          <Row>
                            <Col size={ 5 }>
                              <div className="left-title">
                                <img src={ png3 } style={ { marginRight: '10px' } } />
                                <span>购买量</span>
                              </div>
                            </Col>
                            <Col size={ 19 } >
                              <div className="right-content">
                                {
                                  this.getTimeAndRes()
                                }
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div style={ { marginTop: '50px', marginBottom: '50px', textAlign: 'right' } }>
                        <Button style={ { width: '140px' } } shape="default" onClick={ this.goBack.bind( this ) }>返回</Button>
                        <Button style={ { width: '140px' } } type="primary" onClick={ this.svcSubmit.bind( this ) }>提交申请</Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Form>
          </div>
        </Container>
        <div style={ { display: 'none' } } ref='resvcForm'>
          <Container type="fluid">
            <div style={ { padding: '100px 1% 0 1%' } }>
              {
                this.state.svcFormData ? this.drawSubmitList( this.state.svcFormData ) : null
              }
            </div>
          </Container>
        </div>
      </div>
    );
  }

  goBack() {
    let serviceDetails = this.state.serviceDetails;
    this.context.router.history.push( {
      pathname: `/portal/service-introduction/${ serviceDetails.cServiceInfo.svcCode }`
    } );
  }

  drawSubmitList( svcFormData ) {
    let serviceDetails = this.state.serviceDetails;
    let process = this.state.process;
    let processName = '';


    if( svcFormData[ 'cSvcOrderInfo.waysType' ] === 10 ) {
      if( process ) {
        for( let i = 0; i < process.length; i++ ) {
          if( process[ i ].waysId === svcFormData[ 'cSvcOrderInfo.cOrderWaysInfo.waysId' ] ) {
            processName = process[ i ].waysName;
          }
        }
      }
    }

    let basicArray = [];
    let buyArray = [];

    for( let key in svcFormData ) {

      if( key.indexOf( 'cSvcApplyAttrValueInfoList' ) > -1 && key.indexOf( 'valueObject' ) > -1 ) {
        let number = key.substring( key.indexOf( '[' ) + 1, key.indexOf( ']' ) );
        let unit = svcFormData[ `cSvcApplyAttrValueInfoList[${ number }].metadataUnit` ];
        basicArray.push( {
          'text': key.substring( ( key.indexOf( 'valueObject' ) + 'valueObject'.length ), key.length ),
          'value': svcFormData[ key ],
          'metadataUnit': unit
        } )
      } else if( key.indexOf( 'cSvcModelAttrValueInfoList' ) > -1 && key.indexOf( 'valueObject' ) > -1 ) {
        let number = key.substring( key.indexOf( '[' ) + 1, key.indexOf( ']' ) );
        let unit = svcFormData[ `cSvcModelAttrValueInfoList[${ number }].metadataUnit` ];
        buyArray.push( {
          'text': key.substring( ( key.indexOf( 'valueObject' ) + 'valueObject'.length ), key.length ),
          'value': svcFormData[ key ],
          'metadataUnit': unit
        } )
      }
    }
    if( this[ 'moduleType' ] === 10 ) {
      if( svcFormData.monthFormData ) {
        for( let key in svcFormData.monthFormData ) {
          if( key.indexOf( 'cSvcModelAttrValueInfoList' ) > -1 && key.indexOf( 'valueObject' ) > -1 ) {
            let number = key.substring( key.indexOf( '[' ) + 1, key.indexOf( ']' ) );
            let unit = svcFormData.monthFormData[ `cSvcModelAttrValueInfoList[${ number }].metadataUnit` ];
            buyArray.push( {
              'text': key.substring( ( key.indexOf( 'valueObject' ) + 'valueObject'.length ), key.length ),
              'value': svcFormData.monthFormData[ key ],
              'metadataUnit': unit
            } )
          }
        }
      }
    } else if( this[ 'moduleType' ] === 20 ) {
      if( svcFormData.qualityFormData ) {
        for( let key in svcFormData.qualityFormData ) {
          if( key.indexOf( 'cSvcModelAttrValueInfoList' ) > -1 && key.indexOf( 'valueObject' ) > -1 ) {
            let number = key.substring( key.indexOf( '[' ) + 1, key.indexOf( ']' ) );
            let unit = svcFormData.qualityFormData[ `cSvcModelAttrValueInfoList[${ number }].metadataUnit` ];
            buyArray.push( {
              'text': key.substring( ( key.indexOf( 'valueObject' ) + 'valueObject'.length ), key.length ),
              'value': svcFormData.qualityFormData[ key ],
              'metadataUnit': unit
            } )
          }
        }
      }
    }

    return (
      <div>
        <Row>
          <Col>
            <div className="package-title" style={ { textAlign: 'left' } }>
              <span className="confirm-title">核对订单信息</span>
            </div>
            <hr style={ { margin: '10px 0 14px 0', borderTop: '2px solid #f5f5f5' } } />
          </Col>
        </Row>
        <table className="order-list">
          <thead>
          <tr>
            <td>产品名称</td>
            <td>基本配置</td>
            <td>计费方式</td>
            <td>
              {
                svcFormData ? svcFormData[ 'cSvcOrderInfo.waysType' ] === 10 ? '审批流程' : '购买量' : ''
              }
            </td>
            <td>
              {
                svcFormData ? svcFormData[ 'cSvcOrderInfo.waysType' ] === 10 ? '购买量' : '总费用' : ''
              }
            </td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td style={ { fontSize: '20px', fontWeight: 600 } }>
              {
                serviceDetails ? serviceDetails.cServiceInfo.svcName : ''
              }
            </td>
            <td>
              <ul>
                {
                  ( basicArray.length > 0 ) ? basicArray.map( ( item, index ) => {
                    return(
                      <li key={ index }>
                        <span className="title">{ item.text }</span>
                        <span className="fenghao">:</span>
                        <span className="text">{ item.value }{ item.metadataUnit }</span>
                      </li>
                    )
                  } ) : null
                }
              </ul>
            </td>
            <td>
                <span>
                  {
                    svcFormData ? svcFormData[ 'cSvcOrderInfo.waysType' ] === 10 ? '审批' : svcFormData[ 'cSvcOrderInfo.waysType' ] === 20 ? '付费' : svcFormData[ 'cSvcOrderInfo.waysType' ] === 30 ? '免费' : '' : ''
                  }
                </span>
            </td>
            <td>
              {
                svcFormData ? svcFormData[ 'cSvcOrderInfo.waysType' ] === 10 ? processName :
                  ( buyArray.length > 0 ) ? buyArray.map( ( item, index ) => {
                    return(
                      <li key={ index }>
                        <span className="title">{ item.text }</span>
                        <span className="fenghao">:</span>
                        <span className="text">{ item.value }{ item.metadataUnit }</span>
                      </li>
                    )
                  } ) : null : null
              }
            </td>
            <td>
                <span>
                  {
                    svcFormData ? svcFormData[ 'cSvcOrderInfo.waysType' ] === 10 ? ( buyArray.length > 0 ) ? buyArray.map( ( item, index ) => {
                      return(
                        <li key={ index }>
                          <span className="title">{ item.text }</span>
                          <span className="fenghao">:</span>
                          <span className="text">{ item.value }{ item.metadataUnit }</span>
                        </li>
                      )
                    } ) : null : <span>{ svcFormData[ 'cSvcOrderInfo.orderPrice' ] } 元</span> : null
                  }
                </span>
            </td>
          </tr>
          </tbody>
        </table>
        <Row>
          <Col>
            <div style={ { marginTop: '50px', marginBottom: '50px', textAlign: 'right' } }>
              <Button style={ { width: '140px' } } shape="default" onClick={ this.handleListBack.bind( this ) }>返回</Button>
              <Button style={ { width: '140px' } } type="primary" onClick={ this.handleResultSubmit.bind( this ) }>提交申请</Button>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  handleListBack() {
    this.refs.svcForm.style.display = 'block';
    this.refs.resvcForm.style.display = 'none';
  }

  handleResultSubmit() {
    let formData = this.state.svcFormData;

    let result = {};
    for ( let key in formData ) {

      if ( key === 'monthFormData' || key === 'qualityFormData' ) {
        if( this[ 'moduleType' ] === 10 ) {
          for( key in formData.monthFormData ) {
            if( key.indexOf( 'cSvcModelAttrValueInfoList' ) > -1 && key.indexOf( 'valueObject' ) > -1 ) {
              let subKey = key.substring( 0,  ( key.indexOf( 'valueObject' ) + 'valueObject'.length ) );
              result[ subKey ] = formData.monthFormData[ key ];
            } else {
              result[ key ] = formData.monthFormData[ key ];
            }
          }
        } else if( this[ 'moduleType' ] === 20 ) {
          for( key in formData.qualityFormData ) {
            if( key.indexOf( 'cSvcModelAttrValueInfoList' ) > -1 && key.indexOf( 'valueObject' ) > -1 ) {
              let subKey = key.substring( 0,  ( key.indexOf( 'valueObject' ) + 'valueObject'.length ) );
              result[ subKey ] = formData.qualityFormData[ key ];
            } else {
              result[ key ] = formData.qualityFormData[ key ];
            }
          }
        }
      } else {
        if( ( key.indexOf( 'cSvcApplyAttrValueInfoList' ) > -1 || key.indexOf( 'cSvcModelAttrValueInfoList' ) > -1 ) && key.indexOf( 'valueObject' ) > -1 ) {
          let subKey = key.substring( 0,  ( key.indexOf( 'valueObject' ) + 'valueObject'.length ) );
          result[ subKey ] = formData[ key ];
        } else {
          result[ key ] = formData[ key ];
        }
      }
    }
    delete result.rGroup;

    for( let key in result ) {
      if( key.indexOf( 'metadataUnit' ) > -1 ) {
        delete result[ key ];
      }
    }

    let param = '';

    for ( let name in result ) {
      param += `${ name }=${ result[ name ] }&`;
    }

    let wayType = result[ 'cSvcOrderInfo.waysType' ];
    getDataSource(
      {
        url: `${ context.contextPath }/v1/svcorders/apply`,
        params: { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: param.substring( 0, param.length - 1 ) }
      }, ( result ) => {


        if ( result.status.code == 201 ) {
          popup( <Notification message={ result.status.message } type='success' key={ Math.random().toString() } /> );
          if( wayType == 30 ) {
            getDataSource( `${ context.contextPath }/v1/svcorders/apply/probation/orderId/${ result.orderId }`, ( data ) => {
              if( data.code == 200 ) {
                popup( <Notification message={ data.message } type='success' key={ Math.random().toString() } /> );
                this.context.router.history.push( {
                  pathname: `/portal/order-result/${ wayType }/${ result.orderId }`,
                } );
              } else {
                popup( <Notification message={ data.message } type='error' key={ Math.random().toString() } /> );
              }
            } );
          } else {
            this.context.router.history.push( {
              pathname: `/portal/order-result/${ wayType }/${ result.orderId }`,
            } );
          }
        } else {
            popup( <Notification message={ result.status.message } type='error' key={ Math.random().toString() } /> );
        }
      } );
  }

  // 获取表单 重复代码
  getDefaultValue( attrId, list ) {
    for ( let i = 0; i < list.length; i++ ) {
      if ( list[ i ].attrId === attrId ) {

        return list[ i ];
      }
    }

    return false;
  }

  getInput( item, index, packageDetails, popName ) {
    let packageData = packageDetails ? this.getDefaultValue( item.attrId, packageDetails ) : null;
    const cChargeAttrValueInfo = item.cChargeAttrValueInfo;
    const chargeStr = cChargeAttrValueInfo ? JSON.stringify( cChargeAttrValueInfo ) : '';
      return (
      <Row key={ index }>
        <Col size={ 14 } style={ { paddingLeft: '0' } }>
          <FormItem required={ item.cAttrMetadataInfo.metadataIsRequired } readonly={ packageData ? ( packageData.detailFixed === '1' || packageData.detailFixed === 1 ) : false }>
            <Label style={ { marginRight: '10px' } }>{ item.attrName }</Label>
            <Input ref={ ( node ) => { this[ `formItemValue${ index }` ] = node  } } name={ `${ popName }[${ index }].valueObject${ item.attrName }` } onChange={ this.handleChangeFormItem.bind( this, index, chargeStr, popName ) } value={ packageData ? packageData.valueObject : null } placeholder={ item.attrTips } pattern={ item.cAttrMetadataInfo.metadataIsValidate ? item.cAttrMetadataInfo.cAttrValidateInfo.validateRole : '' } >
              <Input.Right text={ item.cAttrMetadataInfo.metadataUnit } >
              </Input.Right>
            </Input>
          </FormItem>
          <div style={ { display: 'none' } }>
            <FormItem>
              <Input name={ `${ popName }[${ index }].attrId` } value={ item.attrId } />
            </FormItem>
            <FormItem>
              <Input name={ `${ popName }[${ index }].metadataUnit` } value={ item.cAttrMetadataInfo.metadataUnit } />
            </FormItem>
          </div>
        </Col>
        {
          cChargeAttrValueInfo ?
          <Col size={ 4 } style={ { paddingLeft: '0' } }>
            {
              cChargeAttrValueInfo.chargeType === 10 ?
                <span>单价： { cChargeAttrValueInfo.chargePrice } 元/{ cChargeAttrValueInfo.chargeTimeType === 10 ? '日' : ( cChargeAttrValueInfo.chargeTimeType === 20 ? '月' : '年' ) }</span>
                : ( cChargeAttrValueInfo.chargeType === 20 ?
                <span>单价： { cChargeAttrValueInfo.chargePrice } 元/{ cChargeAttrValueInfo.metadataUnit }</span>
                :  <span>单价： { cChargeAttrValueInfo.chargePrice } 元/{ cChargeAttrValueInfo.metadataUnit }/{ cChargeAttrValueInfo.chargeTimeType === 10 ? '日' : ( cChargeAttrValueInfo.chargeTimeType === 20 ? '月' : '年' ) }</span> )
            }
            <Input ref={ ( node ) => { this[ `formItemChargePrice${ index }` ] = node } } style={ { display: 'none' } } value={ cChargeAttrValueInfo.chargePrice } />
            <Input ref={ ( node ) => { this[ `formItemChargeType${ index }` ] = node } } style={ { display: 'none' } } value={ cChargeAttrValueInfo.chargeType } />
            <Input ref={ ( node ) => { this[ `formItemChargeTimeType${ index }` ] = node } } style={ { display: 'none' } } value={ cChargeAttrValueInfo.chargeTimeType } />
          </Col> : null
        }
        {
          cChargeAttrValueInfo ?
            <Col size={ 4 } style={ { paddingLeft: '0' } }>
              <span>总价：</span><span className="totalItemPrice" id={ `totalItemPrice${ index }` } >0</span>元
            </Col> : null
        }
      </Row>
    );
  }

  getSelect( item, index, packageDetails, popName ) {
    let packageData = packageDetails ? this.getDefaultValue( item.attrId, packageDetails ) : null;
    const cChargeAttrValueInfo = item.cChargeAttrValueInfo;
    const chargeStr = cChargeAttrValueInfo ? JSON.stringify( cChargeAttrValueInfo ) : '';

    return (
      <Row key={ index }>
        <Col size={ 14 } style={ { paddingLeft: '0' } }>
          <FormItem required={ item.cAttrMetadataInfo.metadataIsRequired } readonly={ packageData ? ( packageData.detailFixed === '1' || packageData.detailFixed === 1 ) : false }>
            <Label style={ { marginRight: '10px' } }>{ item.attrName }</Label>
            {
              item.cAttrMetadataInfo.metadataIsInit ?
                ( item.cAttrMetadataInfo.cAttrInitInfo.initType === 10 || item.cAttrMetadataInfo.cAttrInitInfo.initType === '10' ) ?
                  <Select ref={ ( node ) => { this[ `formItemValue${ index }` ] = node  } } name={ `${ popName }[${ index }].valueObject${ item.attrName }` } placeholder={ item.attrTips } search={ true } onChange={ this.handleChangeFormItem.bind( this, index, chargeStr, popName ) } value={ packageData ? packageData.valueObject : null }>
                    {
                      getInitArray( item.cAttrMetadataInfo.cAttrInitInfo.valueObject ).map( ( item, index ) => {
                        return <Option key={ index } value={ item.value }>{ item.text }</Option>;
                      } )
                    }
                  </Select>
                  :
                  <Select name={ `${ popName }[${ index }].valueObject${ item.attrName }` } dataSource={ item.cAttrMetadataInfo.cAttrInitInfo.valueObject } placeholder={ item.attrTips } search={ true } value={ packageData ? packageData.valueObject : null } />
                :
                null
            }
          </FormItem>
          <div style={ { display: 'none' } }>
            <FormItem>
              <Input name={ `${ popName }[${ index }].attrId` } value={ item.attrId } />
            </FormItem>
            <FormItem>
              <Input name={ `${ popName }[${ index }].metadataUnit` } value={ item.cAttrMetadataInfo.metadataUnit } />
            </FormItem>
          </div>
        </Col>
        {
          cChargeAttrValueInfo ?
            <Col size={ 4 } style={ { paddingLeft: '0' } }>
              {
                cChargeAttrValueInfo.chargeType === 10 ?
                  <span>单价： { cChargeAttrValueInfo.chargePrice } 元/{ cChargeAttrValueInfo.chargeTimeType === 10 ? '日' : ( cChargeAttrValueInfo.chargeTimeType === 20 ? '月' : '年' ) }</span>
                  : ( cChargeAttrValueInfo.chargeType === 20 ?
                  <span>单价： { cChargeAttrValueInfo.chargePrice } 元/{ cChargeAttrValueInfo.metadataUnit }</span>
                  :  <span>单价： { cChargeAttrValueInfo.chargePrice } 元/{ cChargeAttrValueInfo.metadataUnit }/{ cChargeAttrValueInfo.chargeTimeType === 10 ? '日' : ( cChargeAttrValueInfo.chargeTimeType === 20 ? '月' : '年' ) }</span> )
              }
              <Input ref={ ( node ) => { this[ `formItemChargePrice${ index }` ] = node } } style={ { display: 'none' } } value={ cChargeAttrValueInfo.chargePrice } />
              <Input ref={ ( node ) => { this[ `formItemChargeType${ index }` ] = node } } style={ { display: 'none' } } value={ cChargeAttrValueInfo.chargeType } />
              <Input ref={ ( node ) => { this[ `formItemChargeTimeType${ index }` ] = node } } style={ { display: 'none' } } value={ cChargeAttrValueInfo.chargeTimeType } />
            </Col> : null
        }
        {
          cChargeAttrValueInfo ?
            <Col size={ 4 } style={ { paddingLeft: '0' } }>
              <span>总价：</span><span className="totalItemPrice" id={ `totalItemPrice${ index }` } >0</span>元
            </Col> : null
        }
      </Row>
    );
  }

  getRadio( item, index, packageDetails, popName ) {
    let packageData = packageDetails ? this.getDefaultValue( item.attrId, packageDetails ) : null;
    const cChargeAttrValueInfo = item.cChargeAttrValueInfo;
    const chargeStr = cChargeAttrValueInfo ? JSON.stringify( cChargeAttrValueInfo ) : '';

    return (
      <Row key={ index }>
        <Col size={ 14 } style={ { paddingLeft: '0' } }>
          <FormItem type="inline" required={ item.cAttrMetadataInfo.metadataIsRequired } readonly={ packageData ? ( packageData.detailFixed === '1' || packageData.detailFixed === 1 ) : false }>
            <Label style={ { marginRight: '10px' } }>{ item.attrName }</Label>
            {
              item.cAttrMetadataInfo.metadataIsInit ?
                ( item.cAttrMetadataInfo.cAttrInitInfo.initType === 10 || item.cAttrMetadataInfo.cAttrInitInfo.initType === '10' ) ?
                  <RadioGroup ref={ ( node ) => { this[ `formItemValue${ index }` ] = node  } } name={ `${ popName }[${ index }].valueObject${ item.attrName }` } type="inline" onChange={ this.handleChangeFormItem.bind( this, index, chargeStr, popName ) } value={ packageData ? packageData.valueObject : '' }>
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
              <Input name={ `${ popName }[${ index }].attrId` } value={ item.attrId } />
            </FormItem>
            <FormItem>
              <Input name={ `${ popName }[${ index }].metadataUnit` } value={ item.cAttrMetadataInfo.metadataUnit } />
            </FormItem>
          </div>
        </Col>
        {
          cChargeAttrValueInfo ?
            <Col size={ 4 } style={ { paddingLeft: '0' } }>
              {
                cChargeAttrValueInfo.chargeType === 10 ?
                  <span>单价： { cChargeAttrValueInfo.chargePrice } 元/{ cChargeAttrValueInfo.chargeTimeType === 10 ? '日' : ( cChargeAttrValueInfo.chargeTimeType === 20 ? '月' : '年' ) }</span>
                  : ( cChargeAttrValueInfo.chargeType === 20 ?
                  <span>单价： { cChargeAttrValueInfo.chargePrice } 元/{ cChargeAttrValueInfo.metadataUnit }</span>
                  :  <span>单价： { cChargeAttrValueInfo.chargePrice } 元/{ cChargeAttrValueInfo.metadataUnit }/{ cChargeAttrValueInfo.chargeTimeType === 10 ? '日' : ( cChargeAttrValueInfo.chargeTimeType === 20 ? '月' : '年' ) }</span> )
              }
              <Input ref={ ( node ) => { this[ `formItemChargePrice${ index }` ] = node } } style={ { display: 'none' } } value={ cChargeAttrValueInfo.chargePrice } />
              <Input ref={ ( node ) => { this[ `formItemChargeType${ index }` ] = node } } style={ { display: 'none' } } value={ cChargeAttrValueInfo.chargeType } />
              <Input ref={ ( node ) => { this[ `formItemChargeTimeType${ index }` ] = node } } style={ { display: 'none' } } value={ cChargeAttrValueInfo.chargeTimeType } />
            </Col> : null
        }
        {
          cChargeAttrValueInfo ?
            <Col size={ 4 } style={ { paddingLeft: '0' } }>
              <span>总价：</span><span className="totalItemPrice" id={ `totalItemPrice${ index }` } >0</span>元
            </Col> : null
        }
      </Row>
    );
  }

  getCheckbox( item, index, packageDetails, popName ) {
    let packageData = packageDetails ? this.getDefaultValue( item.attrId, packageDetails ) : null;
    const cChargeAttrValueInfo = item.cChargeAttrValueInfo;
    const chargeStr = cChargeAttrValueInfo ? JSON.stringify( cChargeAttrValueInfo ) : '';

    return (
      <Row key={ index }>
        <Col size={ 14 } style={ { paddingLeft: '0' } }>
          <FormItem type="inline" required={ item.cAttrMetadataInfo.metadataIsRequired } disabled={ packageData ? ( packageData.detailFixed === '1' || packageData.detailFixed === 1 ) : false }>
            <Label style={ { marginRight: '10px' } }>{ item.attrName }</Label>
            {
              item.cAttrMetadataInfo.metadataIsInit ?
                ( item.cAttrMetadataInfo.cAttrInitInfo.initType === 10 || item.cAttrMetadataInfo.cAttrInitInfo.initType === '10' ) ?
                  <CheckboxGroup ref={ ( node ) => { this[ `formItemValue${ index }` ] = node  } } name={ `${ popName }[${ index }].valueObject${ item.attrName }` } type="inline" onChange={ this.handleChangeFormItem.bind( this, index, chargeStr, popName ) } value={ packageData ? packageData.valueObject.split( ',' ) : null }>
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
              <Input name={ `${ popName }[${ index }].attrId` } value={ item.attrId } />
            </FormItem>
            <FormItem>
              <Input name={ `${ popName }[${ index }].metadataUnit` } value={ item.cAttrMetadataInfo.metadataUnit } />
            </FormItem>
          </div>
        </Col>
        {
          cChargeAttrValueInfo ?
            <Col size={ 4 } style={ { paddingLeft: '0' } }>
              {
                cChargeAttrValueInfo.chargeType === 10 ?
                  <span>单价： { cChargeAttrValueInfo.chargePrice } 元/{ cChargeAttrValueInfo.chargeTimeType === 10 ? '日' : ( cChargeAttrValueInfo.chargeTimeType === 20 ? '月' : '年' ) }</span>
                  : ( cChargeAttrValueInfo.chargeType === 20 ?
                  <span>单价： { cChargeAttrValueInfo.chargePrice } 元/{ cChargeAttrValueInfo.metadataUnit }</span>
                  :  <span>单价： { cChargeAttrValueInfo.chargePrice } 元/{ cChargeAttrValueInfo.metadataUnit }/{ cChargeAttrValueInfo.chargeTimeType === 10 ? '日' : ( cChargeAttrValueInfo.chargeTimeType === 20 ? '月' : '年' ) }</span> )
              }
              <Input ref={ ( node ) => { this[ `formItemChargePrice${ index }` ] = node } } style={ { display: 'none' } } value={ cChargeAttrValueInfo.chargePrice } />
              <Input ref={ ( node ) => { this[ `formItemChargeType${ index }` ] = node } } style={ { display: 'none' } } value={ cChargeAttrValueInfo.chargeType } />
              <Input ref={ ( node ) => { this[ `formItemChargeTimeType${ index }` ] = node } } style={ { display: 'none' } } value={ cChargeAttrValueInfo.chargeTimeType } />
            </Col> : null
        }
        {
          cChargeAttrValueInfo ?
            <Col size={ 4 } style={ { paddingLeft: '0' } }>
              <span>总价：</span><span className="totalItemPrice" id={ `totalItemPrice${ index }` } >0</span>元
            </Col> : null
        }
      </Row>
    );
  }

  getSlider( item, index, packageDetails, popName ) {
    let packageData = packageDetails ? this.getDefaultValue( item.attrId, packageDetails ) : null;

    return (
      <Row key={ index }>
        <Col>
          <AngleSlider dataSource={ item } index={ index } packageData={ packageData } popName={ popName } handleGetSliderVal={ this.handleGetSliderVal.bind( this ) } />
        </Col>
      </Row>
    );
  }

  getMonthSlider( item, index, packageDetails, popName ) {
    return (
      <Row key={ index }>
        <Col>
          <MonthSlider dataSource={ item } index={ index } packageData={ packageData } popName={ popName } handleGetMonthSilder={ this.handleMonthSilder.bind( this ) } />
        </Col>
      </Row>
    );

    let packageData = packageDetails ? this.getDefaultValue( item.attrId, packageDetails ) : null;
  }

  getQualitySlider( item, index, packageDetails, popName ) {
    let packageData = packageDetails ? this.getDefaultValue( item.attrId, packageDetails ) : null;

    return (
      <Row key={ index }>
        <QualitySlider dataSource={ item } index={ index } packageData={ packageData } popName={ popName } handleGetQuantitySilder={ this.handleQuantitySilder.bind( this ) } />
      </Row>
    );
  }

  getForms( formItems, packages, popName, moduleType ) {
    const result = [];
    let packageDetails = packages ? packages.cSvcPackageInfo.cSvcAttrValueInfoList : null;

    formItems.forEach( ( item, index ) => {
      let o = null;

      switch ( item.cAttrMetadataInfo.metadataModule ) {
        case 10:
          o = this.getInput( item, index, packageDetails, popName );
          break;
        case 20:
          o = this.getSelect( item, index, packageDetails, popName );
          break;
        case 30:
          o = this.getRadio( item, index, packageDetails, popName );
          break;
        case 40:
          o = this.getCheckbox( item, index, packageDetails, popName );
          break;
        case 50:
          if ( moduleType ) {
            if ( moduleType === 10 ) {
              o = this.getMonthSlider( item, index, packageDetails, popName );
            } else if( moduleType === 20 ){
              o = this.getQualitySlider( item, index, packageDetails, popName );
            }
          } else {
            o = this.getSlider( item, index, packageDetails, popName );
          }
          break;
      }
      result.push( o );
    } );

    return result;
  }
}

ServiceApply.contextTypes = { router: PropTypes.object.isRequired };

export { ServiceApply };
export default ServiceApply;
