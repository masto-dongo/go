import escapeTextContentForBrowser from 'escape-html';
import {
  fromJS,
  Map as ImmutableMap,
} from 'immutable';

import { ACCOUNT_BLOCK_SUCCESS } from 'mastodon-go/actions/accounts';
import {
  NOTIFICATION_REMOVE,
  NOTIFICATION_FETCH_SUCCESS,
} from 'mastodon-go/actions/notification';
import { STATUS_REMOVE } from 'mastodon-go/actions/status';
import {
  TIMELINE_UPDATE,
  TIMELINE_REFRESH_SUCCESS,
  TIMELINE_EXPAND_SUCCESS,
} from 'mastodon-go/actions/timeline';

const normalizeNotification = notification => ImmutableMap({
  id: notification.id,
  type: notification.type,
  account: notification.account.id,
  status: notification.status ? notification.status.id : null,
});

const initialState = ImmutableMap();

const setNotifications = (state, notifications) => state.withMutations(
  map => ([].concat(notifications)).forEach(
    notification => map.set(notification.id, normalizeNotification(notification))
  )
);

const deleteNotifications = (state, ids) => state.withMutations(
  map => ([].concat(ids)).forEach(
    id => map.delete(id)
  )
);

const filterNotifications = (state, relationship) => state.withMutations(
    map => map.forEach(
      notification => {
        if (notification.get('account') === relationship.id) map.delete(id)
      }
    )
  )
  state.forEach(notification => {
    if (notification.get('account') !== relationship.id) return;
    state = deleteNotification(state, notification.get('id'));
  });

  return state;
};

const deleteByStatus = (state, statusId) => {
  return state.update('items', map => map.filterNot(item => item.get('status') === statusId));
};

export default function notification(state = initialState, action) {
  switch(action.type) {
  case TIMELINE_UPDATE:
    if (action.timelineId === notification) return normalizeNotification(state, action.item);
  case NOTIFICATION_FETCH_SUCCESS:
    return normalizeStatus(state, action.item);
  case TIMELINE_REFRESH_SUCCESS:
  case TIMELINE_EXPAND_SUCCESS:
    if (action.timelineId === 'notifications') return normalizeNotifications(state, action.items)
  case NOTIFICATION_SINGULAR_REMOVE:
    return deleteNotification(state, action.id);
  case NOTIFICATION_MULTIPLE_REMOVE:
    return deleteNotifications(state, action.ids);
  case ACCOUNT_BLOCK_SUCCESS:
    return filterNotifications(state, action.relationship);
  case STATUS_REMOVE:
    return deleteByStatus(state, action.id);
  default:
    return state;
  }
};
