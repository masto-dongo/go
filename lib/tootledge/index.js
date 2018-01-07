//  TOOTLEDGE
//  =========

//  Package imports.
import { applyMiddleware, createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk';

//  Reducer imports.
import * as redux from './redux';

//  Variable declaration.
export default createStore(combineReducers(redux), applyMiddleware(thunk));

//  Request exports.
export * from './redux/account';
export * from './redux/attachment';
export * from './redux/card';
export * from './redux/catalogue';
export * from './redux/conversation';
export * from './redux/courier';
export * from './redux/domain';
export * from './redux/emoji';
export * from './redux/meta';
export * from './redux/notification';
export * from './redux/relationship';
export * from './redux/report';
export * from './redux/search';
export * from './redux/setting';
export * from './redux/status';
export * from './redux/timeline';

//  Constant exports.
export * from './constants';

//  Class exports.
export {
  Emoji,
  Emojifier,
} from './lib/emojifier';
