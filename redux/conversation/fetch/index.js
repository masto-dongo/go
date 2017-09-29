//  CONVERSATION:FETCH
//  ==================

//  Imported requests.
import { removeStatus } from 'themes/mastodon-go/redux';

//  Action types.
export const CONVERSATION_FETCH_REQUEST = 'CONVERSATION_FETCH_REQUEST';
export const CONVERSATION_FETCH_SUCCESS = 'CONVERSATION_FETCH_SUCCESS';
export const CONVERSATION_FETCH_FAILURE = 'CONVERSATION_FETCH_FAILURE';

//  Action creators.
const request = status => ({
  status,
  type: CONVERSATION_FETCH_REQUEST,
});
const success = (status, ancestors, descendants) => ({
  ancestors,
  descendants,
  status,
  type: CONVERSATION_FETCH_SUCCESS,
});
const failure = (status, error) => ({
  error,
  status,
  type: CONVERSATION_FETCH_FAILURE,
});

//  Request.
export const fetchConversation = (status, go, current, api) => {
  go(request, status);
  api.get(
    `/api/v1/statuses/${status}/context`
  ).then(
    response => go(success, status, response.data.ancestors, response.data.descendants)
  ).catch(
    error => {

      //  If we got a 404, that means that the status no longer exists.
      if (error.response && error.response.status === 404) {
        go(removeStatus, status);
      }

      //  We dispatch a failure regardless.
      go(failure, status, error);
    }
  );
};
