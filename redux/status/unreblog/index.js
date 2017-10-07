//  STATUS:UNREBLOG
//  ===============

//  Action types.
export const STATUS_UNREBLOG_REQUEST = 'STATUS_UNREBLOG_REQUEST';
export const STATUS_UNREBLOG_SUCCESS = 'STATUS_UNREBLOG_SUCCESS';
export const STATUS_UNREBLOG_FAILURE = 'STATUS_UNREBLOG_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: STATUS_UNREBLOG_REQUEST,
});
const success = status => ({
  status,
  type: STATUS_UNREBLOG_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: STATUS_UNREBLOG_FAILURE,
});

//  Request.
export default function unreblogStatus (id, go, current, api) {
  go(request, id);
  api.get(
    `/api/v1/statuses/${id}/unreblog`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
}
