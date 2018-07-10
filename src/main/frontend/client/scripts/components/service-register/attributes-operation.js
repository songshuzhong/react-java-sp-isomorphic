import React, { Component } from 'react';

import { Button, Label, Input, Select, Checkbox, CheckboxGroup, FormItem, Form, Modal, ModalHeader, ModalBody, Row, Col } from 'epm-ui';

import { KvpSwitch } from '../commons/comm-kvpSwitch';
import { ServiceExpandAttr } from '../service-expand/service-attrexpand';
import CommInitialValue from '../props-library/props-initial';

import { isEmpty } from '../../utilities/object';

import context from 'context';

/**
 *@author sshuzhong
 *@mailTo <a href="mailto:songshuzhong@bonc.com.cn">Song ShuZhong</a>
 *@Date 2017/12/18.
 *@desc
 */
class AttributesOperation extends Component {
  /**
   *
   * @param props
   */
  constructor( props ) {
    super( props );
    this.state = {
      kvpInitInfo: '',
      isHaveDefaultValue: false,
      formModalVisiable: this.props.formModalVisiable,
      modalFormData: this.props.modalFormData,
      modalFormIndex: this.props.modalFormIndex
    };

    this.handleAsyncSubmit = this.handleAsyncSubmit.bind( this );
    this.handleResetForm = this.handleResetForm.bind( this );
    this.handleKvpGetter = this.handleKvpGetter.bind( this );
    this.handleModalClose = this.handleModalClose.bind( this );
  }

  componentWillReceiveProps( nextProps ) {
    let { kvpInitInfo, modalFormIndex, isHaveDefaultValue } = this.state;

    if ( '20,40'.includes( nextProps.modalFormData[ `cAttrFormInfoList[${ nextProps.modalFormIndex }].metadataModule` ] + '' ) ) {
      isHaveDefaultValue = true;
    } else {
      isHaveDefaultValue = false;
    }

    kvpInitInfo = nextProps.modalFormData[ `cAttrFormInfoList[${ nextProps.modalFormIndex }].valueObject` ];

    this.setState( { ...nextProps, kvpInitInfo, isHaveDefaultValue } );
  }

  /**
   *
   * @param formData
   * @returns {boolean}
   */
  handleAsyncSubmit( formData ) {
    let { modalFormIndex, modalFormData, kvpInitInfo } = this.state;

    let valueObject = `cAttrFormInfoList[${ modalFormIndex }].valueObject`;
    let validateRole = `cAttrFormInfoList[${ modalFormIndex }].validateRole`;
    let metadataIsInit = `cAttrFormInfoList[${ modalFormIndex }].metadataIsInit`;
    let initType = `cAttrFormInfoList[${ modalFormIndex }].initType`;
    let metadataIsRequired = `cAttrFormInfoList[${ modalFormIndex }].metadataIsRequired`;
    let metadataIsValidate = `cAttrFormInfoList[${ modalFormIndex }].metadataIsValidate`;

    if ( kvpInitInfo && typeof kvpInitInfo !== 'string' ) {
      kvpInitInfo = JSON.stringify( kvpInitInfo );
      formData[ initType ] = 10;
    } else if ( typeof kvpInitInfo == 'string' ) {
      formData[ initType ] = 20;
    }

    formData[ valueObject ] = kvpInitInfo;

    if ( formData[ valueObject ] )
      formData[ metadataIsInit ] = true;
    else
      formData[ metadataIsInit ] = false;

    if ( formData[ metadataIsRequired ] )
      formData[ metadataIsRequired ] = true;
    else
      formData[ metadataIsRequired ] = false;

    if ( formData[ validateRole ] )
      formData[ metadataIsValidate ] = true;
    else
      formData[ metadataIsValidate ] = false;

    this.props.getter( formData, false, modalFormData ? true : false );

    return false;
  }

  handleEditSelectChange( selectValue ) {

    switch ( selectValue ) {
      case '10':
        this.setState( { isHaveDefaultValue: false } );
        break;
      case '20':
        this.setState( { isHaveDefaultValue: true } );
        break;
      case '30':
        this.setState( { isHaveDefaultValue: true } );
        break;
      case '40':
        this.setState( { isHaveDefaultValue: true } );
        break;
      case '50':
        this.setState( { isHaveDefaultValue: false } );
        break;
      default:
        return;
    }
  }

  handleModalClose() {
    this.props.onFormModalClose();
  }

  /**
   *
   * @param trigger
   */
  handleResetForm( trigger ) {
    this.reset = trigger.reset;
  }

  /**
   *
   * @param kvpGetter
   */
  handleKvpGetter( kvpInitInfo ) {
    this.setState( { kvpInitInfo } );
  }

  /**
   *
   * @returns {XML}
   */
  render() {
    let { modalFormData, modalFormIndex, kvpInitInfo, formModalVisiable, isHaveDefaultValue } = this.state;

    return (
      <div>
        {
          formModalVisiable ?
            <Modal onClose={ this.handleModalClose }>
              <ModalHeader>
                { isEmpty( modalFormData )? '添加属性': '编辑属性'}
              </ModalHeader>
              <ModalBody>
                <Form
                  method="post"
                  async={ true }
                  type="horizontal"
                  onSubmit={ this.handleAsyncSubmit }
                  trigger={ this.handleResetForm }
                >
                  <Row>
                    <Col size={ { normal: 16, small: 16, medium: 16, large: 16 } } style={ { textAlign: 'center' } }>
                      <FormItem name={ `cAttrFormInfoList[${ modalFormIndex }].attrName` }>
                        <Label>属性名</Label>
                        <Input value={ modalFormData ? modalFormData[ `cAttrFormInfoList[${ modalFormIndex }].attrName` ] : '' } />
                      </FormItem>
                      <FormItem name={ `cAttrFormInfoList[${ modalFormIndex }].attrCode` }>
                        <Label>属性编码</Label>
                        <Input value={ modalFormData ? modalFormData[ `cAttrFormInfoList[${ modalFormIndex }].attrCode` ] : '' } />
                      </FormItem>
                      <FormItem name={ `cAttrFormInfoList[${ modalFormIndex }].attrEnname` }>
                        <Label>属性英文名</Label>
                        <Input value={ modalFormData ? modalFormData[ `cAttrFormInfoList[${ modalFormIndex }].attrEnname` ] : '' } />
                      </FormItem>
                      <FormItem name={ `cAttrFormInfoList[${ modalFormIndex }].metadataDataType` }>
                        <Label>属性数据类型</Label>
                        <Select key={ 1 } dataSource={ `${ context.contextPath }/v1/dictcategorys/metadata_datatype/dictdetails/combobox` } value={ modalFormData ? [ modalFormData[ `cAttrFormInfoList[${ modalFormIndex }].metadataDataType` ] + '' ]: '' } />
                      </FormItem>
                      <FormItem name={ `cAttrFormInfoList[${ modalFormIndex }].metadataModule` }>
                        <Label>控件类型</Label>
                        <Select key={ 2  } dataSource={ `${ context.contextPath }/v1/dictcategorys/metadata_module/dictdetails/combobox` } value={ modalFormData ? [ modalFormData[ `cAttrFormInfoList[${ modalFormIndex }].metadataModule` ] + '' ] : '' } onChange={ this.handleEditSelectChange.bind( this ) } />
                      </FormItem>
                      <FormItem name={ `cAttrFormInfoList[${ modalFormIndex }].attrDesc` }>
                        <Label>属性描述</Label>
                        <Input value={ modalFormData ? modalFormData[ `cAttrFormInfoList[${ modalFormIndex }].attrDesc` ] : '' } />
                      </FormItem>
                      <FormItem name={ `cAttrFormInfoList[${ modalFormIndex }].validateRole` }>
                        <Label>校验规则</Label>
                        <Input value={ modalFormData ? modalFormData[ `cAttrFormInfoList[${ modalFormIndex }].validateRole` ] : '' } />
                      </FormItem>
                      <FormItem name={ `cAttrFormInfoList[${ modalFormIndex }].validateTips` }>
                        <Label>校验提示</Label>
                        <Input value={ modalFormData ? modalFormData[ `cAttrFormInfoList[${ modalFormIndex }].validateTips` ] : '' } />
                      </FormItem>
                    </Col>
                    <Col size={ { normal: 8, small: 8, medium: 8, large: 8 } }>
                      <FormItem type="horizontal" name={ `cAttrFormInfoList[${ modalFormIndex }].customAttrType` }>
                        <CheckboxGroup key="1" type="horizontal" style={ { display: 'grid' } } value={ modalFormData ? modalFormData[ `cAttrFormInfoList[${ modalFormIndex }].customAttrType` ] + '' : '' }>
                          <Checkbox key="10" value={ '10' }>申请属性</Checkbox>
                          <Checkbox key="30" value={ '30' }>访问属性</Checkbox>
                          { modalFormData && modalFormData[ `cAttrFormInfoList[${ modalFormIndex }].customAttrType` ] + ''.includes( '20' ) ? <Checkbox key="20" value={ '20' }>资源属性</Checkbox> : null }
                        </CheckboxGroup>
                      </FormItem>
                    </Col>
                  </Row>
                  { isHaveDefaultValue?
                    <Row>
                      <div style={ { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 80px' } }>
                        <Label>初始值</Label>
                        <KvpSwitch key="kvpSwitch" getter={ this.handleKvpGetter } initInfo={ kvpInitInfo } />
                      </div>
                    </Row>
                    : null
                  }
                  <Row>
                    <Col size={ { normal: 24, small: 24, medium: 24, large: 24 } } style={ { textAlign: 'center' } }>
                      <Button htmlType="submit">提交</Button>
                      <Button onClick={ () => { this.reset(); } }>重置</Button>
                    </Col>
                  </Row>
                </Form>
              </ModalBody>
            </Modal>
            :
            null
        }
      </div>
    );
  }

}

export { AttributesOperation };
