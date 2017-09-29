//  <MediaContainer>
//  ================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { createStructuredSelector } from 'reselect';

//  Component imports.
import Media from '.';

//  Other imports
import { connect } from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Selector factory (props-only).
export default connect(
  go => createStructuredSelector({
    href: (state, { id }) => state.getIn(['attachment', id, 'src', 'remote']),
    height: (state, { id }) => state.getIn(['attachment', id, 'height']),
    preview: (state, { id }) => state.getIn(['attachment', id, 'preview']),
    src: (state, { id }) => state.getIn(['attachment', id, 'src', 'local']),
    width: (state, { id }) => state.getIn(['attachment', id, 'width']),
  }),
)(Media);
