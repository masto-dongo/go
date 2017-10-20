//  Imports
//  -------

//  Package imports.
import { defineMessages } from 'react-intl';

//  Component imports.
import {
  ConnectedComposer,
  ConnectedPreview,
  RawPaneller,
} from 'themes/mastodon-go/components';

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
  null,

  //  Messages.
  defineMessages({
    title: {
      defaultMessage: 'Compose',
      description: 'Used as the title for the drawer (where the composer is)',
      id: 'drawer.title',
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
    backdrop: ConnectedComposer,
    className: 'MASTODON_GO--PANELLED--DRAWER',
    icon: 'pencil-square',
    panels: { preview: ConnectedPreview },
    title: ({ ℳ }) => ℳ.title,
  }
);
