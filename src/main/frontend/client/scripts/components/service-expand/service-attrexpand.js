import  React, { Component } from 'react';

import { FormItem, Input, Label, Checkbox, Table, Column, Button, Icon, Tabs, Tab  } from 'epm-ui';

import uuid from '../../utilities/uuid';

/**
 *@author renxuanwei
 *@mailTo <a href="mailto:renxuanwei@bonc.com.cn">renxuanwei</a>
 *@Date 2017/12/25.
 *@desc
 */
class ServiceExpandAttr extends Component {

  constructor() {
    super();
    this.state = {
      dynamicAttributes: [],
      currentTab: 0,
      url: ''
    };

    this.handleAddAttribute = this.handleAddAttribute.bind( this );
    this.handleUrlChange = this.handleUrlChange.bind( this );
  }

  componentDidMount() {
    let initValue = this.props.initValue;

    if ( initValue ) {
      let initType = this.props.initType;

      if ( initType === 10 ) {
        let initValueArray = initValue.substring( initValue.indexOf( '[' ) + 1, initValue.indexOf( ']' ) ).split( ',' );
        if ( initValueArray.length > 0 ) {
          let arr = [];

          for ( let i = 0; i < initValueArray.length; i++ ) {
            let val = JSON.parse( initValueArray[ i ] );
            let key = Object.keys( JSON.parse( initValueArray[ i ] ) )[ 0 ];
            if( i === 0 ) {
              arr.push( {
                'isInit': 'yes',
                'initKey': key,
                'initValue': val[key]
              } );
            } else {
              arr.push( {
                'isInit': 'no',
                'initKey': key,
                'initValue': val[key]
              } );
            }
          }
          this.setState( { dynamicAttributes: arr, currentTab: 0 }, this.rebuildAttr( arr ) );
        }
      } else if ( initType === 20 ) {
        this.setState( { url: initValue, currentTab: 1 }, this.handleUrlChange( initValue ) );
      }
    } else {
      this.setState( { dynamicAttributes: [], currentTab: 0, url: '' } );
    }
  }

  componentDidUpdate( prevProps, prevState ) {

  }

  rebuildAttr( attributes ) {
    let result = [];
    let firstInint = null;
    for ( let i = 0; i < attributes.length; i++ ) {
        if ( attributes[ i ].isInit === 'yes' ) {
          firstInint = attributes[i];
        } else {
          let obj = {};
          obj[ `${ attributes[ i ].initKey }` ] = attributes[ i ].initValue;
          result.push( JSON.stringify( obj ) );
        }
    }

    if( firstInint ) {
      let obj = {};
      obj[ `${ firstInint.initKey }` ] = firstInint.initValue;
      result.unshift( JSON.stringify( obj ) );
    }

    this[ 'initType' ] = 10;
    this[ 'expandAttr' ] = `[${ result }]`;
    if ( result.length > 0 ) {
      this[ 'isInit' ] = true;
    } else {
      this[ 'isInit' ] = false;
    }
    this.props.handleGetValue( this[ 'expandAttr' ], this[ 'initType' ], this[ 'isInit' ] );
  }

  handleAttributeChange( index, dataIndex, value ) {

    let attributes = this.state.dynamicAttributes;

    attributes[index][dataIndex] = value;
    if ( dataIndex === 'isInit' ) {
      attributes.forEach( ( item, index ) => {
        item.isInit = 'no'
      } );
      if ( value === 'yes' ) {
        attributes[ index ][ dataIndex ] = 'no';
      } else if( value === 'no' ) {
        attributes[ index ][ dataIndex ] = 'yes';
      }
      this.setState( { dynamicAttributes: attributes }, this.rebuildAttr( attributes ) );
    } else {
      this.rebuildAttr( attributes );
    }
  }

  handleAddAttribute( ) {
    let attributes = this.state.dynamicAttributes;

    let newAttr = {
      'isInit': 'no',
      'initKey': '',
      'initValue': ''
    };

    attributes.push( newAttr );
    this.setState( { attributes } );
  }

  handleUrlChange( value ) {
    this[ 'initType' ] = 20;
    this[ 'expandAttr' ] = value;
    if ( value.length > 0 ) {
      this[ 'isInit' ] = true;
    } else {
      this[ 'isInit' ] = false;
    }
    this.props.handleGetValue( this[ 'expandAttr' ], this[ 'initType' ], this[ 'isInit' ] );
  }

  handleDeleAttribute( index ) {
    let attributes = this.state.dynamicAttributes;

    attributes.splice( index, 1 );

    this.setState( { dynamicAttributes: attributes }, this.rebuildAttr( attributes ) );
  }

  render() {
    return (
      <div>
        <Tabs currentTab={ this.state.currentTab }>
          <Tab title="手动输入">
            <Table dataSource={ this.state.dynamicAttributes } textAlign="center" bgColor={ { head: '#ecf5fe' } } bordered={ false } singleSelection={ true }>
              <Column title="默认项" dataIndex="isInit">
                {
                  ( value, index ) => <Checkbox key={ uuid() } checked={ value === 'yes' } value={ value } onChange={ this.handleAttributeChange.bind( this, index, 'isInit', value ) } />
                }
              </Column>
              <Column title="键值" dataIndex="initKey">
                {
                  ( value, index ) => <Input key={ uuid() } value={ value } onChange={ this.handleAttributeChange.bind( this, index, 'initKey' ) } />
                }
              </Column>
              <Column title="显示项" dataIndex="initValue">
                {
                  ( value, index ) => <Input key={ uuid() } value={ value } onChange={ this.handleAttributeChange.bind( this, index, 'initValue' ) } />
                }
              </Column>
              <Column title="删除" dataIndex="" >
                {
                  ( value, index ) => <Button key={ uuid() } shape="icon" type="link" onClick={ this.handleDeleAttribute.bind( this, index ) }><Icon icon="trash" /></Button>
                }
              </Column>
            </Table>
            <Button type="info" block onClick={ this.handleAddAttribute }>添加参数</Button>
          </Tab>
          <Tab title="输入地址">
            <FormItem>
              <Label>请输入初始值地址</Label>
              <Input key={ uuid() } onChange={ this.handleUrlChange } value={ this.state.url } />
            </FormItem>
          </Tab>
        </Tabs>
      </div>
    );
  }

}

export { ServiceExpandAttr };
export default ServiceExpandAttr;
