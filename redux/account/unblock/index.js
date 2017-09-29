//  ACCOUNT:UNBLOCK
//  ===============

//  Action types.
export const ACCOUNT_UNBLOCK_REQUEST = 'ACCOUNT_UNBLOCK_REQUEST';
export const ACCOUNT_UNBLOCK_SUCCESS = 'ACCOUNT_UNBLOCK_SUCCESS';
export const ACCOUNT_UNBLOCK_FAILURE = 'ACCOUNT_UNBLOCK_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: ACCOUNT_UNBLOCK_REQUEST,
});
const success = relationship => ({
  relationship,
  type: ACCOUNT_UNBLOCK_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: ACCOUNT_UNBLOCK_FAIL,
});

//  Request.
export const unblockAccount = (id, go, current, api) => {
  go(request, id);
  api.post(
    `/api/v1/accounts/${id}/unblock`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
};
