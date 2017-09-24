//  STATUS:CARD
//  ===========

//  Action types.
export const STATUS_CARD_REQUEST = 'STATUS_CARD_REQUEST';
export const STATUS_CARD_SUCCESS = 'STATUS_CARD_SUCCESS';
export const STATUS_CARD_FAILURE = 'STATUS_CARD_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: STATUS_CARD_REQUEST,
});
const success = (id, card) => ({
  card,
  id,
  type: STATUS_CARD_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: STATUS_CARD_FAILURE,
});

//  Request.
export const cardStatus = (id, go, state, api) => {

  //  We only want to request cards that we don't already have. If we
  //  already have a card associated with this `id`, we do nothing.
  if (state.getIn(['status', id, 'card']) {
    return;
  }

  //  The request.
  go(request, id);
  api.get(
    `/api/v1/statuses/${id}/card`
  ).then(
    response => go(success, id, response.data.value)
  ).catch(
    error => go(failure, id, error)
  );
};
