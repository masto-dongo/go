//  <AccountContainer>
//  ==================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { createSelector } from 'reselect';

//  Our imports.
import Account from '.';
import {
  authorizeAccount,
  blockAccount,
  followAccount,
  muteAccount,
  rejectAccount,
  unblockAccount,
  unfollowAccount,
  unmuteAccount,
} from 'mastodon-go/redux';
import { connect } from 'mastodon-go/util/connect';

//  * * * * * * *  //

//  Selectors
//  ---------

//  State selector.
const stater = () => createSelector(
  [
    (state, { id }) => state.getIn(['account', id, 'at']),
    (state, { id }) => state.getIn(['account', id, 'displayName']),
    (state, { id }) => state.getIn(['account', id, 'href']),
    (state, { id }) => state.getIn(['relationship', id]),
  ],
  (at, displayName, href, relationship) => ({
    at,
    displayName,
    href,
    relationship,
  });
);

//  Dispatch selector.
const dispatcher = go => createSelector(
  [
    (_, { id }) => id,
  ],
  id => ({
    handler: {
      authorize () {
        go(authorizeAccount, id);
      },
      block () {
        go(blockAccount, id);
      },
      follow () {
        go(followAccount, id);
      },
      mute () {
        go(muteAccount, id);
      },
      reject () {
        go(rejectAccount, id);
      },
      unblock () {
        go(unblockAccount, id);
      },
      unfollow () {
        go(unfollowAccount, id);
      },
      unmute () {
        go(unmuteAccount, id);
      },
    },
  }),
);

//  * * * * * * *  //

//  Connecting
//  ----------

//  Making the connection.
export default connect(Account);
