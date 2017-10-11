import classNames from 'classnames'
import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';

import {
  CommonButton,
  CommonMenubar,
} from 'themes/mastodon-go/components';

import './style';

const messages = defineMessages({ settings: {
  defaultMessage: "Settings",
  id: "courier.settings",
} });

export default class CourierMenu extends React.PureComponent {

  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    hash: PropTypes.string,
    history: PropTypes.object,
    intl: PropTypes.object.isRequired,
    onSetHash: PropTypes.func,
    rainbow: ImmutablePropTypes.map.isRequired,
    title: PropTypes.node,
  };

  handleCourierClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#')
    }
  }
  handleSettingsClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#settings')
    }
  }

  render () {
    const {
      handleTimelineClick,
      handleSettingsClick,
    } = this;
    const {
      activeRoute,
      className,
      hash,
      history,
      intl,
      onSetHash,
      rainbow,
      title,
      ...rest
    } = this.props;

    const computedClass = classNames('MASTODON_GO--COURIER--MENU', className);

    return (
      <CommonMenubar
        className={computedClass}
        {...rest}
      >
        <CommonButton
          active
          destination={activeRoute ? '#' : undefined}
          history={history}
          icon='bell'
          onClick={!activeRoute ? handleCourierClick : undefined}
          style={hash !== '#settings' ? { backgroundImage: `linear-gradient(160deg, ${rainbow.get('3').join(', ')})` } : { color: rainbow.get('1') }}
          title={title}
        />
        <CommonButton
          active
          destination={activeRoute ? '#settings' : undefined}
          history={history}
          icon='toggles'
          onClick={!activeRoute ? handleSettingsClick : undefined}
          style={hash === '#settings' ? { backgroundImage: `linear-gradient(160deg, ${rainbow.get('3').join(', ')})` } : { color: rainbow.get('1') }}
          title={intl.formatMessage(messages.settings)}
        />
      </CommonMenubar>
    );
  }

}
