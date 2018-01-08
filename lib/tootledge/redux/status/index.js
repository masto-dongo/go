//  STATUS
//  ======

//  Statuses! The building blocks of Mastodon!!

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  List as ImmutableList,
  Map as ImmutableMap,
} from 'immutable';

//  Request imports.
import deleteStatus from './delete';
import favouriteStatus from './favourite';
import fetchStatus from './fetch';
import pinStatus from './pin';
import reblogStatus from './reblog';
import removeStatus from './remove';
import silenceStatus from './silence';
import submitStatus from './submit';
import unfavouriteStatus from './unfavourite';
import unpinStatus from './unpin';
import unreblogStatus from './unreblog';
import unsilenceStatus from './unsilence';
import updateStatus from './update';

//  Action types.
import { COURIER_EXPAND_SUCCESS } from '../courier/expand';
import { COURIER_FETCH_SUCCESS } from '../courier/fetch';
import { COURIER_REFRESH_SUCCESS } from '../courier/refresh';
import { COURIER_UPDATE_RECEIVE } from '../courier/update';
import { NOTIFICATION_FETCH_SUCCESS } from '../notification/fetch';
import { RELATIONSHIP_BLOCK_SUCCESS } from '../relationship/block';
import { RELATIONSHIP_MUTE_SUCCESS } from '../relationship/mute';
import {
  STATUS_FAVOURITE_FAILURE,
  STATUS_FAVOURITE_REQUEST,
  STATUS_FAVOURITE_SUCCESS,
} from '../status/favourite';
import { STATUS_FETCH_SUCCESS } from '../status/fetch';
import {
  STATUS_PIN_FAILURE,
  STATUS_PIN_REQUEST,
  STATUS_PIN_SUCCESS,
} from '../status/pin';
import {
  STATUS_REBLOG_FAILURE,
  STATUS_REBLOG_REQUEST,
  STATUS_REBLOG_SUCCESS,
} from '../status/reblog';
import { STATUS_REMOVE_COMPLETE } from '../status/remove';
import {
  STATUS_SILENCE_FAILURE,
  STATUS_SILENCE_REQUEST,
  STATUS_SILENCE_SUCCESS,
} from '../status/silence';
import {
  STATUS_UNFAVOURITE_FAILURE,
  STATUS_UNFAVOURITE_REQUEST,
  STATUS_UNFAVOURITE_SUCCESS,
} from '../status/unfavourite';
import {
  STATUS_UNPIN_FAILURE,
  STATUS_UNPIN_REQUEST,
  STATUS_UNPIN_SUCCESS,
} from '../status/unpin';
import {
  STATUS_UNREBLOG_FAILURE,
  STATUS_UNREBLOG_REQUEST,
  STATUS_UNREBLOG_SUCCESS,
} from '../status/unreblog';
import {
  STATUS_UNSILENCE_FAILURE,
  STATUS_UNSILENCE_REQUEST,
  STATUS_UNSILENCE_SUCCESS,
} from '../status/unsilence';
import { STATUS_UPDATE_RECEIVE } from '../status/update';
import { TIMELINE_EXPAND_SUCCESS } from '../timeline/expand';
import { TIMELINE_FETCH_SUCCESS } from '../timeline/fetch';
import { TIMELINE_REFRESH_SUCCESS } from '../timeline/refresh';
import { TIMELINE_UPDATE_RECEIVE } from '../timeline/update';

//  Lib imports.
import deHTMLify from '../../lib/deHTMLify';
import { Emoji } from '../../lib/emojify';

//  Constants.
import {
  POST_TYPE,
  VISIBILITY,
} from '../../constants';

//  * * * * * * *  //

//  Setup
//  -----

//  `normalize` takes a `status` API object and turns it into an
//  Immutable map that we can store. We only keep track of the `id`
//  of the status's related `account`, `reblog`, and `attachments`—not
//  their contents.
function normalize ({
  account,
  application,
  content,
  created_at,
  emojis,
  favourited,
  favourites_count,
  id,
  in_reply_to_account_id,
  in_reply_to_id,
  media_attachments,
  mentions,
  muted,
  reblog,
  reblogged,
  reblogs_count,
  sensitive,
  spoiler_text,
  tags,
  url,
  visibility,
}, oldContent, resolvePending) {
  const plainContent = oldContent && oldContent.get('html') === '' + content ? oldContent.get('plain') : deHTMLify(content);
  const pending = oldContent && oldContent.get('pending');
  return ImmutableMap({
    account: account && account.id ? '' + account.id : null,
    application: application ? ImmutableMap({
      name: application.name,
      website: application.website,
    }) : null,
    content: ImmutableMap({
      html: '' + content,
      plain: '' + plainContent,
    }),
    counts: ImmutableMap({
      favourites: favourites_count >>> 0,
      reblogs: reblogs_count >>> 0,
    }),
    datetime: new Date(created_at),
    emoji: ImmutableList((emojis || []).map(
      emoji => emoji instanceof Emoji ? emoji : new Emoji({
        name: emoji.shortcode ? '' + emoji.shortcode : null,
        href: emoji.url ? '' + emoji.url : null,
        staticHref: emoji.static_url ? '' + emoji.static_url : null,
        title: emoji.shortcode ? ':' + emoji.shortcode + ':' : null,
      })
    )),
    href: url ? '' + url : '#',
    id: id ? '' + id : '0',
    inReplyTo: in_reply_to_id ? ImmutableMap({
      account: in_reply_to_account_id ? '' + in_reply_to_account_id : null,
      id: '' + in_reply_to_id,
    }) : null,
    media: ImmutableList((media_attachments || []).map(
      attachment => ImmutableMap({
        id: attachment.id ? '' + attachment.id : null,
        src: ImmutableMap({
          local: attachment.url ? '' + attachment.url : null,
          remote: attachment.remote_url ? '' + attachment.remote_url : null,
          shortlink: attachment.text_url ? '' + attachment.text_url : null,
        }),
      })
    )),
    pending: pending & ~resolvePending,
    mentions: ImmutableList((mentions || []).map(
      mention => ImmutableMap({
        at: mention.account ? '' + mention.account : null,
        href: mention.url ? '' + mention.url : null,
        id: mention.id ? '' + mention.id : null,
        username: mention.username ? '' + mention.username : null,
      })
    )),
    reblog: reblog && reblog.id ? '' + reblog.id : null,
    sensitive: !!sensitive,
    spoiler: spoiler_text ? '' + spoiler_text : '',
    tags: ImmutableList((tags || []).map(
      tag => ImmutableMap({
        href: tag.url ? '' + tag.url : null,
        name: tag.name ? '' + tag.name : null,
      })
    )),
    type: function () {
      let value = POST_TYPE.STATUS;
      value |= reblog && POST_TYPE.IS_REBLOG;
      value |= in_reply_to_id && POST_TYPE.IS_MENTION;
      value |= media_attachments && media_attachments.length && POST_TYPE.IS_RICH;
      value |= muted && POST_TYPE.HAS_SILENCE;
      value |= reblogged && POST_TYPE.HAS_REBLOG;
      value |= favourited && POST_TYPE.HAS_FAVOURITE;
      return value;
    }(),
    visibility: function () {
      let value = VISIBILITY.DIRECT;
      switch (visibility) {
      case 'private':
        value = VISIBILITY.PRIVATE;
        break;
      case 'public':
        value = VISIBILITY.PUBLIC;
        break;
      case 'unlisted':
        value = VISIBILITY.UNLISTED;
        break;
      }
      if (/👁\ufe0f?\u200b?$/.test(plainContent)) {
        value &= ~VISIBILITY.FEDERATED;
      }
      return value;
    }(),
  });
};

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is an empty map. Our statuses will be stored
//  here by `id`.
const initialState = ImmutableMap();

//  `set()` stores the normalized value of the given `statuses` in the
//  store.
const set = (state, statuses) => state.withMutations(
  map => ([].concat(statuses)).forEach(
    status => {
      if (status) {
        map.set('' + status.id, normalize(status));
        if (status.reblog) {
          map.set('' + status.reblog.id, normalize(status.reblog));
        }
      }
    }
  )
);

//  `makePending()` sets the pending state of an action.
const makePending = (state, id, action, pending) => {
  status = state.get('' + id);
  if (!status) {
    return state;
  }
  return state.setIn(['' + id, 'pending'], pending ? state.get('pending') | action : state.get('pending') & ~action);
};


//  `filterByAccount()` deletes those statuses whose associated
//  `account` matches one of the ones provided.
const filterByAccount = (state, accounts) => {
  accounts = [].concat(accounts);
  state.filter(
    status => {
      if (accounts.indexOf(status.get('account')) !== -1) {
        return false;
      }
      if (status.get('reblog') && accounts.indexOf(state.getIn([status.get('reblog'), 'account'])) !== -1) {
        return false;
      }
      return true;
    }
  );
};

// `filterByStatus()` deletes those statuses whose `id`
//   or `reblog` matches one of the ones provided.
const filterByStatus = (state, statuses) => {
  statuses = [].concat(statuses);
  state.filter(
    status => statuses.indexOf(status.get('id')) === -1 && (!status.get('reblog') || statuses.indexOf(status.get('reblog')) === -1)
  );
};

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function status (state = initialState, action) {
  switch(action.type) {
  case COURIER_EXPAND_SUCCESS:
  case COURIER_FETCH_SUCCESS:
  case COURIER_REFRESH_SUCCESS:
    return set(state, action.notifications.map(
      notification => notification.status
    ));
  case COURIER_UPDATE_RECEIVE:
    return set(state, action.notification.status);
  case NOTIFICATION_FETCH_SUCCESS:
    return set(state, action.notification.status);
  case RELATIONSHIP_BLOCK_SUCCESS:
  case RELATIONSHIP_MUTE_SUCCESS:

    //  If we aren't muting notifications, then we don't get rid of
    //  an account's statuses—although we will remove them from our
    //  timelines.
    if (action.relationship.blocking || action.relationship.muting && action.relationship.muting.notifications) {
      return filterByAccount(state, action.relationship.id);
    }
    return state;
  case STATUS_FAVOURITE_FAILURE:
    return makePending(state, action.id, POST_TYPE.HAS_FAVOURITE, false);
  case STATUS_FAVOURITE_REQUEST:
    return makePending(state, action.id, POST_TYPE.HAS_FAVOURITE, true);
  case STATUS_FAVOURITE_SUCCESS:
    return set(state, action.status, POST_TYPE.HAS_FAVOURITE);
  case STATUS_FETCH_SUCCESS:
    return set(state, action.status);
  case STATUS_PIN_FAILURE:
    return makePending(state, action.id, POST_TYPE.HAS_PIN, false);
  case STATUS_PIN_REQUEST:
    return makePending(state, action.id, POST_TYPE.HAS_PIN, true);
  case STATUS_PIN_SUCCESS:
    return set(state, action.status, POST_TYPE.HAS_PIN);
  case STATUS_REBLOG_FAILURE:
    return makePending(state, action.id, POST_TYPE.HAS_REBLOG, false);
  case STATUS_REBLOG_REQUEST:
    return makePending(state, action.id, POST_TYPE.HAS_REBLOG, true);
  case STATUS_REBLOG_SUCCESS:
    return set(state, action.status, POST_TYPE.HAS_REBLOG);
  case STATUS_REMOVE_COMPLETE:
    return filterByStatus(state, action.ids);
  case STATUS_SILENCE_FAILURE:
    return makePending(state, action.id, POST_TYPE.HAS_SILENCE, false);
  case STATUS_SILENCE_REQUEST:
    return makePending(state, action.id, POST_TYPE.HAS_SILENCE, true);
  case STATUS_SILENCE_SUCCESS:
    return set(state, action.status, POST_TYPE.HAS_SILENCE);
  case STATUS_UNFAVOURITE_FAILURE:
    return makePending(state, action.id, POST_TYPE.HAS_FAVOURITE, true);
  case STATUS_UNFAVOURITE_REQUEST:
    return makePending(state, action.id, POST_TYPE.HAS_FAVOURITE, false);
  case STATUS_UNFAVOURITE_SUCCESS:
    return set(state, action.status, POST_TYPE.HAS_FAVOURITE);
  case STATUS_UNPIN_FAILURE:
    return makePending(state, action.id, POST_TYPE.HAS_PIN, true);
  case STATUS_UNPIN_REQUEST:
    return makePending(state, action.id, POST_TYPE.HAS_PIN, false);
  case STATUS_UNPIN_SUCCESS:
    return set(state, action.status, POST_TYPE.HAS_PIN);
  case STATUS_UNREBLOG_FAILURE:
    return makePending(state, action.id, POST_TYPE.HAS_REBLOG, true);
  case STATUS_UNREBLOG_REQUEST:
    return makePending(state, action.id, POST_TYPE.HAS_REBLOG, false);
  case STATUS_UNREBLOG_SUCCESS:
    return set(state, action.status, POST_TYPE.HAS_REBLOG);
  case STATUS_UNSILENCE_FAILURE:
    return makePending(state, action.id, POST_TYPE.HAS_SILENCE, true);
  case STATUS_UNSILENCE_REQUEST:
    return makePending(state, action.id, POST_TYPE.HAS_SILENCE, false);
  case STATUS_UNSILENCE_SUCCESS:
    return set(state, action.status, POST_TYPE.HAS_SILENCE);
  case STATUS_UPDATE_RECEIVE:
    return set(state, action.status);
  case TIMELINE_EXPAND_SUCCESS:
  case TIMELINE_FETCH_SUCCESS:
  case TIMELINE_REFRESH_SUCCESS:
    return set(state, action.statuses);
  case TIMELINE_UPDATE_RECEIVE:
    return set(state, action.status);
  default:
    return state;
  }
}

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export {
  deleteStatus,
  favouriteStatus,
  fetchStatus,
  pinStatus,
  reblogStatus,
  removeStatus,
  silenceStatus,
  submitStatus,
  unfavouriteStatus,
  unpinStatus,
  unreblogStatus,
  unsilenceStatus,
  updateStatus,
};
