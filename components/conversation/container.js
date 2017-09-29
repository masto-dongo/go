//  <ConversationContainer>
//  =======================

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
import Conversation from '.';

//  Request imports.
import { fetchConversation } from 'themes/mastodon-go/redux';

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
      statuses: (state, { id }) => state.getIn(['conversation', id, 'statuses']),
    }),

    //  Inputs.
    (state, { id }) => id,

    //  Result.
    (props, id) => ({
      handler: {
        fetch: () => go(fetchConversation, id),
      },
      ...props,
    })
  )
)(Conversation);
