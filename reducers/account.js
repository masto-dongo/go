import escapeTextContentForBrowser from 'escape-html';
import {
  fromJS,
  Map as ImmutableMap,
} from 'immutable';

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

const normalizeAccount = account => {
  account = { ...account }

  account.display_name_html = emojify(escapeTextContentForBrowser(
    account.display_name || account.username
  ));
  account.note_html = emojify(account.note);

  return fromJS(account);
};

const initialState = ImmutableMap();

const updateAccounts = (state, accounts) => state.withMutations(
  map => ([].concat(accounts)).forEach(
    account => map.set(account.id, normalizeAccount(account))
  )
);

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
