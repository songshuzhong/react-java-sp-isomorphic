import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Row, Col } from 'epm-ui';

import InstanceList from '../components/service-instance/instance-list';
import InstanceDelete from '../components/service-instance/instance-delete';

/**
 *@author xumeng
 *@mailTo <a href="mailto:xumeng@bonc.com.cn">xumeng</a>
 *@Date 2018/1/15.
 *@desc 服务实例页面（租户管理）
 */

class ServiceInstance extends Component {
  constructor( props ) {
    super( props );
    this.state={
      pageNo: 1,
      pageSize: 10,
      selectKey: '',
      svcId: props.match.params.svcId,
      svcName: props.match.params.svcName,
      showFlag: true,
      menuFirst: [
        {
          title: '实例列表',
          data: { 'tid': '1' },
          selected: true,
          link: `/console-home/service-instance/${ props.match.params.svcId }/${ props.match.params.svcName }/instance-list`
        },
        {
          title: `回收站`,
          data: { 'tid': '2' },
          selected: false,
          link: `/console-home/service-instance/${ props.match.params.svcId }/${ props.match.params.svcName }/instance-delete`
        }
      ],
      menuSecond: [
        {
          title: '实例列表',
          data: { 'tid': '1' },
          selected: true,
          link: `/console-home/service-instance/${ this.props.match.params.svcId }/${ this.props.match.params.svcName }/instance-list`
        }
      ]
    };

    this.getSvcName = this.getSvcName.bind( this );
    this.getDeleteCount = this.getDeleteCount.bind( this );
    this.getShowInfo = this.getShowInfo.bind( this );
  }

  componentWillReceiveProps( nextProps ){
    let { menuFirst } =this.state;

    menuFirst.forEach( ( item ) => {
      if( item.link == nextProps.location.pathname ) {
        item.selected = true;
      }else {
        item.selected = false;
      }
    } );
  }

  componentWillMount() {
    let { menuFirst, svcId, svcName } =this.state;

    menuFirst.forEach( ( item ) => {
      if( this.props.location.pathname !== `/console-home/service-instance/${ svcId }/${ svcName }`) {
        if( item.link == this.props.location.pathname ) {
          item.selected = true;
        }else {
          item.selected = false;
        }
      }else {
        menuFirst[0].selected = true;
      }
    } );
  }

  getSvcName( svcName ) {
    this.setState( { svcName } );
  }

  getDeleteCount( count ) {
    let { menuFirst } = this.state;

    menuFirst[1].title = `回收站（${ count }）`;
    this.setState( { menuFirst } );
  }

  getShowInfo( showFlag ) {
    this.setState( { showFlag } );
  }

  linkComponent( item, icon ){

    return (
      <Link to={ item.link }
            style={ {
              width: '100%',
              position: 'relative',
              height: '40px',
              cursor: 'pointer'
            } }
      >
        <span
          style={ {
            position: 'absolute',
            top: '10px',
            left: '32px',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: '#18335b'
          } }
        >
          { item.title }
        </span>
      </Link>
    );
  }

  render() {
    let { svcName, svcId } = this.state;
    let intancePath = `/console-home/service-instance/${ svcId }/${ svcName }`;
    let listPath = `/console-home/service-instance/${ svcId }/${ svcName }/instance-list`;
    let deletePath = `/console-home/service-instance/${ svcId }/${ svcName }/instance-delete`;

    return (
      <Layout>
        <Layout>
          <Row>
            <Col size={ 3 }>
              <Layout.Sider width={ 150 } style={ { height: '100%' } }>
                <span style={ { display: 'inline-block', margin: '20px 10px' } }>{ svcName ? svcName : '' }</span>
                <Menu dataSource={ this.state.showFlag ? this.state.menuFirst : this.state.menuSecond } linkComponent={ this.linkComponent } />
              </Layout.Sider>
            </Col>
            <Col size={ 21 }>
              <Layout.Content>
                { this.props.location.pathname === intancePath || this.props.location.pathname === listPath ? <InstanceList svcId={ this.state.svcId } svcName={ this.state.svcName } getShowInfo={ this.getShowInfo }/> : '' }
                { this.state.showFlag ?
                  <div>
                    { this.props.location.pathname === deletePath ? <InstanceDelete svcId={ this.state.svcId } svcName={ this.state.svcName } getDeleteCount={ this.getDeleteCount } /> : '' }
                  </div>
                  : null }
              </Layout.Content>
            </Col>
          </Row>
        </Layout>
      </Layout>
    );
  }
}

export { ServiceInstance };
export default ServiceInstance;
