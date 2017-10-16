import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData } from 'react-intl';

import launchOnReady from './on_ready';

export default function launch (Component, store, locale) {

  //  Redirects non-`/web/` links to their proper location.
  if (history && history.replaceState) {
    const { pathname, search, hash } = location;
    const path = pathname + search + hash;
    if (!(/^\/web[$/]/).test(path)){
      history.replaceState(null, document.title, `/web${path}`);
    }
  }

  //  Creates localization.
  addLocaleData(locale.localeData);

  //  Launches app when the brower is ready.
  launchOnReady(function () {

    //  Gets root element and props.
    const props = JSON.parse(root.getAttribute('data-props'));

    //  Renders.
    ReactDOM.render(
      (
        <Component
          locale={props.locale}
          messages={locale.messages}
          store={store}
        />
      ), root
    );
  });
}
