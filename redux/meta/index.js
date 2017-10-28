//  META
//  ====

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  List as ImmutableList,
  Map as ImmutableMap,
} from 'immutable';

//  Requests.
import loadMeta from './load';

//  Action types.
import { ACCOUNT_UPDATE_SUCCESS } from 'themes/mastodon-go/redux/account/update';
import { ACCOUNT_VERIFY_SUCCESS } from 'themes/mastodon-go/redux/account/verify';
import { META_LOAD_COMPLETE } from 'themes/mastodon-go/redux/meta/load';

//  Other imports.
import { VISIBILITY } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` gives defaults for all of our metadata.
const initialState = ImmutableMap({
  accessToken: '',
  admin: '',
  autoplay: false,
  domain: '',
  locale: 'en',
  me: '',
  mediaFormats: ImmutableList(),
  rawBio: '',
  requireConfirmation: ImmutableMap({
    delete: true,  //  Defaults to `true` because it's irreversible
    reblog: false,
    unfollow: false,
  }),
  sensitive: true,
  streamingUrl: '',
  visibility: VISIBILITY.PRIVATE,
});

//  `set()` stores `meta` information in our map.
const set = (state, meta) => state.withMutations(
  map => {
    let data = null;
    if (meta.hasOwnProperty('meta') && (data = meta.meta)) {
      if (data.hasOwnProperty('access_token')) {
        map.set('accessToken', '' + data.access_token);
      }
      if (data.hasOwnProperty('admin')) {
        map.set('admin', '' + data.admin);
      }
      if (data.hasOwnProperty('auto_play_gif')) {
        map.set('autoplay', !!data.auto_play_gif);
      }
      if (data.hasOwnProperty('domain')) {
        map.set('domain', '' + data.domain);
      }
      if (data.hasOwnProperty('locale')) {
        map.set('locale', '' + data.locale);
      }
      if (data.hasOwnProperty('me')) {
        map.set('me', '' + data.me);
      }
      if (data.hasOwnProperty('delete_modal')) {
        map.setIn(['requireConfirmation', 'delete'], !!data.delete_modal);
      }
      if (data.hasOwnProperty('boost_modal')) {
        map.setIn(['requireConfirmation', 'reblog'], !!data.boost_modal);
      }
      if (data.hasOwnProperty('unfollow_modal')) {
        map.setIn(['requireConfirmation', 'unfollow'], !!data.unfollow_modal);
      }
      if (data.hasOwnProperty('streaming_api_base_url')) {
        map.set('streamingUrl', '' + data.streaming_api_base_url);
      }
    }
    if (meta.hasOwnProperty('compose') && (data = meta.compose)) {
      if (data.hasOwnProperty('default_sensitive')) {
        map.set('sensitive', !!data.default_sensitive);
      }
      if (data.hasOwnProperty('default_privacy')) {
        map.set('visibility', function (visibility) {
          switch (visibility) {
          case 'direct':
            return VISIBILITY.DIRECT;
          case 'public':
            return VISIBILITY.PUBLIC;
          case 'unlisted':
            return VISIBILITY.UNLISTED;
          default:
            return VISIBILITY.PRIVATE;
          }
        }(data.default_privacy));
      }
    }
    if (meta.hasOwnProperty('media_attachments') && (data = meta.media_attachments)) {
      if (data.hasOwnProperty('accept_content_types')) {
        map.set('mediaFormats', ImmutableList([].concat(data.accept_content_types)));
      }
    }
  }
);

const update = (state, source) => state.withMutations(
  map => {
    if (source.hasOwnProperty('note')) {
      map.set('rawBio', '' + source.note);
    }
    if (source.hasOwnProperty('sensitive')) {
      map.set('sensitive', !!source.sensitive);
    }
    if (source.hasOwnProperty('privacy')) {
      map.set('visibility', (
        visibility => {
          switch (visibility) {
          case 'direct':
            return VISIBILITY.DIRECT;
          case 'public':
            return VISIBILITY.PUBLIC;
          case 'unlisted':
            return VISIBILITY.UNLISTED;
          default:
            return VISIBILITY.PRIVATE;
          }
        }
      )(source.privacy));
    }
  }
);

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function meta (state = initialState, action) {
  switch(action.type) {
  case ACCOUNT_UPDATE_SUCCESS:
  case ACCOUNT_VERIFY_SUCCESS:
    return action.account.source ? update(state, action.account.source) : state;
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
export { loadMeta };
