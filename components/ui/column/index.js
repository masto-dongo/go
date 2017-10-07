import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Redirect from 'react-router-dom/Redirect';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import {
  StartContainer,
  TimelineContainer,
} from 'themes/mastodon-go/components';

import { RAINBOW } from 'themes/mastodon-go/util/constants';
import rainbow from 'themes/mastodon-go/util/rainbow';

//  Stylesheet imports.
import './style';

const messages = defineMessages({
  global: {
    defaultMessage: 'Federated timeline',
    id: 'column.global',
  },
  home: {
    defaultMessage: 'Home',
    id: 'column.home',
  },
  local: {
    defaultMessage: 'Local timeline',
    id: 'column.local',
  },
  localTag: {
    defaultMessage: '{query} (local)',
    id: 'column.local_tag',
  },
});

export default class UIColumn extends React.Component {  //  Impure

  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    history: PropTypes.object,
    index: PropTypes.number.isRequired,
    intl: PropTypes.object.isRequired,
    location: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    singleColumn: PropTypes.bool.isRequired,
  }

  render () {
    const {
      activeRoute,
      className,
      history,
      index,
      intl,
      location,
      singleColumn,
      ...rest
    } = this.props;

    const computedClass = classNames('MASTODON_GO--UI--COLUMN', className);

    return (
      <section
        className={computedClass}
        {...rest}
      >
        <Switch {...(location ? { location } : {})}>
          <Redirect
            exact
            from='/'
            to='/start'
          />

          <Route
            exact
            path='/start'
            render={({ location: { hash } }) => (
              <StartContainer
                activeRoute={activeRoute}
                {...(activeRoute && hash ? { hash } : {})}
                history={history}
                intl={intl}
              />
            )}
          />

          <Route
            exact
            path='/notifications'
            render={({ location: { hash } }) => (
              <section
                className={computedClass}
                {...rest}
              >
                <UIColumnCourier
                  activeRoute={activeRoute}
                  {...(activeRoute && hash ? { hash } : {})}
                  history={history}
                  intl={intl}
                />
              </section>
            )}
          />

          <Route
            exact
            path='/compose'
            render={({ location: { hash } }) => (
              <section
                className={computedClass}
                {...rest}
              >
                <UIColumnDrawer
                  activeRoute={activeRoute}
                  {...(activeRoute && hash ? { hash } : {})}
                  history={history}
                  intl={intl}
                />
              </section>
            )}
          />

          <Route
            exact
            path='/home'
            render={({ location: { hash } }) => (
              <TimelineContainer
                activeRoute={activeRoute}
                {...(activeRoute && hash ? { hash } : {})}
                icon='home'
                path='/api/v1/timelines/home'
                title={<FormattedMessage {...messages.home} />}
              />
            )}
          />
          <Route
            exact
            path='/global'
            render={({ location: { hash } }) => (
              <TimelineContainer
                activeRoute={activeRoute}
                {...(activeRoute && hash ? { hash } : {})}
                icon='globe'
                path='/api/v1/timelines/public'
                title={<FormattedMessage {...messages.global} />}
              />
            )}
          />
          <Route
            exact
            path='/local'
            render={({ location: { hash } }) => (
              <TimelineContainer
                activeRoute={activeRoute}
                {...(activeRoute && hash ? { hash } : {})}
                icon='users'
                path='/api/v1/timelines/public?local=true'
                title={<FormattedMessage {...messages.local} />}
              />
            )}
          />
          <Route
            exact
            path='/tagged/:query'
            render={({
              location: { hash },
              match: { params: { query } },
            }) => (
              <TimelineContainer
                activeRoute={activeRoute}
                {...(activeRoute && hash ? { hash } : {})}
                icon='hashtag'
                path={`/api/v1/tag/${query}`}
                title={query}
              />
            )}
          />
          <Route
            exact
            path='/tagged/:query/local'
            render={({
              location: { hash },
              match: { params: { query } },
            }) => (
              <TimelineContainer
                activeRoute={activeRoute}
                {...(activeRoute && hash ? { hash } : {})}
                icon='hashtag'
                path={`/api/v1/tag/${query}?local=true`}
                title={<FormattedMessage {...messages.localTag} values={{ query }} />}
              />
            )}
          />

          <Route
            exact
            path='/profile/:id'
            render={({
              location: { hash },
              match: { params: { id } },
            }) => (
              <section
                className={computedClass}
                {...rest}
              >
                <UIColumnProfile
                  activeRoute={activeRoute}
                  {...(activeRoute && hash ? { hash } : {})}
                  history={history}
                  id={id}
                  intl={intl}
                />
              </section>
            )}
          />

          <Route
            render={({ location: { hash } }) => (
              <section
                className={computedClass}
                {...rest}
              >
                <UIColumnUnknown
                  activeRoute={activeRoute}
                  {...(activeRoute && hash ? { hash } : {})}
                  history={history}
                  intl={intl}
                />
              </section>
            )}
          />
        </Switch>
      </section>
    );
  }

}
