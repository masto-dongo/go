//  COMPOSER:SUBMIT
//  ===============

//  Imported requests.
import { removeStatus } from 'mastodon-go/redux';

//  Action types.
export const CONVERSATION_FETCH_REQUEST = 'CONVERSATION_FETCH_REQUEST';
export const CONVERSATION_FETCH_SUCCESS = 'CONVERSATION_FETCH_SUCCESS';
export const CONVERSATION_FETCH_FAILURE = 'CONVERSATION_FETCH_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: CONVERSATION_FETCH_REQUEST,
});
const success = (id, ancestors, descendants) => ({
  ancestors,
  descendants,
  id,
  type: CONVERSATION_FETCH_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: CONVERSATION_FETCH_FAILURE,
});

//  Request.
export const fetchConversation = (id, go, state, api) => {
  go(request, id);
  api.get(
    `/api/v1/statuses/${id}/context`
  ).then(
    response => go(success, id, response.data.value.ancestors, response.data.value.descendants)
  ).catch(
    error => {

      //  If we got a 404, that means that the status no longer exists.
      if (error.response && error.response.status === 404) {
        go(removeStatus, id);
      }

      //  We dispatch a failure regardless.
      go(failure, id, error);
    }
  );
};
