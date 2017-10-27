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

//  DOM imports.
import { DOMListen } from 'themes/mastodon-go/DOM';

//  Routed imports.
import { RoutedUI } from './routed';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class MastodonGO extends React.Component {

  constructor (props) {
    super(props);

    //  State.
    this.state = { konamiActive: false };

    //  Function binding.
    const { handleKeyDown } = Object.getPrototypeOf(this);
    this.handleKeyDown = handleKeyDown.bind(this);
    this.konami = 0;
  }

  componentWillMount () {
    document.body.addEventListener('keydown', handleKeyDown, true);
  }
  componentWillUnmount () {
    document.body.removeEventListener('keydown', handleKeyDown, true);
  }

  //  Big professional companies aren't allowed to have code like this.
  handleKeyDown (e) {
    const { konami } = this;
    const { konamiActive } = this.state;
    if (e.key.toUpperCase() === [
      'ARROWUP',
      'ARROWUP',
      'ARROWDOWN',
      'ARROWDOWN',
      'ARROWLEFT',
      'ARROWRIGHT',
      'ARROWLEFT',
      'ARROWRIGHT',
      'A',
      'B',
    ][konami] || e.key.toUpperCase() === [
      'I',
      'I',
      'K',
      'K',
      'J',
      'L',
      'J',
      'L',
      'X',
      'Z',
    ][konami]) {
      if (++this.konami >= 10) {
        this.setState({ konamiActive: !konamiActive });
        this.konami = 0;
      }
    } else {
      this.konami = 0;
    }
  }

  render () {
    const {
      className,
      locale,
      messages,
      store,
      ...rest
    } = this.props;
    const { konami } = this.state;
    const computedClass = classNames('MASTODON_GO', { konami }, className);

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
  }

}

MastodonGO.propTypes = {
  className: PropTypes.string,
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

//  * * * * * * *  //

//  Exports
//  -------

//  Common exports.
export * from './common';

//  Connected exports.
export * from './connected';

//  Panelled exports.
export * from './panelled';

//  Raw exports.
export * from './raw';

//  Routed exports.
export * from './routed';
