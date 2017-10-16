/*********************************************************************\
|                                                                     |
|   <ConversationContainer>                                           |
|   =======================                                           |
|                                                                     |
|   Conversations are (extremely unfortunately) stored by status id   |
|   in the redux store, so that's how we retrieve them here.  There   |
|   aren't any rainbows created for conversations themselves in the   |
|   store; we use the rainbow of the current status's account as an   |
|   alternative.                                                      |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import { createStructuredSelector } from 'reselect';

//  Component imports.
import Conversation from '.';

//  Request imports.
import { fetchConversation } from 'themes/mastodon-go/redux';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Building our store and handlers.
export default connect(
  createStructuredSelector({
    statuses: (state, { id }) => state.getIn(['conversation', id, 'statuses']),
  }),
  (go, store, { id }) => ({
    fetch: (newId = id) => go(fetchConversation, newId),
  })
)(Conversation);
