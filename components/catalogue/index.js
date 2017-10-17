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
import { defineMessages } from 'react-intl';

//  Container imports.
import { AccountContainer } from 'themes/mastodon-go/components';

//  Component imports.
import CatalogueMenu from './menu';

//  Common imports.
import {
  CommonList,
  CommonPaneller,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  catalogue: {
    defaultMessage: 'Catalogue',
    id: 'catalogue.catalogue',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class Catalogue extends React.PureComponent {

  //  Props and state.
  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    column: PropTypes.bool,
    hash: PropTypes.string,
    history: PropTypes.object,
    icon: PropTypes.string,
    path: PropTypes.string.isRequired,
    title: PropTypes.node,
    '🛄': PropTypes.shape({ intl: PropTypes.object.isRequired }).isRequired,
    '💪': PropTypes.objectOf(PropTypes.func).isRequired,
    '🏪': PropTypes.shape({
      accounts: ImmutablePropTypes.list,
      isLoading: PropTypes.bool,
    }).isRequired,
  };
  state = { storedHash: '#' };

  //  Constructor.  We go ahead and prefetch the catalogue.  Note that
  //  this will erase any existing catalogue contents, but there
  //  shouldn't be multiple of the same catalogue open at the same time
  //  so this isn't really a problem.
  constructor (props) {
    super(props);
    const { '💪': { fetch } } = this.props;
    fetch();
  }

  //  If our component is suddenly no longer the active route, we need
  //  to store its hash value before it disappears.  If our path is
  //  about to change, we need to fetch the new path.
  componentWillReceiveProps (nextProps) {
    const {
      activeRoute,
      hash,
      path,
      '💪': { fetch },
    } = this.props;
    if (activeRoute && !nextProps.activeRoute) {
      this.setState({ storedHash: hash });
    }
    if (path !== nextProps.path) {
      fetch(nextProps.path);
    }
  }

  //  Loads more lol.
  handleLoadMore = () => {
    const { '💪': { expand } } = this.props;
    expand();
  }

  //  This is a tiny function to update our hash if needbe.
  handleSetHash = hash => {
    const { activeRoute } = this;
    if (!activeRoute) {
      this.setState({ storedHash: hash });
    }
  }

  //  Rendering.
  render () {
    const { handleSetHash } = this;
    const {
      activeRoute,
      className,
      column,
      hash,
      history,
      icon,
      path,
      title,
      '🛄': { intl },
      '💪': handler,
      '🏪': {
        accounts,
        isLoading,
      },
      ...rest
    } = this.props;
    const { storedHash } = this.state;
    const computedClass = classNames('MASTODON_GO--CATALOGUE', { list: !column }, className);

    //  We only use our internal hash if this isn't the active route.
    const computedHash = activeRoute ? hash : storedHash;

    if (column) {
      return (
        <CommonPaneller
          className={computedClass}
          menu={
            <CatalogueMenu
              activeRoute={activeRoute}
              hash={computedHash}
              history={history}
              icon={icon}
              intl={intl}
              onSetHash={handleSetHash}
              title={title}
            />
          }
          title={title}
          {...rest}
        >
          <CommonList isLoading={isLoading}>
            {accounts ? accounts.reduce(
              (items, id) => items.push(
                <AccountContainer
                  id={id}
                  key={id}
                />
              ),
              []
            ) : null}
          </CommonList>
        </CommonPaneller>
      )
    }

    return (
      <CommonList
        className={computedClass}
        isLoading={isLoading}
        {...rest}
      >
        {accounts ? accounts.reduce(
          (items, id) => items.push(
            <AccountContainer
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
