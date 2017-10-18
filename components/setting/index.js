//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { CommonToggle } from 'themes/mastodon-go/components';

import './style';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class Setting extends React.PureComponent {

  static propTypes = {
    activeIcon: PropTypes.string,
    activeLabel: PropTypes.node,
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    global: PropTypes.bool,
    inactiveIcon: PropTypes.string,
    inactiveLabel: PropTypes.node,
    settingKey: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    title: PropTypes.string,
    type: PropTypes.oneOf(['input', 'toggle']),
    '🛄': PropTypes.shape({}),
    '💪': PropTypes.objectOf(PropTypes.func).isRequired,
    '🏪': PropTypes.shape({ value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]) }).isRequired,
  };

  //  How we handle a change depends on the type of toggle we are
  //  using.
  handleInput = ({ target: { value } }) => {
    const { '💪': { change } } = this.props;
    change('' + value);
  }
  handleToggle = value => {
    const { '💪': { change } } = this.props;
    change(!!value);
  }

  //  Rendering.
  render () {
    const {
      handleInput,
      handleToggle,
    } = this;
    const {
      activeIcon,
      activeLabel,
      children,
      className,
      disabled,
      inactiveIcon,
      inactiveLabel,
      settingKey,
      global,
      title,
      type,
      '🛄': context,
      '💪': handler,
      '🏪': { value },
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--SETTING', {
      active: value,
      disabled,
    }, className, type);

    //  The type of component we render depends on our `type`.
    const component = function () {
      switch (type) {
      case 'input':
        return (
          <input
            disabled={disabled}
            onChange={handleInput}
            placeholder={title}
            title={title}
            type='text'
            value={value || ''}
          />
        );
      case 'toggle':
        return (
          <CommonToggle
            active={!!value}
            activeIcon={activeIcon}
            activeLabel={activeLabel}
            disabled={disabled}
            inactiveIcon={inactiveIcon}
            inactiveLabel={inactiveLabel}
            onChange={handleToggle}
            title={title}
          />
        );
      default:
        return null;
      }
    }();

    //  If no component was generated, there's no sense in rendering.
    if (!component) {
      return null;
    }

    //  If we have children and this is an `'input'`, we create a
    //  `<label>`. If not, we use `<span>`.
    return children && type === 'input' ? (
      <label
        className={computedClass}
        {...rest}
      >
        {component}
        {children}
      </label>
    ) : (
      <span
        className={computedClass}
        {...rest}
      >
        {children}
        {component}
      </span>
    );
  };

}
