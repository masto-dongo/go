import { Map as ImmutableMap, fromJS } from 'immutable';
import escapeTextContentForBrowser from 'escape-html';

import {
  ACCOUNT_BLOCK_SUCCESS,
} from 'mastodon/actions/accounts';
import {
  REBLOG_REQUEST,
  REBLOG_SUCCESS,
  REBLOG_FAIL,
  UNREBLOG_SUCCESS,
  FAVOURITE_REQUEST,
  FAVOURITE_SUCCESS,
  FAVOURITE_FAIL,
  UNFAVOURITE_SUCCESS,
} from 'mastodon/actions/interactions';
import { SEARCH_FETCH_SUCCESS } from 'mastodon/actions/search';
import emojify from 'mastodon/emoji';

import {
  STATUS_REMOVE,
  STATUS_FETCH_SUCCESS,
  STATUS_CONTEXTUALIZE_SUCCESS,
  STATUS_MUTE_SUCCESS,
  STATUS_UNMUTE_SUCCESS,
  STATUS_HEIGHT_SET,
  STATUS_HEIGHTS_CLEAR,
} from 'glitch/actions/statuses';
import {
  TIMELINE_UPDATE,
  TIMELINE_REFRESH_SUCCESS,
  TIMELINE_EXPAND_SUCCESS,
} from 'glitch/actions/timelines';
import { NOTIFICATION_FETCH_SUCCESS } from 'glitch/actions/notifications';

const domParser = new DOMParser();

const normalizeStatus = (state, status) => {
  if (!status) return state;
  const normalStatus = { ...status };

  normalStatus.account = status.account.id;
  if (status.reblog && status.reblog.id) {
    state = normalizeStatus(state, status.reblog);
    normalStatus.reblog = status.reblog.id;
  }

  const searchContent = [status.spoiler_text, status.content].join('\n').replace(/<br \/>/g, '\n').replace(/<\/p><p>/g, '\n\n');
  normalStatus.searchIndex = domParser.parseFromString(searchContent, 'text/html').documentElement.textContent;
  normalStatus.contentHtml = emojify(normalStatus.content);
  normalStatus.spoilerHtml = emojify(escapeTextContentForBrowser(normalStatus.spoiler_text || ''));

  return state.update(status.id, ImmutableMap(), map => map.mergeDeep(fromJS(normalStatus)));
};

const normalizeStatuses = (state, statuses) => {
  statuses.forEach(status => {
    state = normalizeStatus(state, status);
  });

  return state;
};

const deleteStatus = (state, id, references) => {
  if (references) references.forEach(ref => {
    state = deleteStatus(state, ref);
  });

  return state.delete(id);
};

const filterStatuses = (state, relationship) => {
  state.forEach(status => {
    if (status.get('account') !== relationship.id) return;
    state = deleteStatus(state, status.get('id'), state.filter(item => item.get('reblog') === status.get('id')));
  });

  return state;
};

const setHeight = (state, id, height) => {
  return state.update(id, ImmutableMap(), map => map.set('height', height));
};

const clearHeights = (state) => {
  state.forEach(status => {
    state = state.deleteIn([status.get('id'), 'height']);
  });

  return state;
};

const initialState = ImmutableMap();

export default function status(state = initialState, action) {
  switch(action.type) {
  case TIMELINE_UPDATE:
    if (action.timelineId === notification) return normalizeStatus(state, action.item.status);
    else return normalizeStatus(state, action.item);
  case STATUS_FETCH_SUCCESS:
    return normalizeStatus(state, action.item);
  case NOTIFICATION_FETCH_SUCCESS:
    return normalizeStatus(state, action.item.status);
  case REBLOG_SUCCESS:
  case UNREBLOG_SUCCESS:
  case FAVOURITE_SUCCESS:
  case UNFAVOURITE_SUCCESS:
    return normalizeStatus(state, action.response);
  case FAVOURITE_REQUEST:
    return state.setIn([action.status.get('id'), 'favourited'], true);
  case FAVOURITE_FAIL:
    return state.setIn([action.status.get('id'), 'favourited'], false);
  case REBLOG_REQUEST:
    return state.setIn([action.status.get('id'), 'reblogged'], true);
  case REBLOG_FAIL:
    return state.setIn([action.status.get('id'), 'reblogged'], false);
  case STATUS_MUTE_SUCCESS:
    return state.setIn([action.id, 'muted'], true);
  case STATUS_UNMUTE_SUCCESS:
    return state.setIn([action.id, 'muted'], false);
  case TIMELINE_REFRESH_SUCCESS:
  case TIMELINE_EXPAND_SUCCESS:
    if (action.timelineId === 'notifications') return normalizeStatuses(state, action.items.map(item => item.status))
    else return normalizeStatuses(state, action.items);
  case STATUS_CONTEXTUALIZE_SUCCESS:
  case SEARCH_FETCH_SUCCESS:
    return normalizeStatuses(state, action.statuses);
  case STATUS_REMOVE:
    return deleteStatus(state, action.id, action.references);
  case ACCOUNT_BLOCK_SUCCESS:
    return filterStatuses(state, action.relationship);
  case STATUS_HEIGHT_SET:
    return setHeight(state, action.id, action.height);
  case STATUS_HEIGHTS_CLEAR:
    return clearHeights(state);
  default:
    return state;
  }
};
