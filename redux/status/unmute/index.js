//  STATUS:UNMUTE
//  =============

//  Action types.
export const STATUS_UNMUTE_REQUEST = 'STATUS_UNMUTE_REQUEST';
export const STATUS_UNMUTE_SUCCESS = 'STATUS_UNMUTE_SUCCESS';
export const STATUS_UNMUTE_FAILURE = 'STATUS_UNMUTE_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: STATUS_UNMUTE_REQUEST,
});
const success = status => ({
  status,
  type: STATUS_UNMUTE_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: STATUS_UNMUTE_FAILURE,
});

//  Request.
export default function unmuteStatus (id, go, current, api) {
  go(request, id);
  api.post(
    `/api/v1/statuses/${id}/unmute`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
}
