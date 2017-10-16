//  <StatusContainer>
//  ==================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { createStructuredSelector } from 'reselect';

//  Component imports.
import Status from '.';

//  Request imports.
import {
  deleteStatus,
  favouriteStatus,
  fetchCard,
  fetchStatus,
  muteStatus,
  pinStatus,
  reblogStatus,
  unfavouriteStatus,
  unmuteStatus,
  unpinStatus,
  unreblogStatus,
} from 'themes/mastodon-go/redux';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';
import { POST_TYPE } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  Setup
//  -----

const getInStatus = (state, id, key) => {
  id = state.getIn(['status', id, 'reblog']) || id;
  return state.getIn(['status', id, key]);
};
const getCard = (state, id) => {
  id = state.getIn(['status', id, 'reblog']) || id;
  return state.getIn(['card', id]);
};

//  * * * * * * *  //

//  Connecting
//  ----------

export default connect(
  createStructuredSelector({
    account: (state, { id }) => getInStatus(state, id, 'account'),
    application: (state, { id }) => getInStatus(state, id, 'application'),
    card: (state, { id }) => getCard(state, id),
    comrade: (state, {
      comrade,
      id,
    }) => {
      if (!comrade && state.getIn(['status', id, 'reblog'])) {
        comrade = state.getIn(['status', id, 'account']);
      }
      return comrade || null;
    },
    content: (state, { id }) => getInStatus(state, id, 'content'),
    datetime: (state, { id }) => getInStatus(state, id, 'datetime'),
    href: (state, { id }) => getInStatus(state, id, 'href'),
    inReplyTo: (state, { id }) => getInStatus(state, id, 'inReplyTo'),
    is: (state, { id }) => getInStatus(state, id, 'is'),
    media: (state, { id }) => getInStatus(state, id, 'media'),
    mentions: (state, { id }) => getInStatus(state, id, 'mentions'),
    sensitive: (state, { id }) => getInStatus(state, id, 'sensitive'),
    spoiler: (state, { id }) => getInStatus(state, id, 'spoiler'),
    tags: (state, { id }) => getInStatus(state, id, 'tags'),
    type: (state, {
      id,
      type,
    }) => type | POST_TYPE.STATUS | (state.getIn(['status', id, 'reblog']) && POST_TYPE.IS_REBLOG) | (getInStatus(state, id, 'inReplyTo') && POST_TYPE.IS_MENTION),
    visibility: (state, { id }) => getInStatus(state, id, 'visibility'),
  }),
  (go, store, { id }) => ({
    card: () => go(fetchCard, id),
    delete: () => go(deleteStatus, id),
    favourite: () => go(favouriteStatus, id),
    fetch: () => go(fetchStatus, id),
    mute: () => go(muteStatus, id),
    pin: () => go(pinStatus, id),
    reblog: () => go(reblogStatus, id),
    unfavourite: () => go(unfavouriteStatus, id),
    unmute: () => go(unmuteStatus, id),
    unpin: () => go(unpinStatus, id),
    unreblog: () => go(unreblogStatus, id),
  })
)(Status);
