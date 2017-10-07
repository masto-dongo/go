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
export default function changeSetting (key, value, go, current) {
  go(change, key, value);
  localStorage.setItem(`mastodon-go/${current().getIn(['meta', 'me'])}/settings`, JSON.stringify(state.get('settings').toJS()));
}
