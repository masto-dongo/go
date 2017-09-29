//  STREAM
//  ======

import WebSocketClient from 'websocket.js';

export default function stream (location, accessToken, stream, {
  connected,
  disconnected,
  received,
  reconnected,
}) {
  const client = new WebSocketClient(`${location}/api/v1/streaming/?access_token=${accessToken}&stream=${stream}`);
  client.onopen = connected;
  client.onmessage = e => {
    let data;
    try {
      data = JSON.parse(e.data);
    } catch (error) {
      data = e.data;
    }
    received(data);
  }
  client.onclose = disconnected;
  client.onreconnect = reconnected;
  return client;
};
