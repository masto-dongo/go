import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {
  defineMessages,
  FormattedMessage,
} from 'react-intl';

import { SettingContainer } from 'themes/mastodon-go/components';

const messages = defineMessages({
  advanced: {
    defaultMessage: 'Advanced',
    id: 'settings.advanced',
  },
  basic: {
    defaultMessage: 'Basic',
    id: 'settings.basic',
  },
  reblogs: {
    defaultMessage: 'Show boosts',
    id: 'settings.show_reblogs',
  },
  regex: {
    defaultMessage: 'Filter out by regular expressions',
    id: 'settings.regex',
  },
  replies: {
    defaultMessage: 'Show replies',
    id: 'settings.show_replies',
  },
});

export default function TimelinePaneSettings ({
  className,
  intl,
  path,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--TIMELINE--PANE--SETTINGS', className);

  return (
    <div
      class={computedClass}
      {...rest}
    >
      <section>
        <h2><FormattedMessage {...messages.basic} /></h2>
        <SettingContainer
          global
          settingKey={['timeline', path, 'shows', 'reblog']}
          type='toggle'
        ><FormattedMessage {...messages.reblogs} /></SettingContainer>
        <SettingContainer
          global
          settingKey={['timeline', path, 'shows', 'reply']}
          type='toggle'
        ><FormattedMessage {...messages.replies} /></SettingContainer>
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

TimelinePaneSettings.propTypes = {
  className: PropTypes.string,
  intl: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
}
