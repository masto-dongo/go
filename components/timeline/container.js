//  <TimelineContainer>
//  ===================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { createStructuredSelector } from 'reselect';

//  Component imports.
import Timeline from '.';

//  Request imports.
import {
  connectTimeline,
  expandTimeline,
  fetchTimeline,
  refreshTimeline,
} from 'themes/mastodon-go/redux';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

export default connect(
  createStructuredSelector({
    isLoading: (state, { path }) => state.getIn(['timeline', path, 'isLoading']),
    settings: (state, { path }) => state.getIn([
      'setting',
      'global',
      'timeline',
      path,
    ]),
    statuses: (state, { path }) => state.getIn(['timeline', path, 'statuses']),
  }),
  (go, store, { path }) => ({
    connect: (newPath = path) => go(connectTimeline, newPath),
    expand: (newPath = path) => go(expandTimeline, newPath),
    fetch: (newPath = path) => go(fetchTimeline, newPath),
    refresh: (newPath = path) => go(refreshTimeline, newPath),
  })
)(Timeline);
