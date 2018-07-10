import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Container, Tabs, Tab } from 'epm-ui';

import { getDataSource } from '../utilities/dataSource';

import context from 'context';

/**
 *@author sshuzhong
 *@mailTo <a href="mailto:songshuzhong@bonc.com.cn">Song ShuZhong</a>
 *@Date 2017/12/21.
 *@desc
 */
class ServiceDashboard extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      apiService: {
        apisProNum: 'apisProNum',
        apisProUrl: 'apisProUrl',
        apisSubNum: 'apisSubNum',
        apisSubUrl: 'apisSubUrl'
      }
    };
  }

  componentDidMount() {
    getDataSource( `${ context.contextPath }/v1/dashboard/apiService`, ( apiService ) => this.setState( { apiService } ) );
  }

  render() {
    let { apiService } = this.state;
    return (
      <Container type="fluid">
        <Tabs>
          <Tab title="API服务">
            <div>api发布数量：<a target="_blank" href={ apiService.apisProUrl }>{ apiService.apisProNum }</a></div>
            <div>api订阅次数：<a target="_blank" href={ apiService.apisProUrl }>{ apiService.apisSubNum }</a></div>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

ServiceDashboard.contextTypes = { router: PropTypes.object.isRequired };

export { ServiceDashboard };
export default ServiceDashboard;
