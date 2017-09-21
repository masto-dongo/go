import PropTypes from 'prop-types';
import Redirect from 'react-router-dom/Redirect';
import Switch from 'react-router-dom/Switch';

import CommonRoute from './route';

const UIRoutes = ({
  component,
  history,
  intl,
}) => (
  <Switch>
    <Redirect
      exact
      from='/'
      to='/getting-started'
    />

    <CommonRoute
      component={component}
      exact
      path='/getting-started'
      props={{
        history,
        intl,
        type: 'start',
      }}
    />

    <CommonRoute
      component={component}
      exact
      path='/timelines/home'
      props={{
        history,
        intl,
        meta: { name: 'home' },
        type: 'timeline',
      }}
    />
    <CommonRoute
      component={component}
      exact
      path='/timelines/public'
      props={{
        history,
        intl,
        meta: { name: 'public' },
        type: 'timeline',
      }}
    />
    <CommonRoute
      component={component}
      exact
      path='/timelines/public/local'
      props={{
        history,
        intl,
        meta: {
          name: 'public',
          localOnly: true,
        },
        type: 'timeline',
      }}
    />
    <CommonRoute
      component={component}
      exact
      path='/timelines/tag/:query'
      props={({ query }]) => ({
        history,
        intl,
        meta: {
          name: 'hashtag',
          query,
        },
        type: 'timeline',
      })}
    />
    <CommonRoute
      component={component}
      exact
      path='/notifications'
      props={{
        history,
        intl,
        meta: { name: 'notifications' },
        type: 'timeline',
      }}
    />
    <CommonRoute
      component={component}
      exact
      path='/favourites'
      props={{
        history,
        intl,
        meta: { name: 'favourites' },
        type: 'timeline',
      }}
    />

    <CommonRoute
      component={component}
      exact
      path='/accounts/:id'
      props={({ id }]) => ({
        history,
        intl,
        meta: {
          id,
          mode: 'timeline',
          onlyPinned: true,
        },
        type: 'account',
      })}
    />
    <CommonRoute
      component={component}
      exact
      path='/accounts/:id/posts'
      props={({ id }]) => ({
        history,
        intl,
        meta: {
          id,
          mode: 'timeline',
          noReplies: true
        },
        type: 'account',
      })}
    />
    <CommonRoute
      component={component}
      exact
      path='/accounts/:id/media'
      props={({ id }]) => ({
        history,
        intl,
        meta: {
          id,
          mode: 'timeline',
          onlyMedia: true,
        },
        type: 'account',
      })}
    />
    <CommonRoute
      component={component}
      exact
      path='/accounts/:id/all'
      props={({ id }]) => ({
        history,
        intl,
        meta: {
          id,
          mode: 'timeline',
        },
        type: 'account',
      })}
    />
    <CommonRoute
      component={component}
      exact
      path='/accounts/:id/followers'
      props={({ id }]) => ({
        history,
        intl,
        meta: {
          id,
          mode: 'followers',
        },
        type: 'account',
      })}
    />
    <CommonRoute
      component={component}
      exact
      path='/accounts/:id/following'
      props={({ id }]) => ({
        history,
        intl,
        meta: {
          id,
          mode: 'following',
        },
        type: 'account',
      })}
    />

    <CommonRoute
      component={component}
      exact
      path='/statuses/:id'
      props={({ id }]) => ({
        history,
        intl,
        meta: { id },
        type: 'conversation',
      })}
    />

    <CommonRoute
      component={component}
      exact
      path='/statuses/new'
      props={{
        history,
        intl,
        type: 'compose',
      }}
    />

    <CommonRoute
      component={component}
      exact
      path='/statuses/:query/reblogs'
      props={({ query }]) => ({
        history,
        intl,
        meta: {
          name: 'reblogs',
          query,
        },
        type: 'catalogue',
      })}
    />
    <CommonRoute
      component={component}
      path='/statuses/:query/favourites'
      props={({ query }]) => ({
        history,
        intl,
        meta: {
          name: 'favourites',
          query,
        },
        type: 'catalogue',
      })}
    />

    <CommonRoute
      component={component}
      exact
      path='/follow_requests'
      props={{
        history,
        intl,
        meta: { name: 'requests' },
        type: 'catalogue',
      }}
    />
    <CommonRoute
      component={component}
      exact
      path='/blocks'
      props={{
        history,
        intl,
        meta: { name: 'blocks' },
        type: 'catalogue',
      }}
    />
    <CommonRoute
      component={component}
      exact
      path='/mutes'
      props={{
        history,
        intl,
        meta: { name: 'mutes' },
        type: 'catalogue',
      }}
    />

    <CommonRoute
      component={component}
      props={{
        history,
        intl,
        type: 'unknown',
      }}
    />
  </Switch>
);

UIRoutes.propTypes = {
  component: PropTypes.func.isRequired,
  history: PropTypes.object,
  intl: PropTypes.object.isRequired,
}

export default UIRoutes;
