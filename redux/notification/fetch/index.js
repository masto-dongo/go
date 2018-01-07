//  NOTIFICATION:FETCH
//  ==================

//  Action types.
export const NOTIFICATION_FETCH_REQUEST = 'NOTIFICATION_FETCH_REQUEST';
export const NOTIFICATION_FETCH_SUCCESS = 'NOTIFICATION_FETCH_SUCCESS';
export const NOTIFICATION_FETCH_FAILURE = 'NOTIFICATION_FETCH_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: NOTIFICATION_FETCH_REQUEST,
});
const success = notification => ({
  notification,
  type: NOTIFICATION_FETCH_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: NOTIFICATION_FETCH_FAILURE,
});

//  Request.
export default function fetchNotification (id, force, go, current, api) {

  //  We only want to fetch notifications that we don't already have.
  //  If we already have a notification associated with this `id`, we
  //  do nothing.
  if (!force && current().getIn(['notification', id])) {
    return;
  }

  //  The request.
  go(request, id);
  api.get(
    `/api/v1/notifications/${id}`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
}
