import 'intl';
import 'intl/locale-data/jsonp/en.js';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import { getLocale } from 'mastodon/locales';

import MastodonGO from './components';
import events from './events';
import redux from './redux';
import launch from './util/launch';

import 'font-awesome/css/font-awesome';

if (process.env.NODE_ENV === 'production') {
  // avoid offline in dev mode because it's harder to debug
  OfflinePluginRuntime.install();
}

const root = document.getElementById('mastodon') || document.body;
events(root);
launch(MastodonGO, redux(), getLocale(), root);
