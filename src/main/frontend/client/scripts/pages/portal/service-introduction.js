import React, { Component } from 'react';

import { Container } from 'epm-ui';

import ServiceDetails from '../../components/service-introduction/service-details';

import context from 'context';

/**
 *author: wangxiang
 *desc: 服务介绍
 *date:  2018/1/6
 */
class ServiceIntroduction extends Component {

  constructor( props ) {
    super( props );

    this.state = { svcCode: props.match.params.svcCode };
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.match.params.svcCode !== this.props.svcCode ) {
      this.setState( { svcCode: nextProps.match.params.svcCode } );
    }
  }


  render() {

    return (
      <Container type="fluid">
        <ServiceDetails dataSource={ `${ context.contextPath }/v1/services/serviceCode/${ this.state.svcCode }` } />
      </Container>
    );
  }
}

export { ServiceIntroduction };
export default ServiceIntroduction;
