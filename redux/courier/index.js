//  COURIER
//  =======

//  The name "courier" for the thing that holds your notifications
//  was inspired by the custom localization of
//  <https://monsterpit.net/>.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  List as ImmutableList,
  Map as ImmutableMap,
} from 'immutable';

import connectCourier from './connect';
import expandCourier from './expand';
import fetchCourier from './fetch';
import refreshCourier from './refresh';
import updateCourier from './update';

//  Action types.
import {
  COURIER_EXPAND_FAILURE,
  COURIER_EXPAND_REQUEST,
  COURIER_EXPAND_SUCCESS,
} from '../courier/expand';
import {
  COURIER_FETCH_FAILURE,
  COURIER_FETCH_REQUEST,
  COURIER_FETCH_SUCCESS,
} from '../courier/fetch';
import {
  COURIER_REFRESH_FAILURE,
  COURIER_REFRESH_REQUEST,
  COURIER_REFRESH_SUCCESS,
} from '../courier/refresh';
import { COURIER_UPDATE_RECEIVE } from '../courier/update';
import { NOTIFICATION_REMOVE_COMPLETE } from '../notification/remove';
import { RELATIONSHIP_BLOCK_SUCCESS } from '../relationship/block';
import { RELATIONSHIP_MUTE_SUCCESS } from '../relationship/mute';
import { STATUS_REMOVE_COMPLETE } from '../status/remove';

//  * * * * * * *  //

//  Setup
//  -----

//  `normalize()` takes a list of `notifications` and turns it into a
//  proper courier. We keep track of the `id`s of each `notification`,
//  alongside its associated `account` and `status`.
const normalize = notifications => ImmutableList(notifications ? [].concat(notifications).map(
  notification => ImmutableMap({
    account: notification.account.id,
    id: notification.id,
    status: notification.status ? notification.status.id : null,
  })
) : []);

//  * * * * * * *  //

//  State
//  -----

//  We keep track of whether the courier is `connected`, whether it
//  `isLoading`, and, of course, its `notifications`.
const initialState = ImmutableMap({
  isLoading: false,
  notifications: ImmutableList(),
  next: null,
  prev: null,
});

//  `set()` just replaces our `notifications` with a new `normalized()`
//  list.
const set = (state, notifications, prev, next) => state.withMutations(
  map => {
    map.set('isLoading', false);
    map.set('notifications', normalize(notifications));
    map.setIn('prev', '' + prev);
    map.setIn('next', '' + next);
  }
);

//  `prepend()` prepends the given `notifications` to the state.
const prepend = (state, notifications, prev, next) => state.withMutations(
  map => {
    map.set('isLoading', false);
    map.update(
      'notifications',
      list => normalize(notifications).concat(list)
    );
    map.setIn('prev', '' + prev);
    map.setIn('next', '' + next);
  }
);

//  `append()` appends the given `notifications` to the state.
const append = (state, notifications, prev, next) => state.withMutations(
  map => {
    map.set('isLoading', false);
    map.update(
      'notifications',
      list => list.concat(normalize(notifications))
    );
    map.setIn('prev', '' + prev);
    map.setIn('next', '' + next);
  }
);

//  `filterByAccount()` removes the `notification`s associated with the
//  provided `accounts` from the courier.
const filterByAccount = (state, accounts) => {
  accounts = [].concat(accounts);
  return state.update(
    'notifications',
    list => list.filter(
      notification => accounts.indexOf(notification.get('account')) === -1
    )
  );
};

//  `filterById()` removes the `notification`s associated with the
//  provided `ids` from the courier.
const filterById = (state, ids) => {
  ids = [].concat(ids);
  return state.update(
    'notifications',
    list => list.filter(
      notification => ids.indexOf(notification.get('id')) === -1
    )
  );
};

//  `filterByStatus()` removes the `notification`s associated with the
//  provided `statuses` from the courier.
const filterByStatus = (state, statuses) => {
  statuses = [].concat(statuses);
  return state.update(
    'notifications',
    list => list.filter(
      notification => !notification.get('status') || statuses.indexOf(notification.get('status')) === -1
    )
  );
};

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function courier (state = initialState, action) {
  switch (action.type) {
  case COURIER_EXPAND_FAILURE:
    return state.set('isLoading', false);
  case COURIER_EXPAND_REQUEST:
    return state.set('isLoading', true);
  case COURIER_EXPAND_SUCCESS:
    return append(state, action.notifications, action.prev, action.next);
  case COURIER_FETCH_FAILURE:
    return state.set('isLoading', false);
  case COURIER_FETCH_REQUEST:
    return state.set('isLoading', true);
  case COURIER_FETCH_SUCCESS:
    return set(state, action.notifications, action.prev, action.next);
  case COURIER_REFRESH_FAILURE:
    return state.set('isLoading', false);
  case COURIER_REFRESH_REQUEST:
    return state.set('isLoading', true);
  case COURIER_REFRESH_SUCCESS:
    return prepend(state, action.notifications, action.prev, action.next);
  case COURIER_UPDATE_RECEIVE:
    return prepend(state, action.notification);
  case NOTIFICATION_REMOVE_COMPLETE:
    return filterById(state, action.ids);
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
}

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export {
  expandCourier,
  fetchCourier,
  refreshCourier,
  updateCourier,
};
