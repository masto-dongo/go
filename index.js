import 'intl';
import 'intl/locale-data/jsonp/en';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import { getLocale } from 'mastodon/locales';

import MastodonGO from './components';
import { DOMRoot } from './DOM';
import redux from './redux';
import launch from './util/launch';
import { moduleReady } from './util/module';

import 'font-awesome/css/font-awesome.scss';
import './custom.scss';

moduleReady();

if (process.env.NODE_ENV === 'production') {
  // avoid offline in dev mode because it's harder to debug
  OfflinePluginRuntime.install();
}

launch(DOMRoot, MastodonGO, redux, getLocale());
