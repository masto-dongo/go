import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData } from 'react-intl';

import ready from './ready';
import store from './store';
import { getLocale } from 'mastodon-go/locales';

import UIContainer from 'mastodon-go/components/ui/container';

export default function run() {

  if (history && history.replaceState) {
    const { pathname, search, hash } = location;
    const path = pathname + search + hash;
    if (!(/^\/web[$/]/).test(path)) history.replaceState(null, document.title, `/web${path}`);
  }

  const { localeData, messages } = getLocale();
  addLocaleData(localeData);

  const store = store(() => {
    let state;
    try {
      state = JSON.parse(document.getElementById('initial-state').textContent);
    } catch (error) {
      state = {};
    }
    try {
      state.local_settings = JSON.parse(localStorage.getItem(`mastodon-go/${state.meta.me}`));
    } catch (error) {
      state.local_settings = {};
    }
    return state;
  });

  ready(() => {
    const root = document.getElementById('mastodon');
    const props = JSON.parse(mountNode.getAttribute('data-props'));

    ReactDOM.render(<UIContainer store={store} {...props} />, root);
  });
}
