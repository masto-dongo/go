//  CARD
//  ====

//  Cards aren't kept with statuses for ease of organization and
//  rendering, mostly—although it also helps take care of the case
//  where a server doesn't generate a status's card until *after* it
//  has given us the status data.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { Map as ImmutableMap } from 'immutable';

//  Request imports.
import fetchCard from './fetch';

//  Action types.
import { CARD_FETCH_SUCCESS } from '../card/fetch';

//  Constants.
import { CARD_TYPE } from '../../constants';

//  * * * * * * *  //

//  Setup
//  -----

//  `normalize()` normalizes our card into an Immutable map.
const normalize = (card, status) => Object.keys(card).length ? ImmutableMap({
  author: card.author ? ImmutableMap({
    href: card.author.url ? '' + card.author.url : null,
    name: card.author.name ? '' + card.author.name : null,
  }) : null,
  description: '' + card.description,
  height: +card.height,
  href: card.url ? '' + card.url : null,
  html: card.html ? '' + card.html : null,
  image: card.image ? '' + card.image : null,
  provider: card.provider ? ImmutableMap({
    href: card.provider.url ? '' + card.provider.url : null,
    name: card.provider.name ? '' + card.provider.name : null,
  }) : null,
  status: '' + status,
  title: '' + card.title,
  type: (
    type => {
      switch (type) {
      case 'link':
        return CARD_TYPE.LINK;
      case 'photo':
        return CARD_TYPE.PHOTO;
      case 'rich':
        return CARD_TYPE.RICH;
      case 'video':
        return CARD_TYPE.VIDEO;
      default:
        return CARD_TYPE.UNKNOWN;
      }
    }
  )(card.type),
  width: +card.width,
}) : null;

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is an empty map. Our accounts will be added to
//  this by `status`.
const initialState = ImmutableMap();

//  `set()` just sets the Immutable map for the given `status` to be a
//  newly normalized card.
const set = (state, status, card) => state.set('' + status, normalize(card, status));

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function account (state = initialState, action) {
  switch (action.type) {
  case CARD_FETCH_SUCCESS:
    return set(state, action.status, action.card);
  default:
    return state;
  }
}

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export { fetchCard };
