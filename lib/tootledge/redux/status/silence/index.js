//  STATUS:SILENCE
//  ==============

//  Action types.
export const STATUS_SILENCE_REQUEST = 'STATUS_SILENCE_REQUEST';
export const STATUS_SILENCE_SUCCESS = 'STATUS_SILENCE_SUCCESS';
export const STATUS_SILENCE_FAILURE = 'STATUS_SILENCE_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: STATUS_SILENCE_REQUEST,
});
const success = status => ({
  status,
  type: STATUS_SILENCE_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: STATUS_SILENCE_FAILURE,
});

//  Request.
export default function silenceStatus (id, go, current, api) {
  go(request, id);
  api.post(
    `/api/v1/statuses/${id}/mute`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
}
