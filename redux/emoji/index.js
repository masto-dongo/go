//  Package imports.
import { Map as ImmutableMap } from 'immutable';



const normalize = emoji => ImmutableMap({
  name: '' + emoji.name,
  href: '' + emoji.url,
});


export default function emoji (state = ImmutableList(), action) {
  return state;
}
