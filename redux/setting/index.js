//  SETTING
//  =======

//  Because the Mastodon server is not as-of-yet very friendly to us
//  just waltzing in and setting our own settings, we store everything
//  in `localStorage` for now.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { Map as ImmutableMap } from 'immutable';

//  Action types.
import { SETTING_CHANGE_COMPLETE } from 'themes/mastodon-go/redux/setting/change';

//  * * * * * * *  //

//  Our `initialState()` holds our default setting values.
const initialState = ImmutableMap({
});

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function setting (state = initialState, action) {
  switch(action.type) {
  case SETTING_CHANGE_COMPLETE:
    return state.setIn([].concat(action.key), action.value);
  default:
    return state;
  }
};
