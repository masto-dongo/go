import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {
  defineMessages,
  FormattedMessage,
} from 'react-intl';

import { SettingContainer } from 'themes/mastodon-go/components';

import './style';

export default function TimelineSettings ({
  className,
  path,
  ℳ,
  //  `...rest` doesn't make sense for panels
}) {
  const computedClass = classNames('MASTODON_GO--PANELLER--TIMELINE--SETTINGS', className);

  return (
    <div className={computedClass}>
      <section>
        <h2>{ℳ.basic}</h2>
        <SettingContainer
          activeLabel={ℳ.showReblogs}
          global
          inactiveLabel={ℳ.hideReblogs}
          settingKey={['timeline', path, 'shows', 'reblog']}
          type='toggle'
        />
        <SettingContainer
          activeLabel={ℳ.showReplies}
          global
          inactiveLabel={ℳ.hideReplies}
          settingKey={['timeline', path, 'shows', 'reply']}
          type='toggle'
        />
      </section>
      <section>
        <h2>{ℳ.advanced}</h2>
        <SettingContainer
          global
          settingKey={['timeline', path, 'regex', 'body']}
          title={ℳ.regex}
          type='input'
        />
      </section>
    </div>
  );
};

TimelineSettings.propTypes = {
  className: PropTypes.string,
  path: PropTypes.string.isRequired,
  ℳ: PropTypes.func.isRequired,
};
