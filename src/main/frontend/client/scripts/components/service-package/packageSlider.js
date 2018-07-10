/**
 * Created by renxuanwei on 2018/1/16.
 */
import React, { Component } from 'react';

import { Row, Col, Form, FormItem, Input, Label, Slider, Icon, Checkbox } from 'epm-ui';


class PackageSlider extends Component {

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
    this.props.handleGetSliderVal( this.getValue() );
  }

  formGetter( getter ) {
    this.getValue = getter.value;
  }

  formChange( formData ) {
    this.props.handleGetSliderVal( formData );
  }

  render() {
    let item = this.props.dataSource;
    let index = this.props.index;
    let packageData = this.props.packageData;
    return (
      <Form
        type="horizontal"
        getter={ this.formGetter }
        onChange = { this.formChange }
      >
        <Row key={ index }>
          <Col size={ 1 }>
            <FormItem>
              <Checkbox style={ { float: 'left' } } name={ `cSvcAttrValueInfoList[${ index }].detailFixed` } value={ 1 } checked={ packageData ? ( packageData.detailFixed === '1' || packageData.detailFixed === 1 ) : null } />
            </FormItem>
          </Col>
          <Col size={ 16 } style={ { paddingLeft: '0' } }>
            <FormItem required={ item.cAttrMetadataInfo.metadataIsRequired } style={ { backgroundColor: '#eee' } }>
              <Label style={ { width: '25%', wordBreakWrap: 'break-word' } }>{ item.attrName }</Label>
              <div className="epm field" style={ { paddingTop: '10px' } }>
                <Slider style={ { width: '73%' } } name={ `cSvcAttrValueInfoList[${ index }].valueObject` } value={  this.state.slData > -1 ? this.state.slData : packageData ? parseInt( packageData.valueObject ) : 0 } defaultValue={ this.state.slData > -1 ? this.state.slData : packageData ? parseInt( packageData.valueObject ) : 0 } max={ 100 } step={ 1 } min={ 0 } onChange={ this.handleSliderChange.bind( this ) } />
              </div>
            </FormItem>
          </Col>
          <Col size={ 5 } style={ { paddingLeft: '0' } }>
            <FormItem>
              <Input style={ { display: 'table-cell' } } name={ `cSvcAttrValueInfoList[${ index }].valueObject` } value={ `${ this.state.slData > -1 ? this.state.slData : packageData ? parseInt( packageData.valueObject ) : 0 }` } onChange={ this.handleValueChange.bind( this ) }>
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
                <Input name={ `cSvcAttrValueInfoList[${ index }].attrId` } value={ item.attrId } />
              </FormItem>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export { PackageSlider };
export default PackageSlider;
