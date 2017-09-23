//  COURIER:EXPAND
//  ==============

//  Imported requests.
import { fetchRelationship } from 'mastodon-go/redux';

//  Action types.
export const COURIER_EXPAND_REQUEST = 'COURIER_EXPAND_REQUEST';
export const COURIER_EXPAND_SUCCESS = 'COURIER_EXPAND_SUCCESS';
export const COURIER_EXPAND_FAILURE = 'COURIER_EXPAND_FAILURE';

//  Action creators.
const request = { type: COURIER_EXPAND_REQUEST };
const success = notifications => ({
  notifications,
  type: COURIER_EXPAND_SUCCESS,
})
const failure = error => ({
  error,
  type: COURIER_EXPAND_FAILURE,
})

//  Request.
export const expandCourier = (go, state, api) => {

  //  If our courier is still loading, we can't expand yet.
  const courier = state.get('courier');
  if (courier && courier.get('isLoading')) {
    return;
  }

  //  If our courier already has some notifications, this gets the
  //  oldest one.
  const ids = courier ? courier.get('notifications') : void 0;
  const oldestId = ids && ids.size > 0 ? ids.last() : void 0;

  //  If we have an oldest id, then we can set it in our params.
  const params = { limit: 20 };
  if (oldestId !== void 0) params.max_id = oldestId;

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
