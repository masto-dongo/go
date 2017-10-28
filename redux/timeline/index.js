//  TIMELINE
//  ========

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  List as ImmutableList,
  Map as ImmutableMap,
} from 'immutable';

//  Requests.
import connectTimeline from './connect';
import expandTimeline from './expand';
import fetchTimeline from './fetch';
import refreshTimeline from './refresh';
import updateTimeline from './update';

//  Action types.
import { RELATIONSHIP_BLOCK_SUCCESS } from 'themes/mastodon-go/redux/relationship/block';
import { RELATIONSHIP_MUTE_SUCCESS } from 'themes/mastodon-go/redux/relationship/mute';
import { STATUS_REMOVE_COMPLETE } from 'themes/mastodon-go/redux/status/remove';
import {
  TIMELINE_CONNECT_OPEN,
  TIMELINE_CONNECT_HALT,
} from 'themes/mastodon-go/redux/timeline/connect';
import {
  TIMELINE_EXPAND_FAILURE,
  TIMELINE_EXPAND_REQUEST,
  TIMELINE_EXPAND_SUCCESS,
} from 'themes/mastodon-go/redux/timeline/expand';
import {
  TIMELINE_FETCH_FAILURE,
  TIMELINE_FETCH_REQUEST,
  TIMELINE_FETCH_SUCCESS,
} from 'themes/mastodon-go/redux/timeline/fetch';
import {
  TIMELINE_REFRESH_FAILURE,
  TIMELINE_REFRESH_REQUEST,
  TIMELINE_REFRESH_SUCCESS,
} from 'themes/mastodon-go/redux/timeline/refresh';
import { TIMELINE_UPDATE_RECEIVE } from 'themes/mastodon-go/redux/timeline/update';

//  * * * * * * *  //

//  Setup
//  -----

//  `normalize()` takes a list of `statuses` and turns it into a proper
//  timeline. We keep track of the `id`s of each `status`, alongside
//  its associated `account` and `reblog`.
const normalize = statuses => ImmutableList(statuses ? [].concat(statuses).map(
  status => ImmutableMap({
    account: status.account.id,
    id: status.id,
    reblog: status.reblog ? ImmutableMap({
      account: status.reblog.account.id,
      id: status.reblog.id,
    }) : null,
  })
) : []);

//  `makeTimeline()` creates a normalized timeline from a list of
//  statuses.
const makeTimeline = (path, statuses, prev, next) => ImmutableMap({
  connected: false,
  isLoading: false,
  next: next ? '' + next : null,
  path: '' + path,
  prev: prev ? '' + prev : null,
  statuses: normalize(statuses),
});

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is just an empty Immutable map—we will add
//  timelines to this by `path`.
const initialState = ImmutableMap();

//  `set()` replaces a timeline's `statuses` with a new `normalized()`
//  list.
const set = (state, path, statuses, prev, next) => state.withMutations(
  map => {

    //  We want to ensure our `path` is a string like it should be.
    path = '' + path;

    //  If no timeline exists at the given path, we make one.
    if (!state.get(path)) {
      map.set(path, makeTimeline(path, statuses, prev, next));
      return;
    }

    //  Otherwise, we update its `statuses`.
    map.setIn([path, 'isLoading'], false);
    map.setIn([path, 'statuses'], normalize(statuses));
    map.setIn([path, 'prev'], '' + prev);
    map.setIn([path, 'next'], '' + next);
  }
);

//  `prepend()` prepends the given `statuses` to a timeline.
const prepend = (state, path, statuses, prev, next) => state.withMutations(
  map => {

    //  We want to ensure our `path` is a string like it should be.
    path = '' + path;

    //  If no timeline exists at the given path, we make one.
    if (!state.get(path)) {
      map.set(path, makeTimeline(path, statuses, prev, next));
      return;
    }

    //  Otherwise, we prepend the `statuses`.
    map.setIn([path, 'isLoading'], false);
    map.updateIn(
      [path, 'statuses'],
      (list = ImmutableList()) => normalize(statuses).concat(list)
    );
    map.setIn([path, 'prev'], '' + prev);
    map.setIn([path, 'next'], '' + next);
  }
);

//  `append()` appends the given `statuses` to a timeline.
const append = (state, path, statuses, prev, next) => state.withMutations(
  map => {

    //  We want to ensure our `path` is a string like it should be.
    path = '' + path;

    //  If no timeline exists at the given path, we make one.
    if (!state.get(path)) {
      map.set(path, makeTimeline(path, statuses, prev, next));
      return;
    }

    //  Otherwise, we prepend the `statuses`.
    map.setIn([path, 'isLoading'], false);
    map.updateIn(
      [path, 'statuses'],
      (list = ImmutableList()) => list.concat(normalize(statuses))
    );
    map.setIn([path, 'prev'], '' + prev);
    map.setIn([path, 'next'], '' + next);
  }
);

//  `filterByAccount()` removes the `statuses` associated with the
//  provided `accounts` from the timeline.
const filterByAccount = (state, accounts) => {
  accounts = [].concat(accounts);
  state.map(
    map => map.update(
      'statuses',
      (list = ImmutableList()) => list.filter(
        status => {
          if (accounts.indexOf(status.get('account')) !== -1 ) {
            return false;
          }
          if (status.get('reblog') && accounts.indexOf(status.getIn(['reblog', 'account'])) !== -1) {
            return false;
          }
          return true;
        }
      )
    )
  );
};

// `filterByStatus()` removes the `status`es associated with the
//   provided `statuses` from the timeline.
const filterByStatus = (state, statuses) => {
  statuses = [].concat(statuses);
  state.map(
    map => map.update(
      'statuses',
      (list = ImmutableList()) => list.filter(
        status => statuses.indexOf(status.get('id')) === -1 && (!status.get('reblog') || statuses.indexOf(status.getIn(['reblog', 'id'])) === -1)
      )
    )
  );
};

//  `setConnected()` sets the connected state for our timeline.
const setConnected = (state, path, value) => state.update(
  '' + path,
  (map = makeTimeline(path)) => map.set('connected', !!value)
);

//  `setLoading()` sets the loading state for our timeline.
const setLoading = (state, path, value) => state.update(
  '' + path,
  (map = makeTimeline(path)) => map.set('isLoading', !!value)
);

export default function timeline (state = initialState, action) {
  switch(action.type) {
  case RELATIONSHIP_BLOCK_SUCCESS:
  case RELATIONSHIP_MUTE_SUCCESS:
    if (action.relationship.blocking || action.relationship.muting) {
      return filterByAccount(state, action.relationship.id);
    }
    return state;
  case TIMELINE_CONNECT_OPEN:
    return setConnected(state, action.path, true);
  case TIMELINE_CONNECT_HALT:
    return setConnected(state, action.path, false);
  case TIMELINE_EXPAND_FAILURE:
    return setLoading(state, action.path, false);
  case TIMELINE_EXPAND_REQUEST:
    return setLoading(state, action.path, true);
  case TIMELINE_EXPAND_SUCCESS:
    return append(state, action.path, action.statuses, action.prev, action.next);
  case TIMELINE_FETCH_FAILURE:
    return setLoading(state, action.path, false);
  case TIMELINE_FETCH_REQUEST:
    return setLoading(state, action.path, true);
  case TIMELINE_FETCH_SUCCESS:
    return set(state, action.path, action.statuses, action.prev, action.next);
  case TIMELINE_REFRESH_FAILURE:
    return setLoading(state, action.path, false);
  case TIMELINE_REFRESH_REQUEST:
    return setLoading(state, action.path, true);
  case TIMELINE_REFRESH_SUCCESS:
    return prepend(state, action.path, action.statuses, action.prev, action.next);
  case TIMELINE_UPDATE_RECEIVE:
    return prepend(state, action.path, action.status);
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
  connectTimeline,
  expandTimeline,
  fetchTimeline,
  refreshTimeline,
  updateTimeline,
};
