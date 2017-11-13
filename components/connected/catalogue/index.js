//  <ConnectedCatalogue>
//  ====================

//  A catalogue is just a list of accounts.  I named it "catalogue"
//  because uhhh "Rolodex" is trademarked and also nobody knows what tf
//  that means anymore.  You hand it a `path` (which should be an API
//  access point returning a list of accounts) and it displays them all
//  nice and fancy in a `<CommonList>`.

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
  CommonList,
  CommonObserveäble,
  CommonTextButton,
  ConnectedAccount,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  Request imports.
import {
  expandCatalogue,
  fetchCatalogue,
  refreshCatalogue,
} from 'themes/mastodon-go/redux';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
class Catalogue extends React.Component {  //  Impure

  //  Constructor.  We go ahead and prefetch the catalogue.  Note that
  //  this will erase any existing catalogue contents, but there
  //  shouldn't be multiple of the same catalogue open at the same time
  //  so this isn't really a problem.
  constructor (props) {
    super(props);

    //  Function binding.
    const { handleLoadMore } = Object.getPrototypeOf(this);
    this.handleLoadMore = handleLoadMore.bind(this);

    //  When our catalogue is first created, we go ahead and prefetch
    //  its data.
    const { '💪': { fetch } } = this.props;
    fetch();
  }

  //  If our path changes, then we need to fetch the new path.
  componentWillReceiveProps (nextProps) {
    const {
      path,
      '💪': { fetch },
    } = this.props;
    if (path !== nextProps.path) {
      fetch(nextProps.path);
    }
  }

  //  Loads more.
  handleLoadMore () {
    const { '💪': { expand } } = this.props;
    expand();
  }

  //  Rendering.
  render () {
    const { handleLoadMore } = this;
    const {
      className,
      type,
      ℳ,
      '🏪': {
        accounts,
        isLoading,
      },
      '💪': { expand },
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--CATALOGUE', className);

    //  This looks a bit complicated, but we're just appending a
    //  "load more" button to the end of our accounts unless the
    //  catalogue `isLoading`.
    return (
      <CommonList
        className={computedClass}
        isLoading={isLoading}
        onScrollToBottom={handleLoadMore}
      >
        {accounts ? accounts.reduce(function (items, id) {
          items.push(
            <ConnectedAccount
              id={id}
              key={id}
              type={type}
            />
          );
          return items;
        }, []).concat(
          <CommonObserveäble
            key='loadmore'
            searchText={ℳ.loadMore}
          >
            <CommonTextButton
              disabled={isLoading}
              onClick={expand}
            >{ℳ.loadMore}</CommonTextButton>
          </CommonObserveäble>
        ) : null}
      </CommonList>
    );
  }

}

//  Props.
Catalogue.propTypes = {
  className: PropTypes.string,
  path: PropTypes.string.isRequired,  //  The API path for the catalogue
  type: PropTypes.number,  //  A `POST_TYPE` to pass to the accounts
  ℳ: PropTypes.func.isRequired,
  '🏪': PropTypes.shape({
    accounts: ImmutablePropTypes.list,  //  The list of accounts
    isLoading: PropTypes.bool,  //  Whether the catalogue is currently loading
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component.
var ConnectedCatalogue = connect(

  //  Component.
  Catalogue,

  //  Store.
  createStructuredSelector({
    accounts: (state, { path }) => state.getIn(['catalogue', path, 'accounts']),
    isLoading: (state, { path }) => state.getIn(['catalogue', path, 'isLoading']),
  }),

  //  Messages.
  defineMessages({
    loadMore: {
      defaultMessage: 'Load more',
      description: 'Label for the "load more" button on catalogues',
      id: 'catalogue.load_more',
    },
  }),

  //  Handlers.
  (go, store, { path }) => ({
    expand: (newPath = path) => go(expandCatalogue, newPath),
    fetch: (newPath = path) => go(fetchCatalogue, newPath),
    refresh: (newPath = path) => go(refreshCatalogue, newPath),
  })
);

//  Exporting.
export { ConnectedCatalogue as default };
