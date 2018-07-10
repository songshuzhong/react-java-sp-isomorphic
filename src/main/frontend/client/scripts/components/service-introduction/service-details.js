import React, { Component } from 'react';

import { Row, Col, Container } from 'epm-ui';

import ServicePackageInfo from './service-package-info';

import { getDataSource } from '../../utilities/dataSource';

import context from 'context';

/**
 *author: wangxiang
 *desc:  服务介绍-服务详情部分
 *date:  2018/1/7
 */
class ServiceDetails extends Component {

  constructor( props ) {
    super( props );

    this.state = { dataSource: props.dataSource, data: {} };
  }

  componentDidMount() {
    this.getServiceData();
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.dataSource !== this.props.dataSource ) {
      this.setState( { dataSource: nextProps.dataSource }, this.getServiceData );
    }
  }

  getServiceData() {
    getDataSource( this.state.dataSource, ( data ) => {
      this.setState( { data } );
    } );
  }

  render() {
    const { svcId, svcName, svcVersion, svcDesc, svcIcon, svcCode } = this.state.data;

    return (
      <Container type="fluid" className="service intro details" style={ { padding: '100px 1% 0 1%' } }>
        <Row>
          <Col>
            <div className="title_version">
              <span className="title">{ svcName }</span>
              <span className="version">版本：{ svcVersion }</span>
            </div>
            <hr style={ { margin: '10px 0 14px 0', borderTop: '2px solid #f5f5f5' } } />
          </Col>
        </Row>
        <Row>
          <Col>
            <div style={ { backgroundColor: '#F5F5F5', padding: '16px 1px' } }>
              <Row>
                <Col size={ 20 }>
                  <div className="desc" >
                    { svcDesc }
                  </div>
                </Col>
                <Col size={ 4 }>
                  {
                    svcIcon ? <img src={ `data:image/png;base64,${ svcIcon }` } style={ { height: '100px' } } alt="pic" /> : null
                  }
                </Col>
              </Row>
              <div style={ { height: '45px', width: '100%' } } >&nbsp;</div>
              {
                svcId ? <ServicePackageInfo svcCode={ svcCode } svcId={ svcId } /> : null
              }
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div style={ { padding: '16px 1px' } }>
              <img src={ `${ context.contextPath }/static/img/introduction.png` } style={ { width: '100%' } } alt="pic"/>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export { ServiceDetails };
export default ServiceDetails;
