import React, { Component } from 'react';

import { Icon, Button, Column, Table } from 'epm-ui';

import { formItemConvert, basicTypeConvert, attrCustomConvert } from '../../components/commons/dynamicConvert';
import { unique } from '../../utilities/object';

/**
 *@author sshuzhong
 *@mailTo <a href="mailto:songshuzhong@bonc.com.cn">Song ShuZhong</a>
 *@Date 2017/12/18
 *@desc 新增服务-属性配置
 */
class AttrOperationTable extends Component {
  /**
   *
   * @param props
   */
  constructor( props ) {
    super( props );
    this.state = {
      dataSource: this.props.dataSource,
      modalFormIndex: this.props.modalFormIndex
    };
  }

  /**
   *
   * @param nextProps
   */
  componentWillReceiveProps( nextProps ) {
    this.setState( { dataSource: nextProps.dataSource, modalFormIndex: nextProps.modalFormIndex } );
  }

  /**
   *
   * @param modalFormData
   * @param modalFormIndex
   */
  handleDelete( modalFormIndex ) {
    this.props.onAttrTableDelete( modalFormIndex );
  }

  /**
   *
   * @param modalFormData
   * @param modalFormIndex
   */
  handleEdit( modalFormIndex ) {
    this.props.onAttrTableEdit( modalFormIndex );
  }

  getterRowDataKey( rowData ) {
    let keys = Object.keys( rowData );

    let key = keys.filter( ( key ) => { if ( key.indexOf( 'attrCode' ) >= 0 ) return key; } );

    return key[ 0 ].replace( 'cAttrFormInfoList[', '' ).replace( '].attrCode', '' );
  }

  formatCustomAttrType( dataSource ) {
/*    dataSource = dataSource.map( ( data ) => {
      let key = this.getterRowDataKey( data );
      let customAttrType = data[ `cAttrFormInfoList[${ key }].customAttrType` ];
      if ( customAttrType.includes( 40 ) ) {
        let index = customAttrType.indexOf( 40 );
        customAttrType.splice( index, 1 );
        customAttrType.push( 20 );
        data[ `cAttrFormInfoList[${ key }].customAttrType` ] = unique( customAttrType );
      }

      return data;
    } );*/

    return dataSource;
  }
  /**
   *
   * @returns {XML}
   */
  render() {
    let { dataSource } = this.state;

    dataSource = this.formatCustomAttrType( dataSource );
    return (
      <Table dataSource={ dataSource } headMenu={ true } textAlign="center" bgColor={ { head: '#ecf5fe' } } headBolder={ true } striped={ true }>
        <Column title="属性名" textAlign="left">
          {
            ( rowData, key ) => {
              let index = this.getterRowDataKey( rowData );

              return rowData[ `cAttrFormInfoList[${ index }].attrName` ];
            }
          }
        </Column>
        <Column title="属性英文名" textAlign="left">
          {
            ( rowData, key ) => {
              let index = this.getterRowDataKey( rowData );

              return rowData[ `cAttrFormInfoList[${ index }].attrEnname` ];
            }
          }
        </Column>
        <Column title="属性类型">
          {
            ( rowData, key ) => {
              let index = this.getterRowDataKey( rowData );

              return formItemConvert( rowData[ `cAttrFormInfoList[${ index }].metadataModule` ] );
            }
          }
        </Column>
        <Column title="控件类型">
          {
            ( rowData, key ) => {
              let index = this.getterRowDataKey( rowData );

              return basicTypeConvert( rowData[ `cAttrFormInfoList[${ index }].metadataDataType` ] );
            }
          }
        </Column>
        <Column title="检验规则">
          {
            ( rowData, key ) => {
              let index = this.getterRowDataKey( rowData );

              return rowData[ `cAttrFormInfoList[${ index }].validateRole` ];
            }
          }
        </Column>
        <Column title="属性描述">
          {
            ( rowData, key ) => {
              let index = this.getterRowDataKey( rowData );

              return rowData[ `cAttrFormInfoList[${ index }].attrDesc` ];
            }
          }
        </Column>
        <Column title="属性标签">
          {
            ( rowData, key ) => {
              let index = this.getterRowDataKey( rowData );
              return attrCustomConvert( rowData[ `cAttrFormInfoList[${ index }].customAttrType` ] );
            }
          }
        </Column>
        <Column title="操作" dataIndex="">
          {
            ( rowData, key ) => [
              <Button key={ key } shape="icon" type="link" onClick={ this.handleEdit.bind( this, key ) }><Icon icon="edit" /></Button>,
              <Button key={ key } shape="icon" type="link" onClick={ this.handleDelete.bind( this, key ) }><Icon icon="trash" /></Button>
            ]
          }
        </Column>
      </Table>
    );
  }
}

export { AttrOperationTable };
