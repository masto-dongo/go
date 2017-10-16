//  COURIER:FETCH
//  =============

//  Imported requests.
import { fetchRelationship } from 'themes/mastodon-go/redux';

//  Action types.
export const COURIER_FETCH_REQUEST = 'COURIER_FETCH_REQUEST';
export const COURIER_FETCH_SUCCESS = 'COURIER_FETCH_SUCCESS';
export const COURIER_FETCH_FAILURE = 'COURIER_FETCH_FAILURE';

//  Action creators.
const request = { type: COURIER_FETCH_REQUEST };
const success = notifications => ({
  notifications,
  type: COURIER_FETCH_SUCCESS,
});
const failure = error => ({
  error,
  type: COURIER_FETCH_FAILURE,
});

//  Request.
export default function fetchCourier (go, current, api) {

  //  If our courier is still loading, we can't fetch yet.
  const courier = current().get('courier');
  if (courier && courier.get('isLoading')) {
    return;
  }

  //  The request.
  go(request);
  api.get(
    '/api/v1/notifications'
  ).then(
    response => {

      //  We fetch the relationships for any follow notifications.
      const follows = [];
      response.data.forEach(
        notification => {
          if (notification.type === 'follow') follows.push(notification.account.id);
        }
      );
      if (follows.length) {
        go(fetchRelationship, follows, false);
      }

      //  Regardless, we dispatch our success.
      go(success, response.data);
    }
  ).catch(
    error => go(failure, error)
  );
}
