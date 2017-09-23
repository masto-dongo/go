//  NOTIFICATION
//  ============

//  Upstream Mastodon doesn't store notifications separately like it
//  does statuses… but we do, so that the notification/courier and
//  status/timeline models neatly reflect one another. Furthermore,
//  it means we can easily refer to notifications by `id`—just like we
//  do with statuses.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { Map as ImmutableMap } from 'immutable';

//  Action types.
import { ACCOUNT_BLOCK_SUCCESS } from 'mastodon-go/redux/account/block';
import { ACCOUNT_MUTE_SUCCESS } from 'mastodon-go/redux/account/mute';
import { COURIER_EXPAND } from 'mastodon-go/redux/courier/expand';
import { COURIER_FETCH } from 'mastodon-go/redux/courier/fetch';
import { COURIER_REFRESH } from 'mastodon-go/redux/courier/refresh';
import { COURIER_UPDATE } from 'mastodon-go/redux/courier/update';
import { NOTIFICATION_FETCH_SUCCESS } from 'mastodon-go/redux/notification/fetch';
import { NOTIFICATION_REMOVE_COMPLETE } from 'mastodon-go/redux/notification/remove';
import { STATUS_REMOVE_COMPLETE } from 'mastodon-go/redux/status/remove';

//  Our imports.
import { NOTIFICATION_TYPE } from 'mastodon-go/util/constants';

//  * * * * * * *  //

//  Setup
//  -----

//  `normalize` takes a `notification` API object and turns it into the
//  Immutable map that we will store. We only keep track of the `id`s
//  of the notification's related `account` and `status`—not their
//  contents.
const normalize = notification => ImmutableMap({
  id: notification.id,
  type: (
    type => {
      switch (type) {
      case "follow":
        return NOTIFICATION_TYPE.FOLLOW;
      case "favourite":
        return NOTIFICATION_TYPE.FAVOURITE;
      case "reblog":
        return NOTIFICATION_TYPE.REBLOG;
      case "mention":
        return NOTIFICATION_TYPE.MENTION;
      default:
        return NOTIFICATION_TYPE.UNKNOWN;
      }
    }
  )(notification.type),
  account: notification.account.id,
  status: notification.status ? notification.status.id : null,
});

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is an empty map. Our notifications will be
//  stored here by `id`.
const initialState = ImmutableMap();

//  `set()` sets the value of the given `notifications` to their
//  normalized equivalents in the store.
const set = (state, notifications) => state.withMutations(
  map => ([].concat(notifications)).forEach(
    notification => map.set(notification.id, normalize(notification))
  )
);

//  `remove()` deletes the notifications at the given `ids` from the
//  store.
const remove = (state, ids) => state.deleteAll([].concat(ids));

//  `filterByAccount()` deletes those notifications whose associated
//  `account` matches one of the ones provided.
const filterByAccount = (state, accounts) => {
  accounts = [].concat(accounts);
  state.filter(
    notification => accounts.indexOf(notification.account) === -1
  );
}

// `filterByStatus()` deletes those notifications whose associated
//  `status` matches one of the ones provided.
const filterByStatus = (state, statuses) => {
  statuses = [].concat(statuses);
  state.filter(
    notification => status === null || statuses.indexOf(notification.status) === -1
  );
}

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function notification (state = initialState, action) {
  switch(action.type) {
  case ACCOUNT_BLOCK_SUCCESS:
  case ACCOUNT_MUTE_SUCCESS:
    if (action.relationship.blocking || action.relationship.muting && action.relationship.muting.notifications) {
      return filterByAccount(state, action.relationship.id)
    }
    return state;
  case COURIER_EXPAND_SUCCESS:
  case COURIER_FETCH_SUCCESS:
  case COURIER_REFRESH_SUCCESS:
    return set(state, action.notifications)
  case COURIER_UPDATE:
    return set(state, action.notification);
  case NOTIFICATION_FETCH_SUCCESS:
    return set(state, action.notification);
  case NOTIFICATION_REMOVE_COMPLETE:
    return remove(state, action.ids);
  case STATUS_REMOVE_COMPLETE:
    return filterByStatus(state, action.ids);
  default:
    return state;
  }
};

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export { clearNotification } from './clear';
export { deleteNotification } from './delete';
export { fetchNotification } from './fetch';
export { removeNotification } from './remove';
