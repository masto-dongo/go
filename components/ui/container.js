//  <UIContainer>
//  =================

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

//  Request imports.
import { loadMeta } from 'themes/mastodon-go/redux';

//  Component imports.
import UI from '.';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Selector factory.
export default connect(
  go => createSelector(

    //  Connected props.
    createStructuredSelector({
      //  TK: TODO
    }),

    //  Own props.
    (store, ownProps) => ownProps,

    //  Result.
    (props, ownProps) => ({
      handler: {
        fetch () {
          go(loadMeta);
        },
      },
      ...ownProps,
      ...props,
    })
  )
)(UI);
