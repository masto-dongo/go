//  <CourierContainer>
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

//  Selector factory.
export default connect(
  go => createSelector(

    //  Props.
    createStructuredSelector({
      notifications: state => state.getIn(['courier', 'notifications']),
    }),

    //  Result.
    props => ({
      handler: {
        clear: () => go(clearNotification),
        connect: () => go(connectCourier),
        delete: ids => go(deleteNotification, ids),
        expand: () => go(expandCourier),
        fetch: () => go(fetchCourier),
        refresh: () => go(refreshCourier),
      },
      ...props,
    })
  )
)(Courier);
