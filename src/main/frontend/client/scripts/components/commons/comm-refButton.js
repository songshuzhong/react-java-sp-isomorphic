import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Define an Button Component and inherited from Component
 */
class RefButton extends Component {

  /**
   * The initial state to define
   * @param {object} props The first props
   */
  constructor( props ) {
    super( props );

    this.handleClick = this.handleClick.bind( this );
  }

  /**
   * Change is triggered when the initial state
   * @param { Object } arguments
   */
  handleClick( ...args ) {
    if ( this.props.onClick ) {
      this.props.onClick( ...args );
    }
  }

  /**
   * The react to provide a render method is used to forms a rendering
   */
  render() {
    const { shape, type, htmlType, disabled, children, className, style, size, block, active, btnRef } = this.props;

    let shapeCls = '';

    switch ( shape ) {
      case 'icon':
        shapeCls = 'icon';
        break;
      case 'circle':
        shapeCls = 'circle icon';
        break;
      case 'outline':
        shapeCls = 'outline';
        break;
      case 'default':
      case undefined:
        shapeCls = '';
        break;
    }

    let cls = '';

    switch ( type ) {
      case 'primary':
        cls = 'primary';
        break;
      case 'danger':
        cls = 'danger';
        break;
      case 'warning':
        cls = 'warning';
        break;
      case 'info':
        cls = 'info';
        break;
      case 'success':
        cls = 'success';
        break;
      case 'link':
        shapeCls = 'link';
        break;
      case 'default':
      case undefined:
        cls = '';
        break;
      default:
        cls = '';
        console.warn( `Failed prop value: Invalid prop \`type\` of value \`${ type }\` supplied to \`Button/ButtonGruop\`.`, 'For details, see EPM UI API document.' );
    }

    const sizeType = [ 'mini', 'tiny', 'small', 'medium', 'large', 'huge', 'massive' ].includes( size );
    const buttonClass = classNames( {
      'epm': true,
      [ `${ size }` ]: sizeType,
      block,
      active
    }, cls, shapeCls, className, 'button' );

    return (
      <button
        ref={ btnRef }
        className={ buttonClass }
        style={ style }
        type={ htmlType }
        disabled={ disabled }
        onClick={ this.handleClick }
      >
        { children }
      </button>
    );
  }
}

RefButton.propTypes = {
  type: PropTypes.oneOf( [
    'primary',
    'danger',
    'warning',
    'info',
    'success',
    'link',
    'default'
  ] ),
  htmlType: PropTypes.oneOf( [
    'button',
    'submit',
    'reset'
  ] ),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  shape: PropTypes.oneOf( [ 'default', 'icon', 'circle', 'outline' ] ),
  style: PropTypes.object,
  block: PropTypes.bool,
  active: PropTypes.bool,
  size: PropTypes.oneOf( [ 'mini', 'tiny', 'small', 'medium', 'large', 'huge', 'massive' ] )
};

RefButton.defaultProps = {
  htmlType: 'button',
  disabled: false
};

RefButton.displayName = 'Button';

export { RefButton };
export default RefButton;
