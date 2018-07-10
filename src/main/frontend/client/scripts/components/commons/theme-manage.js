import React, { Component } from 'react';

import { Dropdown, Button } from 'epm-ui';

import context from 'context';

class ThemeChange extends Component {
  constructor( props ) {
    super( props );

    this.state = { themeName: '默认主题' };

    this.handleClick = this.handleClick.bind( this );
    this.addTheme = this.addTheme.bind( this );
  }


  addTheme( name ) {
    if( name !== '默认主题'  ){
      var link = document.createElement( 'link' );
      link.rel = 'stylesheet';
      link.href = `${ context.contextPath }/static/frame/epm-ui.bonc.min.css`;
      var BEMlink = document.createElement( 'link' );
      BEMlink.rel = 'stylesheet';
      BEMlink.href = `${ context.contextPath }/static/frame/epm-ui.bem.bonc.min.css`;
      if( document.getElementsByTagName( 'link' ).length == 1){
        document.getElementsByTagName( 'head' )[ 0 ].appendChild( link );
        document.getElementsByTagName( 'head' )[ 0 ].appendChild( BEMlink );
      }
    }else {
      const linkNode = document.getElementsByTagName( 'link' )[ 1 ];
      const BEMlinkNode = document.getElementsByTagName( 'link' )[ 2 ];
      if ( linkNode !== undefined && BEMlinkNode !== undefined ){
        linkNode.parentNode.removeChild(linkNode);
        BEMlinkNode.parentNode.removeChild(BEMlinkNode);
      }

    }


  }



  handleClick( item ) {
    window.localStorage.setItem( 'theme', item.name );
    this.addTheme( item.name );
    this.setState( { themeName: item.name } );
  }

  componentDidMount() {

    if ( !window.localStorage.getItem( 'theme' ) ) {
      window.localStorage.setItem( 'theme', '默认主题' );
      this.setState( { themeName: '默认主题' } );
    }else {
      this.setState( { themeName: window.localStorage.getItem( 'theme' ) } );
      if ( document.getElementsByTagName( 'link' ).length === 1  && window.localStorage.getItem( 'theme' ) === 'BONC 主题' ) {
        this.addTheme( window.localStorage.theme );
      }

    }


  }

  render() {
    const dataSource = [
      {
        name: '默认主题',
        onClick: ( item, events ) => {
          this.handleClick( item );
        }
      },
      {
        name: 'BONC 主题',
        onClick: ( item, events ) => {
          this.handleClick( item );
        }
      }

    ];

    return (

      <Dropdown dataSource={ dataSource } position={ 'bottom' } container={ this.props.container } showPointer={true} >
        <Dropdown.Trigger>
          <Button shape="outline" type="primary">{ this.state.themeName }</Button>
        </Dropdown.Trigger>
      </Dropdown>

    );
  }
}

export { ThemeChange };
export default ThemeChange;
