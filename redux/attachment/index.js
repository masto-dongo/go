//  ATTACHMENT
//  ==========

//  We pull our attachments from statuses and store them separately
//  here. This allows us to render them easily without having to
//  go through the `status` section of our store, and additionally
//  helps unify them with attachments that don't *have* associated
//  statuses—for example, those that are received when uploading media
//  for a toot.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { Map as ImmutableMap } from 'immutable';

//  Request imports.
import submitAttachment from './submit';

//  Action types.
import { ATTACHMENT_SUBMIT_SUCCESS } from 'themes/mastodon-go/redux/attachment/submit';
import { COURIER_EXPAND_SUCCESS } from 'themes/mastodon-go/redux/courier/expand';
import { COURIER_FETCH_SUCCESS } from 'themes/mastodon-go/redux/courier/fetch';
import { COURIER_REFRESH_SUCCESS } from 'themes/mastodon-go/redux/courier/refresh';
import { COURIER_UPDATE_RECEIVE } from 'themes/mastodon-go/redux/courier/update';
import { NOTIFICATION_FETCH_SUCCESS } from 'themes/mastodon-go/redux/notification/fetch';
import { STATUS_FAVOURITE_SUCCESS } from 'themes/mastodon-go/redux/status/favourite';
import { STATUS_FETCH_SUCCESS } from 'themes/mastodon-go/redux/status/fetch';
import { STATUS_MUTE_SUCCESS } from 'themes/mastodon-go/redux/status/mute';
import { STATUS_PIN_SUCCESS } from 'themes/mastodon-go/redux/status/pin';
import { STATUS_REBLOG_SUCCESS } from 'themes/mastodon-go/redux/status/reblog';
import { STATUS_UNFAVOURITE_SUCCESS } from 'themes/mastodon-go/redux/status/unfavourite';
import { STATUS_UNMUTE_SUCCESS } from 'themes/mastodon-go/redux/status/unmute';
import { STATUS_UNPIN_SUCCESS } from 'themes/mastodon-go/redux/status/unpin';
import { STATUS_UNREBLOG_SUCCESS } from 'themes/mastodon-go/redux/status/unreblog';
import { TIMELINE_EXPAND_SUCCESS } from 'themes/mastodon-go/redux/timeline/expand';
import { TIMELINE_FETCH_SUCCESS } from 'themes/mastodon-go/redux/timeline/fetch';
import { TIMELINE_REFRESH_SUCCESS } from 'themes/mastodon-go/redux/timeline/refresh';
import { TIMELINE_UPDATE_RECEIVE } from 'themes/mastodon-go/redux/timeline/update';

//  Other imports.
import { MEDIA_TYPE } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  Setup
//  -----

//  `normalize()` normalizes our attachment into an Immutable map.
const normalize = ({
  description,
  id,
  meta,
  preview_url,
  remote_url,
  text_url,
  type,
  url,
}) => ImmutableMap({
  description: description ? '' + description : '',
  height: +((meta || {}).original || {}).height,
  href: remote_url || url,
  id: '' + id,
  preview: preview_url ? ImmutableMap({
    height: +((meta || {}).small || {}).height,
    src: '' + preview_url,
    width: +((meta || {}).small || {}).width,
  }) : null,
  src: ImmutableMap({
    local: url ? '' + url : null,
    remote: remote_url ? '' + remote_url : null,
    shortlink: text_url ? '' + text_url : null,
  }),
  type: function () {
    switch (type) {
    case 'gifv':
      return MEDIA_TYPE.GIFV;
    case 'image':
      return MEDIA_TYPE.IMAGE;
    case 'video':
      return MEDIA_TYPE.VIDEO;
    default:
      return MEDIA_TYPE.UNKNOWN;
    }
  }(),
  width: +((meta || {}).original || {}).width,
});

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is an empty map. Our attachments will be added
//  to this by `id`.
const initialState = ImmutableMap();

//  `set()` just sets the Immutable map at each `attachment`'s `id` to
//  be a newly normalized account. We make the assumption that
//  attachments are immutable, and only set them if they aren't already
//  defined.
const set = (state, attachments) => state.withMutations(
  map => [].concat(attachments).forEach(
    attachment => {
      if (!map.get('' + attachment.id)) {
        map.set('' + attachment.id, normalize(attachment));
      }
    }
  )
);

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function attachment (state = initialState, action) {
  switch(action.type) {
  case ATTACHMENT_SUBMIT_SUCCESS:
    return set(state, action.attachment);
  case COURIER_EXPAND_SUCCESS:
  case COURIER_FETCH_SUCCESS:
  case COURIER_REFRESH_SUCCESS:
    return set(state, [].concat(...action.notifications.map(
      notification => notification.status.media_attachments
    )));
  case COURIER_UPDATE_RECEIVE:
    return set(state, action.notification.status.media_attachments);
  case NOTIFICATION_FETCH_SUCCESS:
    return set(state, action.notification.status.media_attachments);
  case STATUS_FAVOURITE_SUCCESS:
  case STATUS_FETCH_SUCCESS:
  case STATUS_MUTE_SUCCESS:
  case STATUS_PIN_SUCCESS:
  case STATUS_REBLOG_SUCCESS:
  case STATUS_UNFAVOURITE_SUCCESS:
  case STATUS_UNMUTE_SUCCESS:
  case STATUS_UNPIN_SUCCESS:
  case STATUS_UNREBLOG_SUCCESS:
    return set(state, action.status.media_attachments);
  case TIMELINE_EXPAND_SUCCESS:
  case TIMELINE_FETCH_SUCCESS:
  case TIMELINE_REFRESH_SUCCESS:
    return set(state, [].concat(...action.statuses.map(
      status => status.media_attachments
    )));
  case TIMELINE_UPDATE_RECEIVE:
    return set(state, action.status.media_attachments);
  default:
    return state;
  }
};

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export { submitAttachment };
