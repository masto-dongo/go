
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { CommonIcon } from 'themes/mastodon-go/components';

export default class CommonToggle extends React.PureComponent {

  static propTypes = {
    active: PropTypes.bool,
    activeIcon: PropTypes.string,
    activeLabel: PropTypes.string.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    inactiveIcon: PropTypes.string,
    inactiveLabel: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    title: PropTypes.string,
  };
  static defaultProps = {
    activeIcon: 'check-circle-o',
    inactiveIcon: 'times',
  };
  state = {
    active: !!this.props.active,
    focused: false,
  };

  componentWillReceiveProps (nextProps) {
    const { active } = this.props;
    if (active !== nextProps.active) {
      this.setState({ active: !!nextProps.active });
    }
  }

  handleActivate = () => {
    const { onChange } = this.props;
    this.setState({ active: true });
    onChange(true);
  }
  handleDeäctivate = () => {
    const { onChange } = this.props;
    this.setState({ active: false });
    onChange(false);
  }
  handleActiveKeyPress = ({ key }) => {
    const {
      handleActivate,
      handleDeäctivate,
    } = this.props;
    const { onChange } = this.props;
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
  }
  handleInactiveKeyPress = ({ key }) => {
    const {
      handleActivate,
      handleDeäctivate,
    } = this.props;
    const { onChange } = this.props;
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
  }
  handleFocus () {
    this.setState({ focused: true });
  }
  handleBlur () {
    this.setState({ focused: false });
  }

  render () {
    const {
      handleActivate,
      handleActiveKeyPress,
      handleBlur,
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
      active,
      focused,
    } = this.state;
    const computedClass = classNames('MASTODON_GO--COMMON--TOGGLE', {
      active,
      focused,
    }, className)

    return (
      <span
        aria-disabled={!!disabled}
        className={computedClass}
        role='radiogroup'
        title={title}
        {...rest}
      >
        <span
          aria-checked={!active}
          onBlur={handleBlur}
          onClick={!disabled ? handleDeäctivate : void 0}
          onKeyPress={!disabled ? handleInactiveKeyPress : void 0}
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
          aria-checked={!!active}
          onBlur={handleBlur}
          onClick={!disabled ? handleActivate : void 0}
          onKeyPress={!disabled ? handleActiveKeyPress : void 0}
          onFocus={handleFocus}
          role='radio'
          tabIndex='0'
        >{activeLabel}</span>
      </span>
    );
  }

}
