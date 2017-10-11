import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Redirect from 'react-router-dom/Redirect';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import {
  CatalogueContainer,
  CourierContainer,
  DrawerContainer,
  ProfileContainer,
  StartContainer,
  TimelineContainer,
} from 'themes/mastodon-go/components';

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

export default class UIColumn extends React.PureComponent {

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
              />
            )}
          />

          <Route
            exact
            path='/courier'
            render={({ location: { hash } }) => (
              <CourierContainer
                activeRoute={activeRoute}
                {...(activeRoute && hash ? { hash } : {})}
                history={history}
              />
            )}
          />

          <Route
            exact
            path='/compose'
            render={({ location: { hash } }) => (
              <DrawerContainer
                activeRoute={activeRoute}
                {...(activeRoute && hash ? { hash } : {})}
                history={history}
              />
            )}
          />

          <Route
            exact
            path='/home'
            render={({ location: { hash } }) => (
              <TimelineContainer
                activeRoute={activeRoute}
                {...(activeRoute && hash ? { hash } : {})}
                history={history}
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
                history={history}
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
                history={history}
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
                history={history}
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
                history={history}
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
              <ProfileContainer
                activeRoute={activeRoute}
                {...(activeRoute && hash ? { hash } : {})}
                history={history}
                id={id}
              />
            )}
          />

          <Route
            render={({ location: { hash } }) => (
              <UIColumnUnknown
                activeRoute={activeRoute}
                {...(activeRoute && hash ? { hash } : {})}
                history={history}
                intl={intl}
              />
            )}
          />
        </Switch>
      </section>
    );
  }

}
