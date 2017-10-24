//  Imports
//  -------

//  Package imports.
import { defineMessages } from 'react-intl';

//  Component imports.
import {
  ConnectedCatalogue,
  ConnectedProfile,
  ConnectedTimeline,
  RawPaneller,
} from 'themes/mastodon-go/components';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';
import { moduleOnReady } from 'themes/mastodon-go/util/module';

//  * * * * * * *  //

//  Connecting
//  ----------

var PanelledProfile;

//  Building our store and handlers.
moduleOnReady(function () {
  PanelledProfile = connect(

    //  Component.
    RawPaneller,

    //  Store.
    null,

    //  Messages.
    defineMessages({
      all: {
        defaultMessage: 'Posts (with replies)',
        description: 'Menu label for a profile timeline with posts and replies',
        id: 'profile.all',
      },
      media: {
        defaultMessage: 'Media',
        description: 'Menu label for a profile timeline with only media',
        id: 'profile.media',
      },
      pinned: {
        defaultMessage: 'Pinned',
        description: 'Menu label for a profile timeline with only pinned toots',
        id: 'profile.pinned',
      },
      posts: {
        defaultMessage: 'Posts',
        description: 'Menu label for a profile timeline with posts (but no replies)',
        id: 'profile.posts',
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
      backdrop: ConnectedProfile,
      className: 'MASTODON_GO--PANELLED--PROFILE',
      icon: 'user',
      menu: ({
        ℳ: {
          all,
          media,
          pinned,
          posts,
        },
      }) => [{
        hash: '#pinned',
        icon: 'thumb-tack',
        title: pinned,
      }, {
        hash: '#posts',
        icon: 'comment',
        title: posts,
      }, {
        hash: '#all',
        icon: 'comments',
        title: all,
      }, {
        hash: '#media',
        icon: 'picture-o',
        title: media,
      }],
      panels: {
        /* eslint-disable react/prop-types */
        all: ({ id }) => <ConnectedTimeline path={`/api/v1/accounts/${id}/statuses`} />,
        followers: ({ id }) => <ConnectedCatalogue path={`/api/v1/accounts/${id}/followers`} />,
        follows: ({ id }) => <ConnectedCatalogue path={`/api/v1/accounts/${id}/following`} />,
        media: ({ id }) => <ConnectedTimeline path={`/api/v1/accounts/${id}/statuses?only_media=true`} />,
        pinned: ({ id }) => <ConnectedTimeline path={`/api/v1/accounts/${id}/statuses?pinned=true`} />,
        posts: ({ id }) => <ConnectedTimeline path={`/api/v1/accounts/${id}/statuses?exclude_replies=true`} />,
        /* eslint-enable react/prop-types */
      },
      suppressTitle: true,
      title: ({ '🏪': { at } }) => '@' + at,
    }
  );
});

export { PanelledProfile as default };
