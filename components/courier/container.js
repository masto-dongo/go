/*********************************************************************\
|                                                                     |
|   <CourierContainer>                                                |
|   ==================                                                |
|                                                                     |
|   The courier container just pulls the usual timeline-esque infos   |
|   from our redux store: loading state, items, handlers, settings,   |
|   et cetera.  Couriers only respond to a single API access point,   |
|   /api/v1/notifications, so we don't need to specify the path.      |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

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
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Building our store and handlers.
export default connect(
  createStructuredSelector({
    isLoading: state => state.getIn(['courier', 'isLoading']),
    notifications: state => state.getIn(['courier', 'notifications']),
    settings: (state, { column }) => column ? state.getIn(['setting', 'global', 'courier']) : null,
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
