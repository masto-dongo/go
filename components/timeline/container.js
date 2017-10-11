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
    rainbow: (state, { path }) => state.getIn(['timeline', path, 'rainbow']),
    settings: (state, { path }) => state.getIn([
      'setting',
      'global',
      'timeline',
      path,
    ]),
    statuses: (state, { path }) => state.getIn(['timeline', path, 'statuses']),
  }),
  (go, store, { path }) => ({
      connect: () => go(connectTimeline, path),
      expand: () => go(expandTimeline, path),
      fetch: () => go(fetchTimeline, path),
      refresh: () => go(refreshTimeline, path),
  })
)(Timeline);
