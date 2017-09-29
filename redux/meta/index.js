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

//  Action types.
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
  requireConfirmation: ImmutableMap({
    delete: true,  //  Defaults to `true` because irreversible
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
        )(data.default_privacy));
      }
    }
    if (media.hasOwnProperty('media_attachments') && (data = meta.media_attachments)) {
      if (data.hasOwnProperty('accept_content_types')) {
        map.set('mediaFormats', ImmutableList([].concat(data.accept_content_types)));
      }
    }
  }
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
export { loadMeta } from './load';
