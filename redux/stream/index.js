//  STREAM
//  ======

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { Map as ImmutableMap } from 'immutable';

//  Request imports.
import connectStream from './connect';
import disconnectStream from './disconnect';

//  Action types.
import {
  STREAM_CONNECT_JOIN,
  STREAM_CONNECT_LOSE,
  STREAM_CONNECT_OPEN,
} from '../stream/connect';
import { STREAM_DISCONNECT_HALT } from '../stream/disconnect';

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is just an empty Immutable map—we will add
//  streams to this by `name`.
const initialState = ImmutableMap();

//  `set()` sets the `connected` state or `close()` function for a
//  stream.
const set = (state, name, connected, close) => state.withMutations(function (map) {

  //  We want to ensure our `name` is a string like it should be.
  name = '' + name;

  //  If no stream exists at the given `name`, we make one.
  if (!state.get(name)) {
    map.set(name, ImmutableMap({
      connected: !!connected,
      close: typeof close === 'function' ? close : null,
    }));
    return;
  }

  //  Otherwise, we update its properties.
  if (connected !== null || typeof connected !== 'undefined') {
    map.setIn([path, 'connected'], !!connected);
  }
  if (typeof close === 'function') {
    map.setIn([path, 'close'], close);
  }
});

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function timeline (state = initialState, action) {
  switch(action.type) {
  case STREAM_CONNECT_JOIN:
    return set(state, action.name, true);
  case STREAM_CONNECT_LOSE:
    return set(state, action.name, false);
  case STREAM_CONNECT_OPEN:
    return set(state, action.name, false, action.close);
  case STREAM_DISCONNECT_HALT:
    return state.delete('' + action.name);
  default:
    return state;
  }
}

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export {
  connectStream,
  disconnectStream,
};
