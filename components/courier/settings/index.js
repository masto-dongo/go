/*********************************************************************\
|                                                                     |
|   <CourierPanelSettings>                                            |
|   ======================                                            |
|                                                                     |
|   This panel provides the various courier settings.                 |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {
  defineMessages,
  FormattedMessage,
} from 'react-intl';

//  Container imports.
import { SettingContainer } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  column: {
    defaultMessage: 'Show in column:',
    id: 'settings.column_notifs',
  },
  desktop: {
    defaultMessage: 'Desktop notifications:',
    id: 'settings.desktop_notifs',
  },
  favourite: {
    defaultMessage: 'Favourites',
    id: 'settings.favourite_notif',
  },
  follow: {
    defaultMessage: 'Follows',
    id: 'settings.follow_notif',
  },
  mention: {
    defaultMessage: 'Mentions',
    id: 'settings.mention_notif',
  },
  reblog: {
    defaultMessage: 'Boosts',
    id: 'settings.reblog_notif',
  },
  sound: {
    defaultMessage: 'Sounds:',
    id: 'settings.sound_notifs',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function CourierSettings ({
  className,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--COURIER--SETTINGS', className);

  //  Rendering.
  return (
    <div
      className={computedClass}
      {...rest}
    >
      {
        //  Column settings
        <section>
          <h2><FormattedMessage {...messages.column} /></h2>
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.follow} />}
            global
            inactiveLabel={<s><FormattedMessage {...messages.follow} /></s>}
            settingKey={['courier', 'shows', 'follow']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.favourite} />}
            global
            inactiveLabel={<s><FormattedMessage {...messages.favourite} /></s>}
            settingKey={['courier', 'shows', 'favourite']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.mention} />}
            global
            inactiveLabel={<s><FormattedMessage {...messages.mention} /></s>}
            settingKey={['courier', 'shows', 'mention']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.reblog} />}
            global
            inactiveLabel={<s><FormattedMessage {...messages.reblog} /></s>}
            settingKey={['courier', 'shows', 'boost']}
            type='toggle'
          />
        </section>
      }
      {
        //  Desktop settings
        <section>
          <h2><FormattedMessage {...messages.desktop} /></h2>
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.follow} />}
            global
            inactiveLabel={<s><FormattedMessage {...messages.follow} /></s>}
            settingKey={['courier', 'alerts', 'follow']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.favourite} />}
            global
            inactiveLabel={<s><FormattedMessage {...messages.favourite} /></s>}
            settingKey={['courier', 'alerts', 'favourite']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.mention} />}
            global
            inactiveLabel={<s><FormattedMessage {...messages.mention} /></s>}
            settingKey={['courier', 'alerts', 'mention']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.reblog} />}
            global
            inactiveLabel={<s><FormattedMessage {...messages.reblog} /></s>}
            settingKey={['courier', 'alerts', 'boost']}
            type='toggle'
          />
        </section>
      }
      {
        //  Sound settings
        <section>
          <h2><FormattedMessage {...messages.sound} /></h2>
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.follow} />}
            global
            inactiveLabel={<s><FormattedMessage {...messages.follow} /></s>}
            settingKey={['courier', 'sounds', 'follow']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.favourite} />}
            global
            inactiveLabel={<s><FormattedMessage {...messages.favourite} /></s>}
            settingKey={['courier', 'sounds', 'favourite']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.mention} />}
            global
            inactiveLabel={<s><FormattedMessage {...messages.mention} /></s>}
            settingKey={['courier', 'sounds', 'mention']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.reblog} />}
            global
            inactiveLabel={<s><FormattedMessage {...messages.reblog} /></s>}
            settingKey={['courier', 'sounds', 'boost']}
            type='toggle'
          />
        </section>
      }
    </div>
  );
};

//  Props.
CourierSettings.propTypes = { className: PropTypes.string };
