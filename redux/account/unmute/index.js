//  ACCOUNT:UNMUTE
//  ==============

//  Action types.
export const ACCOUNT_UNMUTE_REQUEST = 'ACCOUNT_UNMUTE_REQUEST';
export const ACCOUNT_UNMUTE_SUCCESS = 'ACCOUNT_UNMUTE_SUCCESS';
export const ACCOUNT_UNMUTE_FAILURE = 'ACCOUNT_UNMUTE_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: ACCOUNT_UNMUTE_REQUEST,
});
const success = relationship => ({
  relationship,
  type: ACCOUNT_UNMUTE_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: ACCOUNT_UNMUTE_FAIL,
});

//  Request.
export const unmuteAccount = (id, go, current, api) => {
  go(request, id);
  api.post(
    `/api/v1/accounts/${id}/unmute`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
};
