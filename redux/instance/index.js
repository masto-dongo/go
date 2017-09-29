//  Package imports.
import { Map as ImmutableMap } from 'immutable';


const normalize = instance => ImmutableMap({
  description: '' + instance.description,
  domain: '' + instance.uri,
  email: '' + instance.email,
  stream: '' + ((instance.urls || {}).streaming_api || ''),
  title: '' + instance.title,
  version: '' + instance.version,
});


export default function instance (state = ImmutableMap(), action) {
  return state;
}
