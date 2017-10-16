//  NOTIFICATION:DELETE
//  ===================

//  Imported requests.
import { removeNotification } from 'themes/mastodon-go/redux';

//  Action types.
export const NOTIFICATION_DELETE_REQUEST = 'NOTIFICATION_DELETE_REQUEST';
export const NOTIFICATION_DELETE_SUCCESS = 'NOTIFICATION_DELETE_SUCCESS';
export const NOTIFICATION_DELETE_FAILURE = 'NOTIFICATION_DELETE_FAILURE';

//  Action creators.
const request = ids => ({
  ids,
  type: NOTIFICATION_DELETE_REQUEST,
});
const success = ids => ({
  ids,
  type: NOTIFICATION_DELETE_SUCCESS,
});
const failure = (ids, error) => ({
  error,
  ids,
  type: NOTIFICATION_DELETE_FAILURE,
});

//  Request.
export default function deleteNotification (ids, go, current, api) {
  go(request, ids);

  //  If our `ids` are an array, then we use the `destroy_multiple`
  //  endpoint. Otherwise, `dismiss` will suffice.
  (
    ids instanceof Array ? api.delete('/api/v1/notifications/destroy_multiple', { params: { ids } }) : api.post('/api/v1/notifications/dismiss', { id: ids })
  ).then(
    () => {
      go(success, ids);
      go(removeNotification, ids);
    }
  ).catch(
    error => go(failure, ids, error)
  );
}
