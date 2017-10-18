
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { CommonIcon } from 'themes/mastodon-go/components';

import './style';

export default class CommonToggle extends React.PureComponent {

  static propTypes = {
    active: PropTypes.bool,
    activeIcon: PropTypes.string,
    activeLabel: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    inactiveIcon: PropTypes.string,
    inactiveLabel: PropTypes.node.isRequired,
    onChange: PropTypes.func,
    title: PropTypes.string,
  };
  static defaultProps = {
    activeIcon: 'check-circle-o',
    inactiveIcon: 'times',
  };
  state = {
    isActive: !!this.props.active,
    isFocused: false,
  };

  componentWillReceiveProps (nextProps) {
    const { active } = this.props;
    if (active !== nextProps.active) {
      this.setState({ isActive: !!nextProps.active });
    }
  }

  handleChange = value => {
    const { onChange } = this.props;
    const { isActive } = this.state;
    const willBeActive = value !== void 0 ? !!value : !isActive;
    this.setState({ isActive: willBeActive });
    onChange(willBeActive);
  }

  handleClick = e => {
    const { handleChange } = this;
    handleChange();
    e.stopPropagation();
  };
  handleActivate = e => {
    const { handleChange } = this;
    handleChange(true);
    e.stopPropagation();
  };
  handleDeäctivate = e => {
    const { handleChange } = this;
    handleChange(false);
    e.stopPropagation();
  };
  handleKeyPress = e => {
    const { handleChange } = this;
    switch (e.key) {
    case ' ':
      handleChange();
      break;
    case 'Down':
    case 'Right':
    case 'ArrowDown':
    case 'ArrowRight':
      handleChange(false);
      break;
    case 'Left':
    case 'Up':
    case 'ArrowLeft':
    case 'ArrowUp':
      handleChange(true);
      break;
    default:
      return;
    }
    e.stopPropagation();
    e.preventDefault();
  };
  handleActiveKeyPress = e => {
    const { handleChange } = this;
    switch (e.key) {
    case ' ':
      handleChange(true);
      break;
    case 'Down':
    case 'Right':
    case 'ArrowDown':
    case 'ArrowRight':
      handleChange(true);
      break;
    case 'Left':
    case 'Up':
    case 'ArrowLeft':
    case 'ArrowUp':
      handleChange(false);
      break;
    default:
      return;
    }
    e.stopPropagation();
    e.preventDefault();
  };
  handleInactiveKeyPress = e => {
    const { handleChange } = this;
    switch (e.key) {
    case ' ':
      handleChange(false);
      break;
    case 'Down':
    case 'Right':
    case 'ArrowDown':
    case 'ArrowRight':
      handleChange(true);
      break;
    case 'Left':
    case 'Up':
    case 'ArrowLeft':
    case 'ArrowUp':
      handleChange(false);
      break;
    default:
      return;
    }
    e.stopPropagation();
    e.preventDefault();
  };
  handleFocus = () => {
    this.setState({ isFocused: true });
  };
  handleBlur = () => {
    this.setState({ isFocused: false });
  };

  render () {
    const {
      handleActivate,
      handleActiveKeyPress,
      handleBlur,
      handleClick,
      handleDeäctivate,
      handleFocus,
      handleInactiveKeyPress,
      handleKeyPress,
    } = this;
    const {
      active,
      activeIcon,
      activeLabel,
      className,
      disabled,
      inactiveIcon,
      inactiveLabel,
      onChange,
      title,
      ...rest
    } = this.props;
    const {
      isActive,
      isFocused,
    } = this.state;
    const computedClass = classNames('MASTODON_GO--COMMON--TOGGLE', {
      active: isActive,
      focused: isFocused,
    }, className);

    return (
      <span
        aria-disabled={!!disabled}
        onBlur={handleBlur}
        onClick={!disabled ? handleClick : void 0}
        onKeyDown={!disabled ? handleKeyPress : void 0}
        onFocus={handleFocus}
        className={computedClass}
        role='radiogroup'
        title={title}
        {...rest}
      >
        <span
          aria-selected={!isActive}
          onBlur={handleBlur}
          onClick={!disabled ? handleDeäctivate : void 0}
          onKeyDown={!disabled ? handleInactiveKeyPress : void 0}
          onFocus={handleFocus}
          role='radio'
          tabIndex='0'
        >{inactiveLabel}</span>
        <span
          aria-hidden='true'
          className='track'
        >
          <CommonIcon name={inactiveIcon} />
          <span className='thumb' />
          <CommonIcon name={activeIcon} />
        </span>
        <span
          aria-selected={!!isActive}
          onBlur={handleBlur}
          onClick={!disabled ? handleActivate : void 0}
          onKeyDown={!disabled ? handleActiveKeyPress : void 0}
          onFocus={handleFocus}
          role='radio'
          tabIndex='0'
        >{activeLabel}</span>
      </span>
    );
  }

}
