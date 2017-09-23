//  COURIER:FETCH
//  =============

//  Imported requests.
import { fetchRelationship } from 'mastodon-go/redux';

//  Action types.
export const COURIER_UPDATE_RECEIVE = 'COURIER_UPDATE_RECEIVE';

//  Action creators.
const receive = () => ({
  notification,
  type: COURIER_FETCH_REQUEST
});

//  Request.
export const updateCourier = (notification, go, state, api) => {

  //  If the `notification` is a follow, we fetch the
  //  relationships of its `account`.
  if (notification.type === 'follow') {
    go(fetchRelationship, notification.account.id);
  }

  //  Regardless, we dispatch the notification.
  go(receive, notification)
}
