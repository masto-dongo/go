export const SETTINGS_MODIFY = 'SETTINGS_MODIFY';

export const modifySettings = obj => go => {
  go({
    obj,
    type: LOCAL_SETTING_CHANGE,
  });
  go(saveSettings());
};

export function saveLocalSettings() {
  localStorage.setItem(`mastodon-go/settings/${state.getIn(['meta', 'me'])}`, JSON.stringify(state.getIn(['settings', 'local']).toJS()));
  api.put('/api/web/settings', { data: state.getIn(['settings', 'web']).toJS() });
};
