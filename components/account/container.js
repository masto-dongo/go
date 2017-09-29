//  <AccountContainer>
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
  authorizeAccount,
  blockAccount,
  followAccount,
  muteAccount,
  rejectAccount,
  unblockAccount,
  unfollowAccount,
  unmuteAccount,
} from 'themes/mastodon-go/redux';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Selector factory.
export default connect(
  go => createSelector(

    //  Props.
    createStructuredSelector({
      at: (state, { id }) => state.getIn(['account', id, 'at']),
      displayName: (state, { id }) => state.getIn(['account', id, 'displayName']),
      href: (state, { id }) => state.getIn(['account', id, 'href']),
      rainbow: (state, { id }) => state.getIn(['account', id, 'rainbow']),
      relationship: (state, { id }) => state.getIn(['relationship', id]),
    }),

    //  Inputs.
    (state, ownProps) => ownProps,

    //  Result.
    (props, ownProps) => ({
      handler: {
        authorize: () => go(authorizeAccount, ownProps.id),
        block: () => go(blockAccount, ownProps.id),
        follow: () => go(followAccount, ownProps.id),
        mute: () => go(muteAccount, ownProps.id),
        reject: () => go(rejectAccount, ownProps.id),
        unblock: () => go(unblockAccount, ownProps.id),
        unfollow: () => go(unfollowAccount, ownProps.id),
        unmute: () => go(unmuteAccount, ownProps.id),
      },
      ...props,
    })
  )
)(Account);
