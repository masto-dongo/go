//  TIMELINE:EXPAND
//  ===============

//  Action types.
export const TIMELINE_EXPAND_REQUEST = 'TIMELINE_EXPAND_REQUEST';
export const TIMELINE_EXPAND_SUCCESS = 'TIMELINE_EXPAND_SUCCESS';
export const TIMELINE_EXPAND_FAILURE = 'TIMELINE_EXPAND_FAILURE';

//  Action creators.
const request = path => ({
  path,
  type: TIMELINE_EXPAND_REQUEST,
});
const success = (path, statuses) => ({
  statuses,
  type: TIMELINE_EXPAND_SUCCESS,
})
const failure = (path, error) => ({
  error,
  path,
  type: TIMELINE_EXPAND_FAILURE,
})

//  Request.
export const expandTimeline = (path, go, current, api) => {

  //  If our timeline is still loading, we can't expand yet.
  const timeline = current().getIn(['timeline', path]);
  if (timeline && timeline.get('isLoading')) {
    return;
  }

  //  If our timeline already has some statuses, this gets the oldest
  //  one.
  const ids = timeline ? timeline.get('statuses') : void 0;
  const oldestId = ids && ids.size > 0 ? ids.last() : void 0;

  //  If we have an oldest id, then we can set it in our params.
  const params = { limit: 20 };
  if (oldestId !== void 0) params.max_id = oldestId;

  //  The request.
  go(request, path);
  api.get(
    path, { params }
  ).then(
    response => go(success, path, response.data)
  ).catch(
    error => go(failure, path, error)
  );
}
