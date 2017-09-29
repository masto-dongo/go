//  <TimelineContainer>
//  ===================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  List as ImmutableList,
  Map as ImmutableMap,
} from 'immutable';
import {
  createSelector,
  createStructuredSelector,
} from 'reselect';

//  Component imports.
import Timeline from '.';

//  Request imports.
import {
  connectTimeline,
  expandTimeline,
  fetchTimeline,
  refreshTimeline,
} from 'themes/mastodon-go/redux';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';
import rainbow from 'themes/mastodon-go/util/rainbow';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Selector factory.
export default connect(
  go => createSelector(

    //  Props.
    createStructuredSelector({
      isLoading: (state, { path }) => state.getIn(['timeline', path, 'isLoading']),
      rainbow: (state, { path }) => state.getIn(['timeline', path, 'rainbow']) || ImmutableMap({
        1: '#' + (rainbow(path)[0] || 0xffffff).toString(16),
        3: ImmutableList(rainbow(path, 3).map(
          colour => '#' + colour.toString(16)
        )),
        7: ImmutableList(rainbow(path, 7).map(
          colour => '#' + colour.toString(16)
        )),
        15: ImmutableList(rainbow(path, 15).map(
          colour => '#' + colour.toString(16)
        )),
      }),
      statuses: (state, { path }) => state.getIn(['timeline', path, 'statuses']),
    }),

    //  Own props.
    (state, ownProps) => ownProps,

    //  Result.
    (props, ownProps) => ({
      handler: {
        connect: () => go(connectTimeline, ownProps.path),
        expand: () => go(expandTimeline, ownProps.path),
        fetch: () => go(fetchTimeline, ownProps.path),
        refresh: () => go(refreshTimeline, ownProps.path),
      },
      ...ownProps,
      ...props,
    })
  )
)(Timeline);
