//  RELATIONSHIP:BLOCK
//  ==================

//  Action types.
export const RELATIONSHIP_BLOCK_REQUEST = 'RELATIONSHIP_BLOCK_REQUEST';
export const RELATIONSHIP_BLOCK_SUCCESS = 'RELATIONSHIP_BLOCK_SUCCESS';
export const RELATIONSHIP_BLOCK_FAILURE = 'RELATIONSHIP_BLOCK_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: RELATIONSHIP_BLOCK_REQUEST,
});
const success = relationship => ({
  relationship,
  type: RELATIONSHIP_BLOCK_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: RELATIONSHIP_BLOCK_FAILURE,
});

//  Request.
export default function blockRelationship (id, go, current, api) {
  go(request, id);
  api.post(
    `/api/v1/accounts/${id}/block`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
}
