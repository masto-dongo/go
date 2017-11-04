//  <CommonToggle>
//  ==============

//  This renders a toggle which is visually similar to react-toggle,
//  but is actually internally represented as a radio list of exactly
//  two options.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import { CommonIcon } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class CommonToggle extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  State.
    this.state = {
      isActive: !!this.props.active,
      isFocused: false,
    };

    //  Function binding.
    const {
      handleChange,
      handleFocusChange,
      handleKeyPress,
    } = Object.getPrototypeOf(this);
    this.handleActivate = handleChange.bind(this, true);
    this.handleActiveKeyPress = handleKeyPress.bind(this, true);
    this.handleBlur = handleFocusChange.bind(this, false);
    this.handleClick = handleChange.bind(this, null);
    this.handleDeäctivate = handleChange.bind(this, false);
    this.handleFocus = handleFocusChange.bind(this, true);
    this.handleInactiveKeyPress = handleKeyPress.bind(this, false);
    this.handleKeyPress = handleKeyPress.bind(this, null);
  }

  //  If our `active` prop changes, we need to reflect that in our
  //  state.
  componentWillReceiveProps (nextProps) {
    const { active } = this.props;
    if (active !== nextProps.active) {
      this.setState({ isActive: !!nextProps.active });
    }
  }

  //  Changes the value of the toggle to the specified `value`, or
  //  toggles it.
  handleChange (value, e) {
    const {
      disabled,
      onChange,
    } = this.props;
    const { isActive } = this.state;

    //  If our toggle is `disabled`, we do nothing.
    if (disabled) {
      return;
    }

    //  Otherwise, we set our active state.
    const willBeActive = typeof value === 'boolean' ? !!value : !isActive;
    this.setState({ isActive: willBeActive });
    onChange(willBeActive);
    if (e) {
      e.stopPropagation();  //  Prevents clicks from being detected twice
    }
  }

  //  When our focus changes, we change our focused state accordingly.
  handleFocusChange (value) {
    this.setState({ isFocused: !!value });
  };

  //  Handles keyboard events.
  handleKeyPress (value, e) {
    const { handleChange } = Object.getPrototypeOf(this);  //  Unbound version
    const { disabled } = this.props;

    //  If our toggle is disabled, we do nothing.
    if (disabled) {
      return;
    }

    //  Otherwise, we handle our keypresses.
    switch (e.key) {
    case ' ':
      handleChange.call(this, value);
      break;
    case 'Down':
    case 'Right':
    case 'ArrowDown':
    case 'ArrowRight':
      handleChange.call(this, true);
      break;
    case 'Left':
    case 'Up':
    case 'ArrowLeft':
    case 'ArrowUp':
      handleChange.call(this, false);
      break;
    default:
      return;
    }
    if (e) {
      e.stopPropagation();  //  Prevents keypresses from being detected twice
      e.preventDefault();  //  Prevents default keypress actions (ie, scrolling)
    }
  };

  //  Rendering.
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
      compact,
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
      compact: !activeLabel || !inactiveLabel || compact,
      disabled,
      focused: isFocused,
    }, className);

    return !activeLabel || !inactiveLabel || compact ? (
      <span
        aria-disabled={!!disabled}
        className={computedClass}
        onBlur={handleBlur}
        onClick={!disabled ? handleClick : null}
        onKeyDown={!disabled ? handleKeyPress : null}
        onFocus={handleFocus}
        role='radiogroup'
        tabIndex='0'
        title={title}
        {...rest}
      >
        <span className='track'>
          <span
            aria-checked={!isActive}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onClick={!disabled ? handleActivate : null}
            onKeyDown={!disabled ? handleActiveKeyPress : null}
            role='radio'
            tabIndex='-1'
          >
            <CommonIcon
              icon={inactiveIcon}
              title={inactiveLabel}
            />
          </span>
          <span
            aria-hidden='true'
            className='thumb'
          />
          <span
            aria-checked={!!isActive}
            onBlur={handleBlur}
            onClick={!disabled ? handleDeäctivate : null}
            onKeyDown={!disabled ? handleInactiveKeyPress : null}
            onFocus={handleFocus}
            role='radio'
            tabIndex='-1'
          >
            <CommonIcon
              icon={activeIcon}
              title={activeLabel}
            />
          </span>
        </span>
      </span>
    ) : (
      <span
        aria-disabled={!!disabled}
        className={computedClass}
        onBlur={handleBlur}
        onClick={!disabled ? handleClick : null}
        onKeyDown={!disabled ? handleKeyPress : null}
        onFocus={handleFocus}
        role='radiogroup'
        tabIndex='-1'
        title={title}
        {...rest}
      >
        <span
          aria-checked={!isActive}
          onBlur={handleBlur}
          onClick={!disabled ? handleDeäctivate : null}
          onKeyDown={!disabled ? handleInactiveKeyPress : null}
          onFocus={handleFocus}
          role='radio'
          tabIndex='0'
        >{inactiveLabel}</span>
        <span
          aria-hidden='true'
          className='track'
        >
          <CommonIcon icon={inactiveIcon} />
          <span className='thumb' />
          <CommonIcon icon={activeIcon} />
        </span>
        <span
          aria-checked={!!isActive}
          onBlur={handleBlur}
          onClick={!disabled ? handleActivate : null}
          onKeyDown={!disabled ? handleActiveKeyPress : null}
          onFocus={handleFocus}
          role='radio'
          tabIndex='0'
        >{activeLabel}</span>
      </span>
    );
  }

}

//  Props.
CommonToggle.propTypes = {
  active: PropTypes.bool,  //  `true` if the active option is selected
  activeIcon: PropTypes.node,  //  The icon for the active option
  activeLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(String)]).isRequired,  //  The label for the active option
  className: PropTypes.string,
  compact: PropTypes.bool,  //  Whether or not to show the labels
  disabled: PropTypes.bool,  //  Whether the toggle is disabled
  inactiveIcon: PropTypes.node,  //  The icon for the inactive option
  inactiveLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(String)]).isRequired,  //  The label for the inactive option
  onChange: PropTypes.func,  //  A function to call on toggle change, with the current value
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(String)]),  //  A label for the toggle
};

//  Default props.  These give our default active/inactive icons.
CommonToggle.defaultProps = {
  activeIcon: 'check-circle-o',
  inactiveIcon: 'times',
};
