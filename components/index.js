//  <MastodonGO>
//  ============

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Higher-order imports.
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import Route from 'react-router-dom/Route';

//  Container imports.
import AccountContainer from './account/container';
import AvatarContainer from './avatar/container';
// import CatalogueContainer from './catalogue/container';
// import ConversationContainer from './conversation/container';
// import CourierContainer from './courier/container';
// import DrawerContainer from './drawer/container';
// import MediaContainer from './media/container';
// import NotificationContainer from './notification/container';
import ParseContainer from './parse/container';
// import ProfileContainer from './profile/container';
import StatusContainer from './status/container';
import TimelineContainer from './timeline/container';
import UIContainer from './ui/container';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

const MastodonGO = ({
  className,
  locale,
  messages,
  store,
  ...rest
}) => {
  const computedClass = classNames('MASTODON_GO', className);
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
              component={UIContainer}
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
}

export default MastodonGO;

//  * * * * * * *  //

//  Exports
//  -------

//  Common exports.
export * from './common';

//  Container exports.
export {
  AccountContainer,
  AvatarContainer,
//    CatalogueContainer,
//    ConversationContainer,
//    CourierContainer,
//    DrawerContainer,
//    MediaContainer,
//    NotificationContainer,
  ParseContainer,
//    ProfileContainer,
  StatusContainer,
  TimelineContainer,
  UIContainer,
};
