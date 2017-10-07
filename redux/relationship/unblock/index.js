//  RELATIONSHIP:UNBLOCK
//  ====================

//  Action types.
export const RELATIONSHIP_UNBLOCK_REQUEST = 'RELATIONSHIP_UNBLOCK_REQUEST';
export const RELATIONSHIP_UNBLOCK_SUCCESS = 'RELATIONSHIP_UNBLOCK_SUCCESS';
export const RELATIONSHIP_UNBLOCK_FAILURE = 'RELATIONSHIP_UNBLOCK_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: RELATIONSHIP_UNBLOCK_REQUEST,
});
const success = relationship => ({
  relationship,
  type: RELATIONSHIP_UNBLOCK_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: RELATIONSHIP_UNBLOCK_FAIL,
});

//  Request.
export default function unblockRelationship (id, go, current, api) {
  go(request, id);
  api.post(
    `/api/v1/accounts/${id}/unblock`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
}
