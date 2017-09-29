//  <NotificationContainer>
//  =======================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { createStructuredSelector } from 'reselect';

//  Component imports.
import Notification from '.';

//  Other imports
import { connect } from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Selector factory (props-only).
export default connect(
  go => createStructuredSelector({
    account: (state, { id }) => state.getIn(['notification', id, 'account']),
    datetime: (state, { id }) => state.getIn(['notification', id, 'datetime']),
    status: (state, { id }) => state.getIn(['notification', id, 'status']),
    type: (state, { id }) => state.getIn(['notification', id, 'type']),
  }),
)(Notification);
