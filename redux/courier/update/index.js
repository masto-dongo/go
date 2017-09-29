//  COURIER:UPDATE
//  ==============

//  Imported requests.
import { fetchRelationship } from 'themes/mastodon-go/redux';

//  Action types.
export const COURIER_UPDATE_RECEIVE = 'COURIER_UPDATE_RECEIVE';

//  Action creators.
const receive = notification => ({
  notification,
  type: COURIER_UPDATE_RECEIVE
});

//  Request.
export const updateCourier = (notification, go) => {

  //  If the `notification` is a follow, we fetch the
  //  relationships of its `account`.
  if (notification.type === 'follow') {
    go(fetchRelationship, notification.account.id, false);
  }

  //  Regardless, we dispatch the notification.
  go(receive, notification)
}
