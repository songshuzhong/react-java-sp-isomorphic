/**
 *@author sshuzhong
 *@mailTo <a href="mailto:songshuzhong@bonc.com.cn">Song ShuZhong</a>
 *@Date 2017/12/29.
 *@desc
 */
export const formItemConvert = ( posy ) => {
  posy = Number( posy );

  switch ( posy ) {
    case 10 :
      return '文本框';
    case 20 :
      return '下拉框';
    case 30 :
      return '单选框';
    case 40 :
      return '复选框';
    case 50 :
      return 'Slider滑块';
    case 60 :
      return '按钮组';
    default :
      return '-';
  }

};

export const basicTypeConvert = ( posy ) => {
  posy = Number( posy );

  switch ( posy ) {
    case 10 :
      return 'byte';
    case 20 :
      return 'short';
    case 30 :
      return 'int';
    case 40 :
      return 'long';
    case 50 :
      return 'float';
    case 60 :
      return 'double';
    case 70 :
      return 'char';
    case 80 :
      return 'boolean';
    default :
      return '-';
  }
};

export const attrExtConvert = ( posy ) => {
  posy = Number( posy );

  switch ( posy ) {
    case 10 :
      return '基本属性';
    case 20 :
      return '申请属性';
    case 30 :
      return '资源属性';
    case 40 :
      return '访问属性';
    case 50 :
      return '操作属性';
    default :
      return '-';
  }

};

export const attrCustomConvert = ( posy ) => {
  let text = [];

  if ( typeof posy == 'string' )
    posy = posy.split( ',' );

  posy.forEach( ( o ) => {
    o = Number( o );

    switch ( o ) {
      case 10 : text.push( '申请' ); break;
      case 20 : text.push( '资源' ); break;
      case 30 : text.push( '访问' ); break;
      case 40 : text.push( '控制' ); break;
    }
  } );

  return text.join();
};

export const svcStateConvert = ( posy ) => {
  posy = Number( posy );

  switch ( posy ) {
    case 10 :
      return '暂存';
    case 20 :
      return '已注册';
    case 30 :
      return '上线';
    case 40 :
      return '下线';
    default :
      return '-';
  }

};

export const orderTypeConvert = ( posy ) => {
  posy = Number( posy );

  switch ( posy ) {
    case 10 :
      return '新增';
    case 20 :
      return '扩容';
    case 30 :
      return '回收';
    default :
      return '-';
  }

};

export const orderStateConvert = ( posy ) => {
  posy = Number( posy );

  switch ( posy ) {
    case 10 :
      return '待支付';
    case 20 :
      return '支付成功';
    case 30 :
      return '待审批';
    case 40 :
      return '审批中';
    case 50 :
      return '通过';
    case 60 :
      return '失败';
    default :
      return '-';
  }
};

export const waysTypeConvert = ( posy ) => {
  posy = Number( posy );

  switch ( posy ) {
    case 10 :
      return '审批';
    case 20 :
      return '付费';
    case 30 :
      return '自动开通';
    default :
      return '-';
  }
};

export const instanceWorkStateConvert = ( posy ) => {
  posy = Number( posy );

  switch ( posy ) {
    case 10 :
      return '未启动';
    case 1010 :
      return '启动中';
    case 20 :
      return '运行中';
    case 30 :
      return '停止';
    case 3010 :
      return '停止中';
    case 40 :
      return '失败';
    case 50 :
      return '异常';
    default :
      return '-';
  }
};

export const instanceOrderStateConvert = ( posy ) => {
  posy = Number( posy );

  switch ( posy ) {
    case 10 :
      return '创建中';
    case 20 :
      return '使用中';
    case 30 :
      return '已到期';
    default :
      return '-';
  }
};

export const chargeTypeConvert = ( posy ) => {
  posy = Number( posy );

  switch ( posy ) {
    case 10 :
      return '按时间';
    case 20 :
      return '按资源';
    case 30 :
      return '时间+资源';
    default :
      return '-';
  }
};

export const chargeTimeTypeConvert = ( posy ) => {
  posy = Number( posy );

  switch ( posy ) {
    case 10 :
      return '日';
    case 20 :
      return '月';
    case 30 :
      return '年';
    default :
      return '-';
  }
};