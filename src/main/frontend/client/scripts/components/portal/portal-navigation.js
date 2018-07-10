import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon, Col, Row, Container } from 'epm-ui';
import { getDataSource } from '../../utilities/dataSource';
import getUUID from "../../utilities/uuid";
import { RenderRoutes } from '../../../../config/router-utils/index';

import context from 'context';

/**
 *author: wangxiang
 *desc:  门户-导航
 *date:  2018/1/11
 */
class PortalNavigation extends Component {

  constructor( props ) {
    super( props );

    this.state = { display1: 'none', display2: 'none', displayId3: -1, display0: 'none' };
  }

  componentWillMount() {
    if ( this.props.location.pathname === '/portal/login/index' ) { //判断当前路径是否为cas拦截的首页路径

      this.context.router.history.push( {
        pathname: `/`
      } );
    }
  }

  componentDidMount() {
    getDataSource( `${ context.contextPath }/v1/svccategorys/services`, ( data ) => {
      this.setState( { data } );
    } );

    getDataSource( `${ context.contextPath }/v1/users/cur_user`, ( loginInfo ) => {
      this.setState( { loginInfo } );
    } );
  }

  handleMouseHoverNav( type, id ) {
    if ( type === 3 ) {
      this.setState( { [ `displayId3` ] : id } );
    } else if( type === 0 ) {
      if ( this.state[ `display${ type }` ] === 'none') {
        this.setState( { [ `display${ type }` ] : 'block' } );
        this.setState( { [ `display1` ] : 'none' } );
        this.setState( { [ `display1` ] : 'none' } );
      }
    }else if ( type === 1 ) {
      if ( this.state[ `display${ type }` ] === 'none') {
        this.setState( { [ `display${ type }` ] : 'block' } );
        this.setState( { [ `display0` ] : 'none' } );
        this.setState( { [ `display0` ] : 'none' } );
      }
    } else {
      if ( this.state[ `display${ type }` ] === 'none') {
        this.setState( { [ `display${ type }` ] : 'block' } );
      }
    }
  }

  handleMouseLeaveNav( type ) {
    if ( type === 3 ) {
      this.setState( { [ `displayId3` ] : -1 } );

      //点击链接后 收起所有菜单
    } else if( type === 4 ) {
      this.setState( { display1: 'none', display2: 'none', displayId3: -1 } );
    } else {
      if ( this.state[ `display${ type }` ] === 'block') {
        this.setState( { [ `display${ type }` ] : 'none' } );
      }
    }
  }



  handleMouseLeaveNav2() {
    this.setState( { [ `display0` ] : 'none' } );
    this.setState( { [ `display1` ] : 'none' } );
  }

  render() {
    //let roleUrl = '/console-home/tenant/order-manage';
    let array = [];

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

    const loginStatus = this.state.loginInfo ? this.state.loginInfo.loginStatus : 0;

    return (
      <Container type="fluid" style={ { margin: 0, padding: 0 } }>
        <div className="portal nav" style={ { backgroundColor: '/' === this.props.location.pathname || '/portal/login/index' === this.props.location.pathname ? '' : '#0071D1' } }>
          <div className="top-content" onMouseEnter={ this.handleMouseLeaveNav2.bind( this ) }>
            <ul className="clearfix">
              <li className="logo">
                <Link to={ `/` }>
                  <div style={ { float: 'left', height: '100%' } }>BONC&nbsp;</div>
                  <div style={ { fontSize: '16px', fontWeight: 400, float: 'left', height: '100%', paddingTop: '7px' } }>云平台&nbsp;</div>
                </Link>
              </li>
              {
                Number( loginStatus ) === 1 ?
                  <li style={ { float: 'right' } } className="login-username">
                    <span><Icon icon="user" style={ { fontSize: '18px' } } />&nbsp;{ this.state.loginInfo.userName }</span>
                    <div className="login-out"><a href={ `${ context.casPath }/cas/logout?service=${ context.casPath }/bconsole` } >退出登录</a></div>
                  </li>
                  :
                  [ <li style={ { float: 'right', width: '7%', textAlign: 'center', marginRight: '12px' } } className="login" ><a target="_blank" href={ `${ context.casPath }/security/userinfo!registerByPhone.action` } >立即注册</a></li>,
                    <li style={ { float: 'right', width: '6%', textAlign: 'center' } } className="login" ><a href={ `${ context.casPath }/bconsole/portal/login/index` } >登录</a></li>]
              }

              <li style={ { float: 'right', width: '6%', textAlign: 'center' } }>
                <a target="_blank" href={ `http://bconsole.bonc.pro/portal/` } >控制台</a>
              </li>
            </ul>
          </div>
          <div className="bottom-content">
            <ul className="clearfix" style={ { height: '95%' } }>
              <li className="all-nav">
                <div
                  className="all-nav-div"
                  onMouseEnter={ this.handleMouseHoverNav.bind( this, 1 ) }
                  style={ { color: this.state.display1 === 'block' ? '#4799FD' : '' } }
                >
                  <Icon icon="reorder" style={ { fontSize: '20px' } } />
                  &nbsp;全部导航
                </div>
              </li>
              <li className="service-nav" style={ { textAlign: 'center' } }>
                <div
                  className="service-nav-div"
                  onMouseEnter={ this.handleMouseHoverNav.bind( this, 0 ) }
                  style={ { borderBottom: this.state.display0 === 'block' ? '2px solid #4799FD' : '' } }
                >
                  <span>服务</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="hover-row-nav" onMouseLeave={ this.handleMouseLeaveNav.bind( this, 0 ) } style={ { display: this.state.display0, zIndex: this.state.display0 === 'block' ? 1000 : 0 } } >
          {
            array ? array.map( ( item0, index0 ) => {
              return (
                <Row key={ getUUID() }>
                  {
                    item0 ? item0.map( ( item, index ) => {

                      return (
                        <Col key={ getUUID() } size={ 4 }>
                          <div className="item">
                            <ul style={ { margin: '20px 0 0 0' } }><li className="cataName">{ item.cataName }</li></ul>
                            <ul className="svcName">
                              {
                                item.serviceInfoList ? item.serviceInfoList.map( ( item1, index1 ) => {

                                  return (
                                    <li key={ getUUID() } onClick={ this.handleMouseLeaveNav.bind( this, 0 ) } >
                                      <Link to={ `/portal/service-introduction/${ item1.svcCode }` } >{ item1.svcName }</Link>
                                    </li>
                                  );
                                } ) : null
                              }
                            </ul>
                          </div>
                        </Col>
                      );
                    } ) : null
                  }
                </Row>
              );
            }) : null
          }
        </div>
        <div className="hover-nav" style={ { zIndex: this.state.display1 === 'block' ? 1000 : 0   } } >
          <div className="nav first" onMouseLeave={ this.handleMouseLeaveNav.bind( this, 1 ) }  style={ { display: this.state.display1, zIndex: this.state.display1 === 'block' ? 1000 : 0  } }>
            <ul>
              <li className="first-li" onMouseEnter={ this.handleMouseHoverNav.bind( this, 2 ) } >
                <span>服务</span>
                <Icon className="gt" icon="angle-right" />&nbsp;&nbsp;
                <div className="nav second" onMouseLeave={ this.handleMouseLeaveNav.bind( this, 2 ) }  style={ { display: this.state.display2 } }>
                  <ul>
                    {
                      this.state.data ? this.state.data.map( ( item, index ) => {

                        return(
                          <li className="second-li" key={ getUUID() }>
                            <div className="second-div" style={ { width: '100%' } } onMouseEnter={ this.handleMouseHoverNav.bind( this, 3, item.cataId ) }>
                              <span>{ item.cataName }</span>
                              {
                                item.serviceInfoList.length > 0 ? <Icon className="gt" icon="angle-right" /> : null
                              }
                            </div>
                            <div className="nav third" onMouseLeave={ this.handleMouseLeaveNav.bind( this, 3 ) }  style={ { display: this.state.displayId3 === item.cataId ? 'block' : 'none' } }>
                              <ul>
                                {
                                  item.serviceInfoList ? item.serviceInfoList.map( ( item1, index1 ) => {
                                    return(
                                      <li className="third-li" key={ getUUID() } onClick={ this.handleMouseLeaveNav.bind( this, 4 ) }>
                                        <Link to={ `/portal/service-introduction/${ item1.svcCode }` }><span>{ item1.svcName }</span></Link>
                                      </li>
                                    );
                                  } ) : null
                                }
                              </ul>
                            </div>
                          </li>
                        );
                      } ) : null
                    }
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <RenderRoutes routes={ this.props.routes } />
      </Container>
    );
  }
}

PortalNavigation.contextTypes = { router: PropTypes.object.isRequired };

export { PortalNavigation };
export default PortalNavigation;
