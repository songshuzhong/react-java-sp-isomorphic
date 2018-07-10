import React, { Component } from 'react';

import { Row, Col, Layout } from 'epm-ui';

import UserGroupManageList from '../components/user-group-manage/user-group-mana-list';
import LeftMenu from '../components/user-group-manage/left-menu';

/**
 *author: wangxiang
 *desc:  用户组管理
 *date:  2018/1/30
 */
class UserGroupManage extends Component {

  constructor( props ) {
    super( props );

    this.state = { groupId: '' };

    this.handleGetGroupId = this.handleGetGroupId.bind( this );
  }

  handleGetGroupId( groupId ) {
    this.setState( { groupId } );
  }

  render() {

    return (
      <Layout>
        <Row>
          <Col size={ 4 }>
            <Layout.Sider style={ { height: '100%', borderRight:'2px solid #dbdbe1' } }>
              <LeftMenu handleGetGroupId={ this.handleGetGroupId } />
            </Layout.Sider>
          </Col>
          <Col size={ 20 }>
            <Layout.Content>
              {
                this.state.groupId !== '' ? <UserGroupManageList groupId={ this.state.groupId } /> : null
              }
            </Layout.Content>
          </Col>
        </Row>
      </Layout>
    );
  }
}

export { UserGroupManage };
export default UserGroupManage;
