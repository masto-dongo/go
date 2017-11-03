//  REDUX
//  =====

//  Package imports.
import { applyMiddleware, createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk';

//  Reducer imports.
import account from './account';
import attachment from './attachment';
import card from './card';
import catalogue from './catalogue';
import conversation from './conversation';
import courier from './courier';
import domain from './domain';
import emoji from './emoji';
import meta from './meta';
import notification from './notification';
import relationship from './relationship';
import report from './report';
import search from './search';
import setting from './setting';
import status from './status';
import timeline from './timeline';

//  Other imports.
import { moduleOnReady } from 'themes/mastodon-go/util/module';

//  Variable declaration.
var redux;

//  Our store creator.
moduleOnReady(function () {
  redux = createStore(combineReducers({
    account,
    attachment,
    card,
    catalogue,
    conversation,
    courier,
    domain,
    emoji,
    meta,
    notification,
    relationship,
    report,
    search,
    setting,
    status,
    timeline,
  }), applyMiddleware(thunk));
});

//  Exporting.
export { redux as default };

//  Request exports.
export * from './account';
export * from './attachment';
export * from './card';
export * from './catalogue';
export * from './conversation';
export * from './courier';
export * from './domain';
export * from './emoji';
export * from './meta';
export * from './notification';
export * from './relationship';
export * from './report';
export * from './search';
export * from './setting';
export * from './status';
export * from './timeline';
