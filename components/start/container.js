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

//  Requests.
import { ensureTimeline } from 'themes/mastodon-go/redux';

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
      globalRainbow: state => state.getIn(['timeline', '/api/v1/timelines/public', 'rainbow']),
      homeRainbow: state => state.getIn(['timeline', '/api/v1/timelines/home', 'rainbow']),
      localRainbow: state => state.getIn(['timeline', '/api/v1/timelines/public?local=true', 'rainbow']),
      me: state => state.getIn(['meta', 'me']),
      myRainbow: state => state.getIn(['meta', 'me']) ? state.getIn(['account', state.getIn(['meta', 'me']), 'rainbow']) : void 0,
    }),

    //  Own props.
    (state, ownProps) => ownProps,

    //  Result.
    (props, ownProps) => ({
      handler: {
        fetch () {
          go(ensureTimeline, '/api/v1/timelines/home');  //  Home timeline
          go(ensureTimeline, '/api/v1/timelines/public');  //  Global timeline
          go(ensureTimeline, '/api/v1/timelines/public?local=true');  //  Local timeline
        },
      },
      ...ownProps,
      ...props,
    })
  )
)(Start);
