import React, { Component } from 'react';

import { Icon, Button, Label, Checkbox, Tabs, Tab, Input, Column, Table, FormItem } from 'epm-ui';

import getUUID from '../../utilities/uuid';

/**
 *ceshi
 */
class CommInitialValue extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      initInfo: props.initInfo,
      visible: false,
      dynamicAttributes: [ { order: 0 } ],
      num: 0
    };

    this.getValueObject = this.getValueObject.bind( this );
    this.handleAddAttribute = this.handleAddAttribute.bind( this );
    this.handleTabsSwitch = this.handleTabsSwitch.bind( this );
  }

  componentDidMount() {
    this.getValueObject( '' );
  }

  componentWillReceiveProps( nextProps ) {
    const valueObject = nextProps.initInfo ? nextProps.initInfo.valueObject : '';
    const thisValueObject = this.props.initInfo ? this.props.initInfo.valueObject : '';

    if ( valueObject !== thisValueObject ) {
      this.getValueObject( nextProps.initInfo );
    }
  }

  shouldComponentUpdate( nextProps, nextState ) {
   // console.log("shouldComponentUpdate......................")

    if ( nextState.num === 0 ) {
      return true;
    } else {
      return false;
    }

  }

  getValueObject( initInfo ) {
    // console.log("getValueObject--------------------------------------");

    let initInfoObject = this.state.initInfo;

    if ( initInfo !== '' ) {
      initInfoObject = initInfo;
    }

    if ( initInfoObject && initInfoObject !== '' && initInfoObject !== null ) {

      const initType = initInfoObject.initType;
      const valueObject = initInfoObject.valueObject;

      if ( valueObject !== '' ) {
        let array = [ { order: 0 } ];

        if ( initType === 10 ) {
          const jsonObject = JSON.parse( valueObject );
          let index = 0;

          for ( let v of [ ...jsonObject ] ) {

            for ( let key in v ) {
              const json = { order: index, keyData: key, valueData: v[ key ] };

              if ( index === 0 ) {
                json.checkNum = 10;
              }

              array[ index ] = json;
              index += 1;
            }
          }

          if ( initInfo !== '' ) {
            this.setState( { dynamicAttributes: array, initType, num: 0 } );
          } else {
            this.setState( { dynamicAttributes: array, initType } );
          }
        } else if ( initType === 20 ) {
          if ( initInfo !== '' ) {
            this.setState( { dynamicAttributes: valueObject, initType, num: 0 } );
          } else {
            this.setState( { dynamicAttributes: valueObject, initType } );
          }
        }
      }
    } else {
      this.setState( { dynamicAttributes: [ { order: 0, keyData: null, valueData: null } ], initType: 10, num: 0 } );
    }
  }

  handleTabsSwitch( index, title ) {
    let nextDynamicAttr = this.state.dynamicAttributes;

    if ( title === 'URL' ) {
      nextDynamicAttr = '';
    } else {
      nextDynamicAttr = [ { order: 0 } ];
    }

    this.setState( { dynamicAttributes: nextDynamicAttr, num: 0 } );
  }

  handleAddAttribute() {
    let nextAttr = { order: this.state.dynamicAttributes.length };
    let nextDynamicAttr = this.state.dynamicAttributes;

    const obj = nextDynamicAttr.length !== 0 ? nextDynamicAttr[ nextDynamicAttr.length - 1 ] : null;

    if ( obj == null || ( obj.keyData && obj.keyData !== null && obj.keyData.trim() !== '' ) ) {
      nextDynamicAttr.push( nextAttr );

      this.setState( { dynamicAttributes: nextDynamicAttr, num: 0 } );
    }
  }

  handleDeleAttribute( index ) {
    let nextDynamicAttr = this.state.dynamicAttributes;

    nextDynamicAttr.splice( index, 1 );

    this.setState( { dynamicAttributes: nextDynamicAttr, num: 0 }, () => this.props.getter( this.state.dynamicAttributes ) );
  }

  handleAttributeChange( index, type, value ) {
    let nextDynamicAttr = this.state.dynamicAttributes;

    if ( type === 'byhands' ) {
      nextDynamicAttr = value;

      this.setState( { dynamicAttributes: nextDynamicAttr, num: 1 }, () => this.props.getter( this.state.dynamicAttributes ) );
    } else if ( type === 'checkNum' ) {
      let temp = 10;

      if ( !value ) {
        temp = 20;
      } else {
        const k = nextDynamicAttr[ index ][ 'keyData' ];

        //判断是否可以checked
        if ( k  && k !== null && k.trim() !== '' ) {
          nextDynamicAttr = this.handleUnChecked( index );
        } else {
          temp = 20;
          console.log('key值为空 不能选中');
        }
      }
      nextDynamicAttr[ index ][ type ] = temp;

      this.setState( { dynamicAttributes: nextDynamicAttr, num: 0 }, () => this.props.getter( this.state.dynamicAttributes ) );
    } else {
      nextDynamicAttr[ index ][ type ] = value;

      this.setState( { dynamicAttributes: nextDynamicAttr, num: 1 }, () => this.props.getter( this.state.dynamicAttributes ) );
    }
  }

  handleUnChecked( index ) {
    let nextDynamicAttr = this.state.dynamicAttributes;

    for ( let v of nextDynamicAttr ) {

      if ( v.order !== index ) {
        nextDynamicAttr[ v.order ][ 'checkNum' ] = 20;
      }

    }

    return nextDynamicAttr;
  }

  render() {

    return (
      <Tabs onClick={ this.handleTabsSwitch } currentTab={ this.state.initType && this.state.initType === 20 ? 1 : 0 }>
        <Tab title="手动输入">
          <Table dataSource={ this.state.dynamicAttributes } textAlign="center" bgColor={ { head: '#ecf5fe' } } bordered={ false } singleSelection={ true }>
            <Column title="默认项" dataIndex="checkNum">
              {
                ( value, index ) => <Checkbox key={ getUUID() } checked={ value === 10  ? true : false } onChange={ ( dataString ) => this.handleAttributeChange( index, 'checkNum', dataString ) } />
              }
            </Column>
            <Column title="键值" dataIndex="keyData">
              {
                ( value, index ) => <Input key={ getUUID() } value={ value } onChange={ this.handleAttributeChange.bind( this, index, 'keyData' ) } />
              }
            </Column>
            <Column title="显示项" dataIndex="valueData">
              {
                ( value, index ) => <Input key={ getUUID() } value={ value } onChange={ this.handleAttributeChange.bind( this, index, 'valueData' ) } />
              }
            </Column>
            <Column title="删除" dataIndex="" >
              {
                ( value, index ) => <Button key={ getUUID() } shape="icon" type="link" onClick={ this.handleDeleAttribute.bind( this, index ) }><Icon icon="trash" /></Button>
              }
            </Column>
          </Table>
          <Button type="info" block onClick={ this.handleAddAttribute }>添加参数</Button>
        </Tab>
        <Tab title="URL">
          <FormItem>
            <Label>请输入初始值地址</Label>
            <Input key={ getUUID() } value={ this.state.dynamicAttributes } onChange={ this.handleAttributeChange.bind( this, '', 'byhands' ) } />
          </FormItem>
        </Tab>
      </Tabs>
    );
  }

}

export { CommInitialValue };
export default CommInitialValue;
