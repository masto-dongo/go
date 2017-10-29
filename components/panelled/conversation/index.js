//  Imports
//  -------

//  Package imports.
import { List as ImmutableList } from 'immutable';
import React from 'react';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import {
  ConnectedAvatar,
  ConnectedConversation,
  RawPaneller,
} from 'themes/mastodon-go/components';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';
import { moduleOnReady } from 'themes/mastodon-go/util/module';

//  * * * * * * *  //

//  Connecting
//  ----------

var PanelledConversation;

//  Building our store and handlers.
moduleOnReady(function () {
  PanelledConversation = connect(

    //  Component.
    RawPaneller,

    //  Store.
    createStructuredSelector({
      ancestors: (state, { id }) => state.getIn(['conversation', id, 'ancestors']),
      descendants: (state, { id }) => state.getIn(['conversation', id, 'descendants']),
      status: (state, { id }) => state.getIn(['status', id]),
    }),

    //  Messages.
    defineMessages({
      title: {
        defaultMessage: 'Conversation',
        description: 'Used as column title for a conversation',
        id: 'conversation.title',
      },
      viewProfile: {
        defaultMessage: 'View profile',
        description: 'Used as a label for profile menu buttons in conversations',
        id: 'conversation.view_profile',
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
      backdrop: ConnectedConversation,
      className: 'MASTODON_GO--PANELLED--CONVERSATION',
      menu: function ({
        id,
        ℳ,
        '🏪': {
          ancestors,
          descendants,
          status,
        },
      }) {
        if (!ancestors || !descendants) {
          return [];
        }
        return ancestors.concat(ImmutableList([status]), descendants).map(
          item => item ? item.get('account') : null
        ).filter(
          item => !!item
        ).toOrderedSet().reduce(function (items, item, index) {
          items.push({
            destination: `/profile/${item}`,
            icon: <ConnectedAvatar account={item} />,
            title: ℳ.viewProfile,
          });
          return items;
        }, []);
      },
      title: ({ ℳ }) => ℳ.title,
    }
  );
});

export { PanelledConversation as default };
