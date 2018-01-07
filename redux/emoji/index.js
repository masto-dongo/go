//  Package imports.
import {
  List as ImmutableList,
  Map as ImmutableMap,
} from 'immutable';

//  Request imports.
import fetchEmoji from './fetch';

//  Action types.
import { EMOJI_FETCH_SUCCESS } from '../emoji/fetch';
import { META_LOAD_COMPLETE } from '../meta/load';

//  Lib imports.
import {
  Emoji,
  EmojiData,
} from '../../lib/emojify';

//  * * * * * * *  //

//  Setup
//  -----

const normalize = emoji => emoji ? new Emoji({
  category: 'other',
  href: '' + emoji.url,
  name: '' + emoji.shortcode,
  staticHref: '' + emoji.static_url,
  title: ':' + emoji.shortcode + ':',
}) : new Emoji;

//  * * * * * * *  //

//  State
//  -----

const initialState = ImmutableMap({
  custom: ImmutableList(),
  global: ImmutableList(EmojiData),
});

const set = (state, emoji) => state.set('custom', ImmutableList(emoji ? [].concat(emoji).map(
  emojo => normalize(emojo)
) : []));

export default function emoji (state = initialState, action) {
  switch(action.type) {
  case EMOJI_FETCH_SUCCESS:
    return set(state, action.emoji, action.global);
  case META_LOAD_COMPLETE:
    if (action.meta.hasOwnProperty('custom_emojis')) {
      return set(state, action.meta.custom_emojis);
    }
    return state;
  default:
    return state;
  }
}

export { fetchEmoji };
