//  SETTING:CHANGE
//  ==============

//  Action types.
export const SETTING_CHANGE_COMPLETE = 'SETTING_CHANGE_COMPLETE';

//  Action creators.
const change = (key, value) => ({
  key,
  type: SETTING_CHANGE_COMPLETE,
  value,
});

//  Request.
export const changeSetting = (key, value, go, state) => {
  go(change, key, value);
  localStorage.setItem(`mastodon-go/${state().getIn(['meta', 'me'])}/settings`, JSON.stringify(state.get('settings').toJS()));
};
