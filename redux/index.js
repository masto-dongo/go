//  REDUX
//  =====

//  Package imports.
import { combineReducers } from 'redux-immutable';

//  Imported reducers.
import account from './account';
import catalogue from './catalogue';
import composer from './composer';
import conversation from './conversation';
import courier from './courier';
import domain from './domain';
import notification from './notification';
import relationship from './relationship';
import setting from './setting';
import status from './status';
import timeline from './timeline';

//  The combined reducer.
export default combineReducers({
  account,
  catalogue,
  composer,
  conversation,
  courier,
  domain,
  notification,
  relationship,
  setting,
  status,
  timeline,
});

//  Our requests.
export * from './account';
export * from './catalogue';
export * from './composer';
export * from './conversation';
export * from './courier';
export * from './domain';
export * from './notification';
export * from './relationship';
export * from './setting';
export * from './status';
export * from './timeline';
