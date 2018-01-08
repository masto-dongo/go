//  STREAM:CONNECT
//  ==============

//  Package imports.
import WebSocketClient from 'websocket.js';

//  Action types.
export const STREAM_CONNECT_JOIN = 'STREAM_CONNECT_JOIN';
export const STREAM_CONNECT_LOSE = 'STREAM_CONNECT_LOSE';
export const STREAM_CONNECT_OPEN = 'STREAM_CONNECT_OPEN';

//  Action creators.
const join = name => ({
  name,
  type: STREAM_CONNECT_JOIN,
});
const lose = name => ({
  name,
  type: STREAM_CONNECT_LOSE,
});
const open = (name, close) => ({
  close,
  name,
  type: STREAM_CONNECT_OPEN,
});

//  Request.
export default function connectStream (name, onReceive, onRefresh, go, current) {
  const store = current();
  const accessToken = store.getIn(['meta', 'accessToken']);
  const streamingUrl = store.getIn(['meta', 'streamingUrl']);
  const close = store.getIn(['stream', name, 'close']);

  //  We only open a new stream if one doesn't already exist and we
  //  have the requisite parts.
  if (name && !close && streamingUrl && accessToken) {

    //  We use websocket.js to create our client. `polling` will be
    //  used for polling if websockets is unavailable.
    const client = new WebSocketClient(`${streamingUrl}/api/v1/streaming/?access_token=${accessToken}&stream=${streamName}`);
    let polling = null;

    //  If we have a client, then we can set it up.
    if (client) {

      //  When the connection is lost, we begin polling.
      client.onclose = function onclose () {
        polling = window.setInterval(refresh, 20000);
        go(lose, name);
      }

      //  Handles messages.
      client.onmessage = function onmessage (e) {
        let data;
        try {
          data = JSON.parse(e.data);
        } catch (error) {
          data = e ? e.data : null;
        }
        onReceive(data);
      }

      //  When the connection is established, we end polling.
      client.onopen = function onopen () {
        window.clearInterval(polling);
        polling = null;
        go(join, name);
      }

      //  When the connection is reëstablished, we also need to do a
      //  refresh.
      client.onreconnect = function onreconnect () {
        window.clearInterval(polling);
        polling = null;
        onRefresh();
        go(join, name);
      }

    //  If we don't have a client, then we just use polling.
    } else {
      polling = window.setInterval(refresh, 20000);
    }

    //  We send a `close` function through to our store so that we can
    //  close the stream later.
    go(open, name, function close () {
      if (client) {
        client.close();
      }
      window.clearInterval(polling);
      polling = null;
    });
  }
}
