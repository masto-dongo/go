//  <PanelledProfile>
//  =================

//  We include all of the relevant timelines for the profile as panels
//  and create menu items for them.  There are also a couple of
//  catalogues which *don't* have menu items.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import React from 'react';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import {
  ConnectedCatalogue,
  ConnectedProfile,
  ConnectedTimeline,
  RawPaneller,
} from 'flavours/go/components';

//  Lib imports.
import connect from 'flavours/go/lib/connect';
import { moduleOnReady } from 'flavours/go/lib/module';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Variable declaration.
var PanelledProfile;

//  Building the paneller.
moduleOnReady(function () {
  PanelledProfile = connect(

    //  Component.
    RawPaneller,

    //  Store.
    createStructuredSelector({
      at: (state, { id }) => state.getIn(['account', id, 'at']),
    }),

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

//  Exporting.
export { PanelledProfile as default };
