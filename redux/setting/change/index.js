//  SETTING:CHANGE
//  ==============

//  Action types.
export const SETTING_CHANGE_COMPLETE = 'SETTING_CHANGE_COMPLETE';

//  Action creators.
const change = (key, value, global) => ({
  global,
  key,
  type: SETTING_CHANGE_COMPLETE,
  value,
});

//  Request.
export default function changeSetting (key, value, global, go, current) {
  go(change, key, value, global);
  localStorage.setItem(`mastodon-go/${current().getIn(['meta', 'me'])}/settings`, JSON.stringify(current().getIn(['settings', 'local']).toJS()));
}
