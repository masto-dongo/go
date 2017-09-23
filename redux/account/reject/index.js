//  ACCOUNT:REJECT
//  ==============

//  Action types.
export const ACCOUNT_REJECT_REQUEST = 'ACCOUNT_REJECT_REQUEST';
export const ACCOUNT_REJECT_SUCCESS = 'ACCOUNT_REJECT_SUCCESS';
export const ACCOUNT_REJECT_FAILURE = 'ACCOUNT_REJECT_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: ACCOUNT_REJECT_REQUEST,
});
const success = id => ({
  id,
  type: ACCOUNT_REJECT_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: ACCOUNT_REJECT_FAIL,
});

//  Request.
export const rejectAccount = (id, go, state, api) => {
  go(request, id);
  api.post(
    `/api/v1/follow_requests/${id}/reject`
  ).then(
    response => go(success, id)
  ).catch(
    error => go(failure, id, error)
  );
};
