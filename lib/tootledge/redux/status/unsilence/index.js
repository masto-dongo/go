//  STATUS:UNSILENCE
//  ================

//  Action types.
export const STATUS_UNSILENCE_REQUEST = 'STATUS_UNSILENCE_REQUEST';
export const STATUS_UNSILENCE_SUCCESS = 'STATUS_UNSILENCE_SUCCESS';
export const STATUS_UNSILENCE_FAILURE = 'STATUS_UNSILENCE_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: STATUS_UNSILENCE_REQUEST,
});
const success = status => ({
  status,
  type: STATUS_UNSILENCE_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: STATUS_UNSILENCE_FAILURE,
});

//  Request.
export default function unsilenceStatus (id, go, current, api) {
  go(request, id);
  api.post(
    `/api/v1/statuses/${id}/unmute`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
}
