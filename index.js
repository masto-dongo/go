//  Package imports.
import React from 'react';
import ReactDOM from 'react-dom';

//  Function imports.
import launchOnReady from './on_ready';

//  The function.
export default function launch (id, Component, store, props, callback) {

  //  Redirects non-`/web/` links to their proper location.
  if (history && history.replaceState) {
    const { pathname, search, hash } = location;
    const path = pathname + search + hash;
    if (!(/^\/web[$/]/).test(path)){
      history.replaceState(null, document.title, `/web${path}`);
    }
  }

  //  Launches app when the brower is ready.
  launchOnReady(function () {

    //  Gets root element and props.
    const root = document.getElementById(id);
    const data = root.hasAttribute('data-props') ? function () {
      try {
        return JSON.parse(root.getAttribute('data-props'));
      } catch () {}
      return null;
    }() : null;

    //  Runs the callback.
    if (typeof callback === 'function') {
      callback();
    }

    //  Renders.
    ReactDOM.render(
      (
        <Component
          {...(props || {})}
          data={data}
          messages={messages}
          store={store}
        />
      ), root
    );
  });
}
