import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';

import {
  CommonButton,
  CommonMenubar,
} from 'themes/mastodon-go/components';

import './style';

const messages = defineMessages({
  settings: {
    defaultMessage: 'Settings',
    id: 'timeline.settings',
  },
});

export default class TimelineMenu extends React.PureComponent {

  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    hash: PropTypes.string,
    history: PropTypes.object,
    icon: PropTypes.string,
    intl: PropTypes.object.isRequired,
    onSetHash: PropTypes.func,
    title: PropTypes.node,
  };

  handleTimelineClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#');
    }
  };
  handleSettingsClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#settings');
    }
  };

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
      icon,
      intl,
      onSetHash,
      title,
      ...rest
    } = this.props;

    const computedClass = classNames('MASTODON_GO--TIMELINE--MENU', className);

    return (
      <CommonMenubar
        activeRoute={activeRoute}
        className={computedClass}
        history={history}
        intl={intl}
        {...rest}
      >
        <CommonButton
          active={!hash || hash === '#'}
          destination={activeRoute ? '#' : undefined}
          history={history}
          icon={icon}
          onClick={!activeRoute ? handleTimelineClick : undefined}
          title={title}
        />
        <CommonButton
          active={hash === '#settings'}
          destination={activeRoute ? '#settings' : undefined}
          history={history}
          icon='toggles'
          onClick={!activeRoute ? handleSettingsClick : undefined}
          title={intl.formatMessage(messages.settings)}
        />
      </CommonMenubar>
    );
  }

}
