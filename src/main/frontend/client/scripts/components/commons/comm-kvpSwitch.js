import React, { Component } from 'react';

import { Icon, Button, Label, Input, Checkbox, FormItem, Tabs, Tab, Column, Table, Dialog } from 'epm-ui';

/**
 *@author sshuzhong
 *@mailTo <a href="mailto:songshuzhong@bonc.com.cn">Song ShuZhong</a>
 *@Date 2017/12/18.
 *@desc Comm_kvpSwitch
 */
class KvpSwitch extends Component {
  /**
   *
   * @param props
   */
  constructor( props ) {
    super( props );
    this.state = {
      dynamicAttributes: props.initInfo || [],
      currentTab: 1
    };

    this.handleAddAttribute = this.handleAddAttribute.bind( this );
    this.handleTabsSwitch = this.handleTabsSwitch.bind( this );
    this.hanleSortAttr = this.hanleSortAttr.bind( this );
  }

  componentWillMount() {
    let { dynamicAttributes } = this.state;

    try {
      dynamicAttributes = JSON.parse( this.state.dynamicAttributes );

      if ( dynamicAttributes instanceof Array ) {
        dynamicAttributes[ 0 ].checked = true;
        this.setState( { dynamicAttributes, currentTab: 0 } );
      } else
        this.setState( { dynamicAttributes, currentTab: 1 } );
    } catch ( e ) {
      this.setState( { dynamicAttributes, currentTab: 1 } );
    }
  }

  componentDidMount() {
    this.props.getter( this.state.dynamicAttributes );
  }

  /**
   *
   * @param index
   * @param title
   */
  handleTabsSwitch( index, title ) {
    let nextDynamicAttr = this.state.dynamicAttributes;

    this.setState( { currentTab: index, dynamicAttributes: nextDynamicAttr } );
  }

  handleAddAttribute() {
    let nextAttr = {};
    let nextDynamicAttr = this.state.dynamicAttributes;

    nextDynamicAttr.push( nextAttr );
    this.setState( { dynamicAttributes: nextDynamicAttr } );
  }

  /**
   *
   * @param index
   */
  handleDeleAttribute( index ) {
    let nextDynamicAttr = this.state.dynamicAttributes;

    nextDynamicAttr.splice( index, 1 );
    this.setState( { dynamicAttributes: nextDynamicAttr }, () => this.props.getter( this.state.dynamicAttributes ) );
  }

  /**
   *
   * @param index
   * @param type
   * @param value
   */
  handleAttributeChange( index, type, value ) {
    let nextDynamicAttr = this.state.dynamicAttributes;

    if ( type === 'byhands' ) {
      nextDynamicAttr = value;
    }

    if ( type === 'key' ) {
      nextDynamicAttr[ index ][ value ] = '';
      let o = nextDynamicAttr[ index ];
      if ( o.hasOwnProperty( 'ph' ) ) {
        o[ value ] = o.ph;
        delete o.ph;
      } else {
        o[ value ] = '';
      }
    }

    if ( type === 'value' ) {
      let o = Object.keys( nextDynamicAttr[ index ] );
      
      if ( o.length > 0 ) {
        nextDynamicAttr[ index ][ o[ 0 ] ] = value;
      } else {
        nextDynamicAttr[ index ] = { 'ph': value };
      }
    }

    delete nextDynamicAttr[ 0 ].checked;
    this.setState( { dynamicAttributes: nextDynamicAttr }, () => this.props.getter( nextDynamicAttr ) );
  }

  handleKvpGetter( index, type ) {
    let kvp = '';
    let o = this.state.dynamicAttributes[ index ];

    if ( o ) {

      for ( let name in o ) {
        if ( name !== 'checked' ) {
          kvp = name;
        }
      }

      if ( type === 'value' )
        return <Input value={ o[ kvp ] } onChange={ this.handleAttributeChange.bind( this, index, 'value' ) } />;

      return <Input value={ kvp } onChange={ this.handleAttributeChange.bind( this, index, 'key' ) } />;
    }
  }

  hanleSortAttr( data, currentData ) {
    if ( currentData ) {
      let nextDynamicAttr = this.state.dynamicAttributes;

      let temp = nextDynamicAttr[ 0 ];
      nextDynamicAttr[ 0 ] = nextDynamicAttr[ currentData.rowkey ];
      nextDynamicAttr[ currentData.rowkey ] = temp;

      for ( let i = 0; i < nextDynamicAttr.length; i++ ) {
        if ( nextDynamicAttr[ i ].hasOwnProperty( 'checked' ) ) {
          delete nextDynamicAttr[ i ].checked;
        }
      }

      nextDynamicAttr[ 0 ].checked = true;
      this.setState( { nextDynamicAttr }, () => this.props.getter( nextDynamicAttr ) );
    }
  }

  /**
   *
   * @returns {XML}
   */
  render() {
    let { dynamicAttributes, currentTab } = this.state;

    return (
      <Tabs onClick={ this.handleTabsSwitch } currentTab={ currentTab }>
        <Tab title="手动输入">
          <Table dataSource={ dynamicAttributes instanceof Array? dynamicAttributes: []} textAlign="center" bgColor={ { head: '#ecf5fe' } } checkable singleSelection bordered={ false } headMenu={ true }
                 onCheck={ this.hanleSortAttr }>
            <Column title="键值">
              {
                ( rowData, index ) => this.handleKvpGetter( index, 'key' )
              }
            </Column>
            <Column title="显示项">
              {
                ( rowData, index ) => this.handleKvpGetter( index, 'value' )
              }
            </Column>
            <Column title="删除">
              {
                ( rowData, index ) => <Button shape="icon" type="link" onClick={ this.handleDeleAttribute.bind( this, index ) }><Icon icon="trash" /></Button>
              }
            </Column>
          </Table>
          <Button type="info" block onClick={ this.handleAddAttribute }>添加参数</Button>
        </Tab>
        <Tab title="URL">
          <FormItem>
            <Label>请输入初始值地址</Label>
            <Input value={ this.state.dynamicAttributes } onChange={ this.handleAttributeChange.bind( this, '', 'byhands' ) } />
          </FormItem>
        </Tab>
      </Tabs>
    );
  }

}

export { KvpSwitch };
export default KvpSwitch;
