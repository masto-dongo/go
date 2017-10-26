/*********************************************************************\
|                                                                     |
|   <Catalogue>                                                       |
|   ===========                                                       |
|                                                                     |
|   A catalogue is just a list of accounts.  I named it "catalogue"   |
|   because uhh "Rolodex" is trademarked and also nobody knows what   |
|   tf that even means anymore.  You hand it a `path` (which should   |
|   be an API access point which returns a list of accounts) and it   |
|   displays them all nice and fancy in a list.  This component has   |
|   been designed for use with our `<UIContainer>` (ie, it includes   |
|   a menu); it's trivial enough to just render a `<CommonList>` of   |
|   accounts that we don't need a separate component for that.        |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import {
  CommonList,
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
class Catalogue extends React.PureComponent {

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

  //  Loads more lol.
  handleLoadMore () {
    const { '💪': { expand } } = this.props;
    expand();
  }

  //  Rendering.
  render () {
    const {
      className,
      '🏪': {
        accounts,
        isLoading,
      },
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--CATALOGUE', className);

    return (
      <CommonList
        className={computedClass}
        isLoading={isLoading}
      >
        {accounts ? accounts.reduce(
          (items, id) => items.push(
            <ConnectedAccount
              id={id}
              key={id}
            />
          ),
          []
        ) : null}
      </CommonList>
    );
  }

}

//  Props.
Catalogue.propTypes = {
  className: PropTypes.string,
  path: PropTypes.string.isRequired,
  rehash: PropTypes.func,
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    accounts: ImmutablePropTypes.list,
    isLoading: PropTypes.bool,
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

var ConnectedCatalogue = connect(

  //  Component.
  Catalogue,

  //  Store.
  createStructuredSelector({
    accounts: (state, { path }) => state.getIn(['catalogue', path, 'accounts']),
    isLoading: (state, { path }) => state.getIn(['catalogue', path, 'isLoading']),
  }),

  //  Messages.
  null,

  //  Handlers.
  (go, store, { path }) => ({
    expand: (newPath = path) => go(expandCatalogue, newPath),
    fetch: (newPath = path) => go(fetchCatalogue, newPath),
    refresh: (newPath = path) => go(refreshCatalogue, newPath),
  })
);

export { ConnectedCatalogue as default };
