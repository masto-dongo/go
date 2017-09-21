//  reducers/conversation
//  =====================

//  By all rights, conversations should be implemented more-or-less
//  like timelines, but that requires (at the very least) having
//  access to a "conversation id" by which to identify them. Mastodon
//  doesn't give us this, so we have to make do with storing them by
//  status `id`.

//  Obviously, this creates waste every time multiple statuses from the
//  same conversation have their conversations fetched, but since
//  conversations are little more than lists of statuses, the actual
//  impact is negligible.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  List as ImmutableList,
  Map as ImmutableMap,
} from 'immutable'

//  Our imports.
import { CONVERSATION_FETCH_SUCCESS } from 'mastodon-go/actions/conversation';

//  * * * * * * *  //

//  Helper functions
//  ----------------

//  `initialConversation()` provides the initial state for every
//  conversation. The `statuses` of a conversation are just a list of
//  ids.
const initialConversation = id => ImmutableMap({
  for_status: id,
  statuses: ImmutableList(),
});

//  * * * * * * *  //

//  State handling
//  --------------

//  Our `initialState` is just an empty Immutable map. Conversations
//  will be added to this by `id`.
const initialState = ImmutableMap();

//  `setConversation()` creates an entirely new conversation and
//  assigns it to the appropriate `id` in our state, populating it
//  with the `id`s of the provided `ancestors` and `descendants`.
//  It overwrites any existing conversation at that location.
const setConversation = (state, id, ancestors, descendants) => state.set(
  id,
  initialConversation(id).update(
    'statuses',
    list => list.concat([].concat(ancestors.map(
      status => status.id
    ), id, descendants.map(
      status => status.id
    )))
  )
);

//  * * * * * * *  //

//  Action reducing
//  ---------------

export default function conversation (state = initialState, action) {
  switch (action.type) {
  case CONVERSATION_FETCH_SUCCESS:
    return setConversation(state, action.id, action.ancestors, action.descendants);
  }
}
