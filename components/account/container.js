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
  authorizeRelationship,
  blockRelationship,
  followRelationship,
  muteRelationship,
  rejectRelationship,
  unblockRelationship,
  unfollowRelationship,
  unmuteRelationship,
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
        authorize: () => go(authorizeRelationship, ownProps.id),
        block: () => go(blockRelationship, ownProps.id),
        follow: () => go(followRelationship, ownProps.id),
        mute: () => go(muteRelationship, ownProps.id),
        reject: () => go(rejectRelationship, ownProps.id),
        unblock: () => go(unblockRelationship, ownProps.id),
        unfollow: () => go(unfollowRelationship, ownProps.id),
        unmute: () => go(unmuteRelationship, ownProps.id),
      },
      ...ownProps,
      ...props,
    })
  )
)(Account);
