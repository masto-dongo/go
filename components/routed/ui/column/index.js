//  <RoutedUIColumn>
//  ================

//  This component does all of our routeïng.  Most of the props are
//  composer things which just get passed straight through.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import Redirect from 'react-router-dom/Redirect';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import {
  PanelledCatalogue,
  PanelledConversation,
  PanelledCourier,
  PanelledProfile,
  PanelledStart,
  PanelledTimeline,
} from 'flavours/go/components';

const RoutedUIColumnUnknown = () => null;  //  TK

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function RoutedUIColumn ({
  activeRoute,
  className,
  index,
  location,
  ℳ,
}) {
  const computedClass = classNames('MASTODON_GO--ROUTED--UI--COLUMN', 'column-' + index, className);

  //  Rendering.
  return (
    <section className={computedClass}>
      <Switch location={location}>
        <Redirect
          exact
          from='/'
          to='/start'
        />

        {
          //  The start container.
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
        }{
          //  The courier.
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
        }{
          //  The home timeline.
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
        }{
          //  The global timeline.
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
        }{
          //  The local timeline.
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
        }{
          //  Hashtag timelines.
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
        }{
          //  Local hashtag timelines.
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
                  title={ℳ('localTag', { query })}
                />
              );
            }}
          />
        }{
          //  Favourites catalogues.
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
        }{
          //  Reblogs catalogues.
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
        }{
          //  Profiles.
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
        }{
          //  Conversations.
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
        }{
          //  Not found.
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
        }
      </Switch>
    </section>
  );
}

//  Props.
RoutedUIColumn.propTypes = {
  activeRoute: PropTypes.bool,  //  `true` if the column is currently the active route
  className: PropTypes.string,
  index: PropTypes.number.isRequired,  //  The index of the column
  location: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),  //  The location of the column
  ℳ: PropTypes.func.isRequired,
};
