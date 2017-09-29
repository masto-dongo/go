import 'intl';
import 'intl/locale-data/jsonp/en.js';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import 'font-awesome/css/font-awesome';

if (process.env.NODE_ENV === 'production') {
  // avoid offline in dev mode because it's harder to debug
  OfflinePluginRuntime.install();
}

import launch from './util/launch';

launch();
