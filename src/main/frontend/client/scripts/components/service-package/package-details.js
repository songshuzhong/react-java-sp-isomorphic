import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Button, Dialog, Icon, Notification } from 'epm-ui';

import { getDataSource } from '../../utilities/dataSource';
import { popup } from '../../utilities/transient';
import context from 'context';

class PackageDetail extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      svcId: props.match.params.svcId,
      packages: null,
      serviceDetails: null
    };
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.match.params.svcId !== this.props.svcId ) {
      this.setState( { svcId: nextProps.match.params.svcId } );
    }
  }

  componentDidMount() {
    this.fetchServicePackages();
    this.fetchServiceDetail();
  }

  // 获取服务套餐
  fetchServicePackages() {
    getDataSource( `${ context.contextPath }/v1/services/${ this.state.svcId }/package`, ( packages ) => {
      this.setState( { packages } );
    } );
  }

  // 获取服务详细信息
  fetchServiceDetail() {
    getDataSource( `${ context.contextPath }/v1/services/${ this.state.svcId }`, ( serviceDetails ) => {
      this.setState( { serviceDetails } );
    } );
  }

  handleEdit( packageId ) {
    let serviceId = this.state.svcId;

    this.context.router.history.push( { pathname: `/console-home/service-package-edit/${ serviceId }/${ packageId }` } );
  }

  handleDelete( after, packageId ) {
    getDataSource( {
      url: `${ context.contextPath }/v1/services/${ this.state.svcId }/package/${ packageId }`,
      params: { method: 'delete' }
    }, ( callback ) => {
      if ( callback.code === 204 ) {
        after( true );
        this.fetchServicePackages();
        popup( <Notification message={ callback.message } type='success' key={ Math.random().toString() } /> );
      } else {
        after( true );
        popup( <Notification message={ callback.message } type='error' key={ Math.random().toString() } /> );
      }
    } );
  }

  showDeleteDialog( packageId ) {
    popup( <Dialog
      title="删除确认"
      message="确认删除该套餐么？"
      type="confirm"
      icon="danger"
      approveBtnOnClick={ ( after ) => this.handleDelete( after, packageId ) }
    /> );
  }

  newPackage() {
    this.context.router.history.push( {
      pathname: `/console-home/service-package-add/${ this.state.svcId }`
    } );
  }

  goBack() {
    this.context.router.history.go( -1 );
  }

  render() {
    let packages = this.state.packages;
    let serviceDetails = this.state.serviceDetails;

    return (
      <div>
        <div style={ { padding: '2%' } }>
          <Row>
            <Col>
              <div className="package-title">
                <span className="go-back" onClick={ this.goBack.bind( this ) }><Icon icon="angle-left" /></span>
                <span className="blue-bar" />
                <span className="title">套餐</span>
                <Button type="primary" style={ { float: 'right' } } onClick={ this.newPackage.bind( this ) }>新增套餐</Button>
              </div>
            </Col>
          </Row>
          <div className="package-content">
            <div style={ { marginBottom: '15px' } }>
              <Row>
                <Col size={ 12 }>
                  <span className="my-label">服务名称：</span>
                  <span className="my-text">{ serviceDetails ? serviceDetails.cServiceInfo.svcName : '' }</span>
                </Col>
                <Col size={ 12 }>
                  <span className="my-label">服务版本：</span>
                  <span className="my-text">{ serviceDetails ? serviceDetails.cServiceInfo.svcVersion : '' }</span>
                </Col>
              </Row>
            </div>
            <div style={ { marginBottom: '15px' } }>
              <Row>
                <Col>
                  <span className="my-label">服务描述：</span>
                  <span className="my-text">{ serviceDetails ? serviceDetails.cServiceInfo.svcDesc : '' }</span>
                </Col>
              </Row>
            </div>
            <div style={ { marginBottom: '15px' } }>
              {
                packages ? packages.map( ( item, index ) => {
                  return (
                    <div className="package-item" key={ index }>
                      <Row>
                        <Col style={ { marginBottom: '10px' } }>
                          <span className="my-label" style={ { width: '50%', textAlign: 'left', paddingLeft: '15px' } }>{ item.packageName }</span>
                          <span className="my-state">{ item.packageState == 10 ? '暂存' : item.packageState == 20 ? '发布' : '' }</span>
                        </Col>
                      </Row>
                      <Row>
                        <Col style={ { marginBottom: '10px' } }>
                          <span className="my-label">套餐说明：</span>
                          <span className="my-text">{ item.packageDesc }</span>
                        </Col>
                      </Row>
                      <Row>
                        <Col style={ { marginBottom: '10px' } }>
                          <span className="my-label">订购方式：</span>
                          <span className="my-text">
                            {
                              item.waysTypes ? item.waysTypes.map( ( item, index ) => {
                                switch ( item ) {
                                  case 10:
                                    return ( <span key={ index } className="rpk-text">审批</span> );
                                  case 20:
                                    return ( <span key={ index } className="rpk-text">付费</span> );
                                  case 30:
                                    return ( <span key={ index } className="rpk-text">自动开通</span> );
                                  default:
                                    return '';
                                }
                              } ) : null
                            }
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col style={ { marginBottom: '10px' } }>
                          <span className="my-label">控制方式：</span>
                          <span className="my-text">
                            {
                              item.modelTypes ? item.modelTypes.map( ( item, index ) => {
                                switch ( item ) {
                                  case 10:
                                    return ( <span key={ index } className="rpk-text">按时间</span> );
                                  case 20:
                                    return ( <span key={ index } className="rpk-text">按资源</span> );
                                  default:
                                    return '';
                                }
                              } ) : null
                            }
                          </span>
                        </Col>
                      </Row>
                        <div className="package-buttons">
                          <div className="package-edit" onClick={ this.handleEdit.bind( this, item.packageId ) }>编辑</div>
                          <div className="package-delete" onClick={ this.showDeleteDialog.bind( this, item.packageId ) }>删除</div>
                        </div>
                    </div>
                  );
                } ) : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PackageDetail.contextTypes = { router: PropTypes.object.isRequired };

export { PackageDetail };
export default PackageDetail;
