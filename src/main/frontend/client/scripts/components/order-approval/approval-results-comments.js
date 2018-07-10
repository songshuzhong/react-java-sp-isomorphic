import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Button, Row, Col, FormItem, Form, RadioGroup, Radio, Label, Textarea } from 'epm-ui';

import context from 'context';
import PropTypes from "prop-types";

/**
 *author: wangxiang
 *desc:  订单审批-待审批页面-审批结果和审批意见
 *date:  2018/1/24
 */
class ApprovalResultsComments extends Component {

  constructor( props ) {
    super( props );

    this.state = { orderId: props.svcOrderId, taskId: props.taskId };

    this.handleResetForm = this.handleResetForm.bind( this );
    this.onFormGetter = this.onFormGetter.bind( this );
    this.onAsyncSubmit = this.onAsyncSubmit.bind( this );
    this.onAfterSubmit = this.onAfterSubmit.bind( this );
  }

  componentWillReceiveProps( nextProps ) {
    this.setState( { orderId: nextProps.svcOrderId, taskId: nextProps.taskId } );
  }

  onAsyncSubmit( formData ) {
    formData.taskId = this.state.taskId;

    return formData;
  }

  onAfterSubmit( data ) {

    // "当前工单任务处理成功"
    if ( data.code === 201 ) {
      this.context.router.history.push( {
        pathname: `/console-home/order-approval`
      } );
    } else {
      this.context.router.history.push( {
        pathname: `/console-home/order-approval`
      } );
    }
  }


  onFormGetter( getter ) {
    this.getValue = getter.value;
  }

  handleResetForm( trigger ) {
    this.reset = trigger.reset;
  }

  render() {
    return (
      <div style={ { color: '#556a8c' } }>
        <Form
          method="post"
          async={ true }
          type="horizontal"
          onSubmit={ this.onAsyncSubmit }
          onAfterSubmit={ this.onAfterSubmit }
          getter={ this.onFormGetter }
          trigger={ this.handleResetForm }
          action={ `${ context.contextPath }/v1/order/process/svcOrderId/${ this.state.orderId }/approval` }
        >
          <Row style={ { paddingTop: '30px' } }>
            <Col size={ 24 }>
              <FormItem required={ true } type="inline">
                <Label style={ { width: 'auto' } } >审批结果：</Label>
                <RadioGroup value="0" name="agreement" type="inline" style={ { width: '90%' } }>
                  <Radio value="1">同意</Radio>
                  <Radio value="0">不同意</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row style={ { paddingTop: '15px' } }>
            <Col size={ 24 }>
              <FormItem required={ true } type="inline">
                <Label style={ { width: 'auto' } } >审批意见：</Label>
                <Textarea name="remark" style={ { width: '90%' } } rows={ 4 } placeholder="请输入审批意见..." />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col size={ 24 } style={ { textAlign: 'right', paddingBottom: '30px' } }>
              <Button type="default" htmlType="submit">提交</Button>
              <Link to={ `/console-home/order-approval` } ><Button type="default">返回</Button></Link>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

ApprovalResultsComments.contextTypes = { router: PropTypes.object.isRequired };

export { ApprovalResultsComments };
export default ApprovalResultsComments;
