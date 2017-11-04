//  <PanelledCourier>
//  =================

//  Our settings are stored in `<PanelledCourierSettings>`.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { defineMessages } from 'react-intl';

//  Component imports.
import {
  ConnectedCourier,
  RawPaneller,
} from 'themes/mastodon-go/components';
import PanelledCourierSettings from './settings';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';
import { moduleOnReady } from 'themes/mastodon-go/util/module';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Variable declaration.
var PanelledCourier;

//  Building the paneller.
moduleOnReady(function () {
  PanelledCourier = connect(

    //  Component.
    RawPaneller,

    //  Store.
    null,

    //  Messages.
    defineMessages({
      columnNotifs: {
        defaultMessage: 'Show in column:',
        description: 'Heading for column notifications in courier settings',
        id: 'courier.column_notifs',
      },
      desktopNotifs: {
        defaultMessage: 'Desktop notifications:',
        description: 'Heading for desktop notifications in courier settings',
        id: 'courier.desktop_notifs',
      },
      favouriteOff: {
        defaultMessage: 'No Favourites',
        description: 'Option to turn off favourite notifications in courier settings',
        id: 'courier.favourite_off',
      },
      favouriteOn: {
        defaultMessage: 'Favourites',
        description: 'Option to turn on favourite notifications in courier settings',
        id: 'courier.favourite_on',
      },
      followOff: {
        defaultMessage: 'No Follows',
        description: 'Option to turn off follow notifications in courier settings',
        id: 'courier.follow_off',
      },
      followOn: {
        defaultMessage: 'Follows',
        description: 'Option to turn on favourite notifications in courier settings',
        id: 'courier.follow_on',
      },
      mentionOff: {
        defaultMessage: 'No Mentions',
        description: 'Option to turn off mention notifications in courier settings',
        id: 'courier.mention_off',
      },
      mentionOn: {
        defaultMessage: 'Mentions',
        description: 'Option to turn on mention notifications in courier settings',
        id: 'courier.mention_on',
      },
      reblogOff: {
        defaultMessage: 'No Boosts',
        description: 'Option to turn off reblog notifications in courier settings',
        id: 'courier.reblog_off',
      },
      reblogOn: {
        defaultMessage: 'Boosts',
        description: 'Option to turn on reblog notifications in courier settings',
        id: 'courier.reblog_on',
      },
      settings: {
        defaultMessage: 'Settings',
        description: 'Used as the label for a settings panel in the paneller menu',
        id: 'paneller.settings',
      },
      soundNotifs: {
        defaultMessage: 'Sounds:',
        description: 'Heading for sound notifications in courier settings',
        id: 'courier.sound_notifs',
      },
      title: {
        defaultMessage: 'Notifications',
        description: 'Used as the title for a courier (notifications) column',
        id: 'courier.title',
      },
      '❌': {
        defaultMessage: 'Close',
        description: 'Used in the paneller menu to return to Start',
        id: 'paneller.close',
      },
      '⬅': {
        defaultMessage: 'Back',
        description: 'Used in the paneller menu to close the current panel',
        id: 'paneller.back',
      },
    }),

    //  Handlers.
    null,

    //  Panelling.
    {
      backdrop: ConnectedCourier,
      className: 'MASTODON_GO--PANELLED--COURIER',
      icon: 'star-half-o',
      menu: ({ ℳ }) => [{
        hash: '#settings',
        icon: 'sliders',
        title: ℳ.settings,
      }],
      panels: { settings: PanelledCourierSettings },
      title: ({ ℳ }) => ℳ.title,
    }
  );
});

//  Exporting.
export { PanelledCourier as default };
