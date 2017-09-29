//  <StartContainer>
//  ================

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
import Start from '.';

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
      me: state => state.getIn(['meta', 'me']),
      myRainbow: state => state.getIn(['meta', 'me']) ? state.getIn(['account', state.getIn(['meta', 'me']), 'rainbow']) : void 0,
    }),

    //  Own props.
    (state, ownProps) => ownProps,

    //  Result.
    (props, ownProps) => ({
      ...ownProps,
      ...props,
    })
  )
)(Start);
