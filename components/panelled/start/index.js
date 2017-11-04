//  <PanelledStart>
//  ===============

//  The contents of the start column are provided by
//  `<PanelledStartContents>`.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import { RawPaneller } from 'themes/mastodon-go/components';
import PanelledStartContents from './contents';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';
import { moduleOnReady } from 'themes/mastodon-go/util/module';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Variable declaration.
var PanelledStart;

//  Building the paneller.
moduleOnReady(function () {
  PanelledStart = connect(

    //  Component.
    RawPaneller,

    //  Store.
    createStructuredSelector({
      me: state => state.getIn(['meta', 'me']),
    }),

    //  Messages.
    defineMessages({
      about: {
        defaultMessage: 'About this instance',
        id: 'start.about',
      },
      compose: {
        defaultMessage: 'Compose',
        id: 'start.compose',
      },
      courier: {
        defaultMessage: 'Notifications',
        id: 'start.courier',
      },
      global: {
        defaultMessage: 'Federated timeline',
        id: 'start.global',
      },
      home: {
        defaultMessage: 'Home',
        id: 'start.home',
      },
      local: {
        defaultMessage: 'Community timeline',
        id: 'start.local',
      },
      logout: {
        defaultMessage: 'Logout',
        id: 'start.logout',
      },
      meta: {
        defaultMessage: 'Meta',
        id: 'start.meta',
      },
      personal: {
        defaultMessage: 'Personal',
        id: 'start.personal',
      },
      preferences: {
        defaultMessage: 'Preferences',
        id: 'start.preferences',
      },
      timelines: {
        defaultMessage: 'Timelines',
        id: 'start.timelines',
      },
      title: {
        defaultMessage: 'Start',
        description: 'Used as the column title for the start column',
        id: 'start.title',
      },
      //  We don't include a close button for Start.
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
      backdrop: PanelledStartContents,
      className: 'MASTODON_GO--PANELLED--START',
      icon: 'asterisk',
      title: ({ ℳ }) => ℳ.title,
    }
  );
});

//  Exporting.
export { PanelledStart as default };
