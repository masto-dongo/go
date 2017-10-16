//  TIMELINE:REFRESH
//  ===============

//  Action types.
export const TIMELINE_REFRESH_REQUEST = 'TIMELINE_REFRESH_REQUEST';
export const TIMELINE_REFRESH_SUCCESS = 'TIMELINE_REFRESH_SUCCESS';
export const TIMELINE_REFRESH_FAILURE = 'TIMELINE_REFRESH_FAILURE';

//  Action creators.
const request = path => ({
  path,
  type: TIMELINE_REFRESH_REQUEST,
});
const success = (path, statuses) => ({
  statuses,
  type: TIMELINE_REFRESH_SUCCESS,
});
const failure = (path, error) => ({
  error,
  path,
  type: TIMELINE_REFRESH_FAILURE,
});

//  Request.
export default function refreshTimeline (path, go, current, api) {

  //  If our timeline is still loading, we can't refresh yet.
  const timeline = current.getIn(['timeline', path]);
  if (timeline && timeline.get('isLoading')) {
    return;
  }

  //  If our timeline already has some statuses, this gets the latest
  //  one.
  const ids = timeline ? timeline.get('statuses') : void 0;
  const newestId = ids && ids.size > 0 ? ids.first() : void 0;

  //  If we have a newest id, then we can set it in our params.
  const params = {};
  if (newestId !== void 0) params.since_id = newestId;

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
