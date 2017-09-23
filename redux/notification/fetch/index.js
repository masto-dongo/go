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
export const fetchNotification = (id, go, state, api) => {
  go(request, id);
  api.get(
    `/api/v1/notifications/${id}`
  ).then(
    response => go(success, response.data.value)
  ).catch(
    error => go(failure, id, error)
  );
};
