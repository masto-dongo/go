import { debounce } from 'lodash';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { createSelector } from 'reselect';

import Timeline from '.';
import {
  updateTimeline,
  refreshTimeline,
  expandTimeline,
  setTopTimeline,
  connectingTimeline,
  disconnectTimeline,
} from 'glitch/actions/timeline';
import { removeStatus } from 'glitch/actions/status';
import makeTimelineSelector from 'glitch/selectors/timeline';

const makeMapStateToProps = () => {
  const timelineSelector = makeTimelineSelector();

  return (state, { path }) => {
    let timeline = state.getIn(['timeline', path]);

    return {
      accessToken: state.getIn(['meta', 'access_token']),
      hasMore: !!timeline.get('next'),
      hasUnread: timeline.get('unread') > 0,
      ids: timelineSelector(state, path),
      isLoading: state.get('isLoading'),
      settings: state.getIn(['settings', id]),
      streamingAPIBaseURL: state.getIn(['meta', 'streaming_api_base_url']),
    };
  };
}

const makeMapDispatchToProps = (dispatch) => createSelector(
  [
    (_, { path }) => path,
  ],

  path => ({
    handler: {
      connect () {
        dispatch(connectingTimeline(path));
      },
      delete (payload) {
        dispatch(removeStatus(payload))
      },
      disconnect () {
        dispatch(disconnectTimeline(path));
      },
      expand () {
        dispatch(expandTimeline(path));
      },
      refresh () {
        dispatch(refreshTimeline(path));
      },
      scroll: debounce(() => {
        dispatch(setTopTimeline(path, false));
      }, 100),
      scrollToBottom: debounce(() => {
        dispatch(setTopTimeline(path, false));
        dispatch(expandTimeline(path));
      }, 300, { leading: true }),
      scrollToTop: debounce(() => {
        dispatch(setTopTimeline(path, true));
      }, 100),
      update (payload) {
        dispatch(updateTimeline(path, JSON.parse(payload)));
      },
    },
  };
}

export default injectIntl(
  connect(makeMapStateToProps, makeMapDispatchToProps)(Timeline)
);
