//  <DrawerContainer>
//  =================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  createSelector,
  createStructuredSelector
} from 'reselect';

//  Component imports.
import Drawer from '.';

//  Request imports.
import {
  submitAttachment,
  submitSearch,
  submitStatus,
} from 'themes/mastodon-go/redux';

//  Other imports
import { connect } from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Selector factory.
export default connect(
  go => createSelector(

    //  Props.
    createStructuredSelector({
      results: state => state.get('search'),
    }),

    //  Result.
    props => ({
      handler: {
        search: query => go(submitSearch, query),
        submit: (text, options) => go(submitStatus, text, options),
        upload: file => go(submitAttachment, file),
      },
      ...props,
    })
  )
)(Drawer);
