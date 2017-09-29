//  META
//  ====

//  Upstream Mastodon doesn't store notifications separately like it
//  does statuses… but we do, so that the notification/courier and
//  status/timeline models neatly reflect one another. Furthermore,
//  it means we can easily refer to notifications by `id`—just like we
//  do with statuses.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { Map as ImmutableMap } from 'immutable';

//  Action types.
import { META_LOAD_COMPLETE } from 'themes/mastodon-go/redux/meta/load';

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is an empty map. Our notifications will be
//  stored here by `id`.
const initialState = ImmutableMap({
  me: '',
});

//  `set()` stores the normalized value of the given `notifications` in
//  the store.
const set = (state, notifications) => state.withMutations(
  map => ([].concat(notifications)).forEach(
    notification => {
      if (notification) {
        map.set(notification.id, normalize(notification));
      }
    }
  )
);

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function meta (state = initialState, action) {
  switch(action.type) {
  case META_LOAD_COMPLETE:
    return set(state, action.meta);
  default:
    return state;
  }
};

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
//  export { loadMeta } from './load';
