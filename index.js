//  GO
//  ==

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import 'intl';
import 'intl/locale-data/jsonp/en';
import { addLocaleData } from 'react-intl';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

//  Component imports.
import GOǃǃǃ from './components';

//  Lib imports.
import { DOMRoot } from './lib/DOM';
import launch from './lib/launch';
import { moduleReady } from './lib/module';
import Tootledge from './lib/tootledge';

//  Locale imports.
import { getLocale } from 'locales';

//  Stylesheet imports.
import './styles/index.scss';

//  * * * * * * *  //

//  Launching
//  ---------

//  The main function
void function main () {

  //  Gets our locale data.
  const {
    data,
    messages,
  } = getLocale();

  //  Creates async components.
  moduleReady();

  //  Avoids offline in dev mode because apparently it's harder to debug.
  if (process.env.NODE_ENV === 'production') {
    OfflinePluginRuntime.install();
  }

  //  Adds locale data
  addLocaleData(data);

  //  Launches the frontend.
  launch('mastodon', GOǃǃǃ, Tootledge, { messages }, DOMRoot.bind(null, 'mastodon'));
}();
