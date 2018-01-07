//  COURIER:FETCH
//  =============

//  Imported requests.
import { fetchRelationship } from '../../relationship';

//  Action types.
export const COURIER_FETCH_REQUEST = 'COURIER_FETCH_REQUEST';
export const COURIER_FETCH_SUCCESS = 'COURIER_FETCH_SUCCESS';
export const COURIER_FETCH_FAILURE = 'COURIER_FETCH_FAILURE';

//  Action creators.
const request = { type: COURIER_FETCH_REQUEST };
const success = (notifications, prev, next) => ({
  next,
  notifications,
  prev,
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
  api.get('/api/v1/notifications').then(function ({
    data,
    headers: { link },
  }) {
    const next = (link.match(/<\s*([^,]*)\s*>\s*;(?:[^,]*[;\s])?rel="?next"?/) || [])[1];
    const prev = (link.match(/<\s*([^,]*)\s*>\s*;(?:[^,]*[;\s])?rel="?prev(?:ious)?"?/) || [])[1];

    //  We fetch the relationships for any follow notifications.
    const follows = [];
    data.forEach(function (notification) {
      if (notification.type === 'follow') {
        follows.push(notification.account.id);
      }
    });
    if (follows.length) {
      go(fetchRelationship, follows, false);
    }

    //  Regardless, we dispatch our success.
    go(success, data, prev, next);
  }).catch(function (error) {
    go(failure, error);
  });
}
