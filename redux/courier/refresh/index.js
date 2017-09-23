//  COURIER:REFRESH
//  ===============

//  Imported requests.
import { fetchRelationship } from 'mastodon-go/redux';

//  Action types.
export const COURIER_REFRESH_REQUEST = 'COURIER_REFRESH_REQUEST';
export const COURIER_REFRESH_SUCCESS = 'COURIER_REFRESH_SUCCESS';
export const COURIER_REFRESH_FAILURE = 'COURIER_REFRESH_FAILURE';

//  Action creators.
const request = { type: COURIER_REFRESH_REQUEST };
const success = notifications => ({
  notifications,
  type: COURIER_REFRESH_SUCCESS,
})
const failure = error => ({
  error,
  type: COURIER_REFRESH_FAILURE,
})

//  Request.
export const refreshCourier = (go, state, api) => {

  //  If our courier is still loading, we can't refresh yet.
  const courier = state.get('courier');
  if (courier && courier.get('isLoading')) {
    return;
  }

  //  If our courier already has some notifications, this gets the
  //  latest one.
  const ids = courier ? courier.get('notifications') : void 0;
  const newestId = ids && ids.size > 0 ? ids.first() : void 0;

  //  If we have a newest id, then we can set it in our params.
  const params = {};
  if (newestId !== void 0) params.since_id = newestId;

  //  The request.
  go(request);
  api.get(
    '/api/v1/notifications', { params }
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
