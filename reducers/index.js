import { combineReducers } from 'redux-immutable';

import account from './account';
import catalogue from './catalogue';
import composer from './composer';
import conversation from './conversation';
import courier from './courier';
import notification from './notification';
import settings from './settings';
import status from './status';
import timeline from './timeline';

const reducers = {
  account,
  catalogue,
  composer,
  conversation,
  courier,
  notification,
  settings,
  status,
  timeline,
};

export default combineReducers(reducers);
