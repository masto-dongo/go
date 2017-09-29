//  TIMELINE:FETCH
//  ==============

//  Action types.
export const TIMELINE_FETCH_REQUEST = 'TIMELINE_FETCH_REQUEST';
export const TIMELINE_FETCH_SUCCESS = 'TIMELINE_FETCH_SUCCESS';
export const TIMELINE_FETCH_FAILURE = 'TIMELINE_FETCH_FAILURE';

//  Action creators.
const request = path => ({
  path,
  type: TIMELINE_FETCH_REQUEST,
});
const success = (path, statuses) => ({
  path,
  statuses,
  type: TIMELINE_FETCH_SUCCESS,
})
const failure = (path, error) => ({
  error,
  path,
  type: TIMELINE_FETCH_FAILURE,
})

//  Request.
export const fetchTimeline = (path, go, current, api) => {

  //  If our timeline is still loading, we can't fetch yet.
  const timeline = current().getIn(['timeline', path]);
  if (timeline && timeline.get('isLoading')) {
    return;
  }

  //  The request.
  go(request, path);
  api.get(
    path
  ).then(
    response => go(success, path, response.data)
  ).catch(
    error => go(failure, path, error)
  );
}
