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
  favouriteOff: {
    defaultMessage: 'Favourites Off',
    id: 'settings.favourite_off',
  },
  favouriteOn: {
    defaultMessage: 'Favourites On',
    id: 'settings.favourite_on',
  },
  followOff: {
    defaultMessage: 'Follows Off',
    id: 'settings.follow_off',
  },
  followOn: {
    defaultMessage: 'Follows On',
    id: 'settings.follow_on',
  },
  mentionOff: {
    defaultMessage: 'Mentions Off',
    id: 'settings.mention_off',
  },
  mentionOn: {
    defaultMessage: 'Mentions On',
    id: 'settings.mention_on',
  },
  reblogOff: {
    defaultMessage: 'Boosts Off',
    id: 'settings.reblog_off',
  },
  reblogOn: {
    defaultMessage: 'Boosts On',
    id: 'settings.reblog_on',
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
            activeLabel={<FormattedMessage {...messages.followOn} />}
            global
            inactiveLabel={<FormattedMessage {...messages.followOff} />}
            settingKey={['courier', 'shows', 'follow']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.favouriteOn} />}
            global
            inactiveLabel={<FormattedMessage {...messages.favouriteOff} />}
            settingKey={['courier', 'shows', 'favourite']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.mentionOn} />}
            global
            inactiveLabel={<FormattedMessage {...messages.mentionOff} />}
            settingKey={['courier', 'shows', 'mention']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.reblogOn} />}
            global
            inactiveLabel={<FormattedMessage {...messages.reblogOff} />}
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
            activeLabel={<FormattedMessage {...messages.followOn} />}
            global
            inactiveLabel={<FormattedMessage {...messages.followOff} />}
            settingKey={['courier', 'alerts', 'follow']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.favouriteOn} />}
            global
            inactiveLabel={<FormattedMessage {...messages.favouriteOff} />}
            settingKey={['courier', 'alerts', 'favourite']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.mentionOn} />}
            global
            inactiveLabel={<FormattedMessage {...messages.mentionOff} />}
            settingKey={['courier', 'alerts', 'mention']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.reblogOn} />}
            global
            inactiveLabel={<FormattedMessage {...messages.reblogOff} />}
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
            activeLabel={<FormattedMessage {...messages.followOn} />}
            global
            inactiveLabel={<FormattedMessage {...messages.followOff} />}
            settingKey={['courier', 'sounds', 'follow']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.favouriteOn} />}
            global
            inactiveLabel={<FormattedMessage {...messages.favouriteOff} />}
            settingKey={['courier', 'sounds', 'favourite']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.mentionOn} />}
            global
            inactiveLabel={<FormattedMessage {...messages.mentionOff} />}
            settingKey={['courier', 'sounds', 'mention']}
            type='toggle'
          />
          <SettingContainer
            activeLabel={<FormattedMessage {...messages.reblogOn} />}
            global
            inactiveLabel={<FormattedMessage {...messages.reblogOff} />}
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
