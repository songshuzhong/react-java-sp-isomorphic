import React, { Component } from 'react';

import { Button, Row, Col, Icon, Input, FormItem, Form, Select, Transfer, Notification } from 'epm-ui';

import { popup } from '../../utilities/transient';

import context from 'context';
import { getDataSource } from '../../utilities/dataSource';

/**
 *author: wangxiang
 *desc:  用户组管理-添加用户
 *date:  2018/1/31
 */
class AddUser extends Component {

  constructor( props ) {
    super( props );

    this.state = { data: [] ,leftList: [], rightList: [], groupId: props.groupId };

    this.onAfterSubmit = this.onAfterSubmit.bind( this );
    this.onAsyncSubmit = this.onAsyncSubmit.bind( this );
    this.onFormGetter = this.onFormGetter.bind( this );
    this.handleResetForm = this.handleResetForm.bind( this );
    this.onTransferAfterSubmit = this.onTransferAfterSubmit.bind( this );
    this.onTransferAsyncSubmit = this.onTransferAsyncSubmit.bind( this );
    this.handleChangeSearch = this.handleChangeSearch.bind( this );
    this.handleFormatLeftList = this.handleFormatLeftList.bind( this );
    this.handleListChange = this.handleListChange.bind( this );
    this.handleListCheck = this.handleListCheck.bind( this );
    this.handleChangeSearch = this.handleChangeSearch.bind( this );
    this.fetchInitData = this.fetchInitData.bind( this );
  }

  componentDidMount() {
    this.fetchInitData();
  }

  componentWillReceiveProps( nextProps ) {
    this.setState( { groupId: nextProps.groupId }, this.fetchInitData );
  }

  fetchInitData() {
    getDataSource( `${ context.contextPath }/v1/users`, ( data ) => {
      this.setState( { data }, this.handleFormatLeftList );
    } );
  }

  trigger( obj ) {
    this.tranReset = obj.reset;
  }

  onAsyncSubmit(formData ) {
    //console.log(formData);
    return formData;
  }

  onAfterSubmit( data ) {
   // console.log(data);
    this.setState( { data }, this.handleFormatLeftList );
  }

  handleFormatLeftList() {
    const data = this.state.data;
    let leftList = [];

    for( let v of data ) {

      const obj = {
        text: v.userName,
        key: JSON.stringify( v )
      };

      leftList.push( obj );
    }

    this.setState( { leftList } );
  }

  onFormGetter( getter ) {
    this.getValue = getter.value;
  }

  handleResetForm( trigger ) {
    this.addUserReset = trigger.reset;
  }

  onTransferAsyncSubmit( formData ) {
    const rightList = this.state.rightList;

    if (rightList.length > 0) {

      for (let i = 0; i < rightList.length; i++) {
        //console.log( JSON.parse( rightList[i] ) );

        formData[`infos[${ i }].userId`] = JSON.parse( rightList[i] ).userId;
        formData[`infos[${ i }].loginId`] = JSON.parse( rightList[i] ).loginId;
        formData[`infos[${ i }].userName`] = JSON.parse( rightList[i] ).userName;
        formData[`infos[${ i }].userMobile`] = JSON.parse( rightList[i] ).userMobile;
        formData[`infos[${ i }].userEmail`] = JSON.parse( rightList[i] ).userEmail;
      }

      return formData;
    }
  }



  onTransferAfterSubmit( data ) {
    if ( Number( data.code ) === 201 ) {
      popup( <Notification key={ Math.random().toString() } message="通知" type="success" description={ data.message } /> );
      this.props.fetchOrderList();
    } else {
      popup( <Notification key={ Math.random().toString() } message="通知" type="error" description={ data.message } /> );
    }

    this.props.closeModal();
  }

  handleChangeSearch( value ) {
    this.setState( { changeSear: value } );
  }

  handleListChange(leftList, rightList, diredtion, moveList ) {

    //console.log( '改变后左侧列表数据为:', leftList );
    //console.log( '改变后右侧列表数据为:', rightList );
    //console.log( '数据移动方向为：', diredtion );
    //console.log( '移动的数据为：', moveList );

  }

  handleListCheck(listName, checkedList ) {

    if ( listName === 'rightList' ) {
      this.setState( { rightList: checkedList } );
    }

    //console.log( '当前点击数据列表是: ', listName );
    //console.log( '当前列表已选中的数据的主键列表是：', checkedList );

  }

  render() {
    let leftList = this.state.leftList;
    let rightList = [];

      return (
        <div className="user_group_manage add_user">
          <Row>
            <Col>
              <Form
                type="horizontal"
                async={ true }
                getter={ this.onFormGetter }
                trigger={ this.handleResetForm }
                action={ `${ context.contextPath }/v1/users` }
                onSubmit={ this.onAsyncSubmit }
                onAfterSubmit={ this.onAfterSubmit }
              >
                <Col size={ 7 } offset={ 2 } style={ { padding: '0' } }>
                  <FormItem name="orginfoId">
                    <Select placeholder="组织机构" dataSource={ `${ context.contextPath }/v1/orgs` } style={ { width: '100%' } } search={ true } />
                  </FormItem>
                </Col>
                <Col size={ 8 } style={ { padding: '0' } }>
                  <FormItem>
                    <Input style={ { width: '90%' } } name="userName" placeholder="用户名" type="text" />
                  </FormItem>
                </Col>
                <Col size={ 6 } style={ { padding: '0' } }>
                  <Button type="default" htmlType="submit">查询</Button>
                  <Button type="default" onClick={ () => { this.addUserReset(); } }>重置</Button>
                </Col>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col size={ 22 } offset={ 2 }>
              <Form
                method="post"
                async={ true }
                action={ `${ context.contextPath }/v1/userGroups/${ this.state.groupId }/users` }
                onSubmit={ this.onTransferAsyncSubmit }
                onAfterSubmit={ this.onTransferAfterSubmit }
              >
                <FormItem>
                  <Transfer
                    ref="transfer"
                    leftList={ leftList }
                    rightList={ rightList }
                    render={ item => `${ item.text }` }
                    titles={ [ '待选用户', '已选用户' ] }
                    operations={ [ '左移', '右移' ] }
                    onChange={ this.handleListChange }
                    onCheck={ this.handleListCheck }
                    trigger={ this.trigger.bind( this ) }
                  />
                </FormItem>
                <div style={ { float: 'right' } }>
                  <Button type="primary" onClick={ () => { this.props.closeModal() } }>返回</Button>
                  <Button type="primary" htmlType="submit" disabled={ this.state.rightList.length > 0 ? false : true }>提交</Button>
                </div>
              </Form>
            </Col>
          </Row>
        </div>
      );

    }
}

export { AddUser };
export default AddUser;
