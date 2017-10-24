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
export default function PanelledCourierSettings ({
  className,
  ℳ,
  //  `...rest` doesn't make sense for panels
}) {
  const computedClass = classNames('MASTODON_GO--PANELLED--COURIER--SETTINGS', className);

  //  Rendering.
  return (
    <div className={computedClass}>
      {
        //  Column settings
        <section>
          <h2>{ℳ.columnNotifs}</h2>
          <ConnectedSetting
            activeLabel={ℳ.followOn}
            global
            inactiveLabel={ℳ.followOff}
            settingKey={['courier', 'shows', 'follow']}
            type='toggle'
          />
          <ConnectedSetting
            activeLabel={ℳ.favouriteOn}
            global
            inactiveLabel={ℳ.favouriteOff}
            settingKey={['courier', 'shows', 'favourite']}
            type='toggle'
          />
          <ConnectedSetting
            activeLabel={ℳ.mentionOn}
            global
            inactiveLabel={ℳ.mentionOff}
            settingKey={['courier', 'shows', 'mention']}
            type='toggle'
          />
          <ConnectedSetting
            activeLabel={ℳ.reblogOn}
            global
            inactiveLabel={ℳ.reblogOff}
            settingKey={['courier', 'shows', 'boost']}
            type='toggle'
          />
        </section>
      }{
        //  Desktop settings
        <section>
          <h2>{ℳ.desktopNotifs}</h2>
          <ConnectedSetting
            activeLabel={ℳ.followOn}
            global
            inactiveLabel={ℳ.followOff}
            settingKey={['courier', 'alerts', 'follow']}
            type='toggle'
          />
          <ConnectedSetting
            activeLabel={ℳ.favouriteOn}
            global
            inactiveLabel={ℳ.favouriteOff}
            settingKey={['courier', 'alerts', 'favourite']}
            type='toggle'
          />
          <ConnectedSetting
            activeLabel={ℳ.mentionOn}
            global
            inactiveLabel={ℳ.mentionOff}
            settingKey={['courier', 'alerts', 'mention']}
            type='toggle'
          />
          <ConnectedSetting
            activeLabel={ℳ.reblogOn}
            global
            inactiveLabel={ℳ.reblogOff}
            settingKey={['courier', 'alerts', 'boost']}
            type='toggle'
          />
        </section>
      }{
        //  Sound settings
        <section>
          <h2>{ℳ.soundNotifs}</h2>
          <ConnectedSetting
            activeLabel={ℳ.followOn}
            global
            inactiveLabel={ℳ.followOff}
            settingKey={['courier', 'sounds', 'follow']}
            type='toggle'
          />
          <ConnectedSetting
            activeLabel={ℳ.favouriteOn}
            global
            inactiveLabel={ℳ.favouriteOff}
            settingKey={['courier', 'sounds', 'favourite']}
            type='toggle'
          />
          <ConnectedSetting
            activeLabel={ℳ.mentionOn}
            global
            inactiveLabel={ℳ.mentionOff}
            settingKey={['courier', 'sounds', 'mention']}
            type='toggle'
          />
          <ConnectedSetting
            activeLabel={ℳ.reblogOn}
            global
            inactiveLabel={ℳ.reblogOff}
            settingKey={['courier', 'sounds', 'boost']}
            type='toggle'
          />
        </section>
      }
    </div>
  );
};

//  Props.
PanelledCourierSettings.propTypes = {
  className: PropTypes.string,
  ℳ: PropTypes.func.isRequired,
};
