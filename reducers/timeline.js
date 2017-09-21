import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

import {
  ACCOUNT_BLOCK_SUCCESS,
  ACCOUNT_MUTE_SUCCESS,
} from 'mastodon/actions/accounts';
import {
  FAVOURITE_SUCCESS,
  UNFAVOURITE_SUCCESS,
} from 'mastodon/actions/interactions';

import { STATUS_REMOVE } from 'glitch/actions/status';
import {
  TIMELINE_UPDATE,
  TIMELINE_REFRESH_REQUEST,
  TIMELINE_REFRESH_SUCCESS,
  TIMELINE_REFRESH_FAILURE,
  TIMELINE_EXPAND_SUCCESS,
  TIMELINE_EXPAND_REQUEST,
  TIMELINE_EXPAND_FAILURE,
  TIMELINE_TOP_SET,
  TIMELINE_CONNECTING,
  TIMELINE_DISCONNECT,
} from 'glitch/actions/timeline';

const initialState = ImmutableMap();

const initialTimeline = ImmutableMap({
  items: ImmutableList(),
  isLoading: false,
  loaded: false,
  next: false,
  online: false,
  path: '/api/v1',
  top: true,
  unread: 0,
});

const normalizeTimeline = (state, path, items, next) => {
  const ids = ImmutableList(items.map(item => item.get('id')));
  const wasLoaded = state.getIn([timelineId, 'loaded']);
  const hadNext = state.getIn([timelineId, 'next']);
  const oldIds = state.getIn([timelineId, 'items'], ImmutableList());

  return state.update(path, initialTimeline, map => map.withMutations(mMap => {
    mMap.set('loaded', true);
    mMap.set('isLoading', false);
    mMap.set('items', wasLoaded ? ids.concat(oldIds) : ids);
    if (!hadNext) mMap.set('next', next);
    mMap.set('path', path);
  }));
};

const appendNormalizedTimeline = (state, path, items, next) => {
  const ids = ImmutableList(items.map(item => item.get('id')));
  const oldIds = state.getIn([path, 'items'], ImmutableList());

  return state.update(path, initialTimeline, map => map.withMutations(mMap => {
    mMap.set('isLoading', false);
    mMap.set('next', next);
    mMap.set('items', oldIds.concat(ids));
    mMap.set('path', path);
  }));
};

const updateTimeline = (state, path, item, references) => {
  const top        = state.getIn([path, 'top']);
  const ids        = state.getIn([path, 'items'], ImmutableList());
  const includesId = ids.includes(item.get('id'));
  const unread     = state.getIn([path, 'unread'], 0);

  if (includesId) return state;

  let newIds = ids;

  return state.update(path, initialTimeline, map => map.withMutations(mMap => {
    if (!top) mMap.set('unread', unread + 1);
    if (top && ids.size > 40) newIds = newIds.take(20);
    if (path !== 'notifications' && item.getIn(['reblog', 'id'], null) !== null) {
      newIds = newIds.filterNot(item => references.includes(item));
    }
    mMap.set('items', newIds.unshift(item.get('id')));
    mMap.set('path', path);
  }));
};

const filterTimeline = (state, path, item) => {
  return state.updateIn([path, 'items'], ids => ids.filterNot(id => id === item.get('id')));
}

const deleteStatus = (state, itemId, references, reblogOf) => {
  state.keySeq().forEach(path => {
    state = state.updateIn([path, 'items'], ids => {
      if (reblogOf && !ids.includes(reblogOf)) {
        return ids.map(id => id === itemId ? reblogOf : id);
      } else {
        return ids.filterNot(id => id === itemId);
      }
    });
  });

  // Remove reblogs of deleted status
  if (references) references.forEach(ref => {
    state = deleteStatus(state, ref);
  });

  return state;
};

const filterTimelines = (state, relationship, statuses) => {
  let references;

  statuses.forEach(status => {
    if (status.get('account') !== relationship.id) return;

    references = statuses.filter(item => item.get('reblog') === status.get('id')).map(item => [item.get('id'), item.get('account')]);
    state = deleteStatus(state, status.get('id'), status.get('account'), references);
  });

  return state;
};

const updateTop = (state, path, top) => {
  return state.update(path, initialTimeline, map => map.withMutations(mMap => {
    if (top) mMap.set('unread', 0);
    mMap.set('top', top);
  }));
};

export default function timeline(state = initialState, action) {
  switch(action.type) {
  case TIMELINE_REFRESH_REQUEST:
  case TIMELINE_EXPAND_REQUEST:
    return state.update(action.path, initialTimeline, map => map.set('isLoading', true));
  case TIMELINE_REFRESH_FAILURE:
  case TIMELINE_EXPAND_FAILURE:
    return state.update(action.path, initialTimeline, map => map.set('isLoading', false));
  case TIMELINE_REFRESH_SUCCESS:
    return normalizeTimeline(state, action.path, fromJS(action.items), action.next);
  case TIMELINE_EXPAND_SUCCESS:
    return appendNormalizedTimeline(state, action.path, fromJS(action.items), action.next);
  case TIMELINE_UPDATE:
    return updateTimeline(state, action.path, fromJS(action.item), action.references);
  case STATUS_REMOVE:
    return deleteStatus(state, action.id, action.path, action.references, action.reblogOf);
  case ACCOUNT_BLOCK_SUCCESS:
  case ACCOUNT_MUTE_SUCCESS:
    return filterTimelines(state, action.relationship, action.items);
  case TIMELINE_TOP_SET:
    return updateTop(state, action.path, action.top);
  case TIMELINE_CONNECTING:
    return state.update(action.path, initialTimeline, map => map.set('online', true));
  case TIMELINE_DISCONNECT:
    return state.update(action.path, initialTimeline, map => map.set('online', false));
  case FAVOURITE_SUCCESS:
    return updateTimeline(state, 'favourites', fromJS(action.response), null);
  case UNFAVOURITE_SUCCESS:
    return filterTimeline(state, 'favourites', fromJS(action.response));
  default:
    return state;
  }
};
