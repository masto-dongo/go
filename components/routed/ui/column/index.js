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
import './style';

export default class RoutedUIColumn extends React.PureComponent {

  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    history: PropTypes.object,
    index: PropTypes.number.isRequired,
    location: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    media: PropTypes.array,
    onClear: PropTypes.func,
    onMediaRemove: PropTypes.func,
    onSensitive: PropTypes.func,
    onSpoiler: PropTypes.func,
    onSubmit: PropTypes.func,
    onText: PropTypes.func,
    onVisibility: PropTypes.func,
    singleColumn: PropTypes.bool.isRequired,
    spoiler: PropTypes.string,
    text: PropTypes.string,
    visibility: PropTypes.number,
    ℳ: PropTypes.func.isRequired,
  }

  render () {
    const {
      activeRoute,
      className,
      history,
      index,
      location,
      media,
      onClear,
      onMediaRemove,
      onSensitive,
      onSpoiler,
      onSubmit,
      onText,
      onVisibility,
      singleColumn,
      spoiler,
      text,
      visibility,
      ℳ,
      ...rest
    } = this.props;

    const computedClass = classNames('MASTODON_GO--ROUTED--UI--COLUMN', className);

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
            render={function ({ location: { hash } }) {
              return (
                <PanelledStart
                  activeRoute={activeRoute}
                  {...(activeRoute && hash ? { hash } : {})}
                  history={history}
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
                  column
                  {...(activeRoute && hash ? { hash } : {})}
                  history={history}
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
                  {...(activeRoute && hash ? { hash } : {})}
                  history={history}
                  media={media}
                  onClear={onClear}
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
                  {...(activeRoute && hash ? { hash } : {})}
                  history={history}
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
                  {...(activeRoute && hash ? { hash } : {})}
                  history={history}
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
                  {...(activeRoute && hash ? { hash } : {})}
                  history={history}
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
                  {...(activeRoute && hash ? { hash } : {})}
                  history={history}
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
                  {...(activeRoute && hash ? { hash } : {})}
                  history={history}
                  icon='hashtag'
                  path={`/api/v1/tag/${query}?local=true`}
                  title={ℳ.localTag.withValues({ query })}
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
                  {...(activeRoute && hash ? { hash } : {})}
                  history={history}
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
                  {...(activeRoute && hash ? { hash } : {})}
                  history={history}
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
