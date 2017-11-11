//  TIMELINE:STREAM
//  ===============

//  Imported requests.
import {
  refreshCourier,
  refreshTimeline,
  removeStatus,
  updateCourier,
  updateTimeline,
} from 'themes/mastodon-go/redux';

//  Other imports.
import stream from 'themes/mastodon-go/util/stream';

//  Action types.
export const TIMELINE_STREAM_HALT = 'TIMELINE_STREAM_HALT';
export const TIMELINE_STREAM_JOIN = 'TIMELINE_STREAM_JOIN';
export const TIMELINE_STREAM_LOSE = 'TIMELINE_STREAM_LOSE';
export const TIMELINE_STREAM_OPEN = 'TIMELINE_STREAM_OPEN';

//  Action creators.
const open = (path, disconnect) => ({
  disconnect,
  path,
  type: TIMELINE_STREAM_OPEN,
});
const join = (path, name) => ({
  name,
  path,
  type: TIMELINE_STREAM_JOIN,
});
const lose = (path, name) => ({
  name,
  path,
  type: TIMELINE_STREAM_LOSE,
});
const halt = path => ({
  path,
  type: TIMELINE_STREAM_HALT,
});

//  Request.
export default function streamTimeline (path, makeOpen, go, current) {
  const store = current();
  const accessToken = store.getIn(['meta', 'accessToken']);
  const streamingUrl = store.getIn(['meta', 'streamingUrl']);
  const disconnect = store.getIn(['timeline', path, 'disconnect']);

  const streamName = function () {
    let tag;
    switch (path) {
    case '/ap1/v1/timelines/home':
      return 'user';
    case '/api/v1/timelines/public':
      return 'public';
    case '/api/v1/timelines/public?local=true':
      return 'public:local';
    default:
      if ((tag = (path.match(/\/api\/v1\/timelines\/tag\/([^]*)/) || [])[1])) {
        return `hashtag&tag=${tag}`;
      }
      return null;
    }
  }();

  if (makeOpen) {
    if (!disconnect) {
      go(open, path, stream(streamingUrl, accessToken, streamName, {
        connect () {
          go(join, path);
        },
        disconnect () {
          go(lose, path);
        },
        receive (data) {
          switch (data.event) {
          case 'update':
            go(updateTimeline, path, JSON.parse(data.payload));
            break;
          case 'delete':
            go(removeStatus, data.payload);
            break;
          case 'notification':
            go(updateCourier, path, JSON.parse(data.payload));
            break;
          }
        },
        reconnect () {
          go(join, path);
        },
        refresh () {
          go(refreshTimeline, path);
          if (streamName === 'user') {
            go(refreshCourier);
          }
        },
      }));
    }
  } else if (disconnect) {
    disconnect();
    go(halt, path);
  }
}
