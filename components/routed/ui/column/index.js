import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Redirect from 'react-router-dom/Redirect';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import {
  PanelledCatalogue,
  PanelledConversation,
  PanelledCourier,
  PanelledDrawer,
  PanelledProfile,
  PanelledStart,
  PanelledTimeline,
} from 'themes/mastodon-go/components';

//  Component imports.
//import RoutedUIColumnUnknown from './unknown';
const RoutedUIColumnUnknown = () => null;

//  Stylesheet imports.
import './style.scss';

export default class RoutedUIColumn extends React.PureComponent {

  render () {
    const {
      activeRoute,
      className,
      index,
      location,
      media,
      onMediaRemove,
      onSensitive,
      onSpoiler,
      onSubmit,
      onText,
      onVisibility,
      spoiler,
      text,
      uploading,
      visibility,
      ℳ,
    } = this.props;

    const computedClass = classNames('MASTODON_GO--ROUTED--UI--COLUMN', 'column-' + index, className);

    return (
      <section className={computedClass}>
        <Switch location={location}>
          <Redirect
            exact
            from='/'
            to='/start'
          />

          <Route
            exact
            path='/start'
            render={function ({ location: { hash } }) {
              return (
                <PanelledStart
                  activeRoute={activeRoute}
                  hash={activeRoute ? hash : null}
                />
              );
            }}
          />

          <Route
            exact
            path='/courier'
            render={function ({ location: { hash } }) {
              return (
                <PanelledCourier
                  activeRoute={activeRoute}
                  hash={activeRoute ? hash : null}
                />
              );
            }}
          />

          <Route
            exact
            path='/compose'
            render={function ({ location: { hash } }) {
              return (
                <PanelledDrawer
                  activeRoute={activeRoute}
                  disabled={uploading}
                  hash={activeRoute ? hash : null}
                  media={media}
                  onMediaRemove={onMediaRemove}
                  onSensitive={onSensitive}
                  onSpoiler={onSpoiler}
                  onSubmit={onSubmit}
                  onText={onText}
                  onVisibility={onVisibility}
                  spoiler={spoiler}
                  text={text}
                  visibility={visibility}
                />
              );
            }}
          />

          <Route
            exact
            path='/home'
            render={function ({ location: { hash } }) {
              return (
                <PanelledTimeline
                  activeRoute={activeRoute}
                  hash={activeRoute ? hash : null}
                  icon='home'
                  path='/api/v1/timelines/home'
                  title={ℳ.home}
                />
              );
            }}
          />
          <Route
            exact
            path='/global'
            render={function ({ location: { hash } }) {
              return (
                <PanelledTimeline
                  activeRoute={activeRoute}
                  hash={activeRoute ? hash : null}
                  icon='globe'
                  path='/api/v1/timelines/public'
                  title={ℳ.global}
                />
              );
            }}
          />
          <Route
            exact
            path='/local'
            render={function ({ location: { hash } }) {
              return (
                <PanelledTimeline
                  activeRoute={activeRoute}
                  hash={activeRoute ? hash : null}
                  icon='users'
                  path='/api/v1/timelines/public?local=true'
                  title={ℳ.local}
                />
              );
            }}
          />
          <Route
            exact
            path='/tagged/:query'
            render={function ({
              location: { hash },
              match: { params: { query } },
            }) {
              return (
                <PanelledTimeline
                  activeRoute={activeRoute}
                  hash={activeRoute ? hash : null}
                  icon='hashtag'
                  path={`/api/v1/tag/${query}`}
                  title={query}
                />
              );
            }}
          />
          <Route
            exact
            path='/tagged/:query/local'
            render={function ({
              location: { hash },
              match: { params: { query } },
            }) {
              return (
                <PanelledTimeline
                  activeRoute={activeRoute}
                  hash={activeRoute ? hash : null}
                  icon='hashtag'
                  path={`/api/v1/tag/${query}?local=true`}
                  title={ℳ.localTag.withValues({ query })}
                />
              );
            }}
          />

          <Route
            exact
            path='/status/:id/favourites'
            render={function ({
              location: { hash },
              match: { params: { id } },
            }) {
              return (
                <PanelledCatalogue
                  activeRoute={activeRoute}
                  hash={activeRoute ? hash : null}
                  icon='star'
                  path={`/api/v1/statuses/${id}/favourited_by`}
                  title={ℳ.statusFavourites}
                />
              );
            }}
          />
          <Route
            exact
            path='/status/:id/reblogs'
            render={function ({
              location: { hash },
              match: { params: { id } },
            }) {
              return (
                <PanelledCatalogue
                  activeRoute={activeRoute}
                  hash={activeRoute ? hash : null}
                  icon='retweet'
                  path={`/api/v1/statuses/${id}/reblogged_by`}
                  title={ℳ.statusReblogs}
                />
              );
            }}
          />

          <Route
            exact
            path='/profile/:id'
            render={function ({
              location: { hash },
              match: { params: { id } },
            }) {
              return (
                <PanelledProfile
                  activeRoute={activeRoute}
                  hash={activeRoute ? hash : null}
                  id={id}
                />
              );
            }}
          />

          <Route
            exact
            path='/status/:id'
            render={function ({
              location: { hash },
              match: { params: { id } },
            }) {
              return (
                <PanelledConversation
                  activeRoute={activeRoute}
                  hash={activeRoute ? hash : null}
                  id={id}
                />
              );
            }}
          />

          <Route
            render={function ({ location: { hash } }) {
              return (
                <RoutedUIColumnUnknown
                  activeRoute={activeRoute}
                  hash={activeRoute ? hash : null}
                  ℳ={ℳ}
                />
              );
            }}
          />
        </Switch>
      </section>
    );
  }

}

RoutedUIColumn.propTypes = {
  activeRoute: PropTypes.bool,
  className: PropTypes.string,
  index: PropTypes.number.isRequired,
  location: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  media: PropTypes.array,
  onMediaRemove: PropTypes.func,
  onSensitive: PropTypes.func,
  onSpoiler: PropTypes.func,
  onSubmit: PropTypes.func,
  onText: PropTypes.func,
  onVisibility: PropTypes.func,
  spoiler: PropTypes.string,
  text: PropTypes.string,
  uploading: PropTypes.bool,
  visibility: PropTypes.number,
  ℳ: PropTypes.func.isRequired,
};
