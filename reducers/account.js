//  reducers/account
//  ================

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import escapeTextContentForBrowser from 'escape-html';
import {
  fromJS as immutableFromJS,
  Map as ImmutableMap,
} from 'immutable';

//  Our imports.
import {
  ACCOUNT_FETCH_SUCCESS,
  ACCOUNT_RELATE_SUCCESS,
} from 'mastodon-go/actions/account';
import {
  CATALOGUE_FETCH_SUCCESS,
  CATALOGUE_EXPAND_SUCCESS,
} from 'mastodon-go/actions/catalogue';
import { CONVERSATION_FETCH_SUCCESS } from 'mastodon-go/actions/conversation';
import {
  COURIER_UPDATE,
  COURIER_FETCH_SUCCESS,
  COURIER_EXPAND_SUCCESS,
} from 'mastodon-go/actions/courier';
import { NOTIFICATION_FETCH_SUCCESS } from 'mastodon-go/actions/notification';
import {
  TIMELINE_UPDATE,
  TIMELINE_FETCH_SUCCESS,
  TIMELINE_EXPAND_SUCCESS,
} from 'mastodon-go/actions/timeline';
import { STATUS_FETCH_SUCCESS } from 'mastodon-go/actions/status';
import emojify from 'mastodon-go/util/emojify';

//  * * * * * * *  //

//  Helper functions
//  ----------------

//  This normalizes our account into an Immutable map. First we clone
//  our object to ensure that our modifications don't impact anything
//  anywhere else.
const normalizeAccount = account => {
  account = { ...account }

  //  `display_name_html` holds the HTML rendering of our account's
  //  display name. `note_html` has the HTML'd note contents.
  account.display_name_html = emojify(escapeTextContentForBrowser(
    account.display_name || account.username
  ));
  account.note_html = emojify(account.note);

  //  Now that we've set those properties, we can just use
  //  `immutableFromJS()` to get the Immutable version of our account.
  return fromJS(account);
};

//  * * * * * * *  //

//  State handling
//  --------------

//  Our initial state is an empty map. Our accounts will be added to
//  this by `id`.
const initialState = ImmutableMap();

//  For each `account`, we just update (or set) the Immutable map at
//  its `id` to be a newly normalized account.
const updateAccounts = (state, accounts) => state.withMutations(
  map => ([].concat(accounts)).forEach(
    account => map.set(account.id, normalizeAccount(account))
  )
);

//  * * * * * * *  //

//  Action reducing
//  ---------------

export default function account (state = initialState, action) {
  switch (action.type) {
  case ACCOUNT_FETCH_SUCCESS:
    return updateAccounts(state, action.account);
  case ACCOUNT_RELATE_SUCCESS:
  case CATALOGUE_FETCH_SUCCESS:
  case CATALOGUE_EXPAND_SUCCESS:
    return updateAccounts(state, action.accounts);
  case CONVERSATION_FETCH_SUCCESS:
  case COURIER_UPDATE:
    return updateAccounts(state, [
      action.notification.account,
      action.notification.status.account,
    ]);
  case COURIER_FETCH_SUCCESS:
  case COURIER_EXPAND_SUCCESS:
    return updateAccounts(state, action.notifications.map(
      notification => notification.account
    ).concat(action.notifications.map(
      notification => notification.status.account
    )));
  case NOTIFICATION_FETCH_SUCCESS:
    return updateAccounts(state, [
      action.notification.account,
      action.notification.status.account,
    ]);
  case TIMELINE_UPDATE:
    return updateAccounts(state, action.status.account);
  case TIMELINE_FETCH_SUCCESS:
  case TIMELINE_EXPAND_SUCCESS:
    return updateAccounts(state, action.statuses.map(
      status => status.account
    ));
  case STATUS_FETCH_SUCCESS:
    return updateAccounts(state, action.status.account);
  default:
    return state;
  }
}
