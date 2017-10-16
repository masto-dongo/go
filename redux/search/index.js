//  Package imports.
import {
  List as ImmutableList,
  Map as ImmutableMap,
} from 'immutable';


const normalize = search => ImmutableMap({
  accounts: ImmutableList(search.accounts.map(
    account => account.id
  )),
  hashtags: ImmutableList(search.hashtags),
  statuses: ImmutableList(search.statuses.map(
    status => status.id
  )),
});

export default function search (state = ImmutableMap(), action) {
  return state;
}
