//  COURIER:EXPAND
//  ==============

//  Imported requests.
import { fetchRelationship } from 'themes/mastodon-go/redux';

//  Action types.
export const COURIER_EXPAND_REQUEST = 'COURIER_EXPAND_REQUEST';
export const COURIER_EXPAND_SUCCESS = 'COURIER_EXPAND_SUCCESS';
export const COURIER_EXPAND_FAILURE = 'COURIER_EXPAND_FAILURE';

//  Action creators.
const request = { type: COURIER_EXPAND_REQUEST };
const success = (notifications, prev, next) => ({
  next,
  notifications,
  prev,
  type: COURIER_EXPAND_SUCCESS,
});
const failure = error => ({
  error,
  type: COURIER_EXPAND_FAILURE,
});

//  Request.
export default function expandCourier (go, current, api) {

  //  If our courier is still loading, we can't expand yet.
  const courier = current().get('courier');
  if (courier && courier.get('isLoading')) {
    return;
  }

  //  If we were provided a link header in our last request, we can
  //  use it.
  const linkPath = courier && courier.get('next');

  //  The request.
  go(request);
  api.get(linkPath || '/api/v1/notifications').then(function ({
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
