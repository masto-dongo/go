import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData } from 'react-intl';

import { getLocale } from 'mastodon/locales';

import launchOnReady from './on_ready';

import MastodonGO from 'themes/mastodon-go/components';

import redux from 'themes/mastodon-go/redux';

export default function launch () {

  //  Redirects non-`/web/` links to their proper location.
  if (history && history.replaceState) {
    const { pathname, search, hash } = location;
    const path = pathname + search + hash;
    if (!(/^\/web[$/]/).test(path)){
      history.replaceState(null, document.title, `/web${path}`);
    }
  }

  //  Creates localization.
  const { localeData, messages } = getLocale();
  addLocaleData(localeData);

  //  Creates store.
  const store = redux();

  //  Launches app when the brower is ready.
  launchOnReady(
    () => {

      //  Gets root element and props.
      const root = document.getElementById('mastodon') || document.body;
      const props = JSON.parse(root.getAttribute('data-props'));

      //  Renders.
      ReactDOM.render(
        (
          <MastodonGO
            locale={props.locale}
            messages={messages}
            store={store}
          />
        ), root
      );
    }
  );
}
