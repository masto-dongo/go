import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { ConnectedSetting } from 'themes/mastodon-go/components';

import './style';

export default function PanelledTimelineSettings ({
  className,
  path,
  ℳ,
  //  `...rest` doesn't make sense for panels
}) {
  const computedClass = classNames('MASTODON_GO--PANELLED--TIMELINE--SETTINGS', className);

  return (
    <div className={computedClass}>
      <section>
        <h2>{ℳ.basic}</h2>
        <ConnectedSetting
          activeLabel={ℳ.showReblogs}
          global
          inactiveLabel={ℳ.hideReblogs}
          settingKey={['timeline', path, 'shows', 'reblog']}
          type='toggle'
        />
        <ConnectedSetting
          activeLabel={ℳ.showReplies}
          global
          inactiveLabel={ℳ.hideReplies}
          settingKey={['timeline', path, 'shows', 'reply']}
          type='toggle'
        />
      </section>
      <section>
        <h2>{ℳ.advanced}</h2>
        <ConnectedSetting
          global
          settingKey={['timeline', path, 'regex', 'body']}
          title={ℳ.regex}
          type='input'
        />
      </section>
    </div>
  );
};

PanelledTimelineSettings.propTypes = {
  className: PropTypes.string,
  path: PropTypes.string.isRequired,
  ℳ: PropTypes.func.isRequired,
};
