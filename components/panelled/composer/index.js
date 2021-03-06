//  <PanelledComposer>
//  ==================

//  We use `<ConnectedComposer>` as our backdrop but also need
//  `<ConnectedPreview>` for our status previews.

//  * * * * * * *  //

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
import { moduleOnReady } from 'themes/mastodon-go/util/module';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Variable declaration.
var PanelledComposer;

//  Building the paneller.
moduleOnReady(function () {
  PanelledComposer = connect(

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
      className: 'MASTODON_GO--PANELLED--COMPOSER',
      icon: 'pencil-square',
      panels: { preview: ConnectedPreview },
      title: ({ ℳ }) => ℳ.title,
    }
  );
});

//  Exporting.
export { PanelledComposer as default };
