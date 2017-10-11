//  <CourierContainer>
//  ==================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { createStructuredSelector } from 'reselect';

//  Component imports.
import Courier from '.';

//  Request imports.
import {
  connectCourier,
  expandCourier,
  fetchCourier,
  refreshCourier,
  clearNotification,
  deleteNotification,
} from 'themes/mastodon-go/redux';

//  Other imports
import { connect } from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

export default connect(
  createStructuredSelector({
    isLoading: state => state.getIn(['courier', 'isLoading']),
    notifications: state => state.getIn(['courier', 'notifications']),
    rainbow: state => state.getIn(['courier', 'rainbow']),
    settings: state => state.getIn(['setting', 'global', 'courier']),
  }),
  go => ({
    clear: () => go(clearNotification),
    connect: () => go(connectCourier),
    delete: ids => go(deleteNotification, ids),
    expand: () => go(expandCourier),
    fetch: () => go(fetchCourier),
    refresh: () => go(refreshCourier),
  })
)(Courier);
