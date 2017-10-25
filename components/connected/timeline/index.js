import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { createStructuredSelector } from 'reselect';

//  Request imports.
import {
  connectTimeline,
  expandTimeline,
  fetchTimeline,
  refreshTimeline,
} from 'themes/mastodon-go/redux';

import {
  CommonList,
  ConnectedStatus,
} from 'themes/mastodon-go/components';

import './style.scss';

import connect from 'themes/mastodon-go/util/connect';
import { POST_TYPE } from 'themes/mastodon-go/util/constants';
import { moduleOnReady } from 'themes/mastodon-go/util/module';

class Timeline extends React.PureComponent {

  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    history: PropTypes.object,
    icon: PropTypes.string,
    path: PropTypes.string.isRequired,
    rehash: PropTypes.func,
    title: PropTypes.node,
    ℳ: PropTypes.func,
    '🏪': PropTypes.shape({
      isLoading: PropTypes.bool,
      settings: ImmutablePropTypes.map,
      statuses: ImmutablePropTypes.list,
    }).isRequired,
    '💪': PropTypes.objectOf(PropTypes.func).isRequired,
  };

  constructor (props) {
    super(props);
    const { '💪': { fetch } } = this.props;

    //  State.
    this.state = { currentDetail: null };

    //  Function binding.
    const { handleDetail } = Object.getPrototypeOf(this);
    this.handleDetail = handleDetail.bind(this);

    //  Fetching the timeline.
    fetch();
  }

  //  If our path is about to change, we need to fetch the new path.
  componentWillReceiveProps (nextProps) {
    const {
      path,
      '💪': { fetch },
    } = this.props;
    if (path !== nextProps.path) {
      fetch(nextProps.path);
    }
  }

  handleDetail (id) {
    this.setState({ currentDetail: id });
  }

  render () {
    const { handleDetail } = this;
    const {
      activeRoute,
      className,
      history,
      icon,
      path,
      rehash,
      title,
      ℳ,
      '🏪': {
        isLoading,
        settings,
        statuses,
      },
      '💪': handler,
      ...rest
    } = this.props;
    const { currentDetail } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--TIMELINE', className);

    return (
      <CommonList
        className={computedClass}
        isLoading={isLoading}
        {...rest}
      >
        {
          statuses ? statuses.reduce(
            (items, id) => items.push(
              <ConnectedStatus
                detailed={currentDetail === id}
                filterRegex={settings.getIn(['regex', 'body'])}
                hideIf={(settings.getIn(['shows', 'reblog']) && POST_TYPE.IS_REBLOG) | (settings.getIn(['shows', 'reply']) && POST_TYPE.IS_MENTION)}
                id={id}
                key={id}
                setDetail={handleDetail}
              />
            ),
            []
          ) : null
        }
      </CommonList>
    );
  }

}

//  * * * * * * *  //

//  Connecting
//  ----------

var ConnectedTimeline = connect(

  //  Component.
  Timeline,

  //  Store.
  createStructuredSelector({
    isLoading: (state, { path }) => state.getIn(['timeline', path, 'isLoading']),
    settings: (state, { path }) => state.getIn([
      'setting',
      'global',
      'timeline',
      path,
    ]),
    statuses: (state, { path }) => state.getIn(['timeline', path, 'statuses']),
  }),

  //  Messages.
  null,

  //  Handler.
  (go, store, { path }) => ({
    connect: (newPath = path) => go(connectTimeline, newPath),
    expand: (newPath = path) => go(expandTimeline, newPath),
    fetch: (newPath = path) => go(fetchTimeline, newPath),
    refresh: (newPath = path) => go(refreshTimeline, newPath),
  })
);

export { ConnectedTimeline as default };
