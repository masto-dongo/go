//  RELATIONSHIP:FETCH
//  ==================

//  Action types.
export const RELATIONSHIP_FETCH_REQUEST = 'RELATIONSHIP_FETCH_REQUEST';
export const RELATIONSHIP_FETCH_SUCCESS = 'RELATIONSHIP_FETCH_SUCCESS';
export const RELATIONSHIP_FETCH_FAILURE = 'RELATIONSHIP_FETCH_FAILURE';

//  Action creators.
const request = ids => ({
  ids,
  type: RELATIONSHIP_FETCH_REQUEST,
});
const success = relationships => ({
  relationships,
  type: RELATIONSHIP_FETCH_SUCCESS,
});
const failure = (ids, error) => ({
  error,
  ids,
  type: RELATIONSHIP_FETCH_FAILURE,
});

//  Request.
export const fetchRelationship = (ids, go, state, api) => {

  //  We only want to request the relationships that we don't already
  //  have. If we already have relationships for all of the provided
  //  `ids`, we do nothing.
  const loadedRelationships = state.get('relationship');
  const newIds = [].concat(ids).filter(
    id => loadedRelationships.get(id) === void 0
  );
  if (!ids.length) {
    return;
  }

  //  The request.
  go(request, newIds);
  api.get(
    '/api/v1/accounts/relationships', { params: { id: newIds } }
  ).then(
    response => go(success, response.data.value)
  ).catch(
    error => go(failure, newIds, error)
  );
};
