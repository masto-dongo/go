//  <ProfileContainer>
//  ==================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  createSelector,
  createStructuredSelector,
} from 'reselect';

//  Component imports.
import Account from '.';

//  Request imports.
import {
  blockAccount,
  fetchAccount,
  followAccount,
  muteAccount,
  unblockAccount,
  unfollowAccount,
  unmuteAccount,
} from 'themes/mastodon-go/redux';

//  Other imports
import { connect } from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Selector factory.
export default connect(
  go => createSelector(

    //  Props.
    createStructuredSelector({
      at: (state, { id }) => state.getIn(['account', id, 'at']),
      bio: (state, { id }) => state.getIn(['account', id, 'bio']),
      datetime: (state, { id }) => state.getIn(['account', id, 'datetime']),
      displayName: (state, { id }) => state.getIn(['account', id, 'displayName']),
      header: (state, { id }) => state.getIn(['account', id, 'header']),
      href: (state, { id }) => state.getIn(['account', id, 'href']),
      relationship: (state, { id }) => state.getIn(['relationship', id]),
    }),

    //  Inputs.
    (state, { id }) => id,

    //  Result.
    (props, id) => ({
      handler: {
        block: () => go(blockAccount, id),
        fetch: () => go(fetchAccount, id),
        follow: () => go(followAccount, id),
        mute: () => go(muteAccount, id),
        unblock: () => go(unblockAccount, id),
        unfollow: () => go(unfollowAccount, id),
        unmute: () => go(unmuteAccount, id),
      },
      ...props,
    })
  )
)(Profile);
