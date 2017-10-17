//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {
  defineMessages,
  FormattedMessage,
} from 'react-intl';

//  Component imports.
import DrawerComposer from './composer';
import DrawerMenu from './menu';
import DrawerPanel from './panel';

//  Common imports.
import { CommonPaneller } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  drawer: {
    defaultMessage: 'Compose',
    id: 'drawer.drawer',
  },
  search: {
    defaultMessage: 'Search',
    id: 'drawer.search',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class Drawer extends React.PureComponent {

  //  Props.
  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    hash: PropTypes.string,
    history: PropTypes.object,
    '🛄': PropTypes.shape({ intl: PropTypes.object.isRequired }).isRequired,
    '💪': PropTypes.objectOf(PropTypes.func),
    '🏪': PropTypes.shape({
      defaultVisibility: PropTypes.number,
      me: PropTypes.string,
      results: PropTypes.map,
    }).isRequired,
  }
  state = { storedHash: '#' };

  //  If our component is suddenly no longer the active route, we need
  //  to store its hash value before it disappears.
  componentWillReceiveProps (nextProps) {
    const {
      activeRoute,
      hash,
    } = this.props;
    if (activeRoute && !nextProps.activeRoute) {
      this.setState({ storedHash: hash });
    }
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
      hash,
      history,
      '🛄': { intl },
      '💪': {
        submit,
        upload,
      },
      '🏪': {
        defaultVisibility,
        me,
        results,
      },
      ...rest
    } = this.props;
    const { storedHash } = this.state;
    const computedClass = classNames('MASTODON_GO--DRAWER', className);

    //  We only use our internal hash if this isn't the active route.
    const computedHash = activeRoute ? hash : storedHash;

    return (
      <CommonPaneller
        className={computedClass}
        menu={
          <DrawerMenu
            activeRoute={activeRoute}
            hash={computedHash}
            history={history}
            intl={intl}
            onSetHash={handleSetHash}
          />
        }
        panel={
          <DrawerPanel
            hash={computedHash}
            intl={intl}
            results={results}
          />
        }
        title={<FormattedMessage {...messages.drawer} />}
        {...rest}
      >
        <DrawerComposer
          defaultVisibility={defaultVisibility}
          intl={intl}
          me={me}
          onSubmit={submit}
          onUpload={upload}
        />
      </CommonPaneller>
    );
  }

}
