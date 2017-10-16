/*********************************************************************\
|                                                                     |
|   <AttachmentContainer>                                             |
|   =====================                                             |
|                                                                     |
|   Aside from just grabbing the attachment's data, we also need to   |
|   check whether autoplay is enabled for GIFs/videos.                |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import { createStructuredSelector } from 'reselect';

//  Component imports.
import Attachment from '.';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Building our store.
export default connect(createStructuredSelector({
  autoplay: (state, { id }) => state.getIn(['meta', 'autoplay']),
  description: (state, { id }) => state.getIn(['attachment', id, 'description']),
  height: (state, { id }) => state.getIn(['attachment', id, 'height']),
  href: (state, { id }) => state.getIn([
    'attachment', id, 'src', 'remote',
  ]),
  preview: (state, { id }) => state.getIn(['attachment', id, 'preview']),
  src: (state, { id }) => state.getIn([
    'attachment', id, 'src', 'local',
  ]),
  type: (state, { id }) => state.getIn(['attachment', id, 'type']),
  width: (state, { id }) => state.getIn(['attachment', id, 'width']),
}))(Media);
