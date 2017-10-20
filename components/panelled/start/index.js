//  Imports
//  -------

//  Package imports.
import { defineMessages } from 'react-intl';

//  Component imports.
import { RawPaneller } from 'themes/mastodon-go/components';
import PanelledStartContents from './contents';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Building our store and handlers.
export default connect(

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
    drawer: {
      defaultMessage: 'Compose',
      id: 'start.drawer',
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
    title: ({ ℳ: { title }}) => title,
  }
);
