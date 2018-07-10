import React, { Component } from 'react';

import { Button, Row, Col, Input, Tree, Modal, ModalHeader, ModalBody, Dialog, Icon, Notification } from 'epm-ui';

import AddUserGroup from './add-user-group';

import context from 'context';
import { popup } from '../../utilities/transient';
import { getDataSource } from '../../utilities/dataSource';

/**
 *author: wangxiang
 *desc:  用户组管理-左侧菜单
 *date:  2018/1/30
 */
class LeftMenu extends Component {

  constructor( props ) {
    super( props );

    this.state = {
      addUserGroup: false,
      treeData: []
    };

    this.firstLoadGroupId = '';

    this.handleCloseAddUserGroup = this.handleCloseAddUserGroup.bind( this );
    this.handleInputChange = this.handleInputChange.bind( this );
    this.handleSearch = this.handleSearch.bind( this );
    this.handleBeforeEditName = this.handleBeforeEditName.bind( this );
    this.handleBeforeRename = this.handleBeforeRename.bind( this );
    this.handleRename = this.handleRename.bind( this );
    this.handleBeforeRemove = this.handleBeforeRemove.bind( this );
    this.handleRemove = this.handleRemove.bind( this );
    this.fetchInitData = this.fetchInitData.bind( this );
    this.formatData = this.formatData.bind( this );
    this.handleSelect = this.handleSelect.bind( this );
  }

  componentDidMount() {
    this.fetchInitData();
  }

  fetchInitData() {
    getDataSource( `${ context.contextPath }/v1/userGroups`, ( data ) => {
      this.setState( { data }, this.formatData );
    } );
  }

  formatData() {
    let array = [];
    const data = this.state.data;

    if ( data ) {

      for ( let i = 0; i < data.length; i++ ) {

        let select = false;

        if ( this.firstLoadGroupId === '' && i === 0 ) {
          this.firstLoadGroupId = data[ 0 ].groupId;
          this.props.handleGetGroupId( data[ 0 ].groupId );
          select = true;
        }

        let obj = {
          'name': data[ i ].groupName,
          'data': {
            'groupId': data[ i ].groupId
          },
          'selected': select
        };

        array.push( obj );
      }

      this.setState( { treeData: array } );
    }

  }

  handleInputChange( value ) {
    this.setState( { nameForSearch: value.trim() } );
  }

  handleSearch() {
    this.search( this.state.nameForSearch );
  }

  /**
   * 判断是否可以进入编辑状态
   * @param  { Object } node 节点数据对象
   * @return { Boolean }  判断节点是否可以进入编辑状态
   */
  handleBeforeEditName( node ) {

    return true;
  }

  /**
   * 判断节点更新后的名称是否符合规则事件
   * @param  { Object } node  节点对象
   * @param  { String } newName 新名称
   * @return { Boolean }  判断节点名称是否符合规则
   */
  handleBeforeRename( node, newName ) {

    if ( newName.length < 1 ) {
      popup( <Notification key={ Math.random().toString() } message="通知" type="error" description="用户组名不能为空！" /> );
      return false;
    } else {

      getDataSource(
        {
          url: `${ context.contextPath }/v1/userGroups/${ node.data.groupId }/${ newName }`,
          params: { method: 'put', body: '' }
        }, ( callback ) => {
          if ( Number( callback.code ) === 201 ) {
            popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ callback.message } /> );
          } else {
            popup( <Notification key={ Math.random().toString() } message="通知" type="error" description={ callback.message } /> );
          }

          this.fetchInitData();
        }
      );

      return true;
    }
  }

  /**
   * 更新名称之后回调事件
   * @param  { Object } node 节点数据对象
   */
  handleRename( node ) {
    //this.fetchInitData();
  }

  /**
   * 节点删除之前事件
   * @param  { Object } node 节点数据对象
   * @return { Boolean } 判断节点是否可以被删除
   */
  handleBeforeRemove( node ) {

   let type = false;

    popup(
      <Dialog
        title="删除确认"
        message="确认删除该用户组吗？"
        type="confirm"
        icon="danger"
        approveBtnOnClick={ ( after ) => {
          getDataSource(
            {
              url: `${ context.contextPath }/v1/userGroups/${ node.data.groupId }`,
              params: { method: 'delete', body: '' }
            }, ( callback ) => {

              if ( Number( callback.code ) === 200 ) {
                after( true );
                type = true;
                popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ callback.message } /> );
              } else {
                after( true );
                popup( <Notification key={ Math.random().toString() } message="通知" type="error" description={ callback.message } /> );
              }

              this.fetchInitData();
            }
          );
        }
        }
      />
    );

    return type;
  }

  /**
   * 节点删除回调事件
   * @param  { Object } node 节点数据对象
   */
  handleRemove( node ) {

  }

  handleCloseAddUserGroup() {
    this.refs.addUserGroupRef.groupReset();
    this.setState( { addUserGroup: false } );
  }

  /**
   * 节点点击后处理事件
   * @param  { Object } node 节点的数据对象
   * @param  { Boolean } isSelected  节点选中状态
   * @param  { Array }  selectedNodes 被选中节点数据对象集合
   */
  handleSelect( node, isSelected, selectedNodes ) {

    this.props.handleGetGroupId( node.data.groupId );
  }

  render() {

    return (
      <div style={ { padding: '0 0 10px 5px' } }>
        <br />
        <Row style={ { paddingBottom: '12px' } }>
          {/*<Col size={ 15 } style={ { paddingRight: '0' } }>
            <Input onChange={ this.handleInputChange } icon="search"/>
          </Col>
          <Col size={ 9 } style={ { paddingLeft: '10px', paddingTop: '2px' } }>
            <Button type="default" size="small" onClick={ this.handleSearch }>搜索</Button>
          </Col>*/}
          <Col>
            <Input type="search" placeholder="快速查找用户组" style={ { paddingLeft:'5px' } } onChange={ this.handleInputChange } >
              <Input.Right>
                <Button shape="icon" type="default" onClick={ this.handleSearch }  style={ { marginRight:'5px' } }>
                  <Icon icon="search" />
                </Button>
              </Input.Right>
            </Input>
          </Col>
        </Row>
        <Row style={ { paddingBottom: '12px' } }>
          <Col style={ { textAlign: 'center' } }>
            <Button type="default" onClick={ () => { this.setState( { addUserGroup: true } ) } } >新增用户组</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Tree
              dataSource={ this.state.treeData }
              editable={ { remove: true, rename: true } }
              onBeforeEditName={ this.handleBeforeEditName }
              onBeforeRename={ this.handleBeforeRename }
              onRename={ this.handleRename }
              onBeforeRemove={ this.handleBeforeRemove }
              onRemove={ this.handleRemove }
              onSelect={ this.handleSelect }
              trigger={ ( trigger ) => {
                this.search = trigger.search;
              }
              }
            />
          </Col>
        </Row>
        <div>{ this.state.message }</div>
        <Modal visible={ this.state.addUserGroup } onClose={ this.handleCloseAddUserGroup } >
          <ModalHeader>
            新增用户组
          </ModalHeader>
          <ModalBody>
            <AddUserGroup ref="addUserGroupRef" getUserGroup={ this.fetchInitData } closeModal={ this.handleCloseAddUserGroup } />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export { LeftMenu };
export default LeftMenu;
