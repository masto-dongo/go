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

    //  Props.
    createStructuredSelector({
      //  TK: TODO
    }),

    //  Inputs.
    (store, ownProps) => ownProps,

    //  Result.
    (props, ownProps) => ({
      ...ownProps,
      ...props,
    })
  )
)(UI);
