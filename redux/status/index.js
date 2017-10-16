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
import escapeTextContentForBrowser from 'escape-html';

//  Requests.
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
import { COURIER_EXPAND_SUCCESS } from 'themes/mastodon-go/redux/courier/expand';
import { COURIER_FETCH_SUCCESS } from 'themes/mastodon-go/redux/courier/fetch';
import { COURIER_REFRESH_SUCCESS } from 'themes/mastodon-go/redux/courier/refresh';
import { COURIER_UPDATE_RECEIVE } from 'themes/mastodon-go/redux/courier/update';
import { NOTIFICATION_FETCH_SUCCESS } from 'themes/mastodon-go/redux/notification/fetch';
import { RELATIONSHIP_BLOCK_SUCCESS } from 'themes/mastodon-go/redux/relationship/block';
import { RELATIONSHIP_MUTE_SUCCESS } from 'themes/mastodon-go/redux/relationship/mute';
import { STATUS_FAVOURITE_SUCCESS } from 'themes/mastodon-go/redux/status/favourite';
import { STATUS_FETCH_SUCCESS } from 'themes/mastodon-go/redux/status/fetch';
import { STATUS_MUTE_SUCCESS } from 'themes/mastodon-go/redux/status/mute';
import { STATUS_PIN_SUCCESS } from 'themes/mastodon-go/redux/status/pin';
import { STATUS_REBLOG_SUCCESS } from 'themes/mastodon-go/redux/status/reblog';
import { STATUS_REMOVE_COMPLETE } from 'themes/mastodon-go/redux/status/remove';
import { STATUS_UNFAVOURITE_SUCCESS } from 'themes/mastodon-go/redux/status/unfavourite';
import { STATUS_UNMUTE_SUCCESS } from 'themes/mastodon-go/redux/status/unmute';
import { STATUS_UNPIN_SUCCESS } from 'themes/mastodon-go/redux/status/unpin';
import { STATUS_UNREBLOG_SUCCESS } from 'themes/mastodon-go/redux/status/unreblog';
import { TIMELINE_EXPAND_SUCCESS } from 'themes/mastodon-go/redux/timeline/expand';
import { TIMELINE_FETCH_SUCCESS } from 'themes/mastodon-go/redux/timeline/fetch';
import { TIMELINE_REFRESH_SUCCESS } from 'themes/mastodon-go/redux/timeline/refresh';
import { TIMELINE_UPDATE_RECEIVE } from 'themes/mastodon-go/redux/timeline/update';

//  Other imports.
import {
  POST_TYPE,
  VISIBILITY,
} from 'themes/mastodon-go/util/constants';
import deHTMLify from 'themes/mastodon-go/util/deHTMLify';

//  * * * * * * *  //

//  Setup
//  -----

//  `normalize` takes a `status` API object and turns it into an
//  Immutable map that we can store. We only keep track of the `id`
//  of the status's related `account`, `reblog`, and `attachments`—not
//  their contents.
const normalize = (status, oldContent) => {
  const plainContent = oldContent && oldContent.get('html') === '' + status.content ? oldContent.get('plain') : deHTMLify(status.content);
  return ImmutableMap({
    account: '' + status.account.id,
    application: ImmutableMap({
      name: status.application.name,
      website: status.application.website,
    }),
    content: ImmutableMap({
      html: '' + status.content,
      plain: '' + plainContent,
    }),
    counts: ImmutableMap({
      favourites: +status.favourites_count,
      reblogs: +status.reblogs_count,
    }),
    datetime: new Date(status.created_at),
    href: '' + status.url,
    id: '' + status.id,
    inReplyTo: status.in_reply_to_id ? ImmutableMap({
      account: '' + status.in_reply_to_account_id,
      id: '' + status.in_reply_to_id,
    }) : null,
    is: ImmutableMap({
      favourited: !!status.favourited,
      muted: !!status.muted,
      reblogged: !!status.reblogged,
      reply: !!status.in_reply_to_id,
    }),
    media: ImmutableList(status.media_attachments.map(
      attachment => '' + attachment.id,
    )),
    mentions: ImmutableList(status.mentions.map(
      mention => '' + mention.id,
    )),
    reblog: status.reblog ? '' + status.reblog.id : null,
    sensitive: !!status.sensitive,
    spoiler: '' + status.spoiler_text,
    tags: ImmutableList(status.tags.map(
      tag => ImmutableMap({
        href: '' + tag.url,
        name: '' + tag.name,
      })
    )),
    visibility: (
      visibility => {
        let value = VISIBLITY.DIRECT;
        switch (type) {
        case "private":
          value = VISIBILITY.PRIVATE;
          break;
        case "public":
          value = VISIBILITY.PUBLIC;
          break;
        case "unlisted":
          value = VISIBILITY.UNLISTED;
          break;
        }
        if (/👁\ufe0f?$/.test(status.content)) {
          value &= ~VISIBILITY.FEDERATED;
        }
      }
    )(status.visiblity),
  });
}

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
        map.set('' + status.id, normalize(status))
      }
    }
  )
);

//  `remove()` deletes the statuses with the given `ids` from the store.
const remove = (state, ids) => state.deleteAll([].concat(ids));

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
}

// `filterByStatus()` deletes those statuses whose `id`
//   or `reblog` matches one of the ones provided.
const filterByStatus = (state, statuses) => {
  statuses = [].concat(statuses);
  state.filter(
    status => statuses.indexOf(status.get('id')) === -1 && (!status.get('reblog') || statuses.indexOf(status.get('reblog')) === -1)
  );
}

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
    return set(state, action.notification.status);
  case STATUS_REMOVE_COMPLETE:
    return filterByStatus(state, action.ids);
  case STATUS_UNFAVOURITE_SUCCESS:
  case STATUS_UNMUTE_SUCCESS:
  case STATUS_UNPIN_SUCCESS:
  case STATUS_UNREBLOG_SUCCESS:
    return set(state, action.notification.status);
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
