//  <PanelledConversation>
//  ======================

//  We create a menu out of all of the accounts participating in the
//  conversation to make them easy to access.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { Map as ImmutableMap } from 'immutable';
import React from 'react';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import {
  ConnectedAvatar,
  ConnectedConversation,
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
var PanelledConversation;

//  Building the paneller.
moduleOnReady(function () {
  PanelledConversation = connect(

    //  Component.
    RawPaneller,

    //  Store.
    createStructuredSelector({
      account: (state, { id }) => state.getIn(['status', id, 'account']),
      ancestors: (state, { id }) => state.getIn(['conversation', id, 'ancestors']),
      descendants: (state, { id }) => state.getIn(['conversation', id, 'descendants']),
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
      id: 'th-list',
      menu: function ({
        ℳ,
        '🏪': {
          account,
          ancestors,
          descendants,
        },
      }) {
        if (!ancestors || !descendants) {
          return [];
        }
        return ancestors.concat(account, descendants).map(
          item => ImmutableMap.isMap(item) ? item.get('account') : account
        ).toOrderedSet().reduce(function (items, item) {
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

//  Exporting.
export { PanelledConversation as default };
