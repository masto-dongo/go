//  RELATIONSHIP
//  ============

//  Upstream Mastodon stores relationships as objects tied to `id`s.
//  However, thanks to the magic of computing, we can store them as
//  plain numbers instead.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { Map as ImmutableMap } from 'immutable';

//  Action types.
import { ACCOUNT_BLOCK_SUCCESS } from 'themes/mastodon-go/redux/account/block';
import { ACCOUNT_FOLLOW_SUCCESS } from 'themes/mastodon-go/redux/account/follow';
import { ACCOUNT_MUTE_SUCCESS } from 'themes/mastodon-go/redux/account/mute';
import { ACCOUNT_UNBLOCK_SUCCESS } from 'themes/mastodon-go/redux/account/unblock';
import { ACCOUNT_UNFOLLOW_SUCCESS } from 'themes/mastodon-go/redux/account/unfollow';
import { ACCOUNT_UNMUTE_SUCCESS } from 'themes/mastodon-go/redux/account/unmute';
import { RELATIONSHIP_FETCH_SUCCESS } from 'themes/mastodon-go/redux/relationship/fetch';

//  Our imports.
import { RELATIONSHIP } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is an empty map. Our relationships will be added
//  to this by `id`.
const initialState = ImmutableMap();

//  With `set()`, we just set the state at each `relationship`'s `id`
//  to be the appropriate `RELATIONSHIP`.
const set = (state, relationships) => state.withMutations(
  map => [].concat(relationships).forEach(
    relationship => {
      let value = RELATIONSHIP.NONE;
      if (relationship.followed_by) {
        value |= RELATIONSHIP.FOLLOWER;
      }
      if (relationship.following) {
        value |= RELATIONSHIP.FOLLOW;
      }
      if (relationship.requested) {
        value |= RELATIONSHIP.REQUESTED;
      }
      if (relationship.blocking) {
        value |= RELATIONSHIP.BLOCKED;
      }
      if (relationship.muting) {
        value |= RELATIONSHIP.MUTED;
        if (relationship.muting.notifications) {
          value |= RELATIONSHIP.NOTIFICATIONS_MUTED;
        }
      }
      map.set(relationship.id, value);
    }
  )
);

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function relationship (state = initialState, action) {
  switch(action.type) {
  case ACCOUNT_BLOCK_SUCCESS:
  case ACCOUNT_FOLLOW_SUCCESS:
  case ACCOUNT_MUTE_SUCCESS:
  case ACCOUNT_UNBLOCK_SUCCESS:
  case ACCOUNT_UNFOLLOW_SUCCESS:
  case ACCOUNT_UNMUTE_SUCCESS:
    return set(state, action.relationship);
  case RELATIONSHIP_FETCH_SUCCESS:
    return set(state, action.relationships);
  default:
    return state;
  }
};

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export { fetchRelationship } from './fetch';
