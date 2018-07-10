import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Col } from 'epm-ui';

import getUUID from '../../utilities/uuid';

/**
 *author: wangxiang
 *desc:  门户-服务信息面板-内容部分
 *date:  2018/1/5
 */
class ServicePanelContent extends Component {

  constructor( props ) {
    super( props );

    this.state = { hidenStyle: props.hidenStyle, data: props.data };
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.hidenStyle !== this.props.hidenStyle ) {
      this.setState( { hidenStyle: nextProps.hidenStyle } );
    }

    if ( nextProps.data !== this.props.data ) {
      this.setState( { data: nextProps.data } );
    }
  }

  render() {
    return (
      <div className="portal service panel content clearfix" style={ { display: this.state.hidenStyle } } >
        {
          this.state.data.length > 0 ? this.state.data.map( ( item, index ) => {

            return (
              <Col size={ 8 } key={ getUUID() }>
                <div className="item">
                  <div className="title">
                    <Link key={ index } to={ `/portal/service-introduction/${ item.svcCode }` }>{ item.svcName }</Link>
                  </div>
                  <div className="desc">{ item.svcDesc }</div>
                </div>
              </Col>
            );
          } ) : null
        }
      </div>
    );
  }
}

export { ServicePanelContent };
export default ServicePanelContent;
