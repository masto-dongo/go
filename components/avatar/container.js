//  <AvatarContainer>
//  ==================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { createStructuredSelector } from 'reselect';

//  Component imports.
import Avatar from '.';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Selector factory (props-only).
export default connect(
  () => createStructuredSelector({
    accountAt: (state, { account }) => state.getIn(['account', account, 'at']),
    accountSrc: (state, { account }) => state.getIn(['account', account, 'avatar']),
    comradeAt: (state, { comrade }) => comrade ? state.getIn(['account', comrade, 'at']) : null,
    comradeSrc: (state, { comrade }) => comrade ? state.getIn(['account', comrade, 'avatar']) : null,
  })
)(Avatar);
