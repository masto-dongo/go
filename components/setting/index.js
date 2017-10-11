import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';

export default class Setting extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    handler: PropTypes.objectOf(PropTypes.func).isRequired,
    global: PropTypes.bool,
    settingKey: PropTypes.oneOf([PropTypes.string, PropTypes.array]).isRequired,
    title: PropTypes.string,
    type: PropTypes.oneOf(['input', 'toggle']),
    value: PropTypes.oneOf([PropTypes.string, PropTypes.bool]),
  };

  handleChange = e => {
    const {
      handler,
      type,
    } = this.props;
    switch (type) {
    case 'input':
      handler.change('' + e.target.value);
    case 'toggle':
      handler.change(!!e.target.value);
    }
  }

  render () {
    const { handleChange } = this;
    const {
      children,
      className,
      disabled,
      key,
      global,
      title,
      type,
      value,
      ...rest
    } = this.props;

    const computedClass = classNames('MASTODON_GO--COMMON--TOGGLE', {
      active: value,
      disabled,
    }, className, type);

    const component = function (type) {
      switch (type) {
      case 'input':
        return (
          <input
            disabled={disabled}
            onChange={handleChange}
            placeholder={title}
            title={title}
            value={value}
          />
        );
      case 'toggle':
        return (
          <Toggle
            checked={value}
            disabled={disabled}
            onChange={handleChange}
            title={title}
          />
        );
      default:
        return null;
      }
    }(type);

    if (!component) {
      return null;
    }

    return children ? (
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
      >{component}</span>
    );
  };

}
