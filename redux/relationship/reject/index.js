//  RELATIONSHIP:REJECT
//  ===================

//  Action types.
export const RELATIONSHIP_REJECT_REQUEST = 'RELATIONSHIP_REJECT_REQUEST';
export const RELATIONSHIP_REJECT_SUCCESS = 'RELATIONSHIP_REJECT_SUCCESS';
export const RELATIONSHIP_REJECT_FAILURE = 'RELATIONSHIP_REJECT_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: RELATIONSHIP_REJECT_REQUEST,
});
const success = id => ({
  id,
  type: RELATIONSHIP_REJECT_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: RELATIONSHIP_REJECT_FAILURE,
});

//  Request.
export default function rejectRelationship (id, go, current, api) {
  go(request, id);
  api.post(
    `/api/v1/follow_requests/${id}/reject`
  ).then(
    () => go(success, id)
  ).catch(
    error => go(failure, id, error)
  );
}
