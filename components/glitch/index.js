import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import Route from 'react-router-dom/Route';
import ScrollContext from 'react-router-scroll/lib/ScrollBehaviorContext';
import { IntlProvider } from 'react-intl';

import {
  updateTimeline,
  deleteFromTimelines,
  refreshHomeTimeline,
  connectTimeline,
  disconnectTimeline,
} from 'mastodon/actions/timelines';
import { showOnboardingOnce } from 'mastodon/actions/onboarding';
import { updateNotifications, refreshNotifications } from 'mastodon/actions/notifications';
import createStream from 'mastodon/stream';

import UIContainer from 'glitch/components/ui/container';

export default class Glitch extends React.PureComponent {

  static propTypes = {
    locale: PropTypes.string.isRequired,
    store: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { locale, store }  = this.props;
    const state = store.getState();

    const streamingAPIBaseURL = state.getIn(['meta', 'streaming_api_base_url']);
    const accessToken = state.getIn(['meta', 'access_token']);

    const setupPolling = () => {
      this.polling = setInterval(() => {
        store.dispatch(refreshHomeTimeline());
        store.dispatch(refreshNotifications());
      }, 20000);
    };

    const clearPolling = () => {
      clearInterval(this.polling);
      this.polling = undefined;
    };

    this.subscription = createStream(streamingAPIBaseURL, accessToken, 'user', {

      connected () {
        clearPolling();
        store.dispatch(connectTimeline('home'));
      },

      disconnected () {
        setupPolling();
        store.dispatch(disconnectTimeline('home'));
      },

      received (data) {
        switch(data.event) {
        case 'update':
          store.dispatch(updateTimeline('home', JSON.parse(data.payload)));
          break;
        case 'delete':
          store.dispatch(deleteFromTimelines(data.payload));
          break;
        case 'notification':
          store.dispatch(updateNotifications(JSON.parse(data.payload), messages, locale));
          break;
        }
      },

      reconnected () {
        clearPolling();
        store.dispatch(connectTimeline('home'));
        store.dispatch(refreshHomeTimeline());
        store.dispatch(refreshNotifications());
      },

    });

    // Desktop notifications
    if (typeof window.Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    store.dispatch(showOnboardingOnce());
  }

  componentWillUnmount () {
    if (typeof this.subscription !== 'undefined') {
      this.subscription.close();
      this.subscription = null;
    }

    if (typeof this.polling !== 'undefined') {
      clearInterval(this.polling);
      this.polling = null;
    }
  }

  render () {
    const { locale, store } = this.props;
    return (
      <IntlProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <BrowserRouter basename='/web'>
            <ScrollContext>
              <Route path='/' component={UIContainer} />
            </ScrollContext>
          </BrowserRouter>
        </Provider>
      </IntlProvider>
    );
  }

}
