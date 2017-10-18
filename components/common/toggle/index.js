
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

  handleClick = () => {
    const { onChange } = this.props;
    const { isActive } = this.state;
    this.setState({ isActive: !isActive });
    onChange(!isActive);
  };
  handleActivate = () => {
    const { onChange } = this.props;
    this.setState({ isActive: true });
    onChange(true);
  };
  handleDeäctivate = () => {
    const { onChange } = this.props;
    this.setState({ isActive: false });
    onChange(false);
  };
  handleKeyPress = ({ key }) => {
    const {
      handleActivate,
      handleDeäctivate,
    } = this;
    switch (key) {
      case ' ':
        handleClick();
        break;
      case 'Down':
      case 'Right':
      case 'ArrowDown':
      case 'ArrowRight':
        handleDeäctivate();
        break;
      case 'Left':
      case 'Up':
      case 'ArrowLeft':
      case 'ArrowUp':
        handleActivate();
        break;
    }
  };
  handleActiveKeyPress = ({ key }) => {
    const {
      handleActivate,
      handleDeäctivate,
    } = this;
    switch (key) {
      case ' ':
        handleActivate();
        break;
      case 'Down':
      case 'Right':
      case 'ArrowDown':
      case 'ArrowRight':
        handleDeäctivate();
        break;
      case 'Left':
      case 'Up':
      case 'ArrowLeft':
      case 'ArrowUp':
        handleActivate();
        break;
    }
  };
  handleInactiveKeyPress = ({ key }) => {
    const {
      handleActivate,
      handleDeäctivate,
    } = this;
    switch (key) {
    case ' ':
      handleDeäctivate();
      break;
    case 'Down':
    case 'Right':
    case 'ArrowDown':
    case 'ArrowRight':
      handleDeäctivate();
      break;
    case 'Left':
    case 'Up':
    case 'ArrowLeft':
    case 'ArrowUp':
      handleActivate();
      break;
    }
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
        onFocusOut={handleBlur}
        onClick={!disabled ? handleClick : void 0}
        onKeyPress={!disabled ? handleKeyPress : void 0}
        onFocusIn={handleFocus}
        className={computedClass}
        role='radiogroup'
        title={title}
        {...rest}
      >
        <span
          aria-checked={!isActive}
          onClick={!disabled ? handleDeäctivate : void 0}
          onKeyPress={!disabled ? handleInactiveKeyPress : void 0}
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
          aria-checked={!!isActive}
          onClick={!disabled ? handleActivate : void 0}
          onKeyPress={!disabled ? handleActiveKeyPress : void 0}
          role='radio'
          tabIndex='0'
        >{activeLabel}</span>
      </span>
    );
  }

}
