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
const success = (path, statuses, prev, next) => ({
  next,
  path,
  prev,
  statuses,
  type: TIMELINE_FETCH_SUCCESS,
});
const failure = (path, error) => ({
  error,
  path,
  type: TIMELINE_FETCH_FAILURE,
});

//  Request.
export default function fetchTimeline (path, go, current, api) {

  //  If our timeline is still loading, we can't fetch yet.
  const timeline = current().getIn(['timeline', path]);
  if (timeline && timeline.get('isLoading')) {
    return;
  }

  //  The request.
  go(request, path);
  api.get(path).then(function ({
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
