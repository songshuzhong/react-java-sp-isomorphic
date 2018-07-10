import React, { Component } from 'react';

import { Col, Row } from 'epm-ui';

import ServicePanelContent from './service-panel-content';

import { getDataSource } from '../../utilities/dataSource';
import getUUID from '../../utilities/uuid';

/**
 *author: wangxiang
 *desc:  门户-服务信息面板
 *date:  2018/1/5
 */
class ServicePanel extends Component {

  constructor( props ) {
    super( props );

    this.state = { dataSource: this.props.dataSource, row: 0, data: [] };
  }

  componentDidMount() {
    getDataSource( this.state.dataSource, ( data ) => {
      this.setState( { data } );
    } );
  }

  handleClickTitle( cataId, index, serviceInfoList ) {
    if ( this.state.cataId !== cataId ) {
      this.setState( { cataId } );
    }

    if ( this.state.row !== index ) {
      this.setState( { row: index } );
    }

    if ( this.state.serviceInfoList !== serviceInfoList ) {
      this.setState( { serviceInfoList: serviceInfoList } );
    }
  }

  render() {
    let array = [];
    let cataId = 1;
    let serviceInfoList = [];

    // 对服务类别相关数据进行处理
    if ( this.state.data ) {
      const len = this.state.data.length;
      let rowNum = len / 6;

      for ( let i = 0; i < rowNum; i++ ) {
        let array1 = [];

        for ( let j = 0; j < len; j++ ) {

          if ( j >= 6 * i && j < 6 * ( i + 1 ) ) {
            array1.push( this.state.data[ j ] );
          }
        }

        array.push( array1 );
      }
    }

    return (
      <Row className="portal service panel" style={ { margin: 0 } }>
        <Col size={ 24 }>
          {
            array.length > 0 ? array.map( ( item, index ) => {

              return (
                <div key={ getUUID() }>
                  <Row className="click-title" style={ { margin: 0 } }>

                    {
                      item.length > 0 ? item.map( ( item1, index1 ) => {

                        if ( index === 0 && index1 === 0 ) {
                          cataId = item1.cataId;
                          serviceInfoList = item1.serviceInfoList;
                        }

                        return (
                          <Col size={ 4 } key={ getUUID() }>
                            <div className="item" style={ { backgroundColor: ( !this.state.cataId && cataId === item1.cataId ) || this.state.cataId === item1.cataId ? '#7EB9FF' : '#4799FD' } } onClick={ this.handleClickTitle.bind( this, item1.cataId, index, item1.serviceInfoList ) } >
                              <span className="title" onClick={ this.handleClickTitle.bind( this, item1.cataId, index, item1.serviceInfoList ) } >{ item1.cataName }</span>
                            </div>
                            <div style={ { width: '100%', height: '10px', backgroundColor: '#F5F5F5' } } >&nbsp;</div>
                          </Col>
                        );
                      } ) : null
                    }
                  </Row>
                  <Row style={ { margin: 0 } }>
                    <Col size={ 24 }>
                      <ServicePanelContent data={ this.state.serviceInfoList ? this.state.serviceInfoList : serviceInfoList } hidenStyle={ this.state.row === index ? 'block' : 'none' } />
                    </Col>
                  </Row>
                </div>
              );
            } ) : null
          }
        </Col>
      </Row>
    );
  }
}

export { ServicePanel };
export default ServicePanel;
