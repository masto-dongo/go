//  RELATIONSHIP:AUTHORIZE
//  ======================

//  Action types.
export const RELATIONSHIP_AUTHORIZE_REQUEST = 'RELATIONSHIP_AUTHORIZE_REQUEST';
export const RELATIONSHIP_AUTHORIZE_SUCCESS = 'RELATIONSHIP_AUTHORIZE_SUCCESS';
export const RELATIONSHIP_AUTHORIZE_FAILURE = 'RELATIONSHIP_AUTHORIZE_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: RELATIONSHIP_AUTHORIZE_REQUEST,
});
const success = id => ({
  id,
  type: RELATIONSHIP_AUTHORIZE_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: RELATIONSHIP_AUTHORIZE_FAILURE,
});

//  Request.
export default function authorizeRelationship (id, go, current, api) {
  go(request, id);
  api.post(
    `/api/v1/follow_requests/${id}/authorize`
  ).then(
    () => go(success, id)
  ).catch(
    error => go(failure, id, error)
  );
}
