import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'epm-ui';

import { instanceWorkStateConvert, instanceOrderStateConvert } from '../../components/commons/dynamicConvert';
import getUUID from "../../utilities/uuid";

/**
 *@author xumeng
 *@mailTo <a href="mailto:xumeng@bonc.com.cn">xumeng</a>
 *@Date 2018/1/24.
 *@desc 服务实例-实例详情Modal（系统管理）
 */

class AdminInstanceDetail extends Component {
  constructor( props ) {
    super( props );
    this.state={
      pageNo: 1,
      pageSize: 10,
      selectKey: '',
      keyWords: '',
      checkData: null,
      instanceDetail: props.instanceDetail
    };
  }

  componentWillReceiveProps( nextProps ) {
    this.setState( { instanceDetail: nextProps.instanceDetail } );
  }

  render() {
    const { instanceDetail } = this.state;

    return (
      <div>
        <Row style={ { marginTop: '10px' } }>
          <Col size={ 6 } style={ { textAlign: 'right' } }>
            <span>实例编号：</span>
          </Col>
          <Col size={ 10 }>
            <span>{ instanceDetail.instanceNo }</span>
          </Col>
          <Col size={ 8 }>
            <Link to={ `/console-home/admin/order-manage/${ instanceDetail.instanceId }` }>
              <Button style={ { verticalAlign: 'middle', marginTop: '-10px' } }>查看订单</Button>
            </Link>
          </Col>
        </Row>
        {
          instanceDetail.nodeInfos ?
            <Row style={ { marginTop: '10px' } }>
              <Col size={ 6 } style={ { textAlign: 'right' } }>
                <span>实例结点个数：</span>
              </Col>
              <Col size={ 18 }>
                <span>{ instanceDetail.nodeInfos.length }</span>
              </Col>
            </Row>: null
        }
        <Row style={ { marginTop: '10px' } }>
          <Col size={ 6 } style={ { textAlign: 'right' } }>
            <span>订购状态：</span>
          </Col>
          <Col size={ 18 }>
            <span>{ instanceOrderStateConvert( instanceDetail.instanceOrderState ) }</span>
          </Col>
        </Row>
        <Row style={ { marginTop: '10px' } }>
          <Col size={ 6 } style={ { textAlign: 'right' } }>
            <span>运行状态：</span>
          </Col>
          <Col size={ 18 }>
            <span>{ instanceWorkStateConvert( instanceDetail.instanceWorkState ) }</span>
          </Col>
        </Row>
        {
          instanceDetail.extInfos ? Object.keys( instanceDetail.extInfos ).map( ( key ) => {
            return (
              <Row style={ { marginTop: '10px' } }>
                <Col key={ getUUID() } size={ 6 } style={ { textAlign: 'right' } }>
                  <span>{ instanceDetail.extInfos[ key ].attrName }：</span>
                </Col>
                <Col key={ getUUID() } size={ 18 }>
                  <span>{ instanceDetail.extInfos[ key ].valueObject }</span>
                </Col>
              </Row>
              )
          } ) : null
        }
      </div>
    );
  }
}

export { AdminInstanceDetail };
export default AdminInstanceDetail;