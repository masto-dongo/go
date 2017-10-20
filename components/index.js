//  <MastodonGO>
//  ============

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Higher-order component imports.
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import {
  BrowserRouter,
  Route,
} from 'react-router-dom';

//  Routed imports.
import { RoutedUI } from './routed';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function MastodonGO ({
  className,
  locale,
  messages,
  store,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO', className);

  //  Rendering.
  return (
    <div
      className={computedClass}
      {...rest}
    >
      <IntlProvider
        locale={locale}
        messages={messages}
      >
        <Provider store={store}>
          <BrowserRouter basename='/web'>
            <Route
              component={RoutedUI}
              path='/'
            />
          </BrowserRouter>
        </Provider>
      </IntlProvider>
    </div>
  );
};

MastodonGO.propTypes = {
  className: PropTypes.string,
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

//  * * * * * * *  //

//  Exports
//  -------

//  Common exports.  Must not contain components which depend on raw
//  exports.
export * from './common';

//  Connected exports.  Must not contain components which depend on raw
//  exports.
export * from './connected';

//  Raw exports.  These must be executed before the components which
//  depend on them.
export * from './raw';

//  Panelled exports.  Depend on raw exports.
export * from './panelled';

//  Routed exports.  May contain components which depend on raw
//  exports.
export * from './routed';
