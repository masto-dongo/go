//  ACCOUNT
//  =======

//  Upstream Mastodon splits out some of its account information
//  (namely, the various counts for followers, etc.), but we leave them
//  all packaged together. Good selector design should overcome any
//  problems that this might otherwise cause.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { Map as ImmutableMap } from 'immutable';

//  Action types.
import { ACCOUNT_FETCH_SUCCESS } from 'mastodon-go/redux/account/fetch';
import { CATALOGUE_EXPAND_SUCCESS } from 'mastodon-go/redux/catalogue/expand';
import { CATALOGUE_FETCH_SUCCESS } from 'mastodon-go/redux/catalogue/fetch';
import { CATALOGUE_REFRESH_SUCCESS } from 'mastodon-go/redux/catalogue/refresh';
import { CONVERSATION_FETCH_SUCCESS } from 'mastodon-go/redux/conversation/fetch';
import { COURIER_EXPAND_SUCCESS } from 'mastodon-go/redux/courier/expand';
import { COURIER_FETCH_SUCCESS } from 'mastodon-go/redux/courier/fetch';
import { COURIER_REFRESH_SUCCESS } from 'mastodon-go/redux/courier/refresh';
import { COURIER_UPDATE_RECIEVE } from 'mastodon-go/redux/courier/update';
import { NOTIFICATION_FETCH_SUCCESS } from 'mastodon-go/redux/notification/fetch';
import { TIMELINE_EXPAND_SUCCESS } from 'mastodon-go/redux/timeline/expand';
import { TIMELINE_FETCH_SUCCESS } from 'mastodon-go/redux/timeline/fetch';
import { TIMELINE_REFRESH_SUCCESS } from 'mastodon-go/redux/timeline/refresh';
import { TIMELINE_UPDATE_RECIEVE } from 'mastodon-go/redux/timeline/update';
import { STATUS_FETCH_SUCCESS } from 'mastodon-go/actions/status/fetch';

//  * * * * * * *  //

//  Setup
//  -----

//  This normalizes our account into an Immutable map. First we clone
//  our object to ensure that our modifications don't impact anything
//  anywhere else.
const normalize = account => ImmutableMap({
  at: '' + account.acct,
  avatar: ImmutableMap({
    original: '' + account.avatar,
    static: '' + account.avatar_static,
  }),
  bio: '' + account.bio,
  counts: ImmutableMap({
    followers: +account.followers_count,
    following: +account.following_count,
    statuses: +account.statuses_count,
  }),
  datetime: new Date(account.created_at),
  displayName: '' + (account.display_name || account.username),
  domain: '' + (account.acct.split('@')[1] || ''),
  header: ImmutableMap({
    original: '' + account.header,
    static: '' + account.header_static,
  }),
  href: '' + account.url,
  id: '' + account.id,
  locked: !!account.locked,
  username: '' + account.username,
});

{
  account = { ...account }

  //  `domain` holds the domain of our account. It is `null` for local
  //  accounts.
  account.domain = account.acct.split('@')[1] || null;

  //  `display_name_html` holds the HTML rendering of our account's
  //  display name. `note_html` has the HTML'd note contents.
  account.display_name_html = emojify(escapeTextContentForBrowser(
    account.display_name || account.username
  ));
  account.note_html = emojify(account.note);

  //  Now that we've set those properties, we can just use
  //  `immutableFromJS()` to get the Immutable version of our account.
  return immutableFromJS(account);
};

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is an empty map. Our accounts will be added to
//  this by `id`.
const initialState = ImmutableMap();

//  With `set()`, we just set the Immutable map at each `account`'s
//  `id` to be a newly normalized account.
const set = (state, accounts) => state.withMutations(
  map => [].concat(accounts).forEach(
    account => map.set(account.id, normalize(account))
  )
);

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function account (state = initialState, action) {
  switch (action.type) {
  case ACCOUNT_FETCH_SUCCESS:
    return set(state, action.account);
  case CATALOGUE_EXPAND_SUCCESS:
  case CATALOGUE_FETCH_SUCCESS:
  case CATALOGUE_REFRESH_SUCCESS:
    return set(state, action.accounts);
  case CONVERSATION_FETCH_SUCCESS:
    return set(state, [].concat(action.ancestors.map(
      status => status.account
    ), action.descendants.map(
      status => status.account
    )));
  case COURIER_EXPAND_SUCCESS:
  case COURIER_FETCH_SUCCESS:
  case COURIER_REFRESH_SUCCESS:
    return set(state, [].concat(...action.notifications.map(
      notification => [
        notification.account,
        notification.status.account,
      ]
    )));
  case COURIER_UPDATE_RECIEVE:
    return set(state, [
      action.notification.account,
      action.notification.status.account,
    ]);
  case NOTIFICATION_FETCH_SUCCESS:
    return set(state, [
      action.notification.account,
      action.notification.status.account,
    ]);
  case STATUS_FETCH_SUCCESS:
    return set(state, action.status.account);
  case TIMELINE_EXPAND_SUCCESS:
  case TIMELINE_FETCH_SUCCESS:
  case TIMELINE_REFRESH_SUCCESS:
    return update(state, action.statuses.map(
      status => status.account
    ));
  case TIMELINE_UPDATE_RECIEVE:
    return set(state, action.status.account);
  default:
    return state;
  }
}

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export { authorizeAccount } from './authorize';
export { blockAccount } from './block';
export { fetchAccount } from './fetch';
export { followAccount } from './follow';
export { muteAccount } from './mute';
export { rejectAccount } from './reject';
export { unblockAccount } from './unblock';
export { unfollowAccount } from './unfollow';
export { unmuteAccount } from './unmute';
