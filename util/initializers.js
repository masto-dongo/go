import 'intl';
import 'intl/locale-data/jsonp/en.js';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

if (process.env.NODE_ENV === 'production') {
  // avoid offline in dev mode because it's harder to debug
  OfflinePluginRuntime.install();
}
