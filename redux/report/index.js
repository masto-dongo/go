//  Package imports.
import { Map as ImmutableMap } from 'immutable';


const normalize = report => ImmutableMap({
  id: '' + report.id,
  response: '' + report.action_taken,
});


export default function report (state = ImmutableMap(), action) {
  return state;
}
