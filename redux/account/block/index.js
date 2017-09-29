//  ACCOUNT:BLOCK
//  =============

//  Action types.
export const ACCOUNT_BLOCK_REQUEST = 'ACCOUNT_BLOCK_REQUEST';
export const ACCOUNT_BLOCK_SUCCESS = 'ACCOUNT_BLOCK_SUCCESS';
export const ACCOUNT_BLOCK_FAILURE = 'ACCOUNT_BLOCK_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: ACCOUNT_BLOCK_REQUEST,
});
const success = relationship => ({
  relationship,
  type: ACCOUNT_BLOCK_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: ACCOUNT_BLOCK_FAIL,
});

//  Request.
export const blockAccount = (id, go, current, api) => {
  go(request, id);
  api.post(
    `/api/v1/accounts/${id}/block`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
};
