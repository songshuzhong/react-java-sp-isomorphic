import React, { Component } from 'react';

import { Col, FormItem, Input, Button, Label, RadioGroup, Radio, Select, Checkbox, CheckboxGroup, Slider } from 'epm-ui';

import getInitArray from './getInitArray';

/**
 *@author sshuzhong
 *@mailTo <a href="mailto:songshuzhong@bonc.com.cn">Song ShuZhong</a>
 *@Date 2017/12/18
 *@desc 动态表单组件
 */
const getInput = ( item, index, formItem ) => {
  return (
    <Col key={ index } size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
      {
        formItem ?
          [
            <FormItem key="1" required={ item.cAttrInfo.cAttrMetadataInfo.metadataIsRequired } unvalidateMsg={ item.cAttrInfo.cAttrMetadataInfo.metadataIsValidate ? item.cAttrInfo.cAttrMetadataInfo.cAttrValidateInfo.validateTips : '您的输入不合法！' }>
              <Label>{ item.cAttrInfo.attrName }</Label>
              <Input name={ `cSvcAttrValueInfoList[${ index }].valueObject` } value={ item.valueObject } placeholder={ item.cAttrInfo.attrTips } pattern={ item.cAttrInfo.cAttrMetadataInfo.metadataIsValidate ? item.cAttrInfo.cAttrMetadataInfo.cAttrValidateInfo.validateRole : '' } />
            </FormItem>,
            <FormItem key="2" style={ { top: '-9999px', position: 'absolute' } }>
              <Input name={ `cSvcAttrValueInfoList[${ index }].attrId` } value={ item.cAttrInfo.cAttrMetadataInfo.attrId } />
            </FormItem>
          ]
          :
          [
            <p key="1" style={ { width: '70px', textAline: 'center', display: 'inline-block', margin: '7px 30px' } }>{ item.cAttrInfo.attrName }</p>,
            <p key="2" style={ { display: 'inline-block' } }>{ item.valueObject }</p>
          ]
      }
    </Col>
  );
};

const getSelect = ( item, index, formItem ) => {
  return (
    <Col key={ index } size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
      {
        formItem ?
          [
            <FormItem key="1" required={ item.cAttrInfo.cAttrMetadataInfo.metadataIsRequired } unvalidateMsg={ item.cAttrInfo.cAttrMetadataInfo.metadataIsValidate ? item.cAttrInfo.cAttrMetadataInfo.cAttrValidateInfo.validateTips : '您的输入不合法！' }>
              <Label>{ item.cAttrInfo.attrName }</Label>
              {
                item.cAttrInfo.cAttrMetadataInfo.metadataIsInit ?
                  item.cAttrInfo.cAttrMetadataInfo.cAttrInitInfo.initType == '10' ?
                    <Select dataSource={ getInitArray( item.cAttrInfo.cAttrMetadataInfo.cAttrInitInfo.valueObject ) } name={ `cSvcAttrValueInfoList[${ index }].valueObject` } value={ [ item.valueObject ] } placeholder={ item.cAttrInfo.attrTips } />
                    :
                    <Select name={ `cSvcAttrValueInfoList[${ index }].valueObject` } value={ [ item.valueObject ] } dataSource={ item.cAttrInfo.cAttrMetadataInfo.cAttrInitInfo.valueObject } placeholder={ item.cAttrInfo.attrTips } />
                  :
                  null
              }
            </FormItem>,
            <FormItem key="2" style={ { top: '-9999px', position: 'absolute' } }>
              <Input name={ `cSvcAttrValueInfoList[${ index }].attrId` } value={ item.cAttrInfo.cAttrMetadataInfo.attrId } />
            </FormItem>
          ]
          :
          [
            <p key="1" style={ { width: '70px', textAline: 'center', display: 'inline-block', margin: '7px 30px' } }>{ item.cAttrInfo.attrName }</p>,
            <p key="2" style={ { display: 'inline-block' } }>{ item.valueObject }</p>
          ]
      }
    </Col>
  );
};

const getRadio = ( item, index, formItem ) => {
  return (
    <Col key={ index } size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
      {
        formItem ?
          [
            <FormItem key="1" type="inline" required={ item.cAttrInfo.cAttrMetadataInfo.metadataIsRequired } unvalidateMsg={ item.cAttrInfo.cAttrMetadataInfo.metadataIsValidate ? item.cAttrInfo.cAttrMetadataInfo.cAttrValidateInfo.validateTips : '您的输入不合法！' }>
              <Label>{ item.cAttrInfo.attrName }</Label>
              <RadioGroup type="inline" style={ { display: 'inline' } } name={ `cSvcAttrValueInfoList[${ index }].valueObject` } value={ item.valueObject }>
                {
                  Object.keys( JSON.parse( item.cAttrInfo.cAttrMetadataInfo.cAttrInitInfo.valueObject ) ).map( ( obj, index ) => {
                    return <Radio key={ index } value={ obj }>{ obj }</Radio>;
                  } )
                }
              </RadioGroup>
            </FormItem>,
            <FormItem key="2" style={ { top: '-9999px', position: 'absolute' } }>
              <Input name={ `cSvcAttrValueInfoList[${ index }].attrId` } value={ item.cAttrInfo.cAttrMetadataInfo.attrId } />
            </FormItem>
          ]
          :
          [
            <p key="1" style={ { width: '70px', textAline: 'center', display: 'inline-block', margin: '7px 30px' } }>{ item.cAttrInfo.attrName }</p>,
            <p key="2" style={ { display: 'inline-block' } }>{ item.valueObject }</p>
          ]
      }
    </Col>
  );
};

const getCheckbox = ( item, index, formItem ) => {
  return (
    <Col key={ index } size={ { normal: 24, small: 24, medium: 24, large: 24 } }>
      {
        formItem ?
          [
            <FormItem key="1" type="inline" required={ item.cAttrInfo.cAttrMetadataInfo.metadataIsRequired } unvalidateMsg={ item.cAttrInfo.cAttrMetadataInfo.metadataIsValidate ? item.cAttrInfo.cAttrMetadataInfo.cAttrValidateInfo.validateTips : '您的输入不合法！' }>
              <Label>{ item.cAttrInfo.attrName }</Label>
              <CheckboxGroup type="inline" style={ { display: 'inline' } } name={ `cSvcAttrValueInfoList[${ index }].valueObject` } value={ item.valueObject }>
                {
                  Object.keys( JSON.parse( item.cAttrInfo.cAttrMetadataInfo.cAttrInitInfo.valueObject ) ).map( ( obj, index ) => {
                    return <Checkbox key={ index } value={ obj }>{ obj }</Checkbox>;
                  } )
                }
              </CheckboxGroup>
            </FormItem>,
            <FormItem key="2" style={ { top: '-9999px', position: 'absolute' } }>
              <Input name={ `cSvcAttrValueInfoList[${ index }].attrId` } value={ item.cAttrInfo.cAttrMetadataInfo.attrId } />
            </FormItem>
          ]
          :
          [
            <p key="1" style={ { width: '70px', textAline: 'center', display: 'inline-block', margin: '7px 30px' } }>{ item.cAttrInfo.attrName }</p>,
            <p key="2" style={ { display: 'inline-block' } }>{ item.valueObject }</p>
          ]
      }
    </Col>
  );
};

const getSlider = ( item, index, formItem ) => {
  return (
    <Col key={ index } size={ { normal: 24, small: 24, medium: 24, large: 24 } }>
      {
        formItem ?
          [
            <FormItem key="1" required={ item.cAttrInfo.cAttrMetadataInfo.metadataIsRequired } style={ { width: '100%' } }>
              <div style={ { display: 'flex', alignItems: 'center' } }>
                <Label>{ item.cAttrInfo.attrName }</Label>
                <div style={ { width: '100%' } }>
                  <Slider name={ `cSvcAttrValueInfoList[${ index }].valueObject` } defaultValue={ 7 } max={ 10 } step={ 1 } min={ 4 } boundary={ [ 6, 9 ] } />
                </div>
              </div>
            </FormItem>,
            <FormItem key="2" style={ { top: '-9999px', position: 'absolute' } }>
              <Input name={ `cSvcAttrValueInfoList[${ index }].attrId` } value={ item.cAttrInfo.cAttrMetadataInfo.attrId } />
            </FormItem>
          ]
          :
          [
            <p key="1" style={ { width: '70px', textAline: 'center', display: 'inline-block', margin: '7px 30px' } }>{ item.cAttrInfo.attrName }</p>,
            <p key="2" style={ { display: 'inline-block' } }>{ item.valueObject }</p>
          ]
      }
    </Col>
  );
};

const getButtons = ( item, index ) => {
  return (
    <Col key={ index } size={ { normal: 12, small: 12, medium: 12, large: 12 } }>
      <FormItem type="inline" required={ item.cAttrInfo.cAttrMetadataInfo.metadataIsRequired } name={ item.cAttrInfo.attrCode }>
        <Label>{ item.cAttrInfo.attrName }</Label>
        <Button type="primary" htmlType="submit">提交</Button>
      </FormItem>
      <FormItem style={ { top: '-9999px', position: 'absolute' } }>
        <Input name={ `cSvcAttrValueInfoList[${ index }].attrId` } value={ item.cAttrInfo.cAttrMetadataInfo.attrId } />
      </FormItem>
    </Col>
  );
};

const getDynamicForm = ( formItems, formItem = true ) => {
  const result = [];

  formItems.forEach( ( item, index ) => {
    let o = null;

    switch ( item.cAttrInfo.cAttrMetadataInfo.metadataModule ) {
      case 10:
        o = getInput( item, index, formItem );
        break;
      case 20:
        o = getSelect( item, index, formItem );
        break;
      case 30:
        o = getRadio( item, index, formItem );
        break;
      case 40:
        o = getCheckbox( item, index, formItem );
        break;
      case 50:
        o = getSlider( item, index, formItem );
        break;
      case 60:
        o = getButtons( item, index, formItem );
        break;
    }
    result.push( o );
  } );

  return result;
};

export { getDynamicForm };
export default getDynamicForm;
