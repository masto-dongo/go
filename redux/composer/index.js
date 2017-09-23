//  COMPOSER
//  ========

//  In upstream Mastodon, the "compose" section of the Redux store
//  holds the current state of the <Compose> component(s), from what
//  text is inputted to what options are selected to what things should
//  be visible. Personally? I think it's a little silly to be updating
//  our global store every time a user types a character or presses a
//  button (unless, of course, it is the "TOOT!" button), so in keeping
//  in line with our general "only API stuff in the Redux store"
//  principle, I've left such matters to the React component to manage.

//  Both our component and our segment of the store is named "composer"
//  rather than "compose" because that sounds a whole lot better to me.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  Map as ImmutableMap,
  fromJS as immutableFromJS,
} from 'immutable';

//  Action types.
import {
  COMPOSER_DISCARD_EACH,
  COMPOSER_DISCARD_SOME,
} from 'mastodon-go/redux/composer/discard';
import {
  COMPOSER_SUBMIT_FAILURE,
  COMPOSER_SUBMIT_REQUEST,
  COMPOSER_SUBMIT_SUCCESS,
} from 'mastodon-go/redux/composer/submit';
import {
  COMPOSER_UPLOAD_ADVANCE,
  COMPOSER_UPLOAD_FAILURE,
  COMPOSER_UPLOAD_REQUEST,
  COMPOSER_UPLOAD_SUCCESS,
} from 'mastodon-go/redux/composer/upload';

//  Our imports.
import { MEDIA_TYPE } from 'mastodon-go/util/constants';

//  * * * * * * *  //

//  State
//  -----

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

//  `reset()` resets our state, clearing all attachments.
const reset = state => state.withMutations(
  map => {
    map.update(
      'attachments',
      list => list.clear()
    );
    map.setIn(['request', 'is_uploading'], false);
    map.setIn(['request', 'is_submitting'], false);
    map.setIn(['request', 'progress'], 0);
  }
);

//  `attach()` loads an attachment.
const attach = (state, media) => {

  //  We only attach the media if we are currently uploading. (This
  //  will be `false` if the composer was reset during the upload.)
  if (!map.getIn(['request', 'is_uploading'])) {
    return state;
  }

  //  We overwrite the `type` of the media with the appropriate
  //  `MEDIA_TYPE` constant.
  media.type = (
    type => {
      switch (type) {
      case "image":
        return MEDIA_TYPE.IMAGE;
      case "audio":  //  Speculative; not used
        return MEDIA_TYPE.AUDIO;
      case "gifv":
        return MEDIA_TYPE.GIFV;
      case "video":
        return MEDIA_TYPE.VIDEO;
      default:
        return MEDIA_TYPE.UNKNOWN;
      }
    }
  )(media.type);

  //  This saves our attachment.
  return state.withMutations(
    map => {
      map.update(
        'attachments',
        list => list.push(immutableFromJS(media))
      );
      map.setIn(['request', 'is_uploading'], false);
    }
  );
}

//  This removes attachment(s) by `id`.
const unattach = (state, ids) => {
  ids = [].concat(ids);
  return state.withMutations(
    map => map.update('attachments',
      list => list.filter(
        item => ids.indexOf(item.get('id')) !== -1
      )
    )
  );
}

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function composer (state = initialState, action) {
  switch (action.type) {
  case COMPOSER_DISCARD_EACH:
    return reset(state);
  case COMPOSER_DISCARD_SOME:
    return unattach(state, action.ids);
  case COMPOSER_SUBMIT_FAILURE:
    return state.setIn(['request', 'is_submitting'], false);
  case COMPOSER_SUBMIT_REQUEST:
    return state.setIn(['request', 'is_submitting'], true);
  case COMPOSER_SUBMIT_SUCCESS:
    return state.setIn(['request', 'is_submitting'], false);
  case COMPOSER_UPLOAD_ADVANCE:
    return state.setIn(['request', 'progress'], action.loaded / action.total);
  case COMPOSER_UPLOAD_FAILURE:
    return state.setIn(['request', 'is_uploading'], false);
  case COMPOSER_UPLOAD_REQUEST:
    return state.setIn(['request', 'is_uploading'], true);
  case COMPOSER_UPLOAD_SUCCESS:
    return attach(state, fromJS(action.media));
  default:
    return state;
  }
}

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export { discardComposer } from './discard';
export { submitComposer } from './submit';
export { uploadComposer } from './upload';
