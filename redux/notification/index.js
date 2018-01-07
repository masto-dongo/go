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

//  Request.
import clearNotification from './clear';
import deleteNotification from './delete';
import fetchNotification from './fetch';
import removeNotification from './remove';

//  Action types.
import { COURIER_EXPAND_SUCCESS } from '../courier/expand';
import { COURIER_FETCH_SUCCESS } from '../courier/fetch';
import { COURIER_REFRESH_SUCCESS } from '../courier/refresh';
import { COURIER_UPDATE_RECEIVE } from '../courier/update';
import { NOTIFICATION_FETCH_SUCCESS } from '../notification/fetch';
import { NOTIFICATION_REMOVE_COMPLETE } from '../notification/remove';
import { RELATIONSHIP_BLOCK_SUCCESS } from '../relationship/block';
import { RELATIONSHIP_MUTE_SUCCESS } from '../relationship/mute';
import { STATUS_REMOVE_COMPLETE } from '../status/remove';

//  Constants.
import { POST_TYPE } from '../../constants';

//  * * * * * * *  //

//  Setup
//  -----

//  `normalize` takes a `notification` API object and turns it into the
//  Immutable map that we will store. We only keep track of the `id`s
//  of the notification's related `account` and `status`—not their
//  contents.
const normalize = notification => ImmutableMap({
  account: notification.account.id,
  datetime: new Date(notification.created_at),
  id: notification.id,
  status: notification.status ? notification.status.id : null,
  type: (
    type => {
      switch (type) {
      case 'follow':
        return POST_TYPE.FOLLOW;
      case 'favourite':
        return POST_TYPE.FAVOURITE;
      case 'reblog':
        return POST_TYPE.REBLOG;
      case 'mention':
        return POST_TYPE.MENTION;
      default:
        return POST_TYPE.UNKNOWN;
      }
    }
  )(notification.type),
});

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is an empty map. Our notifications will be
//  stored here by `id`.
const initialState = ImmutableMap();

//  `set()` stores the normalized value of the given `notifications` in
//  the store.
const set = (state, notifications) => state.withMutations(
  map => ([].concat(notifications)).forEach(
    notification => {
      if (notification) {
        map.set('' + notification.id, normalize(notification));
      }
    }
  )
);

//  `remove()` deletes the notifications with the given `ids` from the
//  store.
const remove = (state, ids) => state.deleteAll([].concat(ids));

//  `filterByAccount()` deletes those notifications whose associated
//  `account` matches one of the ones provided.
const filterByAccount = (state, accounts) => {
  accounts = [].concat(accounts);
  state.filter(
    notification => accounts.indexOf(notification.get('account')) === -1
  );
};

// `filterByStatus()` deletes those notifications whose associated
//  `status` matches one of the ones provided.
const filterByStatus = (state, statuses) => {
  statuses = [].concat(statuses);
  state.filter(
    notification => !notification.get('status') || statuses.indexOf(notification.get('status')) === -1
  );
};

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function notification (state = initialState, action) {
  switch(action.type) {
  case COURIER_EXPAND_SUCCESS:
  case COURIER_FETCH_SUCCESS:
  case COURIER_REFRESH_SUCCESS:
    return set(state, action.notifications);
  case COURIER_UPDATE_RECEIVE:
    return set(state, action.notification);
  case NOTIFICATION_FETCH_SUCCESS:
    return set(state, action.notification);
  case NOTIFICATION_REMOVE_COMPLETE:
    return remove(state, action.ids);
  case RELATIONSHIP_BLOCK_SUCCESS:
  case RELATIONSHIP_MUTE_SUCCESS:
    if (action.relationship.blocking || action.relationship.muting && action.relationship.muting.notifications) {
      return filterByAccount(state, action.relationship.id);
    }
    return state;
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
export {
  clearNotification,
  deleteNotification,
  fetchNotification,
  removeNotification,
};
