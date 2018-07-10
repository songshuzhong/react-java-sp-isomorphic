/**
 * Created by renxuanwei on 2018/1/16.
 */
import React, { Component } from 'react';

import { Row, Col, Form, FormItem, Input, Label, Slider, Icon, Checkbox } from 'epm-ui';


class QualitySlider extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      slData: this.props.packageData ? -1 : 0
    };

    this.formGetter = this.formGetter.bind( this );
    this.formChange = this.formChange.bind( this );
  }

  handleSliderChange( data ) {
    this.setState( { slData: data } );
  }

  handleNumUp( val ) {
    let num = 0;
    if( this.state.slData === -1 ) {
      num = val
    } else {
      num = this.state.slData;
    }

    if ( num < 100 ) {
      this.setState( { slData: ++num } );
    }
  }

  handleNumDown( val ) {
    let num = 0;
    if( this.state.slData === -1 ) {
      num = val
    } else {
      num = this.state.slData;
    }

    if ( num > 0 ) {
      this.setState( { slData: --num } );
    }
  }

  handleValueChange( data ) {
    if ( data === '' ) {
      data = 0;
    }
    this.setState( { slData: data } );
  }


  componentDidMount() {
    this.props.handleGetQuantitySilder( this.props.popName, this.getValue(), this.props.index );
  }

  formGetter( getter ) {
    this.getValue = getter.value;
  }

  formChange( formData ) {
    this.props.handleGetQuantitySilder( this.props.popName, formData, this.props.index );
  }

  render() {
    let item = this.props.dataSource;
    let index = this.props.index;
    let packageData = this.props.packageData;
    let popName = this.props.popName;
    const cChargeAttrValueInfo = item.cChargeAttrValueInfo;

    return (
      <Form
        type="horizontal"
        getter={ this.formGetter }
        onChange = { this.formChange }
      >
        <Col size={ 14 } style={ { paddingLeft: '0' } }>
          <FormItem required={ item.cAttrMetadataInfo.metadataIsRequired } readonly={ packageData ? ( packageData.detailFixed === '1' || packageData.detailFixed === 1 ) : false }>
            <Label style={ { marginRight: '10px' } }>{ item.attrName }</Label>
            <div className="epm field" style={ { paddingTop: '10px' } } >
              <Slider name={ `${ popName }[${ index }].valueObject${ item.attrName }` } value={  this.state.slData > -1 ? this.state.slData : packageData ? parseInt( packageData.valueObject ) : 0 } defaultValue={ this.state.slData > -1 ? this.state.slData : packageData ? parseInt( packageData.valueObject ) : 0 } max={ 100 } step={ 1 } min={ 0 } onChange={ this.handleSliderChange.bind( this ) } />
            </div>
          </FormItem>
        </Col>
        <Col size={ 5 } style={ { paddingLeft: '0' } }>
          <FormItem readonly={ packageData ? ( packageData.detailFixed === '1' || packageData.detailFixed === 1 ) : false }>
            <Input style={ { display: 'table-cell' } } name={ `${ popName }[${ index }].valueObject${ item.attrName }` } value={ `${ this.state.slData > -1 ? this.state.slData : packageData ? parseInt( packageData.valueObject ) : 0 }` } onChange={ this.handleValueChange.bind( this ) }>
              <Input.Right text={ item.cAttrMetadataInfo.metadataUnit }>
                <div className="btn">
                  <button className="epm medium button num-btn" type="button">
                    <span className="num-up" onClick={ this.handleNumUp.bind( this, parseInt( packageData ? packageData.valueObject : 0 ) ) }><Icon icon="sort-up" /></span>
                    <span className="num-down" onClick={ this.handleNumDown.bind( this, parseInt( packageData ? packageData.valueObject : 0 ) ) }><Icon icon="sort-down" /></span>
                  </button>
                </div>
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
            {
              cChargeAttrValueInfo ?
                <div>
                  <FormItem>
                    <Input name={ `${ popName }[${ index }].formItemChargePrice` } value={ cChargeAttrValueInfo.chargePrice } />
                  </FormItem>
                  <FormItem>
                    <Input name={ `${ popName }[${ index }].formItemChargeType` } value={ cChargeAttrValueInfo.chargeType } />
                  </FormItem>
                  <FormItem>
                    <Input name={ `${ popName }[${ index }].formItemChargeTimeType` } value={ cChargeAttrValueInfo.chargeTimeType } />
                  </FormItem>
                </div>
                : null
            }
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
            </Col> : null
        }
        {
          cChargeAttrValueInfo ?
            <Col size={ 4 } style={ { paddingLeft: '0' } }>
              <span>总价：</span><span className="totalItemPrice" id={ `totalItemPrice${ index }` } >0</span>元
            </Col> : null
        }
      </Form>
    );
  }
}

export { QualitySlider };
export default QualitySlider;
