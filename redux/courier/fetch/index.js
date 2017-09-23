//  COURIER:FETCH
//  =============

//  Imported requests.
import { fetchRelationship } from 'mastodon-go/redux';

//  Action types.
export const COURIER_FETCH_REQUEST = 'COURIER_FETCH_REQUEST';
export const COURIER_FETCH_SUCCESS = 'COURIER_FETCH_SUCCESS';
export const COURIER_FETCH_FAILURE = 'COURIER_FETCH_FAILURE';

//  Action creators.
const request = { type: COURIER_FETCH_REQUEST };
const success = notifications => ({
  notifications,
  type: COURIER_FETCH_SUCCESS,
})
const failure = error => ({
  error,
  type: COURIER_FETCH_FAILURE,
})

//  Request.
export const fetchCourier = (go, state, api) => {

  //  If our courier is still loading, we can't fetch yet.
  const courier = state.get('courier');
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
      follows = [];
      response.data.value.forEach(
        notification => {
          if (notification.type === 'follow') follows.push(notification.account.id);
        }
      );
      if (follows.length) {
        go(fetchRelationship, follows);
      }

      //  Regardless, we dispatch our success.
      go(success, response.data.value)
    }
  ).catch(
    error => go(failure, error)
  );
}
