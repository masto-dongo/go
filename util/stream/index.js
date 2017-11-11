//  STREAM
//  ======

export default function stream (location, accessToken, name, {
  connect,
  disconnect,
  receive,
  reconnect,
  refresh,
}) {
  const client = location && accessToken && name ? new WebSocket(`${location}/api/v1/streaming/?access_token=${accessToken}&stream=${name}`) : null;
  let polling = null;

  function beginPolling () {
    polling = window.setInterval(refresh, 20000);
  }

  function endPolling () {
    window.clearInterval(polling);
    polling = null;
  }

  if (client) {
    client.onclose = function () {
      beginPolling();
      disconnect();
    };
    client.onmessage = function (e) {
      let data;
      try {
        data = JSON.parse(e.data);
      } catch (error) {
        data = e.data;
      }
      receive(data);
    };
    client.onopen = function () {
      endPolling();
      connect();
    };
    client.onreconnect = function () {
      endPolling();
      refresh();
      reconnect();
    };
  } else {
    beginPolling();
  }
  return function () {
    if (client) {
      client.close();
    }
    endPolling();
  };
}
