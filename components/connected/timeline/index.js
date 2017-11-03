//  <ConnectedTimeline>
//  ===================

//  This component just pulls a timeline of statuses in from the redux
//  store and renders them in a list.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import {
  CommonButton,
  CommonList,
  CommonObserveäble,
  ConnectedStatus,
} from 'themes/mastodon-go/components';

//  Request imports.
import {
  connectTimeline,
  expandTimeline,
  fetchTimeline,
  refreshTimeline,
} from 'themes/mastodon-go/redux';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';
import { POST_TYPE } from 'themes/mastodon-go/util/constants';

//  * * * * * * * //

//  The component
//  -------------

//  Component definition.
class Timeline extends React.Component {  //  Impure

  //  Constructor.
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

  //  This function sets the currently detailed status in the list.
  handleDetail (id) {
    this.setState({ currentDetail: id });
  }

  //  Rendering.
  render () {
    const { handleDetail } = this;
    const {
      className,
      ℳ,
      '🏪': {
        isLoading,
        settings,
        statuses,
      },
      '💪': { expand },
    } = this.props;
    const { currentDetail } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--TIMELINE', className);

    //  If a status in our list has an `id` which matches our
    //  `currentDetail`, we make it detailed.
    return (
      <CommonList
        className={computedClass}
        isLoading={isLoading}
      >
        {statuses ? statuses.reduce(function (items, status) {
          items.push(
            <ConnectedStatus
              detailed={currentDetail === status.get('id')}
              filterRegex={settings ? settings.getIn(['regex', 'body']) : null}
              hideIf={settings ? (settings.getIn(['shows', 'reblog']) && POST_TYPE.IS_REBLOG) | (settings.getIn(['shows', 'reply']) && POST_TYPE.IS_MENTION) : null}
              id={status.get('id')}
              key={status.get('id')}
              onDetail={handleDetail}
            />
          );
          return items;
        }, []).concat(!isLoading ? (
          <CommonObserveäble
            key='loadmore'
            searchText={ℳ.loadMore}
          >
            <CommonButton
              onClick={expand}
              showTitle
              title={ℳ.loadMore}
            />
          </CommonObserveäble>
        ) : null) : null}
      </CommonList>
    );
  }

}

//  Props.
Timeline.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  path: PropTypes.string.isRequired,
  rehash: PropTypes.func,
  title: PropTypes.node,
  ℳ: PropTypes.func.isRequired,
  '🏪': PropTypes.shape({
    isLoading: PropTypes.bool,
    settings: ImmutablePropTypes.map,
    statuses: ImmutablePropTypes.list,
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component.
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
  defineMessages({
    loadMore: {
      defaultMessage: 'Load more',
      description: 'Label for the "load more" button on timelines',
      id: 'timeline.load_more',
    },
  }),

  //  Handlers.
  (go, store, { path }) => ({
    connect: (newPath = path) => go(connectTimeline, newPath),
    expand: (newPath = path) => go(expandTimeline, newPath),
    fetch: (newPath = path) => go(fetchTimeline, newPath),
    refresh: (newPath = path) => go(refreshTimeline, newPath),
  })
);

//  Exporting.
export { ConnectedTimeline as default };
