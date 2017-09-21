//  Package imports.
import {
  fromJS as ImmutableFromJS,
  List as ImmutableList,
  Map as ImmutableMap,
  OrderedSet as ImmutableOrderedSet,
} from 'immutable';

//  Our imports.
import {
  COMPOSER_UPLOAD_REQUEST,
  COMPOSER_UPLOAD_ADVANCE,
  COMPOSER_UPLOAD_SUCCESS,
  COMPOSER_UPLOAD_FAILURE,
  COMPOSER_UPLOAD_DISCARD,
  COMPOSER_SUBMIT_REQUEST,
  COMPOSER_SUBMIT_SUCCESS,
  COMPOSER_SUBMIT_FAILURE,
} from 'mastodon-go/actions/composer';
import uuid from 'mastodon-go/util/uuid';

//  * * * * * * *  //

//  Initial state. As usual, we only store information related to the
//  Mastodon server (and not the state of our current components).
const initialState = ImmutableMap({
  attachments: ImmutableList(),
  defaults: ImmutableMap({
    local: false,
    privacy: 'public',
    sensitive: false,
  }),
  request: ImmutableMap({
    is_uploading: false,
    is_submitting: false,
    progress: 0,
  }),
});

//  This resets our state, clearing all attachments.
function reset (state) {
  return state.withMutations(map => {
    map.update('attachments', list => list.clear());
    map.setIn(['request', 'is_uploading'], false);
    map.setIn(['request', 'is_submitting'], false);
    map.setIn(['request', 'progress'], 0);
  });
}

//  We only attach the media if we are currently uploading. (This will
//  be `false` if the composer was reset during the upload.)
function attach (state, media) {
  if (!map.getIn(['request', 'is_uploading'])) return state;
  return state.withMutations(map => {
    map.update('attachments', list => list.push(media));
    map.setIn(['request', 'is_uploading'], false);
  });
}

//  This removes a single attachment by `id`.
function unattach (state, id) {
  return state.withMutations(map => {
    map.update('attachments', list => list.filterNot(item => item.get('id') === id));
  });
}

//  Our action reducer.
export default function composer(state = initialState, action) {
  switch (action.type) {
  case COMPOSER_UPLOAD_REQUEST:
    return state.setIn(['request', 'is_uploading'], true);
  case COMPOSER_UPLOAD_ADVANCE:
    return state.setIn(['request', 'progress'], action.loaded / action.total);
  case COMPOSER_UPLOAD_SUCCESS:
    return attach(state, fromJS(action.media));
  case COMPOSER_UPLOAD_FAILURE:
    return state.setIn(['request', 'is_uploading'], false);
  case COMPOSER_UPLOAD_DISCARD:
    return unattach(state, action.id);
  case COMPOSER_SUBMIT_REQUEST:
    return state.setIn(['request', 'is_submitting'], true);
  case COMPOSER_SUBMIT_SUCCESS:
    return state.setIn(['request', 'is_submitting'], false);
  case COMPOSER_SUBMIT_FAILURE:
    return state.setIn(['request', 'is_submitting'], false);
  case COMPOSER_RESET:
    return reset(state);
  default:
    return state;
  }
}
