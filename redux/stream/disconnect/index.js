//  STREAM:DISCONNECT
//  =================

//  Action types.
export const STREAM_DISCONNECT_HALT = 'STREAM_DISCONNECT_HALT';

//  Action creators.
const halt = name => ({
  name,
  type: STREAM_DISCONNECT_HALT,
});

//  Request.
export default function disconnectStream (name, go, current) {
  const close = current().getIn(['stream', name, 'close']);

  //  Closes the stream if we can.
  if (typeof close === 'function') {
    close();
  }

  //  Sends the action regardless.
  go(halt, name);
}
