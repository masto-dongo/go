//  Package imports.
import 'intl';
import 'intl/locale-data/jsonp/en';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

//  Our imports.
import MastodonGO from './components';
import { DOMRoot } from './DOM';
import redux from './redux';
import launch from './util/launch';
import { moduleReady } from './util/module';

//  Stylesheet imports.
import 'font-awesome/css/font-awesome.css';
import './custom.scss';

//  Creates async components.
moduleReady();

//  Avoids offline in dev mode because apparently it's harder to debug.
if (process.env.NODE_ENV === 'production') {
  OfflinePluginRuntime.install();
}

//  Launches the frontend.
launch(DOMRoot, MastodonGO, redux, {
  data: {},
  messages: {},
});
