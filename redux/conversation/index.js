//  CONVERSATION
//  ============

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
} from 'immutable';

import fetchConversation from './fetch';

//  Action types.
import { CONVERSATION_FETCH_SUCCESS } from 'themes/mastodon-go/redux/conversation/fetch';


//  * * * * * * *  //

//  Setup
//  -----

//  `normalize()` normalizes the given array of status `ids` into a
//  proper conversation.
const normalize = (ancestors, id, descendants) => ImmutableMap({
  ancestors: ImmutableList(ancestors ? ancestors.map(
    status => ImmutableMap({
      account: '' + status.account.id,
      id: '' + status.id,
    })
  ) : []),
  status: id,
  descendants: ImmutableList(descendants ? descendants.map(
    status => ImmutableMap({
      account: '' + status.account.id,
      id: '' + status.id,
    })
  ) : []),
});

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is just an empty Immutable map. Conversations
//  will be added to this by status `id`.
const initialState = ImmutableMap();

//  `set()` creates an entirely new conversation and assigns it to the
//  appropriate `id` in our state, populating it with ids from the
//  provided `ancestors` and `descendants`. It overwrites any existing
//  catalogue at that location.
const set = (state, id, ancestors, descendants) => state.set('' + id, normalize(ancestors, id, descendants));

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function conversation (state = initialState, action) {
  switch (action.type) {
  case CONVERSATION_FETCH_SUCCESS:
    return set(state, action.status, action.ancestors, action.descendants);
  default:
    return state;
  }
}

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export { fetchConversation };
