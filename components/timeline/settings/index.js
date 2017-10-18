import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {
  defineMessages,
  FormattedMessage,
} from 'react-intl';

import { SettingContainer } from 'themes/mastodon-go/components';

import './style';

const messages = defineMessages({
  advanced: {
    defaultMessage: 'Advanced',
    id: 'settings.advanced',
  },
  basic: {
    defaultMessage: 'Basic',
    id: 'settings.basic',
  },
  reblogsOff: {
    defaultMessage: 'Hide boosts',
    id: 'settings.hide_reblogs',
  },
  reblogsOn: {
    defaultMessage: 'Show boosts',
    id: 'settings.show_reblogs',
  },
  regex: {
    defaultMessage: 'Filter out by regular expressions',
    id: 'settings.regex',
  },
  repliesOff: {
    defaultMessage: 'Hide replies',
    id: 'settings.hide_replies',
  },
  repliesOn: {
    defaultMessage: 'Show replies',
    id: 'settings.show_replies',
  },
});

export default function TimelineSettings ({
  className,
  intl,
  path,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--TIMELINE--SETTINGS', className);

  return (
    <div
      className={computedClass}
      {...rest}
    >
      <section>
        <h2><FormattedMessage {...messages.basic} /></h2>
        <SettingContainer
          activeLabel={<FormattedMessage {...messages.reblogsOn} />}
          global
          inactiveLabel={<FormattedMessage {...messages.reblogsOff} />}
          settingKey={['timeline', path, 'shows', 'reblog']}
          type='toggle'
        />
        <SettingContainer
          activeLabel={<FormattedMessage {...messages.repliesOn} />}
          global
          inactiveLabel={<FormattedMessage {...messages.repliesOff} />}
          settingKey={['timeline', path, 'shows', 'reply']}
          type='toggle'
        />
      </section>
      <section>
        <h2><FormattedMessage {...messages.advanced} /></h2>
        <SettingContainer
          global
          settingKey={['timeline', path, 'regex', 'body']}
          title={intl.formatMessage(messages.regex)}
          type='input'
        />
      </section>
    </div>
  );
};

TimelineSettings.propTypes = {
  className: PropTypes.string,
  intl: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};
