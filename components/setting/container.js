//  <SettingContainer>
//  ==================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  createSelector,
  createStructuredSelector,
} from 'reselect';

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
  go => createSelector(

    //  Props.
    createStructuredSelector({
      value: (state, {
        global,
        settingKey,
      }) => state.getIn(['setting', global ? 'global' : 'local'].concat(settingKey)),
    }),

    //  Own props.
    (state, ownProps) => ownProps,

    //  Result.
    (props, ownProps) => ({
      handler: {
        change: value => go(changeSetting, ownProps.key, value, ownProps.global),
      },
      ...ownProps,
      ...props,
    })
  )
)(Setting);
