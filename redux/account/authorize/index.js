//  ACCOUNT:AUTHORIZE
//  =================

//  Action types.
export const ACCOUNT_AUTHORIZE_REQUEST = 'ACCOUNT_AUTHORIZE_REQUEST';
export const ACCOUNT_AUTHORIZE_SUCCESS = 'ACCOUNT_AUTHORIZE_SUCCESS';
export const ACCOUNT_AUTHORIZE_FAILURE = 'ACCOUNT_AUTHORIZE_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: ACCOUNT_AUTHORIZE_REQUEST,
});
const success = id => ({
  id,
  type: ACCOUNT_AUTHORIZE_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: ACCOUNT_AUTHORIZE_FAILURE,
});

//  Request.
export const authorizeAccount = (id, go, state, api) => {
  go(request, id);
  api.post(
    `/api/v1/follow_requests/${id}/authorize`
  ).then(
    response => go(success, id)
  ).catch(
    error => go(failure, id, error)
  );
};
