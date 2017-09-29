//  REDUX
//  =====

//  Package imports.
import { applyMiddleware, createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk';


//  Imported reducers.
import account from './account';
import attachment from './attachment';
import card from './card';
import catalogue from './catalogue';
import conversation from './conversation';
import courier from './courier';
import domain from './domain';
import instance from './instance';
import meta from './meta';
import notification from './notification';
import relationship from './relationship';
import report from './report';
import search from './search';
import setting from './setting';
import status from './status';
import timeline from './timeline';

//  Our store creator.
export default function redux () {
  return createStore(combineReducers({
    account,
    attachment,
    catalogue,
    conversation,
    courier,
    domain,
    instance,
    meta,
    notification,
    relationship,
    report,
    search,
    setting,
    status,
    timeline,
  }), applyMiddleware(thunk));
}

//  Our requests.
export * from './account';
export * from './attachment';
export * from './card';
export * from './catalogue';
export * from './conversation';
export * from './courier';
export * from './domain';
export * from './instance';
export * from './meta';
export * from './notification';
export * from './relationship';
export * from './report';
export * from './search';
export * from './setting';
export * from './status';
export * from './timeline';
