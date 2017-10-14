/*********************************************************************\
|                                                                     |
|   <NotificationContainer>                                           |
|   =======================                                           |
|                                                                     |
|   Notifications are pretty simple (they're mostly just a wrapper)   |
|   so the amount of data we need to fetch is fairly light.           |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

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

//  Building our store.
export default connect(createStructuredSelector({
  account: (state, { id }) => state.getIn(['notification', id, 'account']),
  datetime: (state, { id }) => state.getIn(['notification', id, 'datetime']),
  status: (state, { id }) => state.getIn(['notification', id, 'status']),
  type: (state, { id }) => state.getIn(['notification', id, 'type']),
}))(Notification);
