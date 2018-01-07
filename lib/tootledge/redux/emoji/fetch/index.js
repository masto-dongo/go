//  EMOJI:FETCH
//  ==========

//  Action types.
export const EMOJI_FETCH_REQUEST = 'EMOJI_FETCH_REQUEST';
export const EMOJI_FETCH_SUCCESS = 'EMOJI_FETCH_SUCCESS';
export const EMOJI_FETCH_FAILURE = 'EMOJI_FETCH_FAILURE';

//  Action creators.
const request = { type: EMOJI_FETCH_REQUEST };
const success = emoji => ({
  emoji,
  type: EMOJI_FETCH_SUCCESS,
});
const failure = error => ({
  error,
  type: EMOJI_FETCH_FAILURE,
});

//  Request.
export default function fetchEmoji (go, current, api) {

  //  The request.
  go(request);
  api.get(
    '/api/v1/custom_emojis'
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, error)
  );
}
