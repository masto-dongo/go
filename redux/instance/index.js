

const normalize = instance => ImmutableMap({
  description: '' + instance.description,
  domain: '' + instance.uri,
  email: '' + instance.email,
  stream: '' + ((instance.urls || {}).streaming_api || ''),
  title: '' + instance.title,
  version: '' + instance.version,
});
