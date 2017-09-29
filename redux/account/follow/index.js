//  ACCOUNT:FOLLOW
//  ==============

//  Action types.
export const ACCOUNT_FOLLOW_REQUEST = 'ACCOUNT_FOLLOW_REQUEST';
export const ACCOUNT_FOLLOW_SUCCESS = 'ACCOUNT_FOLLOW_SUCCESS';
export const ACCOUNT_FOLLOW_FAILURE = 'ACCOUNT_FOLLOW_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: ACCOUNT_FOLLOW_REQUEST,
});
const success = relationship => ({
  relationship,
  type: ACCOUNT_FOLLOW_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: ACCOUNT_FOLLOW_FAILURE,
});

//  Request.
export const followAccount = (id, go, current, api) => {
  go(request, id);
  api.get(
    `/api/v1/accounts/${id}/follow`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
};
