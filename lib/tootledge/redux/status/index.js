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
import muteStatus from './mute';
import pinStatus from './pin';
import reblogStatus from './reblog';
import removeStatus from './remove';
import submitStatus from './submit';
import unfavouriteStatus from './unfavourite';
import unmuteStatus from './unmute';
import unpinStatus from './unpin';
import unreblogStatus from './unreblog';

//  Action types.
import { COURIER_EXPAND_SUCCESS } from '../courier/expand';
import { COURIER_FETCH_SUCCESS } from '../courier/fetch';
import { COURIER_REFRESH_SUCCESS } from '../courier/refresh';
import { COURIER_UPDATE_RECEIVE } from '../courier/update';
import { NOTIFICATION_FETCH_SUCCESS } from '../notification/fetch';
import { RELATIONSHIP_BLOCK_SUCCESS } from '../relationship/block';
import { RELATIONSHIP_MUTE_SUCCESS } from '../relationship/mute';
import { STATUS_FAVOURITE_SUCCESS } from '../status/favourite';
import { STATUS_FETCH_SUCCESS } from '../status/fetch';
import { STATUS_MUTE_SUCCESS } from '../status/mute';
import { STATUS_PIN_SUCCESS } from '../status/pin';
import { STATUS_REBLOG_SUCCESS } from '../status/reblog';
import { STATUS_REMOVE_COMPLETE } from '../status/remove';
import { STATUS_UNFAVOURITE_SUCCESS } from '../status/unfavourite';
import { STATUS_UNMUTE_SUCCESS } from '../status/unmute';
import { STATUS_UNPIN_SUCCESS } from '../status/unpin';
import { STATUS_UNREBLOG_SUCCESS } from '../status/unreblog';
import { TIMELINE_EXPAND_SUCCESS } from '../timeline/expand';
import { TIMELINE_FETCH_SUCCESS } from '../timeline/fetch';
import { TIMELINE_REFRESH_SUCCESS } from '../timeline/refresh';
import { TIMELINE_UPDATE_RECEIVE } from '../timeline/update';

//  Lib imports.
import deHTMLify from '../../lib/deHTMLify';
import { Emoji } from '../../lib/emojify';

//  Constants.
import { VISIBILITY } from '../../constants';

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
}, oldContent) {
  const plainContent = oldContent && oldContent.get('html') === '' + content ? oldContent.get('plain') : deHTMLify(content);
  return ImmutableMap({
    account: account ? '' + account.id : null,
    application: application ? ImmutableMap({
      name: application.name,
      website: application.website,
    }) : null,
    content: ImmutableMap({
      html: '' + content,
      plain: '' + plainContent,
    }),
    counts: ImmutableMap({
      favourites: +favourites_count,
      reblogs: +reblogs_count,
    }),
    datetime: new Date(created_at),
    emoji: ImmutableList((emojis || []).map(
      emoji => new Emoji({
        name: '' + emoji.shortcode,
        href: '' + emoji.url,
        staticHref: '' + emoji.static_url,
        title: ':' + emoji.shortcode + ':',
      })
    )),
    href: '' + url,
    id: '' + id,
    inReplyTo: in_reply_to_id ? ImmutableMap({
      account: '' + in_reply_to_account_id,
      id: '' + in_reply_to_id,
    }) : null,
    is: ImmutableMap({
      favourited: !!favourited,
      muted: !!muted,
      reblogged: !!reblogged,
      reply: !!in_reply_to_id,
    }),
    media: ImmutableList((media_attachments || []).map(
      attachment => ImmutableMap({
        id: '' + attachment.id,
        src: ImmutableMap({
          local: '' + attachment.url,
          remote: '' + attachment.remote_url,
          shortlink: '' + attachment.text_url,
        }),
      })
    )),
    mentions: ImmutableList((mentions || []).map(
      mention => ImmutableMap({
        at: '' + mention.account,
        href: '' + mention.url,
        id: '' + mention.id,
        username: '' + mention.username,
      })
    )),
    reblog: reblog ? '' + reblog.id : null,
    sensitive: !!sensitive,
    spoiler: spoiler_text ? '' + spoiler_text : '',
    tags: ImmutableList((tags || []).map(
      tag => ImmutableMap({
        href: '' + tag.url,
        name: '' + tag.name,
      })
    )),
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
      if (/👁\ufe0f?$/.test(status.content)) {
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
  case STATUS_FAVOURITE_SUCCESS:
  case STATUS_FETCH_SUCCESS:
  case STATUS_MUTE_SUCCESS:
  case STATUS_PIN_SUCCESS:
  case STATUS_REBLOG_SUCCESS:
    return set(state, action.status);
  case STATUS_REMOVE_COMPLETE:
    return filterByStatus(state, action.ids);
  case STATUS_UNFAVOURITE_SUCCESS:
  case STATUS_UNMUTE_SUCCESS:
  case STATUS_UNPIN_SUCCESS:
  case STATUS_UNREBLOG_SUCCESS:
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
  muteStatus,
  pinStatus,
  reblogStatus,
  removeStatus,
  submitStatus,
  unfavouriteStatus,
  unmuteStatus,
  unpinStatus,
  unreblogStatus,
};
