//  DOMAIN
//  ======

//  If you want to get domain information on Mastodon (which at this
//  point is just limited to domain block information), you have to
//  first find an account from that domain, and then request the
//  relationships with that account. This is a little kooky, so we
//  don't follow that representation internally, and give domains their
//  own section in our Redux store.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  List as ImmutableList,
  Map as ImmutableMap,
} from 'immutable';

//  Action types.
import { DOMAIN_BLOCK_SUCCESS } from 'themes/mastodon-go/redux/domain/block';
import { DOMAIN_UNBLOCK_SUCCESS } from 'themes/mastodon-go/redux/domain/unblock';
import { RELATIONSHIP_FETCH_SUCCESS } from 'themes/mastodon-go/redux/relationship/fetch';

//  Other imports.
import rainbow from 'themes/mastodon-go/util/rainbow';

//  * * * * * * *  //

//  Setup
//  -----

//  We could use `immutableFromJS()` to `normalize()` our domain, but
//  there's no point, and this way, we can perform typecasting as well.
const normalize = (domain) => ImmutableMap({
  blocking: !!domain.blocking,
  domain: domain.domain || '',
  rainbow: ImmutableMap({
    1: '#' + (rainbow(domain.domain)[0] || 0xffffff).toString(16),
    3: ImmutableList(rainbow(domain.domain, 3).map(
      colour => '#' + colour.toString(16)
    )),
    7: ImmutableList(rainbow(domain.domain, 7).map(
      colour => '#' + colour.toString(16)
    )),
    15: ImmutableList(rainbow(domain.domain, 15).map(
      colour => '#' + colour.toString(16)
    )),
  }),
});

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is an empty map. Our domains will be added to
//  this by `domain`.
const initialState = ImmutableMap();

//  `set()` just stores the normalized equivalents for the provided
//  `domains` in our store. We don't store empty or null domains, which
//  refer to the local instance.
const set = (state, domains) => state.withMutations(
  map => [].concat(domains).forEach(
    domain => {
      if (domain.domain) {
        state.set(domain.domain, normalize(domain));
      }
    }
  )
);

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function domain (state = initialState, action) {
  switch (action.type) {
  case DOMAIN_BLOCK_SUCCESS:
    return set(state, {
      blocking: true,
      domain: action.domain,
    });
  case DOMAIN_UNBLOCK_SUCCESS:
    return set(state, {
      blocking: false,
      domain: action.domain,
    });
  case RELATIONSHIP_FETCH_SUCCESS:
    return set(state, action.relationships.map(
      relationship => ({
        blocking: relationship.domain_blocking,
        domain: relationship.domain,
      })
    ));
  default:
    return state;
  }
}

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export { blockDomain } from './block';
export { unblockDomain } from './unblock';
