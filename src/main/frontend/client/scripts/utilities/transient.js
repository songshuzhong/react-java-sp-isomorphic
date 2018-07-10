import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

/** 定义了一个容器组件，用来控制使用 popup 展示的所有组件 */
class Transient extends Component {
  /** 初始状态值 */
  constructor( props ) {
    super( props );

    this.state = { nodes: [], type: null, posi: '' };

    this.add = this.add.bind( this );
    this.remove = this.remove.bind( this );
    this.symbolRemove = this.symbolRemove.bind( this );
    this.addProps = this.addProps.bind( this );
    this.timer = this.timer.bind( this );
    this.queue = [];
  }

  /**
   * 队列工具
   *
   */
  timer( Component, nodes ) {

    this.setState( {
      nodes: nodes.concat( Component ),
      type: Component.type.displayName === 'Notification' ? 'notification' : null,
      posi: Component.props.position ? Component.props.position : ''
    } );
    if ( !this.closeTime && Component.props.duration ) {
      this.closeTime = setInterval( () => {
        this.remove( this.queue.shift() );

        if ( this.queue.length === 0 ) {
          clearInterval( this.closeTime );
          this.closeTime = null;
        }
      }, Component.props.duration * 1000 );
    }
  }

  /** 添加组件 */
  add( Component ) {

    if ( Component.type.displayName === 'Notification' ) {
      this.queue.push( Component );
      this.timer( Component, this.state.nodes );
    } else {

      this.setState( ( previousState ) => {
        const nodes = previousState.nodes;

        if ( !nodes.filter( ( node ) => node === Component ).length ) {

          return { nodes: nodes.concat( Component ) };
        }

      } );
    }

  }

  /**
   * symbolRemove
   *  多个组件，唯一标示删除
   */
  symbolRemove( key ) {
    this.setState( ( previousState ) => {
      const nodes = previousState.nodes.filter( ( node ) => { return node.props.keyword !== key; } );

      return { nodes };
    } );
  }

  /** 删除组件 */
  remove( Component ) {
    this.setState( ( previousState ) => {
      const nodes = previousState.nodes.filter( ( node ) => { return node !== Component; } );

      // if( Component.type.displayName === 'Notification' ) {
      //   if( nodes.length < Component.props.limit && this.queue >= Component.props.limit ) {
      //     this.queue.every( ( item, index ) => {
      //       if( item === nodes[nodes.length-1] ) {
      //         nodes.push( this.queue[index+1] );
      //         return false;
      //       }
      //      } )
      //   }
      // }

      return { nodes };
    } );
  }

  /** 为添加的组件增加 key 值和方法 */
  addProps( key, component ) {
    const props = {};

    if ( component.type.displayName !== 'Notification' ) {
      props.key = key;
    }
    props._self = component;
    props._onDisappear = this.remove;
    props._onDisappearSym = this.symbolRemove;
    if ( key >= component.props.limit ) {
      props.hide = true;
    }

    return React.cloneElement( component, props );
  }

  /** 渲染组件 */
  render() {

    const nodeItems = this.state.nodes.map( ( node, index ) => {
      return this.addProps( index, node );
    } );

    const cls = classNames( 'epm', 'transient', {
      [ `${ this.state.type }` ]: this.state.type,
      [ `${ this.state.posi }` ]: this.state.posi

    } );

    return (
      <div className={ cls }>
        { nodeItems }
      </div>
    );
  }
}

/** Transient 本质是个方法，扩展一个方法 */
Transient.newInstance = function newInstance( props ) {
  const div = document.createElement( 'div' );

  document.body.appendChild( div );

  const transient = ReactDOM.render( <Transient { ...props } />, div );

  return {
    add( Component ) {
      transient.add( Component );
    },
    remove( Component ) {
      transient.remove( Component );
    },
    component: transient,
    destroy() {
      ReactDOM.unmountComponentAtNode( div );
      document.body.removeChild( div );
    }
  };
};

const that = {};

const checkAttr = ( Component, type, posi ) => {
  const typeAttr = type ? type : Component.type.displayName;
  const posiAttr = posi ? posi : Component.props.position;

  that[ typeAttr ] = that[ typeAttr ] || {};
  that[ typeAttr ][ posiAttr ] = that[ typeAttr ][ posiAttr ] || Transient.newInstance( { } );

  return that[ typeAttr ][ posiAttr ];
};

/** 展示 */
const popup = ( Component, type, posi ) => {
  if ( Component.type.displayName === 'Notification' ) {
    return checkAttr( Component, type, posi ).add( Component );
  }
  that.transient = that.transient || Transient.newInstance( { } );

  return that.transient.add( Component );

};

/** 隐藏 */
const popover = ( Component, type, posi ) => {
  if ( Component.type.displayName === 'Notification' ) {
    return checkAttr( Component, type, posi ).remove( Component );
  }
  that.transient = that.transient || Transient.newInstance( { } );

  return that.transient.remove( Component );
};

const destroy = () => {
  if ( Component.type.displayName === 'Notification' ) {
    for ( const name in that ) {
      for ( const item in that[ name ] ) {
        that[ name ][ item ].destroy();
        that[ name ][ item ] = null;
      }
    }
  } else if ( that.transient ) {
    that.transient.destroy();
    that.transient = null;
  }
};

export { popup, popover, destroy };