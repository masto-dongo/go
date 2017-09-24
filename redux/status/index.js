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

//  Action types.
import { ACCOUNT_BLOCK_SUCCESS } from 'mastodon-go/redux/account/block';
import { ACCOUNT_MUTE_SUCCESS } from 'mastodon-go/redux/account/mute';
import { COURIER_EXPAND_SUCCESS } from 'mastodon-go/redux/courier/expand';
import { COURIER_FETCH_SUCCESS } from 'mastodon-go/redux/courier/fetch';
import { COURIER_REFRESH_SUCCESS } from 'mastodon-go/redux/courier/refresh';
import { COURIER_UPDATE_SUCCESS } from 'mastodon-go/redux/courier/update';
import { NOTIFICATION_FETCH_SUCCESS } from 'mastodon-go/redux/notification/fetch';
import { STATUS_FAVOURITE_SUCCESS } from 'mastodon-go/redux/status/favourite';
import { STATUS_FETCH_SUCCESS } from 'mastodon-go/redux/status/fetch';
import { STATUS_MUTE_SUCCESS } from 'mastodon-go/redux/status/mute';
import { STATUS_PIN_SUCCESS } from 'mastodon-go/redux/status/pin';
import { STATUS_REBLOG_SUCCESS } from 'mastodon-go/redux/status/reblog';
import { STATUS_REMOVE_COMPLETE } from 'mastodon-go/redux/status/fetch';
import { STATUS_UNFAVOURITE_SUCCESS } from 'mastodon-go/redux/status/unfavourite';
import { STATUS_UNMUTE_SUCCESS } from 'mastodon-go/redux/status/unmute';
import { STATUS_UNPIN_SUCCESS } from 'mastodon-go/redux/status/unpin';
import { STATUS_UNREBLOG_SUCCESS } from 'mastodon-go/redux/status/unreblog';
import { TIMELINE_EXPAND_SUCCESS } from 'mastodon-go/redux/timeline/expand';
import { TIMELINE_FETCH_SUCCESS } from 'mastodon-go/redux/timeline/fetch';
import { TIMELINE_REFRESH_SUCCESS } from 'mastodon-go/redux/timeline/refresh';
import { TIMELINE_UPDATE_SUCCESS } from 'mastodon-go/redux/timeline/update';

//  Our imports.
import { VISIBILITY } from 'mastodon-go/util/constants';
import emojify from 'mastodon-go/util/emoji';
import {
  parseEmoji,
  parseStatus,
  parseTextContent,
} from 'mastodon-go/util/parse';

//  * * * * * * *  //

//  Setup
//  -----

//  `normalize` takes a `status` API object and turns it into an
//  Immutable map that we can store. We only keep track of the `id`
//  of the status's related `account`, `reblog`, and `attachments`—not
//  their contents.
const normalize = status => ImmutableMap({
  account: '' + status.account.id,
  content: ImmutableMap({
    plain: parseTextContent(status.content),
    react: parseStatus(status.content),
  }),
  counts: ImmutableMap({
    favourites: +status.favourites_count,
    reblogs: +status.reblogs_count,
  }),
  datetime: new Date(status.created_at),
  href: '' + status.url,
  id: '' + status.id,
  inReplyTo: ImmutableMap({
    account: '' + status.in_reply_to_account_id,
    id: '' + status.in_reply_to_id,
  }),
  is: ImmutableMap({
    favourited: !!status.favourited,
    muted: !!status.muted,
    reblogged: !!status.reblogged,
  }),
  media: ImmutableList(status.media_attachments.map(
    attachment => attachment.id,
  )),
  mentions: ImmutableList(status.mentions.map(
    mention => mention.id,
  )),
  tags: ImmutableList(status.tags.map(
    tag => ImmutableMap({
      href: tag.url,
      name: tag.name,
    })
  )),
  reblog: '' + status.reblog.id,
  sensitive: !!status.sensitive,
  spoiler: ImmutableMap({
    plain: parseTextContent(status.spoiler_text),
    react: parseEmoji(status.spoiler_text),
  }),
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
        map.set(status.id, normalize(status))
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
  case ACCOUNT_BLOCK_SUCCESS:
  case ACCOUNT_MUTE_SUCCESS:

    //  If we aren't muting notifications, then we don't get rid of
    //  an account's statuses—although we will remove them from our
    //  timelines.
    if (action.relationship.blocking || action.relationship.muting && action.relationship.muting.notifications) {
      return filterByAccount(state, action.relationship.id);
    }
    return state;
  case COURIER_EXPAND_SUCCESS:
  case COURIER_FETCH_SUCCESS:
  case COURIER_REFRESH_SUCCESS:
    return set(state, action.notifications.map(
      notification => notification.status
    ));
  case COURIER_UPDATE:
    return set(state, action.notification.status);
  case NOTIFICATION_FETCH_SUCCESS:
    return set(state, action.notification.status);
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
    return set(state, action.statuses)
  case TIMELINE_UPDATE:
    return set(state, action.status);
  default:
    return state;
  }
};

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export { deleteStatus } from './delete';
export { favouriteStatus } from './favourite';
export { fetchStatus } from './fetch';
export { muteStatus } from './mute';
export { pinStatus } from './pin';
export { reblogStatus } from './reblog';
export { removeStatus } from './remove';
export { unfavouriteStatus } from './unfavourite';
export { unmuteStatus } from './unmute';
export { unpinStatus } from './unpin';
export { unreblogStatus } from './unreblog';
