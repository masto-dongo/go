//  <PanelledTimelineSettings>
//  ==========================

//  Our timeline settings are just a list of toggles and inputs,
//  broken up into sections.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import { ConnectedSetting } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function PanelledTimelineSettings ({
  className,
  path,
  ℳ,
}) {
  const computedClass = classNames('MASTODON_GO--PANELLED--TIMELINE--SETTINGS', className);

  //  Rendering.
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

//  Props.
PanelledTimelineSettings.propTypes = {
  className: PropTypes.string,
  path: PropTypes.string.isRequired,  //  The API path to the timeline
  ℳ: PropTypes.func.isRequired,
};
