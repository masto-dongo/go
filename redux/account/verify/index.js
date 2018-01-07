//  ACCOUNT:VERIFY
//  ==============

//  Action types.
export const ACCOUNT_VERIFY_REQUEST = 'ACCOUNT_VERIFY_REQUEST';
export const ACCOUNT_VERIFY_SUCCESS = 'ACCOUNT_VERIFY_SUCCESS';
export const ACCOUNT_VERIFY_FAILURE = 'ACCOUNT_VERIFY_FAILURE';

//  Action creators.
const request = { type: ACCOUNT_VERIFY_REQUEST };
const success = account => ({
  account,
  type: ACCOUNT_VERIFY_SUCCESS,
});
const failure = error => ({
  error,
  type: ACCOUNT_VERIFY_FAILURE,
});

//  Request.
export default function verifyAccount (go, current, api) {

  //  The request.
  go(request);
  api.get(
    '/api/v1/accounts/verify_credentials'
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, error)
  );
}
