import WebSocketClient from 'websocket.js';

export default function stream (location, accessToken, stream, {
  connected,
  disconnected,
  received,
  reconnected,
}) {
  const ws = new WebSocketClient(`${location}/api/v1/streaming/?access_token=${accessToken}&stream=${stream}`);
  ws.onopen = connected;
  ws.onmessage = e => {
    let data;
    try {
      data = JSON.parse(e.data);
    } catch (error) {
      data = e.data;
    }
    received(data);
  }
  ws.onclose = disconnected;
  ws.onreconnect = reconnected;
  return ws;
};
