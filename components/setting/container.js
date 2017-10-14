//  <SettingContainer>
//  ==================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { createStructuredSelector } from 'reselect';

//  Component imports.
import Setting from '.';

//  Request imports.
import { changeSetting } from 'themes/mastodon-go/redux';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Selector factory.
export default connect(
  createStructuredSelector({
    value: (state, {
      global,
      settingKey,
    }) => state.getIn(['setting', global ? 'global' : 'local'].concat(settingKey)),
  }),

  //  Result.
  (go, store, {
    global,
    settingKey,
  }) => ({
    change: value => go(changeSetting, settingKey, value, global),
  })
)(Setting);
