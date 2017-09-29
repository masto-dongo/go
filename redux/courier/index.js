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

//  Action types.
import { ACCOUNT_BLOCK_SUCCESS } from 'themes/mastodon-go/redux/account/block';
import { ACCOUNT_MUTE_SUCCESS } from 'themes/mastodon-go/redux/account/mute';
import {
  COURIER_CONNECT_OPEN,
  COURIER_CONNECT_HALT,
} from 'themes/mastodon-go/redux/courier/connect';
import {
  COURIER_EXPAND_FAILURE,
  COURIER_EXPAND_REQUEST,
  COURIER_EXPAND_SUCCESS,
} from 'themes/mastodon-go/redux/courier/expand';
import {
  COURIER_FETCH_FAILURE,
  COURIER_FETCH_REQUEST,
  COURIER_FETCH_SUCCESS,
} from 'themes/mastodon-go/redux/courier/fetch';
import {
  COURIER_REFRESH_FAILURE,
  COURIER_REFRESH_REQUEST,
  COURIER_REFRESH_SUCCESS,
} from 'themes/mastodon-go/redux/courier/refresh';
import { COURIER_UPDATE_RECEIVE } from 'themes/mastodon-go/redux/courier/update';
import { NOTIFICATION_REMOVE_COMPLETE } from 'themes/mastodon-go/redux/notification/remove';
import { STATUS_REMOVE_COMPLETE } from 'themes/mastodon-go/redux/status/remove';

//  Other imports.
import rainbow from 'themes/mastodon-go/util/rainbow';

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
  connected: false,
  isLoading: false,
  notifications: ImmutableList(),
  rainbow: ImmutableMap({
    1: rainbow('/api/v1/notifications'),
    3: ImmutableList(rainbow('/api/v1/notifications', 3)),
    7: ImmutableList(rainbow('/api/v1/notifications', 7)),
    15: ImmutableList(rainbow('/api/v1/notifications', 15)),
  }),
});

//  `set()` just replaces our `notifications` with a new `normalized()`
//  list.
const set = (state, notifications) => state.withMutations(
  map => {
    map.set('isLoading', false);
    map.set('notifications', normalize(notifications));
  }
);

//  `prepend()` prepends the given `notifications` to the state.
const prepend = (state, notifications) => state.withMutations(
  map => {
    map.set('isLoading', false);
    map.update(
      'notifications',
      list => normalize(notifications).concat(list)
    );
  }
);

//  `append()` appends the given `notifications` to the state.
const append = (state, notifications) => state.withMutations(
  map => {
    map.set('isLoading', false);
    map.update(
      'notifications',
      list => list.concat(normalize(notifications))
    );
  }
);

//  `filterByAccount()` removes the `notification`s associated with the
//  provided `accounts` from the courier.
const filterByAccount = (state, accounts) => {
  accounts = [].concat(accounts);
  state.update(
    'notifications',
    list => list.filter(
      notification => accounts.indexOf(notification.get('account')) === -1
    )
  );
}

//  `filterById()` removes the `notification`s associated with the
//  provided `ids` from the courier.
const filterById = (state, ids) => {
  ids = [].concat(ids);
  state.update(
    'notifications',
    list => list.filter(
      notification => ids.indexOf(notification.get('id')) === -1
    )
  );
}

//  `filterByStatus()` removes the `notification`s associated with the
//  provided `statuses` from the courier.
const filterByStatus = (state, statuses) => {
  statuses = [].concat(statuses);
  state.update(
    'notifications',
    list => list.filter(
      notification => !notification.get('status') || statuses.indexOf(notification.get('status')) === -1
    )
  );
}

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function courier (state = initialState, action) {
  switch (action.type) {
  case ACCOUNT_BLOCK_SUCCESS:
  case ACCOUNT_MUTE_SUCCESS:
    if (action.relationship.blocking || action.relationship.muting && action.relationship.muting.notifications) {
      return filterByAccount(state, action.relationship.id)
    }
    return state;
  case COURIER_CONNECT_OPEN:
    return state.set('connected', true);
  case COURIER_CONNECT_HALT:
    return state.set('connected', false);
  case COURIER_EXPAND_FAILURE:
    return state.set('isLoading', false);
  case COURIER_EXPAND_REQUEST:
    return state.set('isLoading', true);
  case COURIER_EXPAND_SUCCESS:
    return append(state, action.notifications);
  case COURIER_FETCH_FAILURE:
    return state.set('isLoading', false);
  case COURIER_FETCH_REQUEST:
    return state.set('isLoading', true);
  case COURIER_FETCH_SUCCESS:
    return set(state, action.notifications);
  case COURIER_REFRESH_FAILURE:
    return state.set('isLoading', false);
  case COURIER_REFRESH_REQUEST:
    return state.set('isLoading', true);
  case COURIER_REFRESH_SUCCESS:
    return prepend(state, action.notifications);
  case COURIER_UPDATE_RECEIVE:
    return prepend(state, action.notification);
  case NOTIFICATION_REMOVE_COMPLETE:
    return filterById(state, action.ids);
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
export { connectCourier } from './connect';
export { expandCourier } from './expand';
export { fetchCourier } from './fetch';
export { refreshCourier } from './refresh';
export { updateCourier } from './update';
