//  <ConnectedSetting>
//  ==================

//  This component links a `<CommonInput>` or a `<CommonToggle>` with a
//  setting that is kept in the redux store.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import {
  CommonInput,
  CommonToggle,
} from 'themes/mastodon-go/components';

//  Request imports.
import { changeSetting } from 'themes/mastodon-go/redux';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
class Setting extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  Function binding.
    const {
      handleInput,
      handleToggle,
    } = Object.getPrototypeOf(this);
    this.handleInput = handleInput.bind(this);
    this.handleToggle = handleToggle.bind(this);
  }

  //  How we handle a change depends on the type of toggle we are
  //  using.
  handleInput (value) {
    const { '💪': { change } } = this.props;
    change('' + value);
  }
  handleToggle (value) {
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
      title,
      type,
      '🏪': { value },
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--SETTING', {
      active: value,
      disabled,
    }, className, type);

    //  The type of component we render depends on our `type`.
    const component = function () {
      switch (type) {
      case 'input':
        return (
          <CommonInput
            disabled={disabled}
            onChange={handleInput}
            title={title}
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
      <label className={computedClass}>
        {component}
        {children}
      </label>
    ) : (
      <span className={computedClass}>
        {children}
        {component}
      </span>
    );
  };

}

//  Props.
Setting.propTypes = {
  activeIcon: PropTypes.node,  //  The active icon for a toggle setting
  activeLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(String)]),  //  The active label for a toggle setting
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,  //  `true` if the setting is disabled
  global: PropTypes.bool,  //  `true` if the setting is a global (stored server-side) setting
  inactiveIcon: PropTypes.node,  //  The inactive icon for a toggle setting
  inactiveLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(String)]), //  The inactive label for a toggle setting
  settingKey: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,  //  The key for the setting
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(String)]),  //  The label for the setting
  type: PropTypes.oneOf(['input', 'toggle']),  //  The setting type
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({ value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]) }).isRequired,  //  The value of the setting
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component.
var ConnectedSetting = connect(

  //  Component.
  Setting,

  //  Store.
  createStructuredSelector({
    value: (state, {
      global,
      settingKey,
    }) => state.getIn(['setting', global ? 'global' : 'local'].concat(settingKey)),
  }),

  //  Messages.
  null,

  //  Handlers.
  (go, store, {
    global,
    settingKey,
  }) => ({
    change: value => go(changeSetting, settingKey, value, global),
  })
);

//  Exporting.
export { ConnectedSetting as default };
