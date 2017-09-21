//  <StatusContainer>
//  =================

//  For code documentation, please see:
//  https://glitch-soc.github.io/docs/javascript/mastodon-go/account/container

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { createSelector } from 'reselect';

//  Mastodon imports.
import { openModal } from 'mastodon/actions/modal';

//  Our imports.
import Account from '.';
import {
  blockAccount,
  followAccount,
  muteAccount,
  unblockAccount,
  unfollowAccount,
  unmuteAccount,
} from 'mastodon-go/actions/accounts';
import makeAccountSelector from 'mastodon-go/selectors/account';

//  * * * * * * *  //

//  State mapping
//  -------------

//  We wrap our `mapStateToProps()` function in a
//  `makeMapStateToProps()` to give us a closure and preserve
//  `makeGetStatus()`'s value.
const makeMapStateToProps = () => createSelector(
  [
    (state, { id }) => state.getIn(['account', id]),
    (state)         => state.getIn(['meta', 'me']),
  ],

  (account, me) => ({
    account,
    me,
  })

);

//  * * * * * * *  //

//  Dispatch mapping
//  ----------------

const makeMapDispatchToProps = dispatch => createSelector(
  [
    (_, { id })   => id,
    (_, { intl }) => intl,
  ],

  intl => ({
    handler: {
      block: () => dispatch(blockAccount(id)),
      follow: () => dispatch(followAccount(id)),
      mute: () => dispatch(muteAccount(id)),
      unblock: () => dispatch(unblockAccount(id)),
      unfollow: () => dispatch(unfollowAccount(id)),
      unmute: () => dispatch(unmuteAccount(id)),
    },
  }),
);

//  * * * * * * *  //

//  Connecting
//  ----------

//  `connect` will only update when its resultant props change. So
//  `withRouter` won't get called unless an update is already planned.
//  This is intended behaviour because we only care about the (mutable)
//  `history` object.
export default injectIntl(
  connect(makeMapStateToProps, makeMapDispatchToProps)(
    withRouter(Status)
  )
);
