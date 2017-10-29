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
const success = (path, statuses, prev, next) => ({
  next,
  path,
  prev,
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
  const timeline = current().getIn(['timeline', path]);
  if (timeline && timeline.get('isLoading')) {
    return;
  }

  //  If we were provided a link header in our last request, we can
  //  use it.
  const linkPath = timeline && timeline.get('prev');

  //  The request.
  go(request, path);
  api.get(linkPath || path).then(function ({
    data,
    headers: { link },
  }) {
    const next = (link.match(/<\s*([^,]*)\s*>\s*;(?:[^,]*[;\s])?rel="?next"?/) || [])[1];
    const prev = (link.match(/<\s*([^,]*)\s*>\s*;(?:[^,]*[;\s])?rel="?prev(?:ious)?"?/) || [])[1];
    go(success, path, data, prev, next);
  }).catch(function (error) {
    go(failure, path, error);
  });
}
