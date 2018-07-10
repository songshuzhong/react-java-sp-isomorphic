import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Button } from 'epm-ui';

import getUUID from '../../utilities/uuid';
import { getDataSource } from '../../utilities/dataSource';

import context from 'context';

/**
 *author: wangxiang
 *desc:  服务介绍-服务详情部分-套餐部分
 *date:  2018/1/9
 */
class ServicePackageInfo extends Component {

  constructor( props ) {
    super( props );

    this.state = {
      svcId: props.svcId,
      svcCode: props.svcCode,
      array: [],
      data:[]
    };

    this.lastIndex = 0;
    this.formData = this.formData.bind( this );
    this.getPackageData = this.getPackageData.bind( this );
  }

  componentDidMount() {
    this.getPackageData();
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.svcId !== this.props.svcId ) {
      this.lastIndex = 0;
      this.setState( { svcId: nextProps.svcId, svcCode: nextProps.svcCode }, this.getPackageData );
    }
  }

  getPackageData() {
    getDataSource( `${ context.contextPath }/v1/services/${ this.state.svcId }/package`, ( data ) => {
      this.setState( { data }, this.formData );
    } );
  }

  handleClick( type ) {
    const data = this.state.data;
    let array = [];

    if ( this.lastIndex >= 3 && this.lastIndex < data.length ) {

      if ( 1 === type ) {
        if ( this.lastIndex < data.length - 1 ) {
          this.lastIndex += 1;
        }
      } else {
        if ( this.lastIndex > 3 ) {
          this.lastIndex -= 1;
        }
      }

      if ( data ) {
        for ( let i = this.lastIndex - 3; i < this.lastIndex + 1; i++ ) {
          let arr = {};
          arr.index = i;
          arr.data = data[ i ];
          array.push( arr );
        }

        this.setState( { array } );
      }
    }
  }

  formData() {
    let array = [];
    let dataArray = [];
    const data = this.state.data;

    if ( data ) {
      for ( let v of data ) {
        if ( Number( v.packageState ) === 20 ) { //如果套餐状态是发布
          dataArray.push( v );
        }
      }

      const len = dataArray.length;

      for ( let i = 0; i < ( len < 4 ? len : 4); i++ ) {
        let arr = {};
        arr.index = i;
        arr.data = dataArray[ i ];
        array.push( arr );
      }

      this.setState( { array, len } );
    }
  }

  handleGoPackage( svcId, packageId ) {
    this.context.router.history.push( `/portal/service-apply/${ svcId }/${ packageId }` );
  }

  render() {

    return (
      <Row className="service package info" style={ { height: '140px' } }>
        <Col size={ 1 } style={ { paddingRight: '0', height: '100%' } }>
          {
            this.state.len && this.state.len > 4 ?
              <div style={ { height: '100%', width: '30px', backgroundColor: 'white', textAlign: 'center', float: 'right', paddingTop: '55px', cursor: 'pointer' } } onClick={ this.handleClick.bind( this, 0 ) } >
                <span style={ { fontSize: '20px', fontWeight: 700 } } >&lt;</span>
              </div> : null
          }
        </Col>
        <Col size={ 22 } style={ { padding: '0', height: '100%' } } >
          <Row style={ { height: '100%' } }>
            {
              this.state.array.length > 0 ? this.state.array.map( ( item, index ) => {

                if ( index === this.state.array.length - 1) {
                  this.lastIndex = item.index;
                }

                return (
                  <Col size={ 6 } key={ getUUID() } style={ { height: '100%' } }>
                    <div className="pack-item" >
                      <div className="title" style={ { padding: '28px 0'} }>
                        { item.data.packageName }
                      </div>
                       <Button type="primary" size="medium" onClick={ this.handleGoPackage.bind( this, item.data.svcId, item.data.packageId ) } style={ { marginBottom: '5px' } } >立即申请</Button>
                    </div>
                  </Col>
                );
              } ) : <div>没有套餐信息</div>
            }
          </Row>
        </Col>
        <Col size={ 1 } style={ { paddingLeft: '0', height: '100%' } }>
          {
            this.state.len && this.state.len > 4 ?
              <div style={ { height: '100%', width: '30px', backgroundColor: 'white', textAlign: 'center', paddingTop: '55px', cursor: 'pointer' } } onClick={ this.handleClick.bind( this, 1 ) } >
                <span style={ { fontSize: '20px', fontWeight: 700 } } >&gt;</span>
              </div> : null
          }
        </Col>
      </Row>
    );
  }
}

ServicePackageInfo.contextTypes = { router: PropTypes.object.isRequired };

export { ServicePackageInfo };
export default ServicePackageInfo;
